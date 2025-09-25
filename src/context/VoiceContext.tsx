import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULT_PERSONA_VOICES } from "../config/elevenlabs";
import { ttsService } from "../services/ttsService";

export interface PersonaVoice {
  key: string;
  name: string;
  subtitle: string;
  description: string;
  image: any;
  gender: "male" | "female";
  accent: string;
}

interface VoiceContextType {
  selectedVoice: PersonaVoice | null;
  availableVoices: PersonaVoice[];
  selectVoice: (voice: PersonaVoice) => Promise<void>;
  isLoading: boolean;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

const SELECTED_VOICE_KEY = "@h2oasis_selected_voice";

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedVoice, setSelectedVoice] = useState<PersonaVoice | null>(null);
  const [availableVoices, setAvailableVoices] = useState<PersonaVoice[]>(
    DEFAULT_PERSONA_VOICES as any,
  );
  const [isLoading, setIsLoading] = useState(true);

  // Load available voices from backend and saved voice on app start
  useEffect(() => {
    loadVoicesAndSelection();
  }, []);

  const loadVoicesAndSelection = async () => {
    try {
      // Try to fetch voices from backend, fallback to default
      const backendVoices = await ttsService.getAvailableVoices();
      if (backendVoices.length > 0) {
        // Map backend voices to frontend format
        const mappedVoices = backendVoices.map((voice) => ({
          key: voice.key,
          name: voice.name,
          subtitle: voice.subtitle,
          description: voice.description,
          gender: voice.gender,
          accent: voice.accent,
          image:
            DEFAULT_PERSONA_VOICES.find((v) => v.key === voice.key)?.image ||
            DEFAULT_PERSONA_VOICES[0].image,
        }));
        setAvailableVoices(mappedVoices);
      }

      // Load saved voice selection
      const savedVoiceKey = await AsyncStorage.getItem(SELECTED_VOICE_KEY);
      if (savedVoiceKey) {
        const voice = availableVoices.find((v) => v.key === savedVoiceKey);
        if (voice) {
          setSelectedVoice(voice);
        }
      }

      // Set default voice if none selected
      if (!savedVoiceKey && availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0]);
      }
    } catch (error) {
      console.error("Error loading voices:", error);
      // Fallback to default voices
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const selectVoice = async (voice: PersonaVoice) => {
    try {
      setSelectedVoice(voice);
      await AsyncStorage.setItem(SELECTED_VOICE_KEY, voice.key);
      console.log("✅ Voice selected and saved:", voice.name);
    } catch (error) {
      console.error("Error saving selected voice:", error);
    }
  };

  const value: VoiceContextType = {
    selectedVoice,
    availableVoices,
    selectVoice,
    isLoading,
  };

  return (
    <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>
  );
};

export const useVoice = (): VoiceContextType => {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error("useVoice must be used within a VoiceProvider");
  }
  return context;
};
