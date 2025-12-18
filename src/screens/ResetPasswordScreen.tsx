import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { resetPasswordStyles } from "../styles/ResetPasswordScreenStyles";
import API_CONFIG from "../config/api";
import { TextField, PrimaryButton, BackButton } from "../components/ui";
import { useAuthNavigation } from "../context/AppFlowContext";

type ResetPasswordScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AppFlow"
>;

interface ResetPasswordScreenProps {
  email?: string;
}

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  email: propEmail,
}) => {
  const navigation = useNavigation<ResetPasswordScreenNavigationProp>();
  const authNav = useAuthNavigation();

  const [email, setEmail] = useState(propEmail || "");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Handle OTP input
  const handleOtpChange = (value: string, index: number) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Validate inputs
  const validateInputs = () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return false;
    }
    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email");
      return false;
    }

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      Alert.alert("Error", "Please enter the complete 6-digit code");
      return false;
    }

    if (!newPassword.trim()) {
      Alert.alert("Error", "Please enter your new password");
      return false;
    }
    if (newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long");
      return false;
    }
    return true;
  };

  // Handle reset password
  const handleResetPassword = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const otpCode = otp.join("");

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.toLowerCase(),
            code: otpCode,
            newPassword,
          }),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert(
          "Success",
          "Your password has been reset successfully!",
          [
            {
              text: "OK",
              onPress: () => {
                authNav.navigateTo("login");
              },
            },
          ],
        );
      } else {
        Alert.alert(
          "Error",
          data.message || "Failed to reset password. Please try again.",
        );
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please try again.");
      console.error("Reset password error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={resetPasswordStyles.container}>
      <SafeAreaView style={resetPasswordStyles.safeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={resetPasswordStyles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Back Button */}
            <BackButton onPress={() => authNav.navigateTo("forgotPassword")} />

            {/* Title */}
            <Text style={resetPasswordStyles.title}>Reset Password</Text>
            <Text style={resetPasswordStyles.subtitle}>
              Enter the verification code sent to your email{"\n"}
              and create a new password.
            </Text>

            {/* Email Input (if not passed as prop) */}
            {!propEmail && (
              <TextField
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}

            {propEmail && (
              <Text style={resetPasswordStyles.emailText}>
                Email: {propEmail}
              </Text>
            )}

            {/* OTP Input */}
            <View style={resetPasswordStyles.otpContainer}>
              <Text style={resetPasswordStyles.label}>Verification Code</Text>
              <View style={resetPasswordStyles.otpInputRow}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      inputRefs.current[index] = ref;
                    }}
                    style={[
                      resetPasswordStyles.otpInput,
                      digit ? resetPasswordStyles.otpInputFilled : null,
                    ]}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                  />
                ))}
              </View>
            </View>

            {/* New Password Input */}
            <TextField
              placeholder="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            {/* Password Requirements */}
            <Text style={resetPasswordStyles.requirementsText}>
              Password must be at least 8 characters long
            </Text>

            {/* Spacer */}
            <View style={resetPasswordStyles.spacer} />

            {/* Reset Password Button */}
            <PrimaryButton
              label={loading ? "Resetting..." : "Reset Password"}
              onPress={handleResetPassword}
              loading={loading}
              disabled={loading}
              style={resetPasswordStyles.primaryButton}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default ResetPasswordScreen;
