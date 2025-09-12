import React, { useState, useEffect } from "react";
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

const ConnectWearableScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [selectedWearable, setSelectedWearable] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { updateCurrentStep, updateStepProgress, getProgressPercentage } =
    useSetupProgress();
  const { firebaseUID } = useAuth();

  // Complete onboarding process
  const completeOnboarding = async () => {
    if (!firebaseUID) {
      Alert.alert("Error", "Authentication required");
      return;
    }

    setLoading(true);
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
                  // routes: [{ name: "Dashboard" }],
                  routes: [{ name: "AIAssistant" }],
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
    } finally {
      setLoading(false);
    }
  };

  // Set initial step when component mounts
  useEffect(() => {
    updateCurrentStep(2);
  }, []);

  type Wearable = {
    id: string;
    name: string;
    icon: any;
  };

  const wearables: Wearable[] = [
    {
      id: "Apple",
      name: "Apple",
      icon: require("../../assets/icons/apple.png"),
    },
    {
      id: "Samsung",
      name: "Samsung",
      icon: require("../../assets/icons/samsung.png"),
    },
    {
      id: "Fitbit",
      name: "Fitbit",
      icon: require("../../assets/icons/fitbit.png"),
    },
    {
      id: "Garmin",
      name: "Garmin",
      icon: require("../../assets/icons/garmin.png"),
    },
    {
      id: "Whoop",
      name: "Whoop",
      icon: require("../../assets/icons/whoop.png"),
    },
  ];

  return (
    <View style={ConnectWearableStyles.container}>
      {/* Content */}
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

        <Text style={ConnectWearableStyles.title}>Connect your wearable</Text>

        {/* Wearable Grid */}
        <View style={ConnectWearableStyles.grid}>
          {wearables.map((wearable, index) => {
            const isSelected = selectedWearable === wearable.id;

            return (
              <TouchableOpacity
                key={wearable.id}
                onPress={() => {
                  setSelectedWearable(wearable.id);
                  updateStepProgress(1);
                }}
                activeOpacity={0.8}
                style={[
                  ConnectWearableStyles.wearableBtn,
                  isSelected
                    ? ConnectWearableStyles.wearableSelected
                    : ConnectWearableStyles.wearableDefault,
                ]}
              >
                <View style={ConnectWearableStyles.iconWrapper}>
                  <Image
                    source={wearable.icon}
                    style={ConnectWearableStyles.icon}
                  />
                </View>
                <Text
                  style={[
                    ConnectWearableStyles.wearableText,
                    { color: isSelected ? "#fff" : "#1A1A1A" },
                  ]}
                >
                  {wearable.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Next Button */}
        <NextButton
          onPress={() => {
            if (selectedWearable) {
              navigation.navigate("AIAssistant");
            }
          }}
          disabled={!selectedWearable || loading}
        />
      </ScrollView>
    </View>
  );
};

export default ConnectWearableScreen;
