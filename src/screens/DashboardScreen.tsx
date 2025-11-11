import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  AppState,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/api";
import { styles } from "../styles/DashboardScreen.styles";
import BottomNav from "../components/BottomNav";

type MoodType = "awful" | "bad" | "okay" | "good" | "great";

const DashboardScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { firebaseUID } = useAuth();
  const [userName, setUserName] = useState<string>("Rachel");
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    try {
      if (!firebaseUID) {
        setError("User not authenticated");
        setLoading(false);
        return;
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
        if (result.data.profile.name) {
          setUserName(result.data.profile.name);
        } else if (result.data.profile.email) {
          const emailName = result.data.profile.email.split("@")[0];
          setUserName(emailName.charAt(0).toUpperCase() + emailName.slice(1));
        }
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [firebaseUID]);

  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, [firebaseUID]),
  );

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        fetchUserData();
      }
    });

    return () => {
      subscription?.remove();
    };
  }, [firebaseUID]);

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

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
  };

  const handleStartNow = () => {
    navigation.navigate("chatScreen" as never);
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
        <TouchableOpacity style={styles.retryButton} onPress={fetchUserData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getUserInitials()}</Text>
            </View>
            <Text style={styles.dateText}>{getFormattedDate()}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Image
              source={require("../../assets/dashboard/notificationButton.png")}
              style={{ width: 32, height: 32 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.greetingSection}>
          <Text style={styles.greetingTop}>{getGreeting()}</Text>
          <Text style={styles.greetingName}>{userName}!</Text>
        </View>

        <View style={styles.moodSection}>
          <Text style={styles.moodQuestion}>How are you feeling today?</Text>
          <View style={styles.moodOptions}>
            <TouchableOpacity
              style={styles.moodOption}
              onPress={() => handleMoodSelect("awful")}
            >
              <View
                style={[
                  styles.moodEmoji,
                  selectedMood === "awful" && styles.moodEmojiSelected,
                ]}
              >
                <Image
                  source={require("../../assets/dashboard/emojis/awful.png")}
                  style={{ width: 40, height: 40 }}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.moodLabel}>awful</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moodOption}
              onPress={() => handleMoodSelect("bad")}
            >
              <View
                style={[
                  styles.moodEmoji,
                  selectedMood === "bad" && styles.moodEmojiSelected,
                ]}
              >
                <Image
                  source={require("../../assets/dashboard/emojis/bad.png")}
                  style={{ width: 40, height: 40 }}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.moodLabel}>bad</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moodOption}
              onPress={() => handleMoodSelect("okay")}
            >
              <View
                style={[
                  styles.moodEmoji,
                  selectedMood === "okay" && styles.moodEmojiSelected,
                ]}
              >
                <Image
                  source={require("../../assets/dashboard/emojis/okay.png")}
                  style={{ width: 40, height: 40 }}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.moodLabel}>okay</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moodOption}
              onPress={() => handleMoodSelect("good")}
            >
              <View
                style={[
                  styles.moodEmoji,
                  selectedMood === "good" && styles.moodEmojiSelected,
                ]}
              >
                <Image
                  source={require("../../assets/dashboard/emojis/good.png")}
                  style={{ width: 40, height: 40 }}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.moodLabel}>good</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moodOption}
              onPress={() => handleMoodSelect("great")}
            >
              <View
                style={[
                  styles.moodEmoji,
                  selectedMood === "great" && styles.moodEmojiSelected,
                ]}
              >
                <Image
                  source={require("../../assets/dashboard/emojis/great.png")}
                  style={{ width: 40, height: 40 }}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.moodLabel}>great</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.ritualCard}>
          <Image
            source={require("../../assets/dashboard/ritualCard.png")}
            style={styles.ritualCardBackground}
            resizeMode="cover"
          />
          <View style={styles.ritualCardContent}>
            <View>
              <Text style={styles.ritualLabel}>Ritual Card</Text>
              <Text style={styles.ritualTitle}>Evening Unwind</Text>
              <Text style={styles.ritualSubtitle}>Hot Tub + Breathing</Text>
            </View>

            <View style={styles.ritualButtons}>
              <TouchableOpacity
                style={styles.startButton}
                onPress={handleStartNow}
              >
                <Text style={styles.startButtonText}>Start Now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.scheduleLaterButton}
                onPress={handleScheduleLater}
              >
                <Text style={styles.scheduleLaterButtonText}>
                  Schedule Later
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <BottomNav onAIButtonPress={handleStartNow} />
    </View>
  );
};

export default DashboardScreen;
