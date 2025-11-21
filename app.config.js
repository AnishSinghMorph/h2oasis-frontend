/**
 * Expo App Configuration
 * 
 * This file replaces app.json to enable dynamic environment variable handling.
 * For EAS builds, environment variables are injected via eas.json's env field.
 * For local development, they're loaded from .env file.
 * 
 * All environment variables are exposed through Constants.expoConfig.extra
 * to ensure consistent access across the application.
 */

export default ({ config }) => {
  // Get environment variables from process.env (set by EAS during build or from .env locally)
  const getEnvVar = (key, defaultValue = '') => {
    return process.env[key] || defaultValue;
  };

  return {
    ...config,
    name: "H2Oasis",
    slug: "h2oasis",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/applogo.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    scheme: "h2oasis",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.h2oasis.app",
      buildNumber: "16",
      icon: "./assets/applogo.png",
      usesAppleSignIn: true,
      googleServicesFile: "./GoogleService-Info.plist",
      entitlements: {
        "com.apple.developer.applesignin": ["Default"]
      },
      infoPlist: {
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [
              "com.googleusercontent.apps.620966779579-93m9te52ppjgfu8hurju0q4rd82r4jr1"
            ]
          }
        ],
        CFBundleDisplayName: "H2Oasis",
        NSPhotoLibraryUsageDescription: "H2Oasis needs access to your photo library to update your profile picture.",
        NSCameraUsageDescription: "H2Oasis needs access to your camera to take profile pictures.",
        NSPhotoLibraryAddUsageDescription: "H2Oasis needs permission to save photos to your library.",
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: true,
          NSExceptionDomains: {
            localhost: {
              NSExceptionAllowsInsecureHTTPLoads: true
            }
          }
        }
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      package: "com.h2oasis.app",
      minSdkVersion: 26,
      permissions: [
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.READ_MEDIA_IMAGES"
      ],
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: "h2oasis"
            }
          ],
          category: ["BROWSABLE", "DEFAULT"]
        }
      ]
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      eas: {
        projectId: "fc86c044-95df-4e62-ba0d-51f7d1d80611"
      },
      // ROOK Configuration
      rookClientUuid: getEnvVar('EXPO_PUBLIC_ROOK_CLIENT_UUID'),
      rookBaseUrl: getEnvVar('EXPO_PUBLIC_ROOK_BASE_URL', 'https://api.rook-connect.review'),
      rookEnvironment: getEnvVar('EXPO_PUBLIC_ROOK_ENVIRONMENT', 'sandbox'),
      
      // OAuth Redirect URL
      oauthRedirectUrl: getEnvVar('EXPO_PUBLIC_OAUTH_REDIRECT_URL', 'h2oasis://oauth-callback'),
      
      // Firebase Configuration
      firebaseApiKey: getEnvVar('EXPO_PUBLIC_FIREBASE_API_KEY'),
      firebaseAuthDomain: getEnvVar('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
      firebaseProjectId: getEnvVar('EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
      firebaseStorageBucket: getEnvVar('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'),
      firebaseMessagingSenderId: getEnvVar('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
      firebaseAppId: getEnvVar('EXPO_PUBLIC_FIREBASE_APP_ID'),
      firebaseMeasurementId: getEnvVar('EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID'),
      
      // Google Sign-In Configuration
      googleIosClientId: getEnvVar('EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID'),
      googleWebClientId: getEnvVar('EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID'),
    }
  };
};
