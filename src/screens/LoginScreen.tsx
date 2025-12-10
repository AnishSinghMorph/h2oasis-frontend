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
import { loginStyles } from "../styles/LoginScreenStyles";
import API_CONFIG from "../config/api";
import { useAuth } from "../context/AuthContext";
import { useAuthNavigation } from "../context/AppFlowContext";
import { TextField, PrimaryButton, PhoneInput } from "../components/ui";

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

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AppFlow"
>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, signInWithApple, signInWithGoogle } = useAuth();
  const authNav = useAuthNavigation();

  // Tab state for Email/Phone toggle
  const [activeTab, setActiveTab] = useState<"email" | "phone">("email");

  // Country picker modal state
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  // State for form inputs
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phoneNumber: "",
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

  // Check onboarding status after successful login
  const checkOnboardingStatus = async (firebaseUID: string) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROFILE}`,
        {
          headers: { "x-firebase-uid": firebaseUID },
        },
      );

      const data = await response.json();

      if (response.ok && data.user) {
        if (data.user.onboardingCompleted) {
          // User completed onboarding, go to Dashboard
          navigation.reset({
            index: 0,
            routes: [{ name: "Dashboard" }],
          });
        } else {
          // User needs to complete onboarding - switch view within same context (smooth transition)
          authNav.navigateTo("choosePersona");
        }
      } else {
        // New user, start onboarding
        authNav.navigateTo("choosePersona");
      }
    } catch (error) {
      // Default to onboarding on error
      authNav.navigateTo("choosePersona");
    }
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Validate form
  const validateForm = () => {
    if (activeTab === "email") {
      if (!formData.email.trim()) {
        Alert.alert("Error", "Please enter your email");
        return false;
      }
      if (!formData.email.includes("@")) {
        Alert.alert("Error", "Please enter a valid email");
        return false;
      }
      if (!formData.password.trim()) {
        Alert.alert("Error", "Please enter your password");
        return false;
      }
    } else {
      if (!formData.phoneNumber.trim()) {
        Alert.alert("Error", "Please enter your phone number");
        return false;
      }
      if (formData.phoneNumber.length < 8) {
        Alert.alert("Error", "Please enter a valid phone number");
        return false;
      }
    }
    return true;
  };

  // Handle login
  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (activeTab === "phone") {
        // TODO: Implement phone OTP login
        Alert.alert("Coming Soon", "Phone login will be available soon");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        await login(data.firebaseUID);
        await checkOnboardingStatus(data.firebaseUID);
      } else {
        Alert.alert("Error", data.message || "Login failed");
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please try again.");
      console.error("Login error:", error);
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
        authNav.navigateTo("choosePersona");
      }
    } catch (error: any) {
      console.error("Apple Sign-In error:", error);
      if (error.message !== "Apple Sign-In was canceled") {
        Alert.alert(
          "Login Failed",
          error.message || "Could not sign in with Apple",
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
        authNav.navigateTo("choosePersona");
      }
    } catch (error: any) {
      console.error("Google Sign-In error:", error);
      if (error.message !== "Google Sign-In was canceled") {
        Alert.alert(
          "Login Failed",
          error.message || "Could not sign in with Google",
        );
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <View style={loginStyles.container}>
      <SafeAreaView style={loginStyles.safeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={loginStyles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Title */}
            <Text style={loginStyles.title}>Login account</Text>
            <Text style={loginStyles.subtitle}>
              Create your account, it takes less than a minute,{"\n"}
              Enter your email/phone and password
            </Text>

            {/* Tab Selector */}
            <View style={loginStyles.tabContainer}>
              <TouchableOpacity
                style={[
                  loginStyles.tab,
                  activeTab === "email" && loginStyles.activeTab,
                ]}
                onPress={() => setActiveTab("email")}
              >
                <Text
                  style={[
                    loginStyles.tabText,
                    activeTab === "email" && loginStyles.activeTabText,
                  ]}
                >
                  Email
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  loginStyles.tab,
                  activeTab === "phone" && loginStyles.activeTab,
                ]}
                onPress={() => setActiveTab("phone")}
              >
                <Text
                  style={[
                    loginStyles.tabText,
                    activeTab === "phone" && loginStyles.activeTabText,
                  ]}
                >
                  Phone Number
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form Inputs */}
            {activeTab === "email" ? (
              <>
                <TextField
                  placeholder="Email"
                  value={formData.email}
                  onChangeText={(value: string) =>
                    handleInputChange("email", value)
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <TextField
                  placeholder="Password"
                  value={formData.password}
                  onChangeText={(value: string) =>
                    handleInputChange("password", value)
                  }
                  isPassword
                />
              </>
            ) : (
              <PhoneInput
                value={formData.phoneNumber}
                onChangeText={(value: string) =>
                  handleInputChange("phoneNumber", value)
                }
                countryCode={countryCode}
                countryFlag={countryFlag}
                isValid={formData.phoneNumber.length >= 8}
                onCountryPress={() => setShowCountryPicker(true)}
              />
            )}

            {/* Login Button */}
            <PrimaryButton
              label={
                activeTab === "phone"
                  ? "Send OTP"
                  : loading
                    ? "Logging In..."
                    : "Log In"
              }
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={
                activeTab === "phone"
                  ? loginStyles.primaryButtonPhone
                  : loginStyles.primaryButton
              }
            />

            {/* Forgot Password */}
            <TouchableOpacity
              style={loginStyles.forgotPassword}
              onPress={() => authNav.navigateTo("forgotPassword")}
            >
              <Text style={loginStyles.forgotPasswordText}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={loginStyles.dividerContainer}>
              <View style={loginStyles.dividerLine} />
              <Text style={loginStyles.dividerText}>or</Text>
              <View style={loginStyles.dividerLine} />
            </View>

            {/* Social Login Buttons */}
            <TouchableOpacity
              style={[
                loginStyles.socialButton,
                appleLoading && { opacity: 0.7 },
              ]}
              onPress={handleAppleSignIn}
              disabled={appleLoading}
            >
              <Ionicons
                name="logo-apple"
                size={20}
                color="#FFFFFF"
                style={loginStyles.socialIcon}
              />
              <Text style={loginStyles.socialButtonText}>
                {appleLoading ? "Signing in..." : "Sign in with Apple"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                loginStyles.socialButton,
                googleLoading && { opacity: 0.7 },
              ]}
              onPress={handleGoogleSignIn}
              disabled={googleLoading}
            >
              <Image
                source={require("../../assets/google.png")}
                style={loginStyles.googleIcon}
                resizeMode="contain"
              />
              <Text style={loginStyles.socialButtonText}>
                {googleLoading ? "Signing in..." : "Sign in with Google"}
              </Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={loginStyles.signUpLink}>
              <Text style={loginStyles.signUpText}>
                You don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => authNav.navigateTo("signup")}>
                <Text style={loginStyles.signUpLinkText}>Sign Up</Text>
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
        <View style={loginStyles.modalOverlay}>
          <View style={loginStyles.modalContent}>
            <View style={loginStyles.modalHeader}>
              <Text style={loginStyles.modalTitle}>Select Country</Text>
              <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={COUNTRIES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={loginStyles.countryItem}
                  onPress={() => handleCountrySelect(item)}
                >
                  <Text style={loginStyles.countryFlag}>{item.flag}</Text>
                  <Text style={loginStyles.countryName}>{item.name}</Text>
                  <Text style={loginStyles.countryCode}>{item.code}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LoginScreen;
