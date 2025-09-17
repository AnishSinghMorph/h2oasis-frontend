import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { WearableDevice } from "../components/wearables/WearableCard";
import {
  AppleHealthService,
  WearableIntegrationResult,
} from "../services/wearables/AppleHealthService";
import {
  APIBasedWearableService,
  APIWearableConfig,
} from "../services/wearables/APIBasedWearableService";
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
  const apiWearableConfig: APIWearableConfig = {
    baseUrl: isSandbox
      ? "https://sandbox-api.tryrook.io"
      : "https://api.tryrook.io",
    clientId: process.env.ROOK_CLIENT_UUID || "your-client-uuid", // TODO: Add to env
    redirectUri: "h2oasis://wearable-callback", // TODO: Configure deep linking
    scopes: ["read"], // Adjust based on wearable requirements
    isSandbox,
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

      if (result.nextScreen) {
        setTimeout(() => {
          navigation.navigate(result.nextScreen as keyof RootStackParamList);
        }, 1000);
      } else {
        Alert.alert(
          "Connection Successful!",
          `${wearableName} has been connected successfully.`,
          [
            {
              text: "Continue",
              onPress: () => navigation.navigate("AIAssistant"),
            },
          ],
        );
      }
    },
    [navigation, updateStepProgress],
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
   * Connect to API-based wearable (Garmin, Fitbit, Whoop)
   */
  const connectAPIWearable = useCallback(
    async (
      wearableType: "garmin" | "fitbit" | "whoop" | "oura" | "polar",
      wearableName: string,
    ) => {
      if (!firebaseUID) {
        Alert.alert("Error", "Authentication required");
        return;
      }

      if (!apiWearableService.isConfigured()) {
        Alert.alert("Error", "Wearable service is not properly configured");
        return;
      }

      setWearableLoading(wearableType, true);

      try {
        const result = await apiWearableService.connect(
          wearableType,
          firebaseUID,
        );

        if (result.success) {
          handleConnectionSuccess(result, wearableName);
        } else {
          // For coming soon features, show a different message
          Alert.alert(
            "Coming Soon",
            `${wearableName} integration will be available soon! We're working on bringing you seamless ${wearableName} connectivity.`,
            [
              {
                text: "Stay Tuned",
                style: "default",
              },
              {
                text: "Continue with Apple Health",
                onPress: () => {
                  setSelectedWearable("apple");
                  connectAppleHealth();
                },
              },
            ],
          );
        }
      } catch (error) {
        handleConnectionError("Unexpected error occurred", wearableName);
      } finally {
        setWearableLoading(wearableType, false);
      }
    },
    [
      firebaseUID,
      apiWearableService,
      connectAppleHealth,
      handleConnectionSuccess,
      handleConnectionError,
      setWearableLoading,
    ],
  );

  /**
   * Handle wearable selection and connection
   */
  const handleWearablePress = useCallback(
    (wearable: WearableDevice) => {
      setSelectedWearable(wearable.id);

      if (wearable.isComingSoon) {
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

  return {
    selectedWearable,
    loadingStates,
    handleWearablePress,
    getConnectionStatus,
    isAppleHealthReady: appleHealthService.isReady(),
    isAPIServiceConfigured: apiWearableService.isConfigured(),
  };
};
