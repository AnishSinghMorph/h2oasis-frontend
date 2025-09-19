import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Alert,
  FlatList,
  Dimensions,
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

const { width } = Dimensions.get("window");

const personas = [
  {
    id: "1",
    name: "Lena Vale",
    subtitle: "The Mindful Explorer",
    image: require("../../assets/persona.png"),
  },
  {
    id: "2",
    name: "Arjun Mehta",
    subtitle: "The Tech Visionary",
    image: require("../../assets/persona.png"),
  },
  {
    id: "3",
    name: "Sophia Lee",
    subtitle: "The Creative Dreamer",
    image: require("../../assets/persona.png"),
  },
];

const ChoosePersonaScreen = () => {
  const navigation = useNavigation<ChoosePersonaScreenNavigationProp>();
  const { firebaseUID } = useAuth();
  const [loading, setLoading] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleDotPress = (index: number) => {
    setActiveIndex(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

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
          // routes: [{ name: "Dashboard" }],
          routes: [{ name: "chatScreen" }],
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

            <View style={AIAssistant.carouselContainer}>
              <FlatList
                ref={flatListRef}
                data={personas}
                horizontal
                pagingEnabled
                snapToAlignment="center"
                snapToInterval={width}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ alignItems: "center" }}
                onMomentumScrollEnd={(event) => {
                  const index = Math.round(
                    event.nativeEvent.contentOffset.x / width,
                  );
                  setActiveIndex(index);
                }}
                renderItem={({ item }) => (
                  <View
                    style={{
                      width,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View style={AIAssistant.carouselItemContainer}>
                      <Image
                        source={item.image}
                        style={AIAssistant.carouselImage}
                        resizeMode="contain"
                      />
                      <View style={AIAssistant.carouselTextContainer}>
                        <Text style={AIAssistant.logoText}>{item.name}</Text>
                        <Text style={AIAssistant.logoSubText}>
                          {item.subtitle}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              />

              {/* Clickable Dots */}
              <View style={AIAssistant.dotsContainer}>
                {personas.map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleDotPress(index)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        AIAssistant.dot,
                        {
                          backgroundColor:
                            index === activeIndex ? "#000" : "#ccc",
                        },
                      ]}
                    />
                  </TouchableOpacity>
                ))}
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