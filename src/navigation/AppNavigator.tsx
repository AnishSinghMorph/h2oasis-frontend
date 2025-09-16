import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SetupProgressProvider } from "../context/SetupProgressContext";
import { AuthProvider } from "../context/AuthContext";
import LandingScreen from "../screens/LandingScreen";
import SignUpScreen from "../screens/SignUpScreen";
import LoginScreen from "../screens/LoginScreen";
import SelectProductScreen from "../screens/SelectProductScreen";
import ConnectWearableScreen from "../screens/ConnectWearableScreen";
import DashboardScreen from "../screens/DashboardScreen";
import AIAssistantScreen from "../screens/AIAssistantScreen";
import ChoosePersonaScreen from "../screens/ChoosePersonaScreen";

export type RootStackParamList = {
  Landing: undefined;
  SignUp: undefined;
  Login: undefined;
  SelectProduct: undefined;
  ConnectWearables: undefined;
  Dashboard: undefined;
  AIAssistant: undefined;
  choosePersona: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <SetupProgressProvider>
          <Stack.Navigator
            initialRouteName="Landing"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen
              name="SelectProduct"
              component={SelectProductScreen}
            />
            <Stack.Screen
              name="ConnectWearables"
              component={ConnectWearableScreen}
            />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="AIAssistant" component={AIAssistantScreen} />
            <Stack.Screen
              name="choosePersona"
              component={ChoosePersonaScreen}
            />
          </Stack.Navigator>
        </SetupProgressProvider>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default AppNavigator;
