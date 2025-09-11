import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { signUpStyles } from "../styles/SignUpScreenStyles";
import API_CONFIG from "../config/api";

type SignUpScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SignUp"
>;

const SignUpScreen = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();

  // State for form inputs
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Validation function
  const validateForm = () => {
    if (!formData.fullName.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return false;
    }
    if (!formData.password) {
      Alert.alert("Error", "Please enter a password");
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
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Account created successfully!", [
          { text: "OK", onPress: () => navigation.navigate("Login") },
        ]);
      } else {
        Alert.alert("Error", data.message || "Failed to create account");
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please try again.");
      console.error("Sign up error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={signUpStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={signUpStyles.content}>
            {/* Title */}
            <Text style={signUpStyles.title}>Create an account</Text>
            <Text style={signUpStyles.subtitle}>
              Create your account, it takes less than a minute.{"\n"}
              Enter your email/phone and password
            </Text>

            {/* Form Inputs */}
            <View style={signUpStyles.inputContainer}>
              <TextInput
                style={signUpStyles.input}
                value={formData.fullName}
                onChangeText={(value: string) =>
                  handleInputChange("fullName", value)
                }
                placeholder="Full Name"
                autoCapitalize="words"
              />
            </View>

            <View style={signUpStyles.inputContainer}>
              <TextInput
                style={signUpStyles.input}
                value={formData.email}
                onChangeText={(value: string) =>
                  handleInputChange("email", value)
                }
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={signUpStyles.inputContainer}>
              <TextInput
                style={signUpStyles.input}
                value={formData.password}
                onChangeText={(value: string) =>
                  handleInputChange("password", value)
                }
                placeholder="Password"
                secureTextEntry
              />
            </View>

            <View style={signUpStyles.inputContainer}>
              <TextInput
                style={signUpStyles.input}
                value={formData.confirmPassword}
                onChangeText={(value: string) =>
                  handleInputChange("confirmPassword", value)
                }
                placeholder="Confirm Password"
                secureTextEntry
              />
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={signUpStyles.signUpButton}
              onPress={handleSignUp}
            >
              <Text style={signUpStyles.signUpButtonText}>
                {loading ? "Creating Account..." : "Sign Up"}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={signUpStyles.orContainer}>
              <View style={signUpStyles.orLine} />
              <Text style={signUpStyles.orText}>or</Text>
              <View style={signUpStyles.orLine} />
            </View>

            {/* Social Login Buttons */}
            <TouchableOpacity
              onPress={() => navigation.navigate("SelectProduct")}
              style={[signUpStyles.socialButton, signUpStyles.googleButton]}
            >
              <Image
                source={require("../../assets/google.png")}
                style={{ width: 20, height: 20, marginRight: 14 }}
                resizeMode="contain"
              />
              <Text style={signUpStyles.socialButtonText}>
                Continue with Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={signUpStyles.socialButton}>
              <Image
                source={require("../../assets/apple.png")}
                style={{ width: 20, height: 20, marginRight: 14 }}
                resizeMode="contain"
              />
              <Text style={signUpStyles.socialButtonText}>
                Continue with Apple
              </Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={signUpStyles.loginLink}>
              <Text style={signUpStyles.loginText}>
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={signUpStyles.loginLinkText}>Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUpScreen;
