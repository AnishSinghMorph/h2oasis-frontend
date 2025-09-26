import { useState, useCallback, useEffect } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as WebBrowser from "expo-web-browser";

import { WearableDevice } from "../components/wearables/WearableCard";
import { WEARABLE_DEVICES } from "../constants/wearables";
import { ROOK_CONFIG } from "../config/rookConfig";
import {
  AppleHealthService,
  WearableIntegrationResult,
} from "../services/wearables/AppleHealthService";
import { APIBasedWearableService } from "../services/wearables/APIBasedWearableService";

import { useRookHealth } from "./useRookHealth";
import { useAuth } from "../context/AuthContext";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useSetupProgress } from "../context/SetupProgressContext";
import API_CONFIG from "../config/api";

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

  // API-based wearable service configuration - use ROOK_CONFIG
  const apiWearableConfig = {
    clientUUID: ROOK_CONFIG.CLIENT_UUID,
    secretKey: ROOK_CONFIG.SECRET_KEY,
    baseUrl: ROOK_CONFIG.BASE_URL,
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
    async (
      result: WearableIntegrationResult,
      wearableName: string,
      wearableId: string,
      dataSource?: string,
    ) => {
      updateStepProgress(1);

      // Save connection status and health data to API
      try {
        console.log(
          `💾 Saving ${wearableName} connection status and data to API...`,
        );

        const requestBody: any = {
          wearableId: wearableId,
          wearableName: wearableName,
          dataSource: dataSource || wearableId,
          connected: true,
        };

        // Include health data if available (for Apple Health)
        if (result.data) {
          requestBody.healthData = result.data;
          console.log(`📊 Including health data:`, result.data);
        }

        const response = await fetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WEARABLE_CONNECTION}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-firebase-uid": firebaseUID || "",
            },
            body: JSON.stringify(requestBody),
          },
        );

        if (response.ok) {
          console.log(
            `✅ ${wearableName} connection status and data saved to API`,
          );
        } else {
          console.warn(
            `⚠️ Failed to save ${wearableName} connection status to API`,
          );
        }
      } catch (error) {
        console.error(
          `❌ Error saving ${wearableName} connection status:`,
          error,
        );
      }

      // Show simple success message
      Alert.alert(
        "Connection Successful!",
        `${wearableName} has been connected successfully.`,
        [
          {
            text: "OK",
            style: "default",
          },
        ],
      );
    },
    [updateStepProgress, firebaseUID],
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
        handleConnectionSuccess(result, "Apple Health", "apple");
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

        // Get authorization URL from API
        const authResult = await apiWearableService.getAuthorizationUrl(
          wearableDevice.dataSource,
          firebaseUID,
        );

        if (!authResult.success) {
          throw new Error(
            authResult.error || "Failed to get authorization URL",
          );
        }

        // Handle already connected case
        if (authResult.isAlreadyConnected) {
          console.log(`✅ ${wearableName} is already connected!`);
          handleConnectionSuccess(
            {
              success: true,
              data: { connected: true, alreadyConnected: true },
            },
            wearableName,
            wearableId,
            wearableDevice.dataSource,
          );
          return;
        }

        if (!authResult.authorizationUrl) {
          throw new Error("No authorization URL provided");
        }

        // Open OAuth URL directly in browser - no complex deep linking
        await WebBrowser.openBrowserAsync(authResult.authorizationUrl, {
          dismissButtonStyle: "close",
          presentationStyle:
            WebBrowser.WebBrowserPresentationStyle.OVER_FULL_SCREEN,
        });

        console.log(
          "📋 OAuth browser opened. Starting connection status polling...",
        );

        // Show instructions to user
        Alert.alert(
          `Connecting ${wearableName}`,
          "Please complete the authorization in your browser. We'll automatically check when you're connected.",
          [
            {
              text: "I completed authorization",
              onPress: async () => {
                console.log(
                  "👤 User indicates OAuth completion, checking status...",
                );
                if (wearableDevice.dataSource) {
                  await pollConnectionStatus(
                    wearableDevice.dataSource,
                    wearableName,
                  );
                }
              },
            },
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => {
                setWearableLoading(wearableId, false);
              },
            },
          ],
        );
      } catch (error) {
        console.error(`❌ Failed to connect ${wearableName}:`, error);
        // Don't show error popup - user might have just cancelled OAuth
        // They can use "Check Connections" to verify status
      } finally {
        setWearableLoading(wearableId, false);
      }
    },
    [
      firebaseUID,
      apiWearableService,
      handleConnectionSuccess,
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

      console.log(
        `✅ ${wearable.name} is available - proceeding with connection`,
      );

      // Handle connection based on wearable type
      switch (wearable.type) {
        case "sdk":
          if (wearable.id === "apple") {
            connectAppleHealth();
          } else if (wearable.id === "samsung") {
            // Samsung Health requires Android Health Connect integration
            Alert.alert(
              "Samsung Health Coming Soon",
              "Samsung Health integration via Android Health Connect is coming soon! For now, you can connect with Apple Health.",
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
   * Poll connection status after OAuth completion
   */
  const pollConnectionStatus = useCallback(
    async (dataSource: string, wearableName: string) => {
      if (!firebaseUID) return;

      let attempts = 0;
      const maxAttempts = 10; // Poll for up to 30 seconds (3s intervals)

      const checkStatus = async (): Promise<void> => {
        try {
          attempts++;
          console.log(
            `📊 Attempt ${attempts}/${maxAttempts} - Checking ${wearableName} status...`,
          );

          const isConnected = await apiWearableService.checkConnection(
            firebaseUID,
            dataSource,
          );

          if (isConnected) {
            setWearableLoading(dataSource, false);
            handleConnectionSuccess(
              { success: true, data: { connected: true } },
              wearableName,
              dataSource,
              dataSource,
            );
            return;
          }

          if (attempts < maxAttempts) {
            console.log(
              `⏳ ${wearableName} not connected yet, retrying in 3s...`,
            );
            setTimeout(checkStatus, 3000);
          } else {
            setWearableLoading(dataSource, false);
            Alert.alert(
              "Connection Status",
              `${wearableName} authorization may still be processing. Please use "Check Connections" to verify status later.`,
              [{ text: "OK" }],
            );
          }
        } catch (error) {
          console.error(`❌ Error polling ${wearableName} status:`, error);
          if (attempts < maxAttempts) {
            setTimeout(checkStatus, 3000);
          } else {
            setWearableLoading(dataSource, false);
            Alert.alert(
              "Connection Check Failed",
              `Unable to verify ${wearableName} connection status. Please try again later.`,
              [{ text: "OK" }],
            );
          }
        }
      };

      // Start polling after a brief delay
      setTimeout(checkStatus, 2000);
    },
    [
      firebaseUID,
      apiWearableService,
      handleConnectionSuccess,
      setWearableLoading,
    ],
  );

  return {
    selectedWearable,
    loadingStates,
    handleWearablePress,
    isAppleHealthReady: appleHealthService.isReady(),
  };
};
