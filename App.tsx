import { StatusBar } from "expo-status-bar";
import React from "react";
import { RookSyncGate } from "react-native-rook-sdk";
import AppNavigator from "./src/navigation/AppNavigator";
import { ROOK_CONFIG } from "./src/config/rookConfig";

export default function App() {
  return (
    <RookSyncGate
      environment={ROOK_CONFIG.ENVIRONMENT}
      clientUUID={ROOK_CONFIG.CLIENT_UUID}
      password={ROOK_CONFIG.SECRET_KEY}
      enableLogs={true}
      enableBackgroundSync={false}
    >
      <AppNavigator />
      <StatusBar style="light" />
    </RookSyncGate>
  );
}
