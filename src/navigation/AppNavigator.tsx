import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SetupProgressProvider } from "../context/SetupProgressContext";
import { AuthProvider } from "../context/AuthContext";
import { VoiceProvider } from "../context/VoiceContext";
import LandingScreen from "../screens/LandingScreen";
import AppFlowScreen from "../screens/AppFlowScreen";
import DashboardScreen from "../screens/DashboardScreen";
import AIAssistantScreen from "../screens/AIAssistantScreen";
import ChatScreen from "../screens/ChatScreen";
import ActiveSessionScreen from "../screens/ActiveSessionScreen";
import SessionCompleteScreen from "../screens/SessionCompleteScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CacheManagementScreen from "../screens/CacheManagementScreen";
import { Session } from "../types/session.types";

import { AppFlowView } from "../context/AppFlowContext";

export type RootStackParamList = {
  Landing: undefined;
  AppFlow: { initialView?: AppFlowView } | undefined;
  Dashboard: undefined;
  AIAssistant: undefined;
  chatScreen: undefined;
  VoiceChatTest: undefined;
  ActiveSession: { session: Session } | undefined;
  SessionComplete: { session?: Session } | undefined;
  Profile: undefined;
  CacheManagement: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: "#FFFFFF",
          background: "#000000",
          card: "#000000",
          text: "#FFFFFF",
          border: "#000000",
          notification: "#FFFFFF",
        },
        fonts: {
          regular: { fontFamily: "System", fontWeight: "400" },
          medium: { fontFamily: "System", fontWeight: "500" },
          bold: { fontFamily: "System", fontWeight: "700" },
          heavy: { fontFamily: "System", fontWeight: "900" },
        },
      }}
    >
      <AuthProvider>
        <VoiceProvider>
          <SetupProgressProvider>
            <Stack.Navigator
              initialRouteName="Landing"
              screenOptions={{
                headerShown: false,
                // Default slide animation (standard for most apps)
                animation: "slide_from_right",
              }}
            >
              <Stack.Screen name="Landing" component={LandingScreen} />
              <Stack.Screen name="AppFlow" component={AppFlowScreen} />
              <Stack.Screen name="Dashboard" component={DashboardScreen} />
              <Stack.Screen name="AIAssistant" component={AIAssistantScreen} />
              <Stack.Screen name="chatScreen" component={ChatScreen} />
              <Stack.Screen
                name="ActiveSession"
                component={ActiveSessionScreen}
              />
              <Stack.Screen
                name="SessionComplete"
                component={SessionCompleteScreen}
              />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen
                name="CacheManagement"
                component={CacheManagementScreen}
              />
            </Stack.Navigator>
          </SetupProgressProvider>
        </VoiceProvider>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default AppNavigator;
