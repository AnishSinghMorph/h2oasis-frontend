import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StatusBar,
  TouchableOpacity,
  Alert,
} from "react-native";
import { BlurView } from "@react-native-community/blur";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { styles } from "../styles/ScheduleSessionScreen.styles";
import { GlassmorphicButton } from "../components/GlassmorphicButton";
import { Picker } from "react-native-wheel-pick";
import { scheduleSessionNotification } from "../services/notificationService";

const ScheduleSessionScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [selectedHour, setSelectedHour] = useState(7);
  const [selectedMinute, setSelectedMinute] = useState(30);
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">("AM");

  const hours = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: (i + 1).toString(),
  }));
  const minutes = Array.from({ length: 60 }, (_, i) => ({
    value: i,
    label: i.toString().padStart(2, "0"),
  }));
  const periods = [
    { value: "AM", label: "AM" },
    { value: "PM", label: "PM" },
  ];

  const handleConfirm = async () => {
    try {
      const notificationId = await scheduleSessionNotification(
        selectedHour,
        selectedMinute,
        selectedPeriod,
      );

      if (notificationId) {
        console.log("Notification scheduled successfully:", notificationId);
        console.log(
          `Scheduled for tomorrow at ${selectedHour}:${selectedMinute.toString().padStart(2, "0")} ${selectedPeriod}`,
        );

        Alert.alert(
          "Session Scheduled!",
          `Your session is scheduled for tomorrow at ${selectedHour}:${selectedMinute.toString().padStart(2, "0")} ${selectedPeriod}`,
          [{ text: "OK", onPress: () => navigation.navigate("Dashboard") }],
        );
      } else {
        Alert.alert(
          "Permission Required",
          "Please enable notifications to schedule sessions.",
          [{ text: "OK" }],
        );
      }
    } catch (error) {
      console.error("Error scheduling notification:", error);
      Alert.alert("Error", "Failed to schedule session. Please try again.", [
        { text: "OK" },
      ]);
    }
  };

  const handleCancel = () => {
    navigation.navigate("Dashboard");
  };

  // Get tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateString = tomorrow.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <ImageBackground
      source={require("../../assets/timerBg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        <Text style={styles.title}>Schedule New Session</Text>
        <Text style={styles.subtitle}>Tomorrow, {dateString}</Text>

        {/* Time Picker */}
        <BlurView
          style={styles.timePickerContainer}
          blurType="light"
          blurAmount={20}
          reducedTransparencyFallbackColor="rgba(255, 255, 255, 0.1)"
        >
          {/* Hours */}
          <View style={styles.pickerColumn}>
            <Picker
              style={styles.picker}
              selectedValue={selectedHour}
              pickerData={hours}
              onValueChange={(value: any) => setSelectedHour(value as number)}
              itemStyle={{ color: "#FFFFFF", fontSize: 20 }}
            />
          </View>

          {/* Minutes */}
          <View style={styles.pickerColumn}>
            <Picker
              style={styles.picker}
              selectedValue={selectedMinute}
              pickerData={minutes}
              onValueChange={(value: any) => setSelectedMinute(value as number)}
              itemStyle={{ color: "#FFFFFF", fontSize: 20 }}
            />
          </View>

          {/* AM/PM */}
          <View style={styles.pickerColumn}>
            <Picker
              style={styles.picker}
              selectedValue={selectedPeriod}
              pickerData={periods}
              onValueChange={(value: any) =>
                setSelectedPeriod(value as "AM" | "PM")
              }
              itemStyle={{ color: "#FFFFFF", fontSize: 20 }}
            />
          </View>

          {/* Middle row highlight lines */}
          <View style={styles.topBorder} />
          <View style={styles.bottomBorder} />
        </BlurView>

        {/* Confirm Button */}
        <GlassmorphicButton
          title="Confirm"
          onPress={handleConfirm}
          style={styles.confirmButton}
        />

        {/* Cancel Button */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default ScheduleSessionScreen;
