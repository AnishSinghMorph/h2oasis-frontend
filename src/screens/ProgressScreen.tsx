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
import { styles } from "../styles/ProgressScreen.styles";
import BottomNav from "../components/BottomNav";
import { sessionService } from "../services/sessionService";
import { Session } from "../types/session.types";
import H2OLoader from "../components/H2OLoader";
import StreakCard from "./progress/StreakCard";
import WellnessSummary from "./progress/WellnessSummary";
import LatestSessions from "./progress/LatestSessions";

const ProgressScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { firebaseUID, photoURL } = useAuth();
  const { selectedVoice } = useVoice();
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [eveningSessions, setEveningSessions] = useState<Session[]>([]);
  const [wearables, setWearables] = useState<Record<string, any>>({});

  const aiName = selectedVoice?.name || "Evy";

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

        // Extract wearables data
        if (result.data.wearables) {
          setWearables(result.data.wearables);
        }

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

  const formattedDate = getFormattedDate();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/progress/progress_bg.png")}
        style={styles.progressBg}
        imageStyle={styles.progressBgImage}
        resizeMode="cover"
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.headerTitle}>Progress</Text>
          <StreakCard />
          <WellnessSummary />
          <LatestSessions />
        </ScrollView>
      </ImageBackground>
      <BottomNav />
    </View>
  );
};

export default ProgressScreen;
