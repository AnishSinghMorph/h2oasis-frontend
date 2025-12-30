import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../context/AuthContext";
import { useVoice } from "../context/VoiceContext";
import { API_BASE_URL } from "../config/api";
import { styles } from "../styles/DashboardScreen.styles";
import BottomNav from "../components/BottomNav";
import { sessionService } from "../services/sessionService";
import { Session } from "../types/session.types";
import DashboardHeader from "./dashboard/DashboardHeader";
import GreetingContent from "./dashboard/GreetingContent";
import SessionList from "./dashboard/SessionList";
import H2OLoader from "../components/H2OLoader";
import { MoodSlider } from "../components/MoodSlider";

const DashboardScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { firebaseUID, photoURL } = useAuth();
  const { selectedVoice } = useVoice();
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [eveningSessions, setEveningSessions] = useState<Session[]>([]);
  const [selectedMood, setSelectedMood] = useState<string>("ok");

  const aiName = selectedVoice?.name || "Evy";

  const handleMoodChange = (mood: string) => {
    setSelectedMood(mood);
    console.log("Selected mood:", mood);
    // TODO: Save mood to backend/storage if needed later
  };

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
      // Load sessions from API
      try {
        const sessions = await sessionService.getSessions(firebaseUID);
        setEveningSessions(sessions);
        console.log(`📋 Loaded ${sessions.length} sessions from API`);
      } catch (e) {
        console.warn("Failed to load sessions from API:", e);
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
    useCallback(() => {
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

  const getUserInitials = useCallback(() => {
    if (!userName) return "U";
    const names = userName.split(" ");
    if (names.length >= 2) {
      return names[0][0] + names[1][0];
    }
    return userName.substring(0, 2).toUpperCase();
  }, [userName]);

  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const getFormattedDate = useCallback(() => {
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
  }, []);

  const handleRetry = useCallback(() => {
    fetchUserData(true);
  }, [firebaseUID]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <H2OLoader size={150} text="Loading..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>❌ {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const userInitials = getUserInitials();
  const greeting = getGreeting();
  const formattedDate = getFormattedDate();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={require("../../assets/greetingCard.png")}
          style={styles.greetingCard}
          imageStyle={styles.greetingCardImage}
        >
          <DashboardHeader
            photoURL={photoURL}
            userInitials={userInitials}
            formattedDate={formattedDate}
          />

          <GreetingContent greeting={greeting} userName={userName} />

          {/* Mood Slider */}
          <View style={styles.moodSliderContainer}>
            <MoodSlider onChange={handleMoodChange} containerWidth={360} />
          </View>
        </ImageBackground>

        <SessionList
          sessions={eveningSessions}
          aiName={aiName}
          navigation={navigation}
        />

        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNav />
    </View>
  );
};

export default DashboardScreen;
