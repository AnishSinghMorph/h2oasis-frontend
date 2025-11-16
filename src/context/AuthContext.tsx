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

interface AuthContextType {
  firebaseUID: string | null;
  mongoUserId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRookReady: boolean;
  login: (uid: string) => Promise<void>;
  logout: () => Promise<void>;
  switchUser: (newUid: string) => Promise<void>;
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

  const fetchMongoUserId = useCallback(
    async (firebaseId: string): Promise<string | null> => {
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
        } else {
          console.error("❌ Failed to fetch user profile:", response.status);
        }
        return null;
      } catch (error) {
        console.error("❌ Error fetching MongoDB user ID:", error);
        return null;
      }
    },
    [],
  );

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
    await AsyncStorage.multiRemove(['firebaseUID', 'user_profile_cache']);

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

  const value: AuthContextType = {
    firebaseUID,
    mongoUserId,
    isAuthenticated: !!firebaseUID,
    isLoading,
    isRookReady: rookReady && rookRegistered && !!mongoUserId,
    login,
    logout,
    switchUser,
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
