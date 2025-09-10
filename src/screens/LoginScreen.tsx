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

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  // State for form inputs
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

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
        Alert.alert("Success", "Login successful!", [
          { text: "OK", onPress: () => navigation.navigate("Landing") },
        ]);
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
