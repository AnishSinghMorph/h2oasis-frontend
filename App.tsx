import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
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
import * as Notifications from "expo-notifications";
import { requestNotificationPermissions } from "./src/services/notificationService";
import { NavigationContainerRef } from "@react-navigation/native";
import { RootStackParamList } from "./src/navigation/AppNavigator";

export default function App() {
  const navigationRef =
    useRef<NavigationContainerRef<RootStackParamList>>(null);

  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  useEffect(() => {
    // Request notification permissions on app startup
    requestNotificationPermissions();

    // Handle notification taps when app is open or in background
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        console.log("Notification tapped:", data);

        if (data.type === "session_reminder" && data.session) {
          // Navigate to ActiveSession with the session data
          navigationRef.current?.navigate("ActiveSession", {
            session: data.session as any,
          });
        }
      },
    );

    return () => subscription.remove();
  }, []);

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
      enableLogs={false}
      enableBackgroundSync={true}
    >
      <ElevenLabsProvider>
        <AppNavigator ref={navigationRef} />
      </ElevenLabsProvider>
      <StatusBar style="light" />
    </RookSyncGate>
  );
}
