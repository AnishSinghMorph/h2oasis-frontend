import { useState, useEffect, useCallback } from "react";
import { Alert, Platform } from "react-native";
import {
  useRookPermissions,
  useRookSync,
  useRookConfiguration,
  SamsungHealthPermission,
  SDKDataSource,
} from "react-native-rook-sdk";
import { RookAPIService } from "../services/wearables/RookAPIService";
import { ROOK_CONFIG } from "../config/rookConfig";

// Import type from the SDK's type definition
type SyncResult = any; // Use any for now since the type is not directly exported

export interface SamsungHealthData {
  sleep?: any;
  physical?: any;
  body?: any;
}

export const useSamsungHealth = (userId?: string) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<SamsungHealthData>({});
  const [isConnected, setIsConnected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Use ROOK SDK hooks
  const {
    ready: permissionsReady,
    checkSamsungAvailability,
    samsungHealthHasPermissions,
    samsungHealthHasPartialPermissions,
    requestSamsungHealthPermissions,
    requestAndroidBackgroundPermissions,
  } = useRookPermissions();

  const { sync: rookSync } = useRookSync();

  const {
    ready: configReady,
    updateUserID,
    enableSamsungSync,
    disableSamsungSync,
    isSamsungSyncEnabled,
  } = useRookConfiguration();

  // Initialize ROOK API service
  const rookAPIService = new RookAPIService({
    clientUUID: ROOK_CONFIG.CLIENT_UUID,
    secretKey: ROOK_CONFIG.SECRET_KEY,
    baseUrl: ROOK_CONFIG.BASE_URL,
    isSandbox: true,
  });

  // Initialize user ID when configuration is ready
  useEffect(() => {
    const initializeUser = async () => {
      if (configReady && userId && !isInitialized) {
        try {
          await updateUserID(userId);
          setIsInitialized(true);
        } catch (error) {
          console.error("Failed to update user ID:", error);
        }
      }
    };

    initializeUser();
  }, [configReady, userId, updateUserID, isInitialized]);

  const checkAvailability = useCallback(async () => {
    try {
      if (Platform.OS !== "android") {
        setIsAvailable(false);
        return;
      }

      if (!permissionsReady) {
        return;
      }

      const availability = await checkSamsungAvailability();
      const available = availability === "INSTALLED";
      setIsAvailable(available);

      if (available) {
        // Check if we have all permissions
        const hasAllPermissions = await samsungHealthHasPermissions();
        const hasPartialPermissions =
          await samsungHealthHasPartialPermissions();

        setHasPermissions(hasAllPermissions || hasPartialPermissions);

        // Check sync status if we have permissions
        if (hasAllPermissions || hasPartialPermissions) {
          try {
            const syncEnabled = await isSamsungSyncEnabled();
            setIsConnected(syncEnabled);
          } catch (error) {
            console.warn("Could not check sync status:", error);
            setIsConnected(false);
          }
        } else {
          setIsConnected(false);
        }
      }
    } catch (error) {
      console.error("Error checking Samsung Health availability:", error);
      setIsAvailable(false);
      setHasPermissions(false);
      setIsConnected(false);
    }
  }, [
    permissionsReady,
    checkSamsungAvailability,
    samsungHealthHasPermissions,
    samsungHealthHasPartialPermissions,
    isSamsungSyncEnabled,
  ]);

  // Check availability when hooks are ready
  useEffect(() => {
    if (Platform.OS === "android" && permissionsReady && configReady) {
      checkAvailability();
    }
  }, [permissionsReady, configReady, checkAvailability]);

  const connect = async (): Promise<boolean> => {
    if (Platform.OS !== "android") {
      Alert.alert(
        "Not Available",
        "Samsung Health is only available on Android devices.",
      );
      return false;
    }

    if (!permissionsReady || !configReady) {
      Alert.alert("Not Ready", "Please wait for SDK to initialize.");
      return false;
    }

    try {
      setIsLoading(true);

      // Ensure user ID is set (use fallback if needed)
      if (!isInitialized && userId) {
        await updateUserID(userId);
        setIsInitialized(true);
      }

      // Check Samsung Health availability (but don't block if not detected)
      try {
        const availability = await checkSamsungAvailability();
        if (availability !== "INSTALLED") {
          // Still try to request permissions - sometimes the check fails but Samsung Health is actually available
        }
      } catch (availabilityError) {
        // Ignore availability check errors and proceed
      }

      // Define Samsung Health permissions we need
      const samsungPermissions: SamsungHealthPermission[] = [
        SamsungHealthPermission.ACTIVITY_SUMMARY,
        SamsungHealthPermission.BODY_COMPOSITION,
        SamsungHealthPermission.HEART_RATE,
        SamsungHealthPermission.SLEEP,
        SamsungHealthPermission.STEPS,
        SamsungHealthPermission.WATER_INTAKE,
      ];

      // Request permissions - this should open the Samsung Health permission dialog
      const permissionResult =
        await requestSamsungHealthPermissions(samsungPermissions);

      // Handle the permission result
      if (permissionResult === "ALREADY_GRANTED") {
        // Permissions already granted, proceed directly
      } else if (permissionResult === "REQUEST_SENT") {
        // Permission dialog was shown, wait a bit for user interaction
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } else {
        // Permission request failed
        Alert.alert(
          "Permission Request Failed",
          "Samsung Health permission dialog could not be opened. Please:\n\n" +
            "1. Make sure Samsung Health is installed and updated\n" +
            "2. Enable Developer Mode in Samsung Health:\n" +
            "   • Go to Settings → About Samsung Health\n" +
            "   • Tap version number 10 times\n" +
            '   • Enable "Developer Mode for Data Read"\n' +
            "3. Try again",
          [{ text: "OK" }],
        );
        return false;
      }

      // Check if permissions were actually granted
      const hasAllPermissions = await samsungHealthHasPermissions();
      const hasPartialPermissions = await samsungHealthHasPartialPermissions();

      if (!hasAllPermissions && !hasPartialPermissions) {
        // Don't show another popup immediately - user might have just dismissed the dialog
        return false;
      }

      // Request Android background permissions
      try {
        await requestAndroidBackgroundPermissions();
      } catch (bgError) {
        // Continue anyway - background permissions are optional
      }

      // Enable Samsung Health sync
      const syncEnabled = await enableSamsungSync();

      if (syncEnabled) {
        setHasPermissions(true);
        setIsConnected(true);
        Alert.alert("Success", "Samsung Health connected successfully!");
        return true;
      } else {
        Alert.alert(
          "Sync Failed",
          "Failed to enable Samsung Health sync. Please ensure the app has all necessary permissions.",
          [{ text: "OK" }],
        );
        return false;
      }
    } catch (error) {
      console.error("❌ Error connecting to Samsung Health:", error);
      Alert.alert(
        "Connection Error",
        `Failed to connect: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const syncData = async (): Promise<boolean> => {
    if (!hasPermissions) {
      Alert.alert("No Permissions", "Please connect to Samsung Health first.");
      return false;
    }

    if (!userId) {
      Alert.alert("User Required", "Please login first to sync data.");
      return false;
    }

    try {
      setIsLoading(true);
      console.log("🔄 Starting Samsung Health data sync...");

      // Get yesterday's date (ROOK typically syncs previous day data)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const syncDate = yesterday.toISOString().split("T")[0];

      console.log("📅 Syncing data for date:", syncDate);

      // Create promise to handle sync callback
      const syncPromise = new Promise<SyncResult>((resolve) => {
        rookSync(
          (result: SyncResult) => {
            console.log("📊 Sync callback result:", result);
            resolve(result);
          },
          {
            date: syncDate,
            sources: [SDKDataSource.SAMSUNG_HEALTH],
          },
        );
      });

      // Wait for sync to complete with timeout
      const syncResult = await Promise.race([
        syncPromise,
        new Promise<SyncResult>((_, reject) =>
          setTimeout(() => reject(new Error("Sync timeout")), 30000),
        ),
      ]);

      const samsungResult = syncResult.samsungHealth;
      const syncSuccess = samsungResult?.status ?? false;

      if (syncSuccess) {
        console.log("✅ Samsung Health sync successful");

        // Fetch processed data from ROOK API
        try {
          const healthData = await rookAPIService.getAllHealthData(
            userId,
            "samsung_health",
            syncDate,
          );
          setData(healthData);

          // Check if we actually got data
          const hasData =
            healthData &&
            (healthData.sleep ||
              healthData.physical ||
              healthData.body ||
              healthData.activity);

          if (hasData) {
            Alert.alert(
              "Success",
              "Samsung Health data synchronized successfully!",
            );
          } else {
            Alert.alert(
              "No Data Available",
              `No Samsung Health data found for ${syncDate}. Make sure Samsung Health has recorded data for that day.`,
            );
          }
        } catch (apiError) {
          console.warn("Could not fetch processed data:", apiError);
          Alert.alert(
            "Sync Complete",
            "Data synced to ROOK. It may take a few minutes to process.",
          );
        }

        return true;
      } else {
        const errorMessage = samsungResult?.error
          ? `Error: ${JSON.stringify(samsungResult.error)}`
          : "Unknown sync error";

        console.error("❌ Samsung Health sync failed:", errorMessage);
        Alert.alert(
          "Sync Failed",
          `Failed to sync Samsung Health data. ${errorMessage}`,
        );
        return false;
      }
    } catch (error) {
      console.error("❌ Error syncing Samsung Health data:", error);

      if (error instanceof Error && error.message === "Sync timeout") {
        Alert.alert("Timeout", "Sync took too long. Please try again.");
      } else {
        Alert.alert(
          "Sync Error",
          `Failed to sync: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshConnectionState = useCallback(async () => {
    if (Platform.OS !== "android" || !permissionsReady) return;

    try {
      await checkAvailability();
    } catch (error) {
      console.error("Error refreshing Samsung Health state:", error);
    }
  }, [permissionsReady, checkAvailability]);

  const checkSyncStatus = async (): Promise<boolean> => {
    try {
      if (!configReady) return false;
      const isEnabled = await isSamsungSyncEnabled();
      return isEnabled;
    } catch (error) {
      console.error("Error checking Samsung Health sync status:", error);
      return false;
    }
  };

  const enableSync = async (): Promise<boolean> => {
    try {
      if (!configReady) return false;
      const result = await enableSamsungSync();
      if (result) setIsConnected(true);
      return result;
    } catch (error) {
      console.error("Error enabling Samsung Health sync:", error);
      return false;
    }
  };

  const disableSync = async (): Promise<boolean> => {
    try {
      if (!configReady) return false;
      const result = await disableSamsungSync();
      if (result) setIsConnected(false);
      return result;
    } catch (error) {
      console.error("Error disabling Samsung Health sync:", error);
      return false;
    }
  };

  return {
    // State
    isAvailable,
    hasPermissions,
    isLoading,
    data,
    isConnected,
    isReady: permissionsReady && configReady && isInitialized,

    // Actions
    connect,
    syncData,
    checkAvailability,
    refreshConnectionState,

    // Samsung Health Sync Configuration
    checkSyncStatus,
    enableSync,
    disableSync,
  };
};
