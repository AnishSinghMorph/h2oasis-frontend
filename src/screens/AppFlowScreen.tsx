import React from "react";
import { ImageBackground, StatusBar, View, StyleSheet } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import {
  AppFlowProvider,
  useAppFlow,
  AppFlowView,
} from "../context/AppFlowContext";

// Auth screen content components
import LoginScreen from "./LoginScreen";
import SignUpScreen from "./SignUpScreen";
import ForgotPasswordScreen from "./ForgotPasswordScreen";

// Onboarding screen content components
import {
  ChoosePersonaContent,
  ConnectWearableContent,
  SelectProductContent,
  FocusSelectionContent,
  OTPVerificationContent,
} from "./onboarding";

// Inner component that renders the current view
const AppFlowScreenContent: React.FC = () => {
  const { currentView } = useAppFlow();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  switch (currentView) {
    // Auth views
    case "login":
      return <LoginScreen />;
    case "signup":
      return <SignUpScreen />;
    case "forgotPassword":
      return <ForgotPasswordScreen />;
    case "otpVerification":
      return <OTPVerificationContent />;
    // Onboarding views
    case "choosePersona":
      return <ChoosePersonaContent />;
    case "connectWearables":
      return <ConnectWearableContent />;
    case "selectProduct":
      return <SelectProductContent />;
    case "focusGoal":
      return <FocusSelectionContent navigation={navigation} />;
    default:
      return <SignUpScreen />;
  }
};

// Main AppFlowScreen with single background for all auth + onboarding views
const AppFlowScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "AppFlow">>();
  const initialView: AppFlowView = route.params?.initialView || "signup";

  return (
    <ImageBackground
      source={require("../../assets/bgWallpaper.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <AppFlowProvider initialView={initialView}>
        <View style={styles.container}>
          <AppFlowScreenContent />
        </View>
      </AppFlowProvider>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
  },
});

export default AppFlowScreen;
