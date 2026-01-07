// API Configuration
const API_CONFIG = {
  // Base URL for your backend API
  // BASE_URL: "https://api.h2oasis.ai",
  BASE_URL: __DEV__ ? "http://192.168.0.76:3000" : "https://api.h2oasis.ai",

  // API endpoints\
  ENDPOINTS: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    PROFILE: "/api/auth/profile",
    COMPLETE_ONBOARDING: "/api/auth/complete-onboarding",
    SELECT_PRODUCT: "/api/onboarding/select-product",
    SELECT_FOCUS_GOAL: "/api/onboarding/select-focus-goal",
    WEARABLE_CONNECTIONS: "/api/health-data/wearable-connections",
    WEARABLE_CONNECTION: "/api/health-data/wearable-connection",
    UNIFIED_HEALTH_DATA: "/api/health-data",
    UPLOAD_PROFILE_PICTURE: "/api/profile/upload-picture",
    DELETE_PROFILE_PICTURE: "/api/profile/delete-picture",
    DELETE_ACCOUNT: "/api/auth/delete-account",
  },
};

// Export for backward compatibility
export const API_BASE_URL = API_CONFIG.BASE_URL;

export default API_CONFIG;
