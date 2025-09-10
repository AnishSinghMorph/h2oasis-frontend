import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ConnectWearableStyles } from "../styles/ConnectWearableStyles";
import { RootStackParamList } from "../navigation/AppNavigator";
import { progressBarStyles } from "../styles/ProgressBar";
import { useSetupProgress } from "../context/SetupProgressContext";
import { NextButton } from "../components/NextButton";

const ConnectWearableScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [selectedWearable, setSelectedWearable] = useState<string | null>(null);
  const { updateCurrentStep, updateStepProgress, getProgressPercentage } =
    useSetupProgress();

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
            // Navigate to the next screen
          }
        }}
        disabled={!selectedWearable}
      />
    </View>
  );
};

export default ConnectWearableScreen;
