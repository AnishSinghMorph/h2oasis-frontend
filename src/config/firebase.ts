import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import Constants from 'expo-constants';

// Your web app's Firebase configuration
// Loaded from Constants.expoConfig.extra (set via app.config.js)
const extra = Constants.expoConfig?.extra || {};

const firebaseConfig = {
  apiKey: extra.firebaseApiKey || '',
  authDomain: extra.firebaseAuthDomain || '',
  projectId: extra.firebaseProjectId || '',
  storageBucket: extra.firebaseStorageBucket || '',
  messagingSenderId: extra.firebaseMessagingSenderId || '',
  appId: extra.firebaseAppId || '',
  measurementId: extra.firebaseMeasurementId || '',
};

// Initialize Firebase only if not already initialized
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase Authentication
export const auth = getAuth(app);
export default app;
