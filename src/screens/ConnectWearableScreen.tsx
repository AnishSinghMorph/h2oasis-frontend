import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ConnectWearableStyles } from "../styles/ConnectWearableStyles";
import { RootStackParamList } from "../navigation/AppNavigator";
import { progressBarStyles } from "../styles/ProgressBar";
import { useSetupProgress } from "../context/SetupProgressContext";
import { useAuth } from "../context/AuthContext";
import { NextButton } from "../components/NextButton";
import API_CONFIG from "../config/api";

// New modular components
import { WearableGrid } from "../components/wearables/WearableGrid";
import { useWearableIntegration } from "../hooks/useWearableIntegration";
import { WEARABLE_DEVICES } from "../constants/wearables";
import { spacing } from "../styles/theme";
import { SamsungHealthDataViewer } from "../components/SamsungHealthDataViewer";

const ConnectWearableScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { updateCurrentStep, getProgressPercentage } = useSetupProgress();
  const { firebaseUID } = useAuth();

  // State for connection statuses and health data
  const [connectionStates, setConnectionStates] = useState<
    Record<string, boolean>
  >({});
  const [healthData, setHealthData] = useState<Record<string, any>>({});

  // Use the new wearable integration hook
  const {
    selectedWearable,
    loadingStates,
    handleWearablePress,
    isAppleHealthReady,
  } = useWearableIntegration({
    isSandbox: true, // TODO: Set to false for production
  });

  // Set initial step when component mounts
  useEffect(() => {
    updateCurrentStep(2);
  }, [updateCurrentStep]);

  // Load connection states from API on mount
  useEffect(() => {
    const loadConnectionStates = async () => {
      try {
        console.log("🔄 Loading connection states from API...");

        if (!firebaseUID) {
          console.log("❌ No Firebase UID available");
          return;
        }

        // Get wearable connections from our API
        const response = await fetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WEARABLE_CONNECTIONS}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-firebase-uid": firebaseUID,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          const wearableConnections = data.data || {};

          // Convert to connection states format and extract health data
          const connectionStates: Record<string, boolean> = {};
          const healthDataStates: Record<string, any> = {};

          Object.keys(wearableConnections).forEach((key) => {
            connectionStates[key] =
              wearableConnections[key]?.connected || false;
            if (wearableConnections[key]?.healthData) {
              healthDataStates[key] = wearableConnections[key].healthData;
            }
          });

          setConnectionStates(connectionStates);
          setHealthData(healthDataStates);
          console.log(
            "✅ Connection states loaded from API:",
            connectionStates,
          );
          console.log("✅ Health data loaded from API:", healthDataStates);
        } else {
          console.warn("⚠️ Failed to load connection states from API");
        }
      } catch (error) {
        console.error("❌ Failed to load connection states:", error);
      }
    };

    if (firebaseUID) {
      loadConnectionStates();
    }
  }, [firebaseUID]);

  // Complete onboarding process
  const completeOnboarding = async () => {
    if (!firebaseUID) {
      Alert.alert("Error", "Authentication required");
      return;
    }

    try {
      console.log("🎯 Completing onboarding for UID:", firebaseUID);
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.COMPLETE_ONBOARDING}`,
        {
          method: "POST",
          headers: { "x-firebase-uid": firebaseUID },
        },
      );

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Onboarding completed successfully");
        Alert.alert(
          "Setup Complete!",
          "Welcome to H2Oasis! Your account is now ready.",
          [
            {
              text: "Continue",
              onPress: () =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Dashboard" }],
                }),
            },
          ],
        );
      } else {
        console.error("❌ Failed to complete onboarding:", data);
        Alert.alert("Error", "Failed to complete setup. Please try again.");
      }
    } catch (error) {
      console.error("❌ Error completing onboarding:", error);
      Alert.alert("Error", "Network error. Please try again.");
    }
  };

  // Handle next button press
  const handleNextPress = () => {
    if (selectedWearable === "apple") {
      // Apple Health setup is handled automatically in the hook
      navigation.navigate("AIAssistant");
    } else if (selectedWearable) {
      // For other wearables that are coming soon
      Alert.alert(
        "Coming Soon",
        "This wearable integration will be available soon!",
        [
          {
            text: "Continue with Apple Health",
            onPress: () => navigation.navigate("AIAssistant"),
          },
          {
            text: "Skip for Now",
            onPress: () => navigation.navigate("AIAssistant"),
          },
        ],
      );
    }
  };

  // Check if any wearable is currently loading
  const isAnyWearableLoading = Object.values(loadingStates).some(
    (loading) => loading,
  );

  return (
    <View style={ConnectWearableStyles.container}>
      {/* Fixed Header Section */}
      <View
        style={{
          paddingHorizontal: spacing.screenHorizontal,
          paddingTop: spacing.screenTop,
        }}
      >
        {/* Header with back button and progress */}
        <View style={ConnectWearableStyles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require("../../assets/back.png")}
              style={{ width: 12 }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Progress bar */}
          <View style={progressBarStyles.container}>
            <View style={progressBarStyles.base}>
              <View
                style={[
                  progressBarStyles.fill,
                  { width: `${getProgressPercentage()}%` },
                ]}
              />
            </View>
          </View>
        </View>

        <Text style={ConnectWearableStyles.title}>Connect your wearable</Text>
      </View>

      {/* Scrollable Wearable Grid Section */}
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: spacing.screenHorizontal,
        }}
        contentContainerStyle={{
          paddingBottom: spacing.xl,
        }}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        {/* Samsung Health Data Viewer - Sync and view health data */}
        <SamsungHealthDataViewer />
        
        <WearableGrid
          wearables={WEARABLE_DEVICES}
          selectedWearable={selectedWearable}
          loadingStates={loadingStates}
          connectionStates={connectionStates}
          healthData={healthData}
          onWearablePress={handleWearablePress}
        />
      </ScrollView>

      {/* Fixed Next Button at Bottom - Same style as SelectProductScreen */}
      <NextButton
        onPress={handleNextPress}
        disabled={!selectedWearable || isAnyWearableLoading}
        containerStyle={{
          paddingHorizontal: spacing.screenHorizontal,
        }}
      />
    </View>
  );
};

export default ConnectWearableScreen;
