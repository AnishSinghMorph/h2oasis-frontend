import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { loginStyles } from "../styles/LoginScreenStyles";
import API_CONFIG from "../config/api";
import { useAuth } from "../context/AuthContext";

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login } = useAuth();

  // State for form inputs
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Check onboarding status after successful login
  const checkOnboardingStatus = async (firebaseUID: string) => {
    try {
      console.log("🔍 Checking onboarding status for UID:", firebaseUID);
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROFILE}`,
        {
          headers: { "x-firebase-uid": firebaseUID },
        },
      );

      const data = await response.json();

      if (response.ok && data.user) {
        if (data.user.onboardingCompleted) {
          console.log(
            "✅ User has completed onboarding - navigating to Dashboard",
          );
          navigation.navigate("Dashboard");
        } else {
          console.log(
            "📋 User needs to complete onboarding - navigating to SelectProduct",
          );
          navigation.navigate("SelectProduct");
        }
      } else {
        console.error("❌ Failed to check onboarding status:", data);
        // Fallback to onboarding flow
        navigation.navigate("SelectProduct");
      }
    } catch (error) {
      console.error("❌ Error checking onboarding status:", error);
      // Fallback to onboarding flow
      navigation.navigate("SelectProduct");
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
    return true;
  };

  // Handle login
  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
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
        // Store the Firebase UID (you'll get this from your backend login response)
        await login(data.firebaseUID); // Your backend should return the Firebase UID

        // Check onboarding status to determine navigation
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

  return (
    <View style={loginStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          <View style={loginStyles.content}>
            {/* Title */}
            <Text style={loginStyles.title}>Welcome back</Text>
            <Text style={loginStyles.subtitle}>
              Sign in to your account to continue your wellness journey.
            </Text>

            {/* Form Inputs */}
            <View style={loginStyles.inputContainer}>
              <TextInput
                style={loginStyles.input}
                value={formData.email}
                onChangeText={(value) => handleInputChange("email", value)}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#999999"
              />
            </View>

            <View style={loginStyles.inputContainer}>
              <TextInput
                style={loginStyles.input}
                value={formData.password}
                onChangeText={(value) => handleInputChange("password", value)}
                placeholder="Password"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#999999"
              />
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={loginStyles.forgotPassword}>
              <Text style={loginStyles.forgotPasswordText}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[loginStyles.loginButton, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={loginStyles.loginButtonText}>
                {loading ? "Signing In..." : "Sign In"}
              </Text>
            </TouchableOpacity>

            {/* OR Divider */}
            <View style={loginStyles.orContainer}>
              <View style={loginStyles.orLine} />
              <Text style={loginStyles.orText}>or</Text>
              <View style={loginStyles.orLine} />
            </View>

            {/* Create Account Button */}
            <TouchableOpacity
              style={loginStyles.createAccountButton}
              onPress={() => navigation.navigate("SignUp")}
            >
              <Text style={loginStyles.createAccountButtonText}>
                Create account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;
