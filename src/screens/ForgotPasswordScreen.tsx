import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { forgotPasswordStyles } from "../styles/ForgotPasswordScreenStyles";
import API_CONFIG from "../config/api";
import { TextField, PrimaryButton, BackButton } from "../components/ui";
import { useAuthNavigation } from "../context/AppFlowContext";

type ForgotPasswordScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AppFlow"
>;

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const authNav = useAuthNavigation();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Validate email
  const validateEmail = () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return false;
    }
    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email");
      return false;
    }
    return true;
  };

  // Handle send verification code
  const handleSendCode = async () => {
    if (!validateEmail()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Success",
          "A verification code has been sent to your email.",
          [
            {
              text: "OK",
              onPress: () => {
                // Navigate to OTP verification or reset password screen
                // navigation.navigate("ResetPassword", { email });
              },
            },
          ],
        );
      } else {
        Alert.alert(
          "Error",
          data.message || "Failed to send verification code",
        );
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please try again.");
      console.error("Forgot password error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={forgotPasswordStyles.container}>
      <SafeAreaView style={forgotPasswordStyles.safeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={forgotPasswordStyles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Back Button */}
            <BackButton onPress={() => authNav.navigateTo("login")} />

            {/* Title */}
            <Text style={forgotPasswordStyles.title}>Forgot password</Text>
            <Text style={forgotPasswordStyles.subtitle}>
              We will send a passcode to your registered{"\n"}
              email for verification.
            </Text>

            {/* Email Input */}
            <TextField
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Spacer to push button down */}
            <View style={forgotPasswordStyles.spacer} />

            {/* Send Verification Code Button */}
            <PrimaryButton
              label={loading ? "Sending..." : "Send verification code"}
              onPress={handleSendCode}
              loading={loading}
              disabled={loading}
              style={forgotPasswordStyles.primaryButton}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default ForgotPasswordScreen;
