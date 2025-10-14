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
import { useSamsungHealth } from "./useSamsungHealth";
import { useAuth } from "../context/AuthContext";
import API_CONFIG from "../config/api";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useSetupProgress } from "../context/SetupProgressContext";

export const useWearableIntegration = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { firebaseUID, mongoUserId: authMongoUserId } = useAuth();
  const { updateStepProgress } = useSetupProgress();
  const rookHealth = useRookHealth();
  const samsungHealth = useSamsungHealth(
    authMongoUserId || firebaseUID || undefined,
  );

  const [selectedWearable, setSelectedWearable] = useState<string | null>(null);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {},
  );
  const [mongoUserId, setMongoUserId] = useState<string | null>(null);
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

  // Fetch MongoDB user ID when Firebase UID changes
  useEffect(() => {
    const fetchMongoUserId = async () => {
      if (!firebaseUID) {
        setMongoUserId(null);
        return;
      }

      try {
        // Get user profile to get MongoDB ID
        const response = await fetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROFILE}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-firebase-uid": firebaseUID,
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
            setMongoUserId(mongoId);
          }
        } else {
          console.warn("⚠️ Failed to fetch user profile for MongoDB ID");
        }
      } catch (error) {
        console.error("❌ Error fetching MongoDB user ID:", error);
      }
    };

    fetchMongoUserId();
  }, [firebaseUID]);

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

      // Save connection status to API (health data comes via webhooks)
      try {
        const requestBody = {
          wearableId: wearableId,
          wearableName: wearableName,
          dataSource: dataSource || wearableId,
          connected: true,
        };

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

        if (!response.ok) {
          console.warn(
            `Failed to save ${wearableName} connection status to API`,
          );
        }
      } catch (error) {
        console.error(`Error saving ${wearableName} connection status:`, error);
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
    (error: string) => {
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
      // Use MongoDB user ID for consistency with other wearables
      const userIdForApple = mongoUserId || firebaseUID;
      const result = await appleHealthService.connect(userIdForApple);

      if (result.success) {
        handleConnectionSuccess(result, "Apple Health", "apple");
      } else {
        handleConnectionError(result.error || "Unknown error");
      }
    } catch (error) {
      handleConnectionError("Unexpected error occurred");
    } finally {
      setWearableLoading("apple", false);
    }
  }, [
    firebaseUID,
    mongoUserId,
    appleHealthService,
    handleConnectionSuccess,
    handleConnectionError,
    setWearableLoading,
  ]);

  /**
   * Connect to Samsung Health (SDK-based via ROOK)
   */
  const connectSamsungHealth = useCallback(async () => {
    setWearableLoading("samsung", true);

    try {
      // Just try to connect - let the Samsung Health hook handle the permission dialog
      const hasPermissions = await samsungHealth.connect();

      if (hasPermissions) {
        // Configure user with ROOK using MongoDB ID for consistency
        const userIdForRook = mongoUserId || firebaseUID;
        if (userIdForRook) {
          const userConfigured = await rookHealth.configureUser(userIdForRook);

          if (!userConfigured) {
            Alert.alert(
              "Configuration Failed",
              "Failed to register your account with the health data service. Please try again.",
            );
            setWearableLoading("samsung", false);
            return;
          }
        }

        // Mark as connected in our API
        const result: WearableIntegrationResult = {
          success: true,
          data: {
            connected: true,
            dataSource: "samsung",
            timestamp: new Date().toISOString(),
          },
        };

        handleConnectionSuccess(result, "Samsung Health", "samsung");

        Alert.alert(
          "Success!",
          "Samsung Health connected successfully. You can now sync your health data.",
        );
      } else {
        Alert.alert(
          "Permissions Required",
          "Samsung Health permissions are required to sync your health data. Please grant permissions to continue.",
        );
      }
    } catch (error) {
      console.error("Error connecting Samsung Health:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to connect Samsung Health";
      handleConnectionError(errorMessage);
    } finally {
      setWearableLoading("samsung", false);
    }
  }, [
    firebaseUID,
    mongoUserId,
    samsungHealth,
    rookHealth,
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

        // Use MongoDB user ID for API wearables for consistency
        const userIdForAPI = mongoUserId || firebaseUID;

        // Get authorization URL from API
        const authResult = await apiWearableService.getAuthorizationUrl(
          wearableDevice.dataSource,
          userIdForAPI,
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
      mongoUserId,
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
            connectSamsungHealth();
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
    [
      connectAppleHealth,
      connectSamsungHealth,
      connectAPIWearable,
      setSelectedWearable,
    ],
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
