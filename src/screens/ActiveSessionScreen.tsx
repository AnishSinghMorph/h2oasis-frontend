import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Image, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
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

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// TODO: Replace with dynamic types from API
// Currently hardcoded - will be fetched from backend based on user's selected product
type TabType = "hotTub" | "breath";

const ActiveSessionScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  // TODO: Replace with API-driven tab types
  // Current tabs are hardcoded - will be replaced with dynamic product-based session types
  const [activeTab, setActiveTab] = useState<TabType>("hotTub");

  // Separate timer states for each tab
  const [hotTubTimeRemaining, setHotTubTimeRemaining] = useState(TIMER_CONFIG.goalTime);
  const [hotTubIsRunning, setHotTubIsRunning] = useState(false);
  const [hotTubIsPaused, setHotTubIsPaused] = useState(false);

  const [breathTimeRemaining, setBreathTimeRemaining] = useState(TIMER_CONFIG.goalTime);
  const [breathIsRunning, setBreathIsRunning] = useState(false);
  const [breathIsPaused, setBreathIsPaused] = useState(false);

  // Separate animation values for each tab
  const circumference = 2 * Math.PI * TIMER_CONFIG.radius;
  const hotTubStrokeDashoffset = useRef(new Animated.Value(circumference)).current;
  const breathStrokeDashoffset = useRef(new Animated.Value(circumference)).current;

  // Hot Tub timer
  useEffect(() => {
    if (!hotTubIsRunning || hotTubIsPaused) return;

    const interval = setInterval(() => {
      setHotTubTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setHotTubIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hotTubIsRunning, hotTubIsPaused]);

  // Navigate when Hot Tub timer completes
  useEffect(() => {
    if (hotTubTimeRemaining === 0 && !hotTubIsRunning) {
      navigation.navigate("SessionComplete");
    }
  }, [hotTubTimeRemaining, hotTubIsRunning, navigation]);

  // Breath timer
  useEffect(() => {
    if (!breathIsRunning || breathIsPaused) return;

    const interval = setInterval(() => {
      setBreathTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setBreathIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [breathIsRunning, breathIsPaused]);

  // Navigate when Breath timer completes
  useEffect(() => {
    if (breathTimeRemaining === 0 && !breathIsRunning) {
      navigation.navigate("SessionComplete");
    }
  }, [breathTimeRemaining, breathIsRunning, navigation]);

  // Hot Tub animation
  useEffect(() => {
    const progressValue = calculateProgress(hotTubTimeRemaining, TIMER_CONFIG.goalTime);
    const newStrokeDashoffset = circumference - (progressValue / 100) * circumference;
    
    Animated.timing(hotTubStrokeDashoffset, {
      toValue: newStrokeDashoffset,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [hotTubTimeRemaining]);

  // Breath animation
  useEffect(() => {
    const progressValue = calculateProgress(breathTimeRemaining, TIMER_CONFIG.goalTime);
    const newStrokeDashoffset = circumference - (progressValue / 100) * circumference;
    
    Animated.timing(breathStrokeDashoffset, {
      toValue: newStrokeDashoffset,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [breathTimeRemaining]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleStart = () => {
    if (activeTab === "hotTub") {
      setHotTubIsRunning(true);
      setHotTubIsPaused(false);
    } else {
      setBreathIsRunning(true);
      setBreathIsPaused(false);
    }
  };

  const handlePauseResume = () => {
    if (activeTab === "hotTub") {
      setHotTubIsPaused(!hotTubIsPaused);
    } else {
      setBreathIsPaused(!breathIsPaused);
    }
  };

  // Get current tab values
  const timeRemaining = activeTab === "hotTub" ? hotTubTimeRemaining : breathTimeRemaining;
  const isRunning = activeTab === "hotTub" ? hotTubIsRunning : breathIsRunning;
  const isPaused = activeTab === "hotTub" ? hotTubIsPaused : breathIsPaused;
  const strokeDashoffset = activeTab === "hotTub" ? hotTubStrokeDashoffset : breathStrokeDashoffset;

  // Calculate current progress and visual properties
  const progress = calculateProgress(timeRemaining, TIMER_CONFIG.goalTime);
  const progressColor = getProgressColor(progress);
  const dotPosition = getProgressDotPosition(progress, TIMER_CONFIG.radius);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Active Session</Text>
        </View>
        <Text style={styles.headerDate}>Wednesday, Apr 23rd</Text>
      </View>

      <View style={styles.tabContainer}>
        {/* TODO: Replace hardcoded tab labels with dynamic data from API */}
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab !== "hotTub" && styles.tabInactive,
            activeTab === "hotTub" && styles.tabActive,
          ]}
          onPress={() => setActiveTab("hotTub")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "hotTub" && styles.tabTextActive,
            ]}
          >
            Hot Tub
          </Text>
        </TouchableOpacity>
        <View style={styles.tabSeparator} />
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab !== "breath" && styles.tabInactive,
            activeTab === "breath" && styles.tabActive,
          ]}
          onPress={() => setActiveTab("breath")}
        >
          <Text
            style={[
              styles.tabText,
              styles.tabTextBreath,
              activeTab === "breath" && styles.tabTextActive,
            ]}
          >
            Breath
          </Text>
        </TouchableOpacity>
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
                <View
                  style={[
                    styles.progressDot,
                    dotPosition,
                  ]}
                />
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
                    Goal- {Math.floor(TIMER_CONFIG.goalTime / 60)}:
                    {(TIMER_CONFIG.goalTime % 60).toString().padStart(2, "0")} min
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
              <TouchableOpacity style={styles.startButton} onPress={handleStart}>
                <Text style={styles.startButtonText}>Start</Text>
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
            Relax your shoulders, let go{"\n"}the day
          </Text>
        </View>
      </View>

      <BottomNav />
    </View>
  );
};

export default ActiveSessionScreen;
