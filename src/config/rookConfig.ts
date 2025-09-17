// ROOK Configuration
export const ROOK_CONFIG = {
  // Your ROOK credentials from the portal
  CLIENT_UUID: "808c0a77-e23d-4fd0-9992-5a132eefad75",
  SECRET_KEY: "jEFtFPsAeU8TMZDLzrzHXqW2thkGGF637SCy",

  // Environment - use 'sandbox' for testing, 'production' for live
  ENVIRONMENT: "sandbox" as "sandbox" | "production",
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
