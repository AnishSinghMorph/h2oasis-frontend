// API Configuration
const API_CONFIG = {
  // Base URL for your backend API
  BASE_URL: __DEV__
    ? 'http://192.168.1.55:3000' // Development (local)
    : 'https://h2oasis-backend.onrender.com', // Production (deployed)

  // API endpoints
  ENDPOINTS: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    PROFILE: '/api/auth/profile',
  },
};

export default API_CONFIG;
