import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation/AppNavigator";
import { signUpStyles } from "../styles/SignUpScreenStyles";
import API_CONFIG from "../config/api";
import { useAuth } from "../context/AuthContext";
import { useAppFlow } from "../context/AppFlowContext";
import { TextField, PrimaryButton, EmailPhoneInput } from "../components/ui";

// Country codes data
const COUNTRIES = [
  { code: "+1", flag: "🇺🇸", name: "United States" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+32", flag: "🇧🇪", name: "Belgium" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+31", flag: "🇳🇱", name: "Netherlands" },
  { code: "+39", flag: "🇮🇹", name: "Italy" },
  { code: "+34", flag: "🇪🇸", name: "Spain" },
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+86", flag: "🇨🇳", name: "China" },
  { code: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "+82", flag: "🇰🇷", name: "South Korea" },
  { code: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "+55", flag: "🇧🇷", name: "Brazil" },
  { code: "+52", flag: "🇲🇽", name: "Mexico" },
  { code: "+7", flag: "🇷🇺", name: "Russia" },
];

type SignUpScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AppFlow"
>;

const SignUpScreen = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const { signInWithApple, signInWithGoogle, onboardingCompleted } = useAuth();
  const { navigateTo, setOtpParams } = useAppFlow();

  // Country picker modal state
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  // State for form inputs
  const [formData, setFormData] = useState({
    fullName: "",
    emailOrPhone: "",
    password: "",
    confirmPassword: "",
  });

  // State for phone country code
  const [countryCode, setCountryCode] = useState("+32");
  const [countryFlag, setCountryFlag] = useState("🇧🇪");

  const [loading, setLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Handle country selection
  const handleCountrySelect = (country: (typeof COUNTRIES)[0]) => {
    setCountryCode(country.code);
    setCountryFlag(country.flag);
    setShowCountryPicker(false);
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Check if input is email or phone
  const isEmail = (value: string) => value.includes("@");

  // Validation function
  const validateForm = () => {
    if (!formData.fullName.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return false;
    }
    if (!formData.emailOrPhone.trim()) {
      Alert.alert("Error", "Please enter your email or phone number");
      return false;
    }
    if (!formData.password) {
      Alert.alert("Error", "Please enter a password");
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const isEmailInput = isEmail(formData.emailOrPhone);
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: isEmailInput ? formData.emailOrPhone : undefined,
          phoneNumber: !isEmailInput
            ? `${countryCode}${formData.emailOrPhone}`
            : undefined,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.requiresEmailVerification) {
          // Set OTP params and navigate within AppFlow
          setOtpParams({
            email: formData.emailOrPhone,
            firebaseUID: data.firebaseUID,
          });
          navigateTo("otpVerification");
        } else {
          // Smooth transition to onboarding within same context
          navigateTo("choosePersona");
        }
      } else {
        if (data.code === "EMAIL_EXISTS") {
          Alert.alert(
            "Account Exists",
            "An account with this email already exists. Would you like to login instead?",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Go to Login",
                onPress: () => navigateTo("login"),
              },
            ],
          );
        } else {
          Alert.alert("Error", data.message || "Failed to create account");
        }
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please try again.");
      console.error("Sign up error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Apple Sign-In
  const handleAppleSignIn = async () => {
    if (Platform.OS !== "ios") {
      Alert.alert("Not Available", "Apple Sign-In is only available on iOS");
      return;
    }

    setAppleLoading(true);

    try {
      const isOnboarded = await signInWithApple();
      // Check if user already completed onboarding
      if (isOnboarded) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Dashboard" }],
        });
      } else {
        navigateTo("choosePersona");
      }
    } catch (error: any) {
      console.error("Apple Sign-In error:", error);
      if (error.message !== "Apple Sign-In was canceled") {
        Alert.alert(
          "Sign Up Failed",
          error.message || "Could not sign up with Apple",
        );
      }
    } finally {
      setAppleLoading(false);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);

    try {
      const isOnboarded = await signInWithGoogle();
      // Check if user already completed onboarding
      if (isOnboarded) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Dashboard" }],
        });
      } else {
        navigateTo("choosePersona");
      }
    } catch (error: any) {
      console.error("Google Sign-In error:", error);
      if (error.message !== "Google Sign-In was canceled") {
        Alert.alert(
          "Sign Up Failed",
          error.message || "Could not sign up with Google",
        );
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <View style={signUpStyles.container}>
      <SafeAreaView style={signUpStyles.safeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={signUpStyles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Title */}
            <Text style={signUpStyles.title}>Let's get you set up.</Text>
            <Text style={signUpStyles.subtitle}>
              Create your account, it takes less than a minute,{"\n"}
              Enter your email/phone and password
            </Text>

            {/* Full Name */}
            <TextField
              placeholder="Full name"
              value={formData.fullName}
              onChangeText={(value: string) =>
                handleInputChange("fullName", value)
              }
              autoCapitalize="words"
            />

            {/* Email/Phone with Country Picker */}
            <EmailPhoneInput
              value={formData.emailOrPhone}
              onChangeText={(value: string) =>
                handleInputChange("emailOrPhone", value)
              }
              countryCode={countryCode}
              countryFlag={countryFlag}
              onCountryPress={() => setShowCountryPicker(true)}
            />

            {/* Password */}
            <TextField
              placeholder="Password"
              value={formData.password}
              onChangeText={(value: string) =>
                handleInputChange("password", value)
              }
              isPassword
            />

            {/* Re-enter Password */}
            <TextField
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChangeText={(value: string) =>
                handleInputChange("confirmPassword", value)
              }
              isPassword
            />

            {/* Create Account Button */}
            <PrimaryButton
              label={loading ? "Creating Account..." : "Create an Account"}
              onPress={handleSignUp}
              loading={loading}
              disabled={loading}
              style={signUpStyles.primaryButton}
            />

            {/* Divider */}
            <View style={signUpStyles.dividerContainer}>
              <View style={signUpStyles.dividerLine} />
              <Text style={signUpStyles.dividerText}>or</Text>
              <View style={signUpStyles.dividerLine} />
            </View>

            {/* Social Login Buttons */}
            <TouchableOpacity
              style={[
                signUpStyles.socialButton,
                appleLoading && { opacity: 0.7 },
              ]}
              onPress={handleAppleSignIn}
              disabled={appleLoading}
            >
              <Ionicons
                name="logo-apple"
                size={20}
                color="#FFFFFF"
                style={signUpStyles.socialIcon}
              />
              <Text style={signUpStyles.socialButtonText}>
                {appleLoading ? "Signing up..." : "Sign in with Apple"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                signUpStyles.socialButton,
                googleLoading && { opacity: 0.7 },
              ]}
              onPress={handleGoogleSignIn}
              disabled={googleLoading}
            >
              <Image
                source={require("../../assets/google.png")}
                style={signUpStyles.googleIcon}
                resizeMode="contain"
              />
              <Text style={signUpStyles.socialButtonText}>
                {googleLoading ? "Signing up..." : "Sign in with Google"}
              </Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={signUpStyles.loginLink}>
              <Text style={signUpStyles.loginText}>
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigateTo("login")}>
                <Text style={signUpStyles.loginLinkText}>Log in</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Country Picker Modal */}
      <Modal
        visible={showCountryPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCountryPicker(false)}
      >
        <View style={signUpStyles.modalOverlay}>
          <View style={signUpStyles.modalContent}>
            <View style={signUpStyles.modalHeader}>
              <Text style={signUpStyles.modalTitle}>Select Country</Text>
              <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={COUNTRIES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={signUpStyles.countryItem}
                  onPress={() => handleCountrySelect(item)}
                >
                  <Text style={signUpStyles.countryFlag}>{item.flag}</Text>
                  <Text style={signUpStyles.countryName}>{item.name}</Text>
                  <Text style={signUpStyles.countryCode}>{item.code}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SignUpScreen;
