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

const ConnectWearableScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { updateCurrentStep, getProgressPercentage } = useSetupProgress();
  const { firebaseUID } = useAuth();

  // State for connection statuses
  const [connectionStates, setConnectionStates] = useState<
    Record<string, boolean>
  >({});

  // Use the new wearable integration hook
  const { selectedWearable, loadingStates, handleWearablePress } =
    useWearableIntegration();

  // Set initial step when component mounts
  useEffect(() => {
    updateCurrentStep(2);
  }, [updateCurrentStep]);

  // Load connection states from API on mount
  useEffect(() => {
    const loadConnectionStates = async () => {
      if (!firebaseUID) return;

      try {
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

          // Convert to connection states format
          const connectionStates: Record<string, boolean> = {};

          Object.keys(wearableConnections).forEach((key) => {
            connectionStates[key] =
              wearableConnections[key]?.connected || false;
          });

          setConnectionStates(connectionStates);
        }
      } catch (error) {
        console.error("Failed to load connection states:", error);
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
      // For other wearables that are coming soon - directly navigate to AI Assistant
      console.log(`⚠️ Wearable is coming soon`);
      navigation.navigate("AIAssistant");
    }
  };

  // Check if any wearable is currently loading
  const isAnyWearableLoading = Object.values(loadingStates).some(
    (loading) => loading,
  );

  return (
    <View style={ConnectWearableStyles.container}>
      {/* Header with back button and progress */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
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

        {/* Title */}
        <Text style={ConnectWearableStyles.title}>Connect your wearable</Text>

        {/* Wearable Grid */}
        <WearableGrid
          wearables={WEARABLE_DEVICES}
          selectedWearable={selectedWearable}
          loadingStates={loadingStates}
          connectionStates={connectionStates}
          onWearablePress={handleWearablePress}
        />

        {/* View Dashboard Button - if any wearable is connected */}
        {Object.values(connectionStates).some((connected) => connected) && (
          <TouchableOpacity
            style={ConnectWearableStyles.viewDashboardButton}
            onPress={() => navigation.navigate("choosePersona")}
          >
            <Text style={ConnectWearableStyles.viewDashboardButtonText}>
              🤖 Continue to AI Setup
            </Text>
          </TouchableOpacity>
        )}

        {/* Next Button - goes to AI Persona selection */}
        <NextButton
          onPress={() => navigation.navigate("choosePersona")}
          disabled={false}
        />
      </ScrollView>
    </View>
  );
};

export default ConnectWearableScreen;
