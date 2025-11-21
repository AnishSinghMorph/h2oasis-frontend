import Constants from 'expo-constants';

// Get extra config from app.config.js
const extra = Constants.expoConfig?.extra || {};

// ROOK Configuration
export const ROOK_CONFIG = {
  // ROOK credentials from Constants.expoConfig.extra
  CLIENT_UUID: extra.rookClientUuid || "",
  SECRET_KEY: extra.rookSecretKey || "",
  BASE_URL: extra.rookBaseUrl || "https://api.rook-connect.review",

  // Environment - use 'sandbox' for testing, 'production' for live
  ENVIRONMENT:
    (extra.rookEnvironment as "sandbox" | "production") || "sandbox",
};

// Health data types we want to access
export const HEALTH_DATA_TYPES = {
  // Physical Health
  STEPS: "steps",
  HEART_RATE: "heart_rate",
  ACTIVITY: "activity",
  SLEEP: "sleep",

  // Body Health
  WEIGHT: "weight",
  BODY_TEMPERATURE: "body_temperature",
  HYDRATION: "hydration",

  // Recovery-specific for H2Oasis
  HRV: "heart_rate_variability",
  STRESS: "stress",
  RECOVERY: "recovery",
};
