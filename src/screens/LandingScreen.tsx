import React from "react";
import { View, Text, Image, ImageBackground, StatusBar } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { landingStyles } from "../styles/LandingScreenStyles";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import API_CONFIG from "../config/api";

type LandingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Landing"
>;

const LandingScreen = () => {
  const navigation = useNavigation<LandingScreenNavigationProp>();
  const { isAuthenticated, isLoading, firebaseUID } = useAuth();
  const [timerDone, setTimerDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTimerDone(true), 2000); // 2 seconds
    return () => clearTimeout(timer);
  }, []);

  // When timer finishes, wait for auth check to complete then navigate
  useEffect(() => {
    if (!timerDone) return;
    if (isLoading) return; // will re-run when loading finishes

    // Check onboarding status for authenticated users
    if (isAuthenticated && firebaseUID) {
      checkOnboardingAndNavigate();
    } else {
      navigation.navigate("SignUp");
    }
  }, [timerDone, isLoading, isAuthenticated, firebaseUID, navigation]);

  const checkOnboardingAndNavigate = async () => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROFILE}`,
        {
          headers: { "x-firebase-uid": firebaseUID! },
        },
      );

      const data = await response.json();

      if (response.ok && data.user) {
        if (data.user.onboardingCompleted) {
          navigation.navigate("Dashboard");
        } else {
          navigation.navigate("SelectProduct");
        }
      } else {
        navigation.navigate("SelectProduct");
      }
    } catch (error) {
      navigation.navigate("SelectProduct");
    }
  };

  return (
    <View style={globalStyles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <ImageBackground
        source={require("../../assets/person.png")}
        style={landingStyles.backgroundImage}
        resizeMode="cover"
      >
        <View style={landingStyles.overlay}>
          <View style={landingStyles.logoSection}>
            <Image
              source={require("../../assets/logo.png")}
              style={landingStyles.logo}
              resizeMode="contain"
            />
            {/* <Text style={landingStyles.logoText}>H2OASIS</Text> */}
          </View>
          <View style={landingStyles.contentSection}>
            <Text style={landingStyles.welcomeText}>Welcome to H2Oasis!</Text>
            <Text style={landingStyles.taglineText}>Elevating Escape—</Text>
            <Text style={landingStyles.taglineText}>
              One Breath, One Moment,
            </Text>
            <Text style={landingStyles.taglineText}>
              One Immersion at a Time
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default LandingScreen;
