export default ({ config }) => {
  return {
    ...config,

    name: "H2Oasis",
    slug: "h2oasis",
    version: "1.0.0",
    orientation: "portrait",
    newArchEnabled: true,
    scheme: "h2oasis",
    icon: "./assets/applogo.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },

    ios: {
      ...config.ios,
      supportsTablet: true,
      bundleIdentifier: "com.h2oasis.app",
      buildNumber: "11",
      usesAppleSignIn: true,
      googleServicesFile: "./GoogleService-Info.plist",
      icon: "./assets/applogo.png",

      entitlements: {
        "com.apple.developer.applesignin": ["Default"],
      },

      infoPlist: {
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [
              process.env.GOOGLE_IOS_CLIENT_ID
                ? process.env.GOOGLE_IOS_CLIENT_ID
                : "com.googleusercontent.apps.620966779579-93m9te52ppjgfu8hurju0q4rd82r4jr1",
            ],
          },
        ],
        CFBundleDisplayName: "H2Oasis",

        NSPhotoLibraryUsageDescription:
          "H2Oasis needs access to your photo library to update your profile picture.",
        NSCameraUsageDescription:
          "H2Oasis needs access to your camera to take profile pictures.",
        NSPhotoLibraryAddUsageDescription:
          "H2Oasis needs permission to save photos to your library.",

        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: true,
          NSExceptionDomains: {
            localhost: {
              NSExceptionAllowsInsecureHTTPLoads: true,
            },
          },
        },
      },
    },

    android: {
      ...config.android,
      package: "com.h2oasis.app",
      minSdkVersion: 26,
      edgeToEdgeEnabled: true,

      permissions: [
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.READ_MEDIA_IMAGES",
      ],

      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },

      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: "h2oasis",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
    },

    web: {
      favicon: "./assets/favicon.png",
    },

    extra: {
      eas: {
        projectId: "fc86c044-95df-4e62-ba0d-51f7d1d80611",
      },

        FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
        FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
        FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
        FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
        FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
        FIREBASE_MEASUREMENT_ID: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
      
        GOOGLE_IOS_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    },
  };
};
