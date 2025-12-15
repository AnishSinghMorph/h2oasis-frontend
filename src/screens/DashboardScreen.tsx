import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  AppState,
  Alert,
  ImageBackground,
  PanResponder,
  Animated,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/api";
import { styles } from "../styles/DashboardScreen.styles";
import BottomNav from "../components/BottomNav";
import { GlassCard } from "../components/GlassCard";
import { chatService } from "../services/chatService";
import { Session } from "../types/session.types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

type MoodType = "notGood" | "ok" | "great";

const DashboardScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { firebaseUID, photoURL } = useAuth();
  const [userName, setUserName] = useState<string>("");
  const [selectedMood, setSelectedMood] = useState<MoodType>("notGood");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [suggestedSession, setSuggestedSession] = useState<Session | null>(
    null,
  );
  const [creatingSession, setCreatingSession] = useState(false);

  const fetchUserData = async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true);

      if (!firebaseUID) {
        setError("User not authenticated");
        setLoading(false);
        setInitialLoad(false);
        return;
      }

      // Check cache first
      const cachedData = await AsyncStorage.getItem("user_profile_cache");
      if (cachedData && initialLoad) {
        const parsed = JSON.parse(cachedData);
        setUserName(parsed.name || "");
        setInitialLoad(false);
        setLoading(false);
        // Continue to fetch fresh data in background
      }

      const response = await fetch(`${API_BASE_URL}/api/health-data`, {
        method: "GET",
        headers: {
          "x-firebase-uid": firebaseUID,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success && result.data.profile) {
        let name = "";
        if (result.data.profile.name) {
          name = result.data.profile.name;
        } else if (result.data.profile.email) {
          const emailName = result.data.profile.email.split("@")[0];
          name = emailName.charAt(0).toUpperCase() + emailName.slice(1);
        }
        setUserName(name);

        // Cache the data
        await AsyncStorage.setItem(
          "user_profile_cache",
          JSON.stringify({ name, timestamp: Date.now() }),
        );
      }
      // Load suggested session (if created from chat)
      try {
        const suggested = await AsyncStorage.getItem("suggestedSession");
        if (suggested) {
          setSuggestedSession(JSON.parse(suggested));
        }
      } catch (e) {
        console.warn("Failed to load suggested session:", e);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Network error");
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  // Only fetch on initial mount
  useEffect(() => {
    fetchUserData(true);
  }, [firebaseUID]);

  // Only refetch when screen comes into focus AND data is stale (>5 minutes)
  useFocusEffect(
    React.useCallback(() => {
      const checkAndRefresh = async () => {
        const cachedData = await AsyncStorage.getItem("user_profile_cache");
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          const isStale = Date.now() - parsed.timestamp > 5 * 60 * 1000; // 5 minutes
          if (isStale) {
            fetchUserData(false); // Background refresh, no loader
          }
        }
      };
      checkAndRefresh();
    }, [firebaseUID]),
  );

  // Remove AppState listener - not needed for this use case
  // Users don't need fresh data every time app comes to foreground

  const getUserInitials = () => {
    if (!userName) return "U";
    const names = userName.split(" ");
    if (names.length >= 2) {
      return names[0][0] + names[1][0];
    }
    return userName.substring(0, 2).toUpperCase();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getFormattedDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "short",
      day: "numeric",
    };
    const formattedDate = date.toLocaleDateString("en-US", options);
    const day = date.getDate();
    const suffix =
      day === 1 || day === 21 || day === 31
        ? "st"
        : day === 2 || day === 22
          ? "nd"
          : day === 3 || day === 23
            ? "rd"
            : "th";
    return formattedDate.replace(/\d+/, `${day}${suffix}`);
  };

  const handleStartNow = async () => {
    if (!firebaseUID) {
      Alert.alert("Error", "Please log in to start a session");
      return;
    }

    // If we already have a suggested session, use it
    if (suggestedSession) {
      navigation.navigate("ActiveSession", { session: suggestedSession });
      return;
    }

    // Otherwise, create a new session
    setCreatingSession(true);
    try {
      const moodMap: Record<MoodType, string> = {
        notGood: "stressed",
        ok: "neutral",
        great: "energetic",
      };

      const response = await chatService.createSession(firebaseUID, {
        tags: ["Spa", "Hot Tub"], // TODO: Get from user's selected product
        goals: ["relaxation", "stress relief"],
        mood: selectedMood ? moodMap[selectedMood] : "relaxed",
      });

      if (response.success && response.session) {
        setSuggestedSession(response.session);
        navigation.navigate("ActiveSession", { session: response.session });
      } else {
        Alert.alert(
          "Session Error",
          response.error || "Failed to create session. Please try again.",
        );
      }
    } catch (err) {
      console.error("Error creating session:", err);
      Alert.alert("Error", "Failed to create session. Please try again.");
    } finally {
      setCreatingSession(false);
    }
  };

  const handleScheduleLater = () => {
    console.log("Schedule later clicked");
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3AAFA9" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>❌ {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchUserData(true)}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting Card with Header Inside */}
        <ImageBackground
          source={require("../../assets/greetingCard.png")}
          style={styles.greetingCard}
          imageStyle={styles.greetingCardImage}
        >
          {/* Header Row */}
          <View style={styles.header}>
            <View style={styles.avatar}>
              {photoURL ? (
                <Image
                  source={{ uri: photoURL }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.avatarText}>{getUserInitials()}</Text>
              )}
            </View>
            <Text style={styles.dateText}>{getFormattedDate()}</Text>
            <View style={styles.spacer} />
            <View style={styles.notificationButton}>
              <BlurView intensity={20} tint="light" style={styles.notificationBlur}>
                <Image
                  source={require("../../assets/notifcation.png")}
                  style={styles.notificationIcon}
                  resizeMode="contain"
                />
              </BlurView>
            </View>
          </View>

          {/* Greeting Text */}
          <View style={styles.greetingContent}>
            <Text style={styles.greetingText}>
              {getGreeting()}
            </Text>
            <Text style={styles.greetingName}>
              {userName}!
            </Text>
          </View>

          {/* Mood Check-in Card with Glass Effect */}
          <GlassCard style={styles.moodCard}>
            <Text style={styles.moodTitle}>How are you feeling today?</Text>
            <Text style={styles.moodSubtitle}>Mood Check in</Text>

            {/* Slider with all emojis visible */}
            <View style={styles.sliderContainer}>
              {/* Background emojis - always visible */}
              <View style={styles.emojisRow}>
                <TouchableOpacity onPress={() => setSelectedMood("notGood")} style={styles.emojiButton}>
                  <Image
                    source={require("../../assets/dashboard/emojis/notGood.png")}
                    style={styles.moodEmoji}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedMood("ok")} style={styles.emojiButton}>
                  <Image
                    source={require("../../assets/dashboard/emojis/ok.png")}
                    style={styles.moodEmoji}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedMood("great")} style={styles.emojiButton}>
                  <Image
                    source={require("../../assets/dashboard/emojis/great.png")}
                    style={styles.moodEmoji}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              {/* Blue slider thumb with arrow */}
              <View 
                style={[
                  styles.sliderThumb,
                  selectedMood === "notGood" && { left: 8 },
                  selectedMood === "ok" && { left: "50%", marginLeft: -40 },
                  selectedMood === "great" && { right: 8 },
                ]}
              >
                <Image
                  source={
                    selectedMood === "notGood" 
                      ? require("../../assets/dashboard/emojis/notGood.png")
                      : selectedMood === "ok"
                      ? require("../../assets/dashboard/emojis/ok.png")
                      : require("../../assets/dashboard/emojis/great.png")
                  }
                  style={styles.moodEmoji}
                  resizeMode="contain"
                />
                <View style={styles.arrowButton}>
                  <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
                </View>
              </View>
            </View>

            {/* Labels Row */}
            <View style={styles.moodLabelsRow}>
              <Text style={[styles.moodLabel, selectedMood === "notGood" && styles.moodLabelActive]}>Not Good</Text>
              <Text style={[styles.moodLabel, selectedMood === "ok" && styles.moodLabelActive]}>Ok</Text>
              <Text style={[styles.moodLabel, selectedMood === "great" && styles.moodLabelActive]}>Great</Text>
            </View>
          </GlassCard>
        </ImageBackground>

        {/* Rest of dashboard content will go here */}
        
      </ScrollView>

      <BottomNav />
    </View>
  );
};

export default DashboardScreen;
