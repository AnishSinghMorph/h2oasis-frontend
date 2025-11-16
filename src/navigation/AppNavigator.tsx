import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SetupProgressProvider } from "../context/SetupProgressContext";
import { AuthProvider } from "../context/AuthContext";
import { VoiceProvider } from "../context/VoiceContext";
import LandingScreen from "../screens/LandingScreen";
import SignUpScreen from "../screens/SignUpScreen";
import LoginScreen from "../screens/LoginScreen";
import SelectProductScreen from "../screens/SelectProductScreen";
import ConnectWearableScreen from "../screens/ConnectWearableScreen";
import DashboardScreen from "../screens/DashboardScreen";
import AIAssistantScreen from "../screens/AIAssistantScreen";
import ChoosePersonaScreen from "../screens/ChoosePersonaScreen";
import ChatScreen from "../screens/ChatScreen";
import ActiveSessionScreen from "../screens/ActiveSessionScreen";
import SessionCompleteScreen from "../screens/SessionCompleteScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CacheManagementScreen from "../screens/CacheManagementScreen";

export type RootStackParamList = {
  Landing: undefined;
  SignUp: undefined;
  Login: undefined;
  SelectProduct: undefined;
  ConeectWearables: undefined;
  Dashboard: undefined;
  AIAssistant: undefined;
  choosePersona: undefined;
  chatScreen: undefined;
  VoiceChatTest: undefined;
  ActiveSession: undefined;
  SessionComplete: undefined;
  Profile: undefined;
  CacheManagement: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <VoiceProvider>
          <SetupProgressProvider>
            <Stack.Navigator
              initialRouteName="Landing"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="Landing" component={LandingScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen
                name="SelectProduct"
                component={SelectProductScreen}
              />
              <Stack.Screen
                name="ConeectWearables"
                component={ConnectWearableScreen}
              />
              <Stack.Screen name="Dashboard" component={DashboardScreen} />
              <Stack.Screen name="AIAssistant" component={AIAssistantScreen} />
              <Stack.Screen
                name="choosePersona"
                component={ChoosePersonaScreen}
              />
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
              <Stack.Screen name="CacheManagement" component={CacheManagementScreen} />
            </Stack.Navigator>
          </SetupProgressProvider>
        </VoiceProvider>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default AppNavigator;
