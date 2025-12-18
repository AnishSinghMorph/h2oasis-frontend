import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ImageBackground,
  StatusBar,
  Image,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { styles } from "../styles/ActiveSessionScreen.styles";
import Svg, { Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import {
  TIMER_CONFIG,
  formatTime,
  calculateProgress,
  getProgressColor,
  getProgressDotPosition,
} from "../utils/timerHelpers";
import { Session, SessionStep } from "../types/session.types";
import { useAuth } from "../context/AuthContext";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type ActiveSessionRouteProp = RouteProp<RootStackParamList, "ActiveSession">;

const ActiveSessionScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<ActiveSessionRouteProp>();
  const { userName } = useAuth();

  // Get session from navigation params
  const session: Session | null = route.params?.session || null;
  const steps: SessionStep[] = session?.Steps || [];

  // Current step index
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[currentStepIndex];

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(
    currentStep ? currentStep.DurationMinutes * 60 : TIMER_CONFIG.goalTime,
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Animation
  const circumference = 2 * Math.PI * TIMER_CONFIG.radius;
  const strokeDashoffset = useRef(new Animated.Value(circumference)).current;

  // Goal time for current step
  const goalTime = currentStep
    ? currentStep.DurationMinutes * 60
    : TIMER_CONFIG.goalTime;

  // Update time remaining when step changes
  useEffect(() => {
    if (currentStep) {
      setTimeRemaining(currentStep.DurationMinutes * 60);
      setIsRunning(false);
      setIsPaused(false);
      strokeDashoffset.setValue(circumference);
    }
  }, [currentStepIndex, currentStep]);

  // Timer countdown
  useEffect(() => {
    if (!isRunning || isPaused) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);

          // Move to next step or complete session
          if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
          } else {
            navigation.navigate("SessionComplete", {
              session: session || undefined,
            });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [
    isRunning,
    isPaused,
    currentStepIndex,
    steps.length,
    navigation,
    session,
  ]);

  // Animation for progress ring
  useEffect(() => {
    const progressValue = calculateProgress(timeRemaining, goalTime);
    const newStrokeDashoffset =
      circumference - (progressValue / 100) * circumference;

    Animated.timing(strokeDashoffset, {
      toValue: newStrokeDashoffset,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [timeRemaining, goalTime]);

  // Auto-start timer when screen loads
  useEffect(() => {
    setIsRunning(true);
    setIsPaused(false);
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleStepSelect = (index: number) => {
    setCurrentStepIndex(index);
  };

  // Calculate current progress and visual properties
  const progress = calculateProgress(timeRemaining, goalTime);
  const progressColor = getProgressColor(progress);
  const dotPosition = getProgressDotPosition(progress, TIMER_CONFIG.radius);

  // Format date
  const formatDate = () => {
    const now = new Date();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = days[now.getDay()];
    const month = months[now.getMonth()];
    const date = now.getDate();
    const suffix =
      date === 1 || date === 21 || date === 31
        ? "st"
        : date === 2 || date === 22
          ? "nd"
          : date === 3 || date === 23
            ? "rd"
            : "th";
    return `${day}, ${month} ${date}${suffix}`;
  };

  // Fallback for no session
  if (!session || steps.length === 0) {
    return (
      <ImageBackground
        source={require("../../assets/timerBg.png")}
        style={styles.container}
        resizeMode="cover"
      >
        <StatusBar barStyle="light-content" />
        <View style={styles.centerContent}>
          <Text style={styles.noSessionText}>No session data available</Text>
          <TouchableOpacity
            style={styles.backButtonError}
            onPress={handleBack}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/timerBg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />

      {/* Activity title at top */}
      <View style={styles.headerSection}>
        <Text style={styles.activityTitle}>
          {currentStep.Activity.charAt(0).toUpperCase() +
            currentStep.Activity.slice(1)}
        </Text>
      </View>

      {/* Timer section */}
      <View style={styles.timerSection}>
        <View style={styles.timerCircleContainer}>
          {/* SVG Circle */}
          <View style={styles.svgContainer}>
            <Svg width="240" height="240">
              <Circle
                cx="120"
                cy="120"
                r={TIMER_CONFIG.radius}
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="3"
                fill="none"
              />
              <AnimatedCircle
                cx="120"
                cy="120"
                r={TIMER_CONFIG.radius}
                stroke="#5BBFCF"
                strokeWidth="3"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                rotation="-90"
                origin="120, 120"
              />
            </Svg>
          </View>

          {/* Progress dot */}
          {progress > 0 && <View style={[styles.progressDot, dotPosition]} />}

          {/* Timer display - absolute positioned */}
          <View style={styles.timerTextContainer}>
            <Text style={styles.timeRemainingLabel}>Time Remaining</Text>
            <Text style={styles.timerDisplay}>{formatTime(timeRemaining)}</Text>
            <View style={styles.temperatureContainer}>
              <Ionicons name="thermometer-outline" size={14} color="rgba(255,255,255,0.7)" />
              <Text style={styles.temperatureText}>34°c</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.actionButtonsContainer}>
        {/* Pause button */}
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            style={styles.actionButtonSmall}
            onPress={handlePauseResume}
          >
            <Image
              source={require("../../assets/pause.png")}
              style={styles.buttonIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.buttonLabel}>Pause</Text>
        </View>

        {/* End Session button */}
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            style={styles.actionButtonCenter}
            onPress={() => {
              setIsRunning(false);
              navigation.navigate("Dashboard");
            }}
          >
            <BlurView intensity={25} tint="light" style={styles.actionButtonBlur}>
              <Ionicons name="close" size={28} color="#FFFFFF" />
            </BlurView>
          </TouchableOpacity>
          <Text style={styles.centerButtonLabel}>End Session</Text>
        </View>

        {/* Sounds button */}
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity style={styles.actionButtonSmall}>
            <Image
              source={require("../../assets/speaker.png")}
              style={styles.buttonIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.buttonLabel}>Sounds</Text>
        </View>
      </View>

      {/* Guidance text */}
      <View style={styles.guidanceSection}>
        <Text style={styles.guidanceText}>
          {userName || "Rachel"},{" "}
          {currentStep.Instructions ||
            currentStep.Message ||
            "as the warmth envelops you, allow the day's demands to gently recede. Focus on this moment of profound relaxation. Your body is now in a state of optimal recovery."}
        </Text>
      </View>

      {/* Info icon at bottom */}
      <View style={styles.infoIcon}>
        <Ionicons name="information-circle-outline" size={28} color="rgba(255,255,255,0.5)" />
      </View>
    </ImageBackground>
  );
};

export default ActiveSessionScreen;
