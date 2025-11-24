import { StatusBar } from "expo-status-bar";
import React from "react";
import { RookSyncGate } from "react-native-rook-sdk";
import { ElevenLabsProvider } from "@elevenlabs/react-native";
import AppNavigator from "./src/navigation/AppNavigator";
import Constants from "expo-constants";
import {
  useFonts,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from "@expo-google-fonts/outfit";
import { ActivityIndicator, View } from "react-native";

export default function App() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  // Get ROOK config from app.config.js (EAS Secrets)
  const rookConfig = {
    clientUUID: Constants.expoConfig?.extra?.ROOK_CLIENT_UUID || "",
    password: Constants.expoConfig?.extra?.ROOK_SECRET_KEY || "",
    environment: (Constants.expoConfig?.extra?.ROOK_ENVIRONMENT || "sandbox") as "sandbox" | "production",
  };

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3AAFA9" />
      </View>
    );
  }

  return (
    <RookSyncGate
      environment={rookConfig.environment}
      clientUUID={rookConfig.clientUUID}
      password={rookConfig.password}
      enableLogs={true}
      enableBackgroundSync={false}
    >
      <ElevenLabsProvider>
        <AppNavigator />
      </ElevenLabsProvider>
      <StatusBar style="light" />
    </RookSyncGate>
  );
}
