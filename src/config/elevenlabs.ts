// Frontend configuration for TTS
export const TTS_CONFIG = {
  // Backend will handle ElevenLabs integration
  BACKEND_TTS_URL: "/api/tts",
};

// Default persona voices (will be fetched from backend)
export const DEFAULT_PERSONA_VOICES = [
  {
    key: "alice",
    name: "Alice",
    subtitle: "The Mindful Explorer",
    description: "Calm, soothing voice perfect for wellness guidance",
    image: require("../../assets/persona.png"),
    gender: "female" as const,
    accent: "american",
  },
  {
    key: "bill",
    name: "Bill",
    subtitle: "The Tech Visionary",
    description: "Clear, confident voice for technical discussions",
    image: require("../../assets/persona.png"),
    gender: "male" as const,
    accent: "british",
  },
  {
    key: "elli",
    name: "Elli",
    subtitle: "The Creative Dreamer",
    description: "Warm, inspiring voice for creative motivation",
    image: require("../../assets/persona.png"),
    gender: "female" as const,
    accent: "australian",
  },
] as const;

export default TTS_CONFIG;
