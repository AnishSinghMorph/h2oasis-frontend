// Frontend configuration for TTS
export const TTS_CONFIG = {
  // Backend will handle ElevenLabs integration
  BACKEND_TTS_URL: "/api/tts",
};

// Default persona voices (will be fetched from backend)
export const DEFAULT_PERSONA_VOICES = [
  {
    key: "emily",
    name: "Emily",
    subtitle: "Calm, Soothing",
    description:
      "Soothing, intelligent guidance to relax your mind and ease your day.",
    image: require("../../assets/EmilyaiOrb.png"),
    gender: "female" as const,
    accent: "american",
    color: "#A90079", // Pink color for selected card
  },
  {
    key: "kai",
    name: "Kai",
    subtitle: "Motivational",
    description:
      "High-energy, results-focused coaching to push your limits and maximize every session.",
    image: require("../../assets/KaiaiOrb.png"),
    gender: "male" as const,
    accent: "american",
    color: "#5BA4B5", // Teal/blue color
  },
] as const;

export default TTS_CONFIG;
