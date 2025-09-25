// ROOK Configuration
export const ROOK_CONFIG = {
  // ROOK credentials from environment variables
  CLIENT_UUID: process.env.ROOK_SANDBOX_CLIENT_UUID || "",
  SECRET_KEY: process.env.ROOK_SANDBOX_SECRET_KEY || "",
  BASE_URL: process.env.ROOK_SANDBOX_BASE_URL || "https://api.rook-connect.review",

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
