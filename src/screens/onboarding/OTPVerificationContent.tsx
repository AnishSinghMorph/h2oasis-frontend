import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import API_CONFIG from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import { useAppFlow } from "../../context/AppFlowContext";
import { OTPVerificationStyles as styles } from "../../styles/OTPVerificationStyles";

const OTPVerificationContent: React.FC = () => {
  const { login } = useAuth();
  const { otpParams, navigateTo, goBack } = useAppFlow();

  const email = otpParams?.email || "";
  const firebaseUID = otpParams?.firebaseUID || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Mask email for display (e.g., jo**@gmail.com)
  const maskEmail = (emailStr: string) => {
    if (!emailStr) return "";
    const [localPart, domain] = emailStr.split("@");
    if (!domain) return emailStr;
    if (localPart.length <= 2) {
      return `${localPart}**@${domain}`;
    }
    return `${localPart.slice(0, 2)}**@${domain}`;
  };

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

  // Verify OTP
  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      Alert.alert("Error", "Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/auth/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp: otpCode,
          }),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // Login with firebaseUID to set auth context
        try {
          await login(firebaseUID);
          // Navigate to choosePersona (smooth transition within same AppFlow)
          navigateTo("choosePersona");
        } catch (loginError) {
          console.error("Login after OTP error:", loginError);
          Alert.alert(
            "Error",
            "Verification successful but login failed. Please try logging in.",
          );
          navigateTo("login");
        }
      } else {
        Alert.alert("Error", data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setResendLoading(true);
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/auth/request-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert("Success", "A new OTP has been sent to your email");
        setOtp(["", "", "", "", "", ""]);
      } else {
        Alert.alert("Error", data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>Enter verification code</Text>
          <Text style={styles.subtitle}>
            A verification code has been sent to{"\n"}your email:{" "}
            {maskEmail(email)}
          </Text>

          {/* OTP Input */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
              />
            ))}
          </View>

          {/* Resend */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive any code? </Text>
            <TouchableOpacity onPress={handleResend} disabled={resendLoading}>
              <Text style={styles.resendLink}>
                {resendLoading ? "Sending..." : "Resend code"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Spacer */}
          <View style={styles.spacer} />

          {/* Verify Button */}
          <TouchableOpacity
            style={[styles.verifyButton, loading && styles.buttonDisabled]}
            onPress={handleVerify}
            disabled={loading}
          >
            <Text style={styles.verifyButtonText}>
              {loading ? "Verifying..." : "Verify & Proceed"}
            </Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OTPVerificationContent;
