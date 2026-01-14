import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ImageBackground,
  StatusBar,
  Image,
  Platform,
  Easing,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { styles } from "../styles/ActiveSessionScreen.styles";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { TIMER_CONFIG, formatTime } from "../utils/timerHelpers";
import { Session, SessionStep } from "../types/session.types";
import { useAuth } from "../context/AuthContext";
import { sessionService } from "../services/sessionService";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ActiveSessionRouteProp = RouteProp<RootStackParamList, "ActiveSession">;

// Message phases for each step
type MessagePhase =
  | "start-message" // Session StartMessage (only first step)
  | "timer-start" // Step TimerStartMessage
  | "instructions" // Step Instructions
  | "message" // Step Message
  | "timer-end"; // Step TimerEndMessage

const ActiveSessionScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<ActiveSessionRouteProp>();
  const { userName, firebaseUID } = useAuth();

  // Get session from navigation params
  const session: Session | null = route.params?.session || null;
  const steps: SessionStep[] = session?.Steps || [];

  // Current step index
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[currentStepIndex];

  // Message phase state
  const [messagePhase, setMessagePhase] =
    useState<MessagePhase>("start-message");
  const [showStartMessage, setShowStartMessage] = useState(true);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(
    currentStep ? currentStep.DurationMinutes * 60 : TIMER_CONFIG.goalTime,
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Marquee animation
  const marqueeAnim = useRef(new Animated.Value(0)).current;

  // Guidance visibility toggle
  const [isGuidanceVisible, setIsGuidanceVisible] = useState(true);
  const guidanceAnim = useRef(new Animated.Value(1)).current;
  // 1 = visible, 0 = hidden

  const toggleGuidance = () => {
    const toValue = isGuidanceVisible ? 0 : 1;

    Animated.timing(guidanceAnim, {
      toValue,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    setIsGuidanceVisible(!isGuidanceVisible);
  };

  // Goal time for current step
  const goalTime = currentStep
    ? currentStep.DurationMinutes * 60
    : TIMER_CONFIG.goalTime;

  // Get current message to display based on phase
  const getCurrentMessage = (): string => {
    if (showStartMessage && session?.StartMessage) {
      return session.StartMessage;
    }

    switch (messagePhase) {
      case "timer-start":
        return currentStep?.TimerStartMessage || "";
      case "instructions":
        return currentStep?.Instructions || "";
      case "message":
        return currentStep?.Message || "";
      case "timer-end":
        return currentStep?.TimerEndMessage || "";
      default:
        return "";
    }
  };

  // Animate marquee message
  const animateMarquee = () => {
    marqueeAnim.setValue(50); // Start from below
    Animated.timing(marqueeAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  // Handle session start message
  useEffect(() => {
    if (showStartMessage && session?.StartMessage) {
      animateMarquee();
      // Show start message for 5-8 seconds, then move to first step
      const timer = setTimeout(() => {
        setShowStartMessage(false);
        setMessagePhase("timer-start");
        animateMarquee();
      }, 6000); // 6 seconds
      return () => clearTimeout(timer);
    }
  }, [showStartMessage, session?.StartMessage]);

  // Handle message phase progression for each step
  useEffect(() => {
    if (showStartMessage) return; // Wait for start message to finish

    let timer: NodeJS.Timeout;

    switch (messagePhase) {
      case "timer-start":
        // Show TimerStartMessage for 5 seconds and start timer
        if (!isRunning) {
          setIsRunning(true);
        }
        timer = setTimeout(() => {
          setMessagePhase("instructions");
          animateMarquee();
        }, 5000);
        break;

      case "instructions":
        // Show Instructions for 5 seconds, then loop to Message
        timer = setTimeout(() => {
          setMessagePhase("message");
          animateMarquee();
        }, 5000);
        break;

      case "message":
        // Show Message for 5 seconds, then loop back to Instructions
        timer = setTimeout(() => {
          setMessagePhase("instructions");
          animateMarquee();
        }, 5000);
        break;

      case "timer-end":
        // Show TimerEndMessage for 5 seconds
        timer = setTimeout(async () => {
          // Move to next step or complete session
          if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
            setMessagePhase("timer-start"); // Reset to timer-start for next step
            animateMarquee();
          } else {
            // Mark session as completed
            const sessionId = session?._id || session?.sessionId;
            if (sessionId && firebaseUID) {
              try {
                await sessionService.markCompleted(firebaseUID, sessionId);
              } catch (error) {
                console.error("Failed to mark session as completed:", error);
              }
            }
            // Show completion message and navigate
            navigation.navigate("SessionComplete", {
              session: session || undefined,
            });
          }
        }, 5000);
        break;
    }

    return () => clearTimeout(timer);
  }, [
    messagePhase,
    showStartMessage,
    currentStepIndex,
    steps.length,
    navigation,
    session,
    isRunning,
  ]);

  // Update time remaining when step changes
  useEffect(() => {
    if (currentStep && currentStepIndex > 0) {
      // For subsequent steps (not the first one)
      setTimeRemaining(currentStep.DurationMinutes * 60);
      setIsPaused(false);
      // Timer will be started by the message phase effect when it sees "timer-start"
    } else if (currentStep && currentStepIndex === 0) {
      // First step initialization
      setTimeRemaining(currentStep.DurationMinutes * 60);
      setIsRunning(false);
      setIsPaused(false);
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
          // Move to timer-end message
          setMessagePhase("timer-end");
          animateMarquee();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isPaused, messagePhase]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
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
          <TouchableOpacity style={styles.backButtonError} onPress={handleBack}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  
  const insets = useSafeAreaInsets();
  
  // Only apply safe area insets on Android
  const bottomOffset = Platform.OS === "android" ? insets.bottom : 0;

  return (
    <ImageBackground
      source={require("../../assets/timerBg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />

      {/* Centered content container */}
      <View style={styles.centeredContent}>
        {/* Activity title */}
        <View style={styles.headerSection}>
          <Text style={styles.activityTitle}>
            {currentStep?.Activity
              ? currentStep.Activity.charAt(0).toUpperCase() +
                currentStep.Activity.slice(1).replace("-", " ")
              : session?.SessionName || "Session"}
          </Text>
        </View>

        {/* Timer section */}
        <View style={styles.timerSection}>
          <AnimatedCircularProgress
            size={280}
            width={16}
            fill={((goalTime - timeRemaining) / goalTime) * 100}
            tintColor="#5BBFCF"
            backgroundColor="rgba(255, 255, 255, 0.3)"
            lineCap="round"
            rotation={0}
          >
            {() => (
              <View style={styles.timerTextContainer}>
                <Text style={styles.timeRemainingLabel}>Time Remaining</Text>
                <Text style={styles.timerDisplay}>
                  {formatTime(timeRemaining)}
                </Text>
              </View>
            )}
          </AnimatedCircularProgress>
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
            <Text style={styles.buttonLabel}>
              {isPaused ? "Resume" : "Pause"}
            </Text>
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
              <BlurView
                intensity={25}
                tint="light"
                style={styles.actionButtonBlur}
              >
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

        <View style={[styles.guidanceWrapper, { bottom: 30 + bottomOffset }]}>

          {/* Marquee message section */}
          <Animated.View
            style={[
              styles.guidanceSection,
              {
                transform: [
                  {
                    translateY: Animated.add(
                      marqueeAnim,
                      guidanceAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    ),
                  },
                ],
                opacity: Animated.multiply(
                  guidanceAnim,
                  marqueeAnim.interpolate({
                    inputRange: [0, 50],
                    outputRange: [1, 0],
                  }),
                ),
              },
            ]}
          >
            <Text style={styles.guidanceText}>
              {userName ? `${userName}, ` : ""}
              {getCurrentMessage()}
            </Text>
          </Animated.View>

          {/* Info icon at bottom */}
          <TouchableOpacity
            style={styles.infoIcon}
            onPress={toggleGuidance}
            activeOpacity={0.7}
          >
            <View style={styles.infoIcon}>
              <Ionicons
                name="information-circle-outline"
                size={28}
                color="rgba(255,255,255,0.5)"
              />
            </View>
          </TouchableOpacity>
              
        </View>
        
      </View>
    </ImageBackground>
  );
};

export default ActiveSessionScreen;
