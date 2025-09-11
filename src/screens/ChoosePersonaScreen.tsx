import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { globalStyles } from "../styles/globalStyles";
import { AIAssistant } from "../styles/AIAssistant";
import { useAuth } from "../context/AuthContext";
import API_CONFIG from "../config/api";

type ChoosePersonaScreenNavigationProp =
  StackNavigationProp<RootStackParamList>;

const ChoosePersonaScreen = () => {
  const navigation = useNavigation<ChoosePersonaScreenNavigationProp>();
  const { firebaseUID } = useAuth();
  const [loading, setLoading] = useState(false);

  // Complete onboarding process
  const completeOnboarding = async () => {
    if (!firebaseUID) {
      Alert.alert("Error", "Authentication required");
      return;
    }

    setLoading(true);
    try {
      console.log("🎯 Completing onboarding for UID:", firebaseUID);
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.COMPLETE_ONBOARDING}`,
        {
          method: "POST",
          headers: { "x-firebase-uid": firebaseUID },
        },
      );

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Onboarding completed successfully");
        navigation.reset({
          index: 0,
          routes: [{ name: "Dashboard" }],
        });
      } else {
        console.error("❌ Failed to complete onboarding:", data);
        Alert.alert("Error", "Failed to complete setup. Please try again.");
      }
    } catch (error) {
      console.error("❌ Error completing onboarding:", error);
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setLoading(false);
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
        source={require("../../assets/gradient_bg_2.png")}
        style={AIAssistant.backgroundImage}
        resizeMode="cover"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          <View style={AIAssistant.overlay}>
            <View style={AIAssistant.titleContainer}>
              <Text style={AIAssistant.title}>Choose your</Text>
              <Text style={AIAssistant.title}>Persona</Text>
            </View>

            <View
              style={[
                AIAssistant.logoSection,
                AIAssistant.chossePersonaCarousel,
              ]}
            >
              <Image
                source={require("../../assets/persona.png")}
                style={{ width: 163, height: 163 }}
                resizeMode="contain"
              />
              <View>
                <Text style={AIAssistant.logoText}>Lena Vale</Text>
                <Text style={AIAssistant.logoSubText}>
                  The Mindful Explorer
                </Text>
              </View>
            </View>

            <View style={AIAssistant.buttonContainer}>
              <TouchableOpacity
                style={[
                  AIAssistant.aiButtons,
                  AIAssistant.letsGo,
                  loading && { opacity: 0.7 },
                ]}
                onPress={completeOnboarding}
                disabled={loading}
              >
                <Text
                  style={[AIAssistant.aiButtonText, AIAssistant.letsGoText]}
                >
                  {loading ? "Setting up..." : "Let's go"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default ChoosePersonaScreen;
