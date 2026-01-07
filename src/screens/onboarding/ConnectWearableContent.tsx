import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { useAppFlow } from "../../context/AppFlowContext";
import { BackButton } from "../../components/ui";
import API_CONFIG from "../../config/api";
import { ConnectWearableStyles as styles } from "../../styles/ConnectWearableStyles";
import { Ionicons } from "@expo/vector-icons";

// Modular components
import { WearableGrid } from "../../components/wearables/WearableGrid";
import { useWearableIntegration } from "../../hooks/useWearableIntegration";
import { WEARABLE_DEVICES } from "../../constants/wearables";

const ConnectWearableContent = () => {
  const { firebaseUID } = useAuth();
  const { navigateTo, goBack } = useAppFlow();

  // State for connection statuses
  const [connectionStates, setConnectionStates] = useState<
    Record<string, boolean>
  >({});

  // Use the new wearable integration hook
  const { selectedWearable, loadingStates, handleWearablePress } =
    useWearableIntegration();

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

          const states: Record<string, boolean> = {};
          Object.keys(wearableConnections).forEach((key) => {
            states[key] = wearableConnections[key]?.connected || false;
          });

          setConnectionStates(states);
        }
      } catch (error) {
        console.error("Failed to load connection states:", error);
      }
    };

    if (firebaseUID) {
      loadConnectionStates();
    }
  }, [firebaseUID]);

  const handleNext = () => {
    navigateTo("selectProduct");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with back button and sound button */}
        <View style={styles.header}>
          <BackButton onPress={goBack} />
        </View>

        {/* Title */}
        <Text style={styles.title}>
          Connect your{"\n"}wearables for the{"\n"}best experience.
        </Text>

        {/* Wearable Grid */}
        <WearableGrid
          wearables={WEARABLE_DEVICES}
          selectedWearable={selectedWearable}
          loadingStates={loadingStates}
          connectionStates={connectionStates}
          onWearablePress={handleWearablePress}
        />

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Next Button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ConnectWearableContent;
