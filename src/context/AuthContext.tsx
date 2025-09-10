import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  firebaseUID: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (uid: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [firebaseUID, setFirebaseUID] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored UID when app starts
  useEffect(() => {
    checkStoredAuth();
  }, []);

  const checkStoredAuth = async () => {
    try {
      const storedUID = await AsyncStorage.getItem("firebase_uid");
      if (storedUID) {
        setFirebaseUID(storedUID);
      }
    } catch (error) {
      console.error("Error checking stored auth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (uid: string) => {
    try {
      await AsyncStorage.setItem("firebase_uid", uid);
      setFirebaseUID(uid);
    } catch (error) {
      console.error("Error storing Firebase UID:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("firebase_uid");
      setFirebaseUID(null);
    } catch (error) {
      console.error("Error removing Firebase UID:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    firebaseUID,
    isAuthenticated: !!firebaseUID,
    isLoading,
    login,
    logout,
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
