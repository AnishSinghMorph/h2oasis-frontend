import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import API_CONFIG from "../config/api";

type OTPVerificationNavigationProp = StackNavigationProp<
  RootStackParamList,
  "OTPVerification"
>;

type OTPVerificationRouteProp = RouteProp<
  RootStackParamList,
  "OTPVerification"
>;

const OTPVerificationScreen = () => {
  const navigation = useNavigation<OTPVerificationNavigationProp>();
  const route = useRoute<OTPVerificationRouteProp>();
  const { email } = route.params;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

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
        Alert.alert("Success", "Email verified successfully!", [
          {
            text: "OK",
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: "SelectProduct" }],
              });
            },
          },
        ]);
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
    if (!canResend) return;

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
        setCountdown(60);
        setCanResend(false);
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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>Verify your email</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit verification code to{"\n"}
            <Text style={styles.emailText}>{email}</Text>
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
              />
            ))}
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={[styles.verifyButton, loading && { opacity: 0.7 }]}
            onPress={handleVerify}
            disabled={loading}
          >
            <Text style={styles.verifyButtonText}>
              {loading ? "Verifying..." : "Verify Email"}
            </Text>
          </TouchableOpacity>

          {/* Resend */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code? </Text>
            {canResend ? (
              <TouchableOpacity onPress={handleResend} disabled={resendLoading}>
                <Text style={styles.resendLink}>
                  {resendLoading ? "Sending..." : "Resend"}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.countdownText}>Resend in {countdown}s</Text>
            )}
          </View>

          {/* Change Email */}
          <TouchableOpacity
            style={styles.changeEmailButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.changeEmailText}>Change email address</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  content: {
    flex: 1,
    paddingTop: 40,
  },
  title: {
    color: "#000000",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "left",
    marginBottom: 12,
  },
  subtitle: {
    color: "#666666",
    fontSize: 16,
    textAlign: "left",
    marginBottom: 40,
    lineHeight: 24,
  },
  emailText: {
    color: "#00A3C7",
    fontWeight: "600",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  otpInput: {
    width: 50,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    color: "#000000",
  },
  otpInputFilled: {
    borderColor: "#00A3C7",
    backgroundColor: "#F0FAFC",
  },
  verifyButton: {
    backgroundColor: "#00A3C7",
    borderRadius: 30,
    paddingVertical: 16,
    marginBottom: 24,
  },
  verifyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  resendText: {
    color: "#666666",
    fontSize: 14,
  },
  resendLink: {
    color: "#00A3C7",
    fontSize: 14,
    fontWeight: "600",
  },
  countdownText: {
    color: "#999999",
    fontSize: 14,
  },
  changeEmailButton: {
    alignItems: "center",
    marginTop: 8,
  },
  changeEmailText: {
    color: "#00A3C7",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default OTPVerificationScreen;
