import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Image, Animated } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { styles } from "../styles/ActiveSessionScreen.styles";
import BottomNav from "../components/BottomNav";
import Svg, { Circle, Path } from "react-native-svg";
import {
  TIMER_CONFIG,
  formatTime,
  calculateProgress,
  getProgressColor,
  getProgressDotPosition,
} from "../utils/timerHelpers";
import { Session, SessionStep } from "../types/session.types";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type ActiveSessionRouteProp = RouteProp<RootStackParamList, "ActiveSession">;

const ActiveSessionScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<ActiveSessionRouteProp>();

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
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Active Session</Text>
          </View>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "#fff", fontSize: 18 }}>
            No session data available
          </Text>
          <TouchableOpacity
            style={[styles.startButton, { marginTop: 20 }]}
            onPress={handleBack}
          >
            <Text style={styles.startButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
        <BottomNav />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{session.SessionName}</Text>
        </View>
        <Text style={styles.headerDate}>{formatDate()}</Text>
      </View>

      {/* Dynamic step tabs */}
      <View style={styles.tabContainer}>
        {steps.map((step, index) => (
          <React.Fragment key={step.StepNumber}>
            {index > 0 && <View style={styles.tabSeparator} />}
            <TouchableOpacity
              style={[
                styles.tab,
                currentStepIndex !== index && styles.tabInactive,
                currentStepIndex === index && styles.tabActive,
              ]}
              onPress={() => handleStepSelect(index)}
            >
              <Text
                style={[
                  styles.tabText,
                  currentStepIndex === index && styles.tabTextActive,
                ]}
                numberOfLines={1}
              >
                {step.Activity}
              </Text>
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </View>

      <View style={styles.content}>
        <View style={styles.timerCard}>
          <View style={styles.timerCircleOuter}>
            <View style={styles.circleContainer}>
              <View style={styles.svgContainer}>
                <Svg width="240" height="240">
                  <Circle
                    cx="120"
                    cy="120"
                    r={TIMER_CONFIG.radius}
                    stroke="#B2C8C8"
                    strokeWidth="10"
                    fill="none"
                  />
                  <AnimatedCircle
                    cx="120"
                    cy="120"
                    r={TIMER_CONFIG.radius}
                    stroke={progressColor}
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    rotation="-90"
                    origin="120, 120"
                  />
                </Svg>
              </View>

              {/* White ball at progress point */}
              {progress > 0 && (
                <View style={[styles.progressDot, dotPosition]} />
              )}

              {/* Inner circle */}
              <View style={styles.circleInner}>
                <View style={styles.timerContent}>
                  <Image
                    source={require("../../assets/timer.png")}
                    style={{ width: 32, height: 32, marginBottom: 8 }}
                    resizeMode="contain"
                  />
                  <Text style={styles.goalText}>
                    Goal- {currentStep.DurationMinutes}:00 min
                  </Text>
                  <Text style={styles.timerDisplay}>
                    {formatTime(timeRemaining)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.buttonSeparatorContainer}>
            <Svg height="120" width="350" style={styles.curvedSeparator}>
              <Path
                d="M 0 0 Q 175 120 350 0"
                stroke="#000000"
                strokeWidth="1"
                fill="none"
              />
            </Svg>
            {!isRunning ? (
              <TouchableOpacity
                style={styles.startButton}
                onPress={handleStart}
              >
                <Text style={styles.startButtonText}>
                  {currentStep.TimerStartMessage || "Start"}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.pauseButton}
                onPress={handlePauseResume}
              >
                <Text style={styles.pauseButtonText}>
                  {isPaused ? "Resume" : "Pause"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.guidanceText}>
            {currentStep.Message || currentStep.Instructions}
          </Text>
        </View>
      </View>

      <BottomNav />
    </View>
  );
};

export default ActiveSessionScreen;
