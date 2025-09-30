import { StatusBar } from "expo-status-bar";
import React from "react";
// Temporarily commented out for build - will re-enable with Samsung SDK
// import { RookSyncGate } from "react-native-rook-sdk";
import { ElevenLabsProvider } from "@elevenlabs/react-native";
import AppNavigator from "./src/navigation/AppNavigator";
// import { ROOK_CONFIG } from "./src/config/rookConfig";
export default function App() {
  return (
    <>
      {/* Temporarily removed RookSyncGate wrapper for build */}
      <ElevenLabsProvider>
        <AppNavigator />
      </ElevenLabsProvider>
      <StatusBar style="light" />
    </>
  );
}
