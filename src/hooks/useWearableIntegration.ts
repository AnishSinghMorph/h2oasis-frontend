import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { WearableDevice } from "../components/wearables/WearableCard";
import {
  WEARABLE_DEVICES,
  getAPIWearables,
  getWearableById,
} from "../constants/wearables";
import {
  AppleHealthService,
  WearableIntegrationResult,
} from "../services/wearables/AppleHealthService";
import { APIBasedWearableService } from "../services/wearables/APIBasedWearableService";
import { useRookHealth } from "./useRookHealth";
import { useAuth } from "../context/AuthContext";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useSetupProgress } from "../context/SetupProgressContext";

interface UseWearableIntegrationProps {
  isSandbox?: boolean;
}

export const useWearableIntegration = ({
  isSandbox = true,
}: UseWearableIntegrationProps = {}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { firebaseUID } = useAuth();
  const { updateStepProgress } = useSetupProgress();
  const rookHealth = useRookHealth();

  const [selectedWearable, setSelectedWearable] = useState<string | null>(null);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {},
  );

  // Apple Health service
  const appleHealthService = new AppleHealthService(rookHealth);

  // API-based wearable service configuration
  const apiWearableConfig = {
    clientUUID:
      process.env.ROOK_SANDBOX_CLIENT_UUID ||
      "808c0a77-e23d-4fd0-9992-5a132eefad75",
    secretKey:
      process.env.ROOK_SANDBOX_SECRET_KEY ||
      "UbMEwmEw2scdjYjPla49ckWA4LWEl19OJmzY",
    baseUrl:
      process.env.ROOK_SANDBOX_BASE_URL || "https://api.rook-connect.review",
    isSandbox: true,
  };

  const apiWearableService = new APIBasedWearableService(apiWearableConfig);

  /**
   * Set loading state for a specific wearable
   */
  const setWearableLoading = useCallback(
    (wearableId: string, loading: boolean) => {
      setLoadingStates((prev) => ({ ...prev, [wearableId]: loading }));
    },
    [],
  );

  /**
   * Handle successful wearable connection
   */
  const handleConnectionSuccess = useCallback(
    (result: WearableIntegrationResult, wearableName: string) => {
      updateStepProgress(1);

      // Just show success message, don't auto-navigate
      Alert.alert(
        "Connection Successful!",
        `${wearableName} has been connected successfully. You can continue testing other wearables or proceed when ready.`,
        [
          {
            text: "OK",
            style: "default",
          },
        ],
      );
    },
    [updateStepProgress],
  );

  /**
   * Handle wearable connection error
   */
  const handleConnectionError = useCallback(
    (error: string, wearableName: string) => {
      Alert.alert("Connection Failed", error, [
        { text: "Try Again", style: "default" },
        {
          text: "Continue Anyway",
          style: "cancel",
          onPress: () => navigation.navigate("AIAssistant"),
        },
      ]);
    },
    [navigation],
  );

  /**
   * Connect to Apple Health (SDK-based)
   */
  const connectAppleHealth = useCallback(async () => {
    if (!firebaseUID) {
      Alert.alert("Error", "Authentication required");
      return;
    }

    if (!appleHealthService.isReady()) {
      Alert.alert(
        "Error",
        "Apple Health service is not ready. Please try again.",
      );
      return;
    }

    setWearableLoading("apple", true);

    try {
      const result = await appleHealthService.connect(firebaseUID);

      if (result.success) {
        handleConnectionSuccess(result, "Apple Health");
      } else {
        handleConnectionError(result.error || "Unknown error", "Apple Health");
      }
    } catch (error) {
      handleConnectionError("Unexpected error occurred", "Apple Health");
    } finally {
      setWearableLoading("apple", false);
    }
  }, [
    firebaseUID,
    appleHealthService,
    handleConnectionSuccess,
    handleConnectionError,
    setWearableLoading,
  ]);

  /**
   * Connect to API-based wearable (Garmin, Fitbit, Whoop, Oura)
   */
  const connectAPIWearable = useCallback(
    async (wearableId: string, wearableName: string) => {
      if (!firebaseUID) {
        Alert.alert("Error", "Authentication required");
        return;
      }

      setWearableLoading(wearableId, true);

      try {
        // Find the wearable device configuration
        const wearableDevice = WEARABLE_DEVICES.find(
          (device) => device.id === wearableId,
        );

        if (!wearableDevice || !wearableDevice.dataSource) {
          throw new Error(`Wearable configuration not found for ${wearableId}`);
        }

        console.log(
          `🔗 Connecting ${wearableName} (${wearableDevice.dataSource})...`,
        );

        // Start the connection process
        const result = await apiWearableService.connect(
          wearableDevice.dataSource,
          wearableName,
          firebaseUID,
        );

        if (result.success) {
          Alert.alert(
            "Authorization Started",
            `${wearableName} authorization has been opened in your browser. Please complete the process and return to the app.`,
            [{ text: "OK" }],
          );
        } else {
          handleConnectionError(result.error || "Unknown error", wearableName);
        }
      } catch (error) {
        console.error(`❌ Failed to connect ${wearableName}:`, error);
        Alert.alert(
          "Connection Error",
          `Failed to start ${wearableName} connection. Please try again.`,
        );
      } finally {
        setWearableLoading(wearableId, false);
      }
    },
    [firebaseUID, handleConnectionError, setWearableLoading],
  );

  /**
   * Handle wearable selection and connection
   */
  const handleWearablePress = useCallback(
    (wearable: WearableDevice) => {
      setSelectedWearable(wearable.id);

      console.log(`🔘 Wearable pressed: ${wearable.name}`);
      console.log(`   ID: ${wearable.id}`);
      console.log(`   Type: ${wearable.type}`);
      console.log(`   DataSource: ${wearable.dataSource}`);
      console.log(`   IsComingSoon: ${wearable.isComingSoon}`);

      if (wearable.isComingSoon) {
        console.log(`⏳ ${wearable.name} is marked as coming soon`);
        Alert.alert(
          "Coming Soon",
          `${wearable.name} integration is coming soon! For now, you can connect with Apple Health.`,
          [
            { text: "OK", style: "cancel" },
            {
              text: "Try Apple Health",
              onPress: () => {
                setSelectedWearable("apple");
                connectAppleHealth();
              },
            },
          ],
        );
        return;
      }

      console.log(
        `✅ ${wearable.name} is available - proceeding with connection`,
      );

      // Handle connection based on wearable type
      switch (wearable.type) {
        case "sdk":
          if (wearable.id === "apple") {
            connectAppleHealth();
          }
          break;

        case "api":
          connectAPIWearable(
            wearable.id as "garmin" | "fitbit" | "whoop" | "oura" | "polar",
            wearable.name,
          );
          break;

        default:
          Alert.alert("Error", "Unsupported wearable type");
      }
    },
    [connectAppleHealth, connectAPIWearable, setSelectedWearable],
  );

  /**
   * Get connection status for debugging
   */
  const getConnectionStatus = useCallback(() => {
    if (selectedWearable === "apple") {
      return appleHealthService.getConnectionStatus();
    }

    return {
      isSetupComplete: false,
      permissionsGranted: false,
      userConfigured: false,
    };
  }, [selectedWearable, appleHealthService]);

  /**
   * Check all API wearable connections
   */
  const checkAllWearableConnections = useCallback(async () => {
    if (!firebaseUID) {
      console.log("❌ No user ID available for connection check");
      return {};
    }

    try {
      console.log("🔍 Checking all wearable connections...");

      // Get all API-based data sources
      const apiWearables = getAPIWearables();
      const dataSources = apiWearables
        .filter((device) => device.dataSource)
        .map((device) => device.dataSource as string);

      // Check connections
      const connections = await apiWearableService.checkAllConnections(
        firebaseUID,
        dataSources,
      );

      console.log("📊 All wearable connections:", connections);
      return connections;
    } catch (error) {
      console.error("❌ Failed to check wearable connections:", error);
      return {};
    }
  }, [firebaseUID, apiWearableService]);

  /**
   * Check specific wearable connection
   */
  const checkWearableConnection = useCallback(
    async (wearableId: string) => {
      if (!firebaseUID) {
        console.log("❌ No user ID available for connection check");
        return false;
      }

      const device = getWearableById(wearableId);
      if (!device?.dataSource) {
        console.log(`❌ No data source found for ${wearableId}`);
        return false;
      }

      try {
        const isConnected = await apiWearableService.checkConnection(
          firebaseUID,
          device.dataSource,
        );
        console.log(
          `📱 ${device.name} connection status: ${isConnected ? "Connected" : "Not connected"}`,
        );
        return isConnected;
      } catch (error) {
        console.error(`❌ Failed to check ${device.name} connection:`, error);
        return false;
      }
    },
    [firebaseUID, apiWearableService],
  );

  return {
    selectedWearable,
    loadingStates,
    handleWearablePress,
    getConnectionStatus,
    checkAllWearableConnections,
    checkWearableConnection,
    isAppleHealthReady: appleHealthService.isReady(),
  };
};
