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
import { useVoice } from "../context/VoiceContext";
import { ttsService } from "../services/ttsService";
import API_CONFIG from "../config/api";

type ChoosePersonaScreenNavigationProp =
  StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get("window");

const ChoosePersonaScreen = () => {
  const navigation = useNavigation<ChoosePersonaScreenNavigationProp>();
  const { firebaseUID } = useAuth();
  const { selectedVoice, availableVoices, selectVoice } = useVoice();
  const [loading, setLoading] = useState(false);
  const [previewingVoice, setPreviewingVoice] = useState<string | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleDotPress = (index: number) => {
    setActiveIndex(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  // Preview voice functionality
  const previewVoice = async (voiceKey: string) => {
    if (previewingVoice === voiceKey) {
      // Stop if already previewing this voice
      await ttsService.stopAudio();
      setPreviewingVoice(null);
      return;
    }

    try {
      setPreviewingVoice(voiceKey);
      await ttsService.previewVoice(voiceKey);
    } catch (error) {
      console.error("Voice preview error:", error);
      Alert.alert(
        "Preview Error",
        "Could not preview this voice. Please try again.",
      );
    } finally {
      setPreviewingVoice(null);
    }
  };

  // Handle voice selection
  const handleVoiceSelect = async (voice: any) => {
    await selectVoice(voice);
    setActiveIndex(availableVoices.findIndex((v) => v.key === voice.key));
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
                data={availableVoices}
                horizontal
                pagingEnabled
                snapToAlignment="center"
                snapToInterval={width}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.key}
                contentContainerStyle={{ alignItems: "center" }}
                onMomentumScrollEnd={(event) => {
                  const index = Math.round(
                    event.nativeEvent.contentOffset.x / width,
                  );
                  setActiveIndex(index);
                  handleVoiceSelect(availableVoices[index]);
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
                        <Text
                          style={[
                            AIAssistant.logoSubText,
                            { fontSize: 12, marginTop: 5 },
                          ]}
                        >
                          {item.description}
                        </Text>

                        {/* Voice Preview Button */}
                        <TouchableOpacity
                          style={{
                            marginTop: 10,
                            paddingHorizontal: 20,
                            paddingVertical: 8,
                            backgroundColor:
                              previewingVoice === item.id
                                ? "#FF6B6B"
                                : "#4ECDC4",
                            borderRadius: 20,
                          }}
                          onPress={() => previewVoice(item.key)}
                          disabled={
                            previewingVoice !== null &&
                            previewingVoice !== item.key
                          }
                        >
                          <Text
                            style={{
                              color: "white",
                              fontSize: 12,
                              fontWeight: "bold",
                            }}
                          >
                            {previewingVoice === item.key
                              ? "🔊 Playing..."
                              : "🎵 Preview Voice"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
              />

              {/* Clickable Dots */}
              <View style={AIAssistant.dotsContainer}>
                {availableVoices.map((_, index: number) => (
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
