import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Image,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { styles } from "../styles/SessionCompleteScreen.styles";
import { Ionicons } from "@expo/vector-icons";
import { GlassmorphicButton } from "../components/GlassmorphicButton";

type SessionCompleteRouteProp = RouteProp<
  RootStackParamList,
  "SessionComplete"
>;

const SessionCompleteScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<SessionCompleteRouteProp>();

  const session = route.params?.session;

  // Calculate total time from all steps
  const totalMinutes =
    session?.Steps?.reduce((sum, step) => sum + step.DurationMinutes, 0) || 0;

  const handleSchedule = () => {
    navigation.navigate("ScheduleSession");
  };

  const handleCancel = () => {
    navigation.navigate("Dashboard");
  };

  return (
    <ImageBackground
      source={require("../../assets/progressBg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        {/* Star Logo */}
        <Image
          source={require("../../assets/sessionComplete.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Restoration Completed!</Text>

        <Text style={styles.subtitle}>
          You've successfully reset your rhythm.{"\n"}
          Take this sense of calm with you into the{"\n"}
          rest of your evening.
        </Text>

        {/* Total Time Card */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={40} color="#1A1A1A" />
            <Text style={styles.statValue}>{totalMinutes}</Text>
            <Text style={styles.statLabel}>min</Text>
          </View>
        </View>

        {/* Schedule Button with Glassmorphism */}
        <GlassmorphicButton
          title="Schedule tomorrow's unwind."
          onPress={handleSchedule}
          style={styles.scheduleButton}
        />

        {/* Cancel Button - Transparent */}
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

export default SessionCompleteScreen;
