import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRookConfiguration, SDKDataSource } from "react-native-rook-sdk";
import API_CONFIG from "../config/api";
import { Platform } from "react-native";
import appleAuth from "@invertase/react-native-apple-authentication";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { signInWithCredential, OAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../config/firebase";

interface AuthContextType {
  firebaseUID: string | null;
  mongoUserId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRookReady: boolean;
  login: (uid: string) => Promise<void>;
  logout: () => Promise<void>;
  switchUser: (newUid: string) => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [firebaseUID, setFirebaseUID] = useState<string | null>(null);
  const [mongoUserId, setMongoUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rookRegistered, setRookRegistered] = useState(false);

  // ROOK configuration hook
  const {
    updateUserID,
    clearUserID,
    getUserID,
    ready: rookReady,
  } = useRookConfiguration();

  const fetchMongoUserId = useCallback(async (firebaseId: string) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROFILE}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-firebase-uid": firebaseId,
          },
        },
      );

      if (response.ok) {
        const userData = await response.json();
        // Handle different response structures - check both data and user properties
        const mongoId =
          userData.data?._id ||
          userData.data?.id ||
          userData.user?.id ||
          userData.user?._id;
        if (mongoId) {
          return mongoId;
        } else {
          console.warn("⚠️ No MongoDB ID found in user data");
        }
      } else if (response.status === 404) {
        // User not found - silently return null (expected for deleted users)
        return null;
      } else {
        console.error("❌ Failed to fetch user profile:", response.status);
      }
      return null;
    } catch (error) {
      console.error("❌ Error fetching MongoDB user ID:", error);
      return null;
    }
  }, []);

  const checkStoredAuth = useCallback(async () => {
    try {
      const storedUID = await AsyncStorage.getItem("firebaseUID");
      if (storedUID) {
        setFirebaseUID(storedUID);

        // Fetch MongoDB ID for ROOK integration
        const mongoId = await fetchMongoUserId(storedUID);
        if (mongoId) {
          setMongoUserId(mongoId);
        }
      }
    } catch (error) {
      console.error("❌ Error checking stored auth:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchMongoUserId]);

  // Check for stored UID when app starts
  useEffect(() => {
    checkStoredAuth();
  }, [checkStoredAuth]);

  // Register with ROOK when ready and we have a user
  useEffect(() => {
    if (!rookReady || !firebaseUID || !mongoUserId || rookRegistered) {
      return;
    }

    const registerWithRook = async () => {
      try {
        // Check if there's already a user registered
        try {
          const currentUser = await getUserID();

          if (currentUser === mongoUserId) {
            setRookRegistered(true);
            return;
          } else if (currentUser && currentUser !== mongoUserId) {
            // Clear with all data sources to ensure complete cleanup
            const dataSources = [
              SDKDataSource.APPLE_HEALTH,
              SDKDataSource.HEALTH_CONNECT,
              SDKDataSource.SAMSUNG_HEALTH,
            ];

            await clearUserID(dataSources);

            // Wait for cleanup to complete
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        } catch (checkError) {
          // No existing ROOK user - normal for first login
        }

        // Register new user with ROOK
        try {
          const success = await updateUserID(mongoUserId);

          if (success) {
            setRookRegistered(true);
          } else {
            setRookRegistered(true); // Prevent retry loop
          }
        } catch (updateError) {
          console.error("❌ Error updating ROOK user ID:", updateError);
          setRookRegistered(true); // Prevent retry loop
        }
      } catch (error) {
        console.error("❌ Error in ROOK registration process:", error);
        setRookRegistered(true); // Prevent retry loop
      }
    };

    registerWithRook();
  }, [
    rookReady,
    firebaseUID,
    mongoUserId,
    rookRegistered,
    updateUserID,
    getUserID,
    clearUserID,
  ]);

  const login = async (uid: string) => {
    try {
      // Get MongoDB user ID first
      const mongoId = await fetchMongoUserId(uid);

      if (!mongoId) {
        throw new Error("Failed to get user profile from server");
      }

      setMongoUserId(mongoId);

      // Handle ROOK user switching if SDK is ready
      if (rookReady) {
        try {
          const currentRookUser = await getUserID();

          if (currentRookUser && currentRookUser !== mongoId) {
            // Clear previous user with all data sources
            const dataSources = [
              SDKDataSource.APPLE_HEALTH,
              SDKDataSource.HEALTH_CONNECT,
              SDKDataSource.SAMSUNG_HEALTH,
            ];

            await clearUserID(dataSources);

            // Wait for cleanup
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }

          // Register new user with ROOK
          if (currentRookUser !== mongoId) {
            const success = await updateUserID(mongoId);

            if (success) {
              setRookRegistered(true);
            }
          } else {
            setRookRegistered(true);
          }
        } catch (rookError) {
          // Don't fail login if ROOK has issues
        }
      } else {
        setRookRegistered(false); // Will trigger registration effect when ready
      }

      // Store Firebase UID
      await AsyncStorage.setItem("firebaseUID", uid);
      setFirebaseUID(uid);
    } catch (error) {
      // Reset state on error
      setFirebaseUID(null);
      setMongoUserId(null);
      setRookRegistered(false);
      throw error;
    }
  };

  const logout = async () => {
    // Clear ROOK user data first if SDK is ready
    if (rookReady) {
      try {
        const currentUser = await getUserID();
        if (currentUser) {
          // Clear all data sources
          const dataSources = [
            SDKDataSource.APPLE_HEALTH,
            SDKDataSource.HEALTH_CONNECT,
            SDKDataSource.SAMSUNG_HEALTH,
          ];

          await clearUserID(dataSources);
        }
      } catch (rookError) {
        // Continue with logout even if ROOK clearing fails
      }
    }

    // Clear all local storage
    await AsyncStorage.multiRemove(["firebaseUID", "user_profile_cache"]);

    // Reset all state
    setFirebaseUID(null);
    setMongoUserId(null);
    setRookRegistered(false);
  };

  const switchUser = async (newUid: string) => {
    // Logout first to clear everything
    await logout();

    // Wait for cleanup to complete
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Login with new user
    await login(newUid);
  };

  const signInWithApple = async () => {
    // Check if Apple Sign-In is available (iOS only)
    if (Platform.OS !== "ios") {
      throw new Error("Apple Sign-In is only available on iOS");
    }

    try {
      // Perform Apple Sign-In request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // Get credential state
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );

      // Check if authorized
      if (credentialState !== appleAuth.State.AUTHORIZED) {
        throw new Error("Apple Sign-In failed");
      }

      // Get identity token and nonce
      const { identityToken, nonce } = appleAuthRequestResponse;

      if (!identityToken) {
        throw new Error("Apple Sign-In failed: no identity token");
      }

      // Create Firebase credential
      const provider = new OAuthProvider("apple.com");
      const credential = provider.credential({
        idToken: identityToken,
        rawNonce: nonce,
      });

      // Sign in to Firebase
      const userCredential = await signInWithCredential(auth, credential);
      const firebaseUser = userCredential.user;

      // Extract full name from Apple response or Firebase user
      let fullName = "User";

      // First priority: Apple's full name (only available on first sign-in)
      if (
        appleAuthRequestResponse.fullName?.givenName &&
        appleAuthRequestResponse.fullName?.familyName
      ) {
        fullName = `${appleAuthRequestResponse.fullName.givenName} ${appleAuthRequestResponse.fullName.familyName}`;
      }
      // Second priority: Firebase display name (persists after first sign-in)
      else if (firebaseUser.displayName) {
        fullName = firebaseUser.displayName;
      }
      // Third priority: Extract from email if not using private relay
      else if (
        firebaseUser.email &&
        !firebaseUser.email.includes("privaterelay")
      ) {
        const emailName = firebaseUser.email.split("@")[0];
        fullName = emailName
          .split(/[._-]/)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }

      // Create/update user in MongoDB via backend
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email,
            fullName,
            provider: "apple.com",
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to create user in backend");
      }

      // Login with the Firebase UID
      await login(firebaseUser.uid);
    } catch (error: any) {
      console.error("❌ Apple Sign-In error:", error);
      if (error.code === appleAuth.Error.CANCELED) {
        throw new Error("Apple Sign-In was canceled");
      }
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Configure Google Sign-In
      GoogleSignin.configure({
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      });

      // Check if Google Play Services are available (Android)
      if (Platform.OS === "android") {
        await GoogleSignin.hasPlayServices();
      }

      // Perform Google Sign-In
      const googleResponse = await GoogleSignin.signIn();

      // Get the ID token - handle both response structures
      const idToken = 
        (googleResponse as any).data?.idToken || 
        (googleResponse as any).idToken;

      if (!idToken) {
        throw new Error("Google Sign-In failed: no ID token");
      }

      // Create Firebase credential
      const credential = GoogleAuthProvider.credential(idToken);

      // Sign in to Firebase
      const userCredential = await signInWithCredential(auth, credential);
      const firebaseUser = userCredential.user;

      // Extract full name from Google response or Firebase user
      let fullName = "User";

      if (firebaseUser.displayName) {
        fullName = firebaseUser.displayName;
      } else if (
        firebaseUser.email &&
        !firebaseUser.email.includes("privaterelay")
      ) {
        const emailName = firebaseUser.email.split("@")[0];
        fullName = emailName
          .split(/[._-]/)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }

      // Create/update user in MongoDB via backend
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email,
            fullName,
            provider: "google.com",
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to create user in backend");
      }

      // Login with the Firebase UID
      await login(firebaseUser.uid);
    } catch (error: any) {
      console.error("❌ Google Sign-In error:", error);
      if (error.code === "SIGN_IN_CANCELLED") {
        throw new Error("Google Sign-In was canceled");
      }
      throw error;
    }
  };

  const value: AuthContextType = {
    firebaseUID,
    mongoUserId,
    isAuthenticated: !!firebaseUID,
    isLoading,
    isRookReady: rookReady && rookRegistered && !!mongoUserId,
    login,
    logout,
    switchUser,
    signInWithApple,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
