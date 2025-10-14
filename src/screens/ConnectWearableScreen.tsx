import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
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
        <WearableGrid
          wearables={WEARABLE_DEVICES}
          selectedWearable={selectedWearable}
          loadingStates={loadingStates}
          connectionStates={connectionStates}
          onWearablePress={handleWearablePress}
        />

        {/* Next Button */}
        <NextButton
          onPress={() => navigation.navigate("AIAssistant")}
          disabled={false}
        />
      </ScrollView>
    </View>
  );
};

export default ConnectWearableScreen;
