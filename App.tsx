import { StatusBar } from "expo-status-bar";
import React from "react";
import { RookSyncGate } from "react-native-rook-sdk";
import { ElevenLabsProvider } from "@elevenlabs/react-native";
import AppNavigator from "./src/navigation/AppNavigator";
import { ROOK_CONFIG } from "./src/config/rookConfig";
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

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3AAFA9" />
      </View>
    );
  }

  return (
    <RookSyncGate
      environment={ROOK_CONFIG.ENVIRONMENT}
      clientUUID={ROOK_CONFIG.CLIENT_UUID}
      password={ROOK_CONFIG.SECRET_KEY}
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
