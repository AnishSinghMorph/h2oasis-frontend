import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";
import { useAuth } from "../../context/AuthContext";
import { useVoice, PersonaVoice } from "../../context/VoiceContext";
import { useAppFlow } from "../../context/AppFlowContext";
import { Ionicons } from "@expo/vector-icons";
import { ChoosePersonaStyles as styles } from "../../styles/ChoosePersonaStyles";

const ChoosePersonaContent = () => {
  const { firebaseUID, userName } = useAuth();
  const { availableVoices, selectVoice, selectedVoice } = useVoice();
  const { navigateTo } = useAppFlow();
  const [loading, setLoading] = useState(false);
  const [previewingVoice, setPreviewingVoice] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Get first name from full name
  const getFirstName = () => {
    if (userName) {
      return userName.split(" ")[0];
    }
    return "there";
  };

  // Set default selection to first voice or previously selected
  useEffect(() => {
    if (selectedVoice) {
      setSelected(selectedVoice.key);
    } else if (availableVoices.length > 0) {
      setSelected(availableVoices[0].key);
    }
  }, [availableVoices, selectedVoice]);

  // Cleanup sound on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // Preview voice functionality using local audio files
  const previewVoice = async (voiceKey: string) => {
    try {
      // Stop currently playing audio
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setPreviewingVoice(null);
      }

      // If clicking the same voice again, just stop
      if (previewingVoice === voiceKey) {
        return;
      }

      setPreviewingVoice(voiceKey);

      // Map voice keys to local audio files
      const voiceAudioMap: Record<string, any> = {
        emily: require("../../../assets/voice/Emily.mp3"),
        kai: require("../../../assets/voice/Kai.mp3"),
      };

      const audioSource = voiceAudioMap[voiceKey.toLowerCase()];

      if (!audioSource) {
        console.error(`No audio file found for voice: ${voiceKey}`);
        setPreviewingVoice(null);
        return;
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
      });

      // Load and play the audio
      const { sound: newSound } = await Audio.Sound.createAsync(audioSource, {
        shouldPlay: true,
        volume: 1.0,
      });

      setSound(newSound);

      // Set up playback status listener
      newSound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.didJustFinish) {
          setPreviewingVoice(null);
          newSound.unloadAsync();
          setSound(null);
        }
      });
    } catch (error) {
      console.error("Voice preview error:", error);
      setPreviewingVoice(null);
      Alert.alert(
        "Preview Error",
        "Could not preview this voice. Please try again.",
      );
    }
  };

  // Handle voice selection
  const handleVoiceSelect = async (voice: PersonaVoice) => {
    setSelected(voice.key);
    await selectVoice(voice);
  };

  // Navigate to next step
  const handleNext = async () => {
    if (!firebaseUID) {
      Alert.alert("Error", "Authentication required");
      return;
    }

    if (!selected) {
      Alert.alert(
        "Please select a persona",
        "Choose Emily or Kai to continue.",
      );
      return;
    }

    setLoading(true);
    try {
      // Save the selected voice
      const selectedPersona = availableVoices.find((v) => v.key === selected);
      if (selectedPersona) {
        await selectVoice(selectedPersona);
      }

      // Navigate to next step within onboarding context
      navigateTo("connectWearables");
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderPersonaCard = (voice: PersonaVoice) => {
    const isSelected = selected === voice.key;
    const isEmily = voice.key === "emily";

    return (
      <TouchableOpacity
        key={voice.key}
        style={[styles.personaCard, isSelected && styles.personaCardSelected]}
        onPress={() => handleVoiceSelect(voice)}
        activeOpacity={0.8}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={
              isEmily
                ? require("../../../assets/EmilyaiOrb.png")
                : require("../../../assets/KaiaiOrb.png")
            }
            style={styles.avatarImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.personaInfo}>
          <Text style={styles.personaName}>{voice.name}</Text>
          <Text style={styles.personaSubtitle}>{voice.subtitle}</Text>
          <Text style={styles.personaDescription}>{voice.description}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header with sound icon */}
      <View style={styles.header}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={styles.soundButton}
          onPress={() => {
            if (selected) previewVoice(selected);
          }}
        >
          <BlurView intensity={40} tint="light" style={styles.soundButtonBlur}>
            <LinearGradient
              colors={[
                "rgba(255, 255, 255, 0.4)",
                "rgba(255, 255, 255, 0.1)",
                "rgba(255, 255, 255, 0.1)",
                "rgba(255, 255, 255, 0.4)",
              ]}
              locations={[0, 0.3, 0.7, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.soundButtonGradient}
            >
              <Ionicons
                name={previewingVoice ? "volume-high" : "volume-medium-outline"}
                size={24}
                color="#FFFFFF"
              />
            </LinearGradient>
          </BlurView>
        </TouchableOpacity>
      </View>

      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.greeting}>Hey, {getFirstName()}!</Text>
        <Text style={styles.title}>
          Which presence feels right for you today?
        </Text>
      </View>

      {/* Persona Cards */}
      <View style={styles.cardsContainer}>
        {availableVoices.map((voice) => renderPersonaCard(voice))}
      </View>

      {/* Bottom Spacer */}
      <View style={styles.spacer} />

      {/* Next Button */}
      <TouchableOpacity
        style={[styles.nextButton, loading && styles.nextButtonDisabled]}
        onPress={handleNext}
        disabled={loading}
      >
        <Text style={styles.nextButtonText}>
          {loading ? "Loading..." : "Next"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ChoosePersonaContent;
