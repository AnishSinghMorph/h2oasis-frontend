import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useAuth } from "../../context/AuthContext";
import { useAppFlow } from "../../context/AppFlowContext";
import { BackButton } from "../../components/ui";
import { Ionicons } from "@expo/vector-icons";
import API_CONFIG from "../../config/api";
import { MoodPageStyles as styles } from "../../styles/MoodPageStyles";

const FOCUS_OPTIONS = [
  { key: "stress-relief", label: "Stress Relief & Sleep" },
  { key: "training-recovery", label: "Training Day Recovery" },
  { key: "traveler-balance", label: "Traveler Balance" },
  { key: "muscle-recovery", label: "Muscle Recovery Boost" },
  { key: "relax-rebalance", label: "Relax & Rebalance" },
  { key: "other", label: "Other" },
];

interface FocusSelectionContentProps {
  navigation: StackNavigationProp<RootStackParamList>;
}

const FocusSelectionContent: React.FC<FocusSelectionContentProps> = ({
  navigation,
}) => {
  const { firebaseUID } = useAuth();
  const { goBack } = useAppFlow();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showOtherModal, setShowOtherModal] = useState(false);
  const [otherText, setOtherText] = useState("");
  const [customFocusLabel, setCustomFocusLabel] = useState("");

  const handleOptionSelect = (optionKey: string) => {
    if (optionKey === "other" && !customFocusLabel) {
      setShowOtherModal(true);
    } else {
      setSelectedOption(optionKey);
    }
  };

  const handleOtherSubmit = () => {
    if (otherText.trim()) {
      setCustomFocusLabel(otherText.trim());
      setSelectedOption("other");
      setShowOtherModal(false);
      Keyboard.dismiss();
    }
  };

  const handleCloseModal = () => {
    setShowOtherModal(false);
    setOtherText("");
  };

  // Get the label for display
  const getOptionLabel = (key: string) => {
    if (key === "other" && customFocusLabel) {
      return customFocusLabel;
    }
    return FOCUS_OPTIONS.find((o) => o.key === key)?.label || key;
  };

  // Save focus goal to backend
  const saveFocusGoal = async () => {
    if (!firebaseUID || !selectedOption) return;

    const focusGoal =
      selectedOption === "other" ? customFocusLabel : selectedOption;
    const focusLabel = getOptionLabel(selectedOption);

    try {
      await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SELECT_FOCUS_GOAL}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-firebase-uid": firebaseUID,
          },
          body: JSON.stringify({
            key: selectedOption,
            label: focusLabel,
            customText: selectedOption === "other" ? customFocusLabel : null,
          }),
        },
      );
    } catch (error) {
      console.error("❌ Error saving focus goal:", error);
    }
  };

  // Complete onboarding and go to Dashboard
  const handleGetStarted = async () => {
    if (!firebaseUID) {
      Alert.alert("Error", "Authentication required");
      return;
    }

    setLoading(true);
    try {
      // Save focus goal first
      await saveFocusGoal();

      // Complete onboarding
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.COMPLETE_ONBOARDING}`,
        {
          method: "POST",
          headers: { "x-firebase-uid": firebaseUID },
        },
      );

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Onboarding completed successfully");
        // Navigate out of onboarding to Dashboard
        navigation.reset({
          index: 0,
          routes: [{ name: "Dashboard" }],
        });
      } else {
        console.error("❌ Failed to complete onboarding:", data);
        Alert.alert("Error", "Failed to complete setup. Please try again.");
      }
    } catch (error) {
      console.error("❌ Error completing onboarding:", error);
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with back button and sound button */}
        <View style={styles.header}>
          <BackButton onPress={goBack} />
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="volume-medium-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          What's the first{"\n"}thing you'd love{"\n"}to focus on?
        </Text>

        {/* Focus Options */}
        <View style={styles.optionsList}>
          {FOCUS_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.optionButton,
                selectedOption === option.key && styles.optionButtonSelected,
              ]}
              onPress={() => handleOptionSelect(option.key)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedOption === option.key && styles.optionTextSelected,
                ]}
              >
                {option.key === "other" && customFocusLabel
                  ? customFocusLabel
                  : option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Get Started Button */}
        <TouchableOpacity
          style={[styles.getStartedButton, loading && styles.buttonDisabled]}
          onPress={handleGetStarted}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.getStartedButtonText}>
            {loading ? "Loading..." : "Get Started"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Other Modal */}
      <Modal
        visible={showOtherModal}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={otherModalStyles.overlay}
            keyboardVerticalOffset={0}
          >
            {/* Orb Image */}
            <View style={otherModalStyles.orbContainer}>
              <Image
                source={require("../../../assets/MoodOrb.png")}
                style={otherModalStyles.orbImage}
                resizeMode="contain"
              />
            </View>

            {/* Close Button */}
            <TouchableOpacity
              style={otherModalStyles.closeButton}
              onPress={handleCloseModal}
            >
              <Ionicons name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Input Container */}
            <View style={otherModalStyles.inputContainer}>
              <View style={otherModalStyles.inputWrapper}>
                <TextInput
                  style={otherModalStyles.textInput}
                  placeholder="Type anything..."
                  placeholderTextColor="#666666"
                  value={otherText}
                  onChangeText={setOtherText}
                  multiline={false}
                  returnKeyType="send"
                  onSubmitEditing={handleOtherSubmit}
                  autoFocus
                />
                <TouchableOpacity style={otherModalStyles.micButton}>
                  <Ionicons name="mic-outline" size={24} color="#666666" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={otherModalStyles.sendButton}
                  onPress={handleOtherSubmit}
                >
                  <Ionicons name="send" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

// Modal styles
import { StyleSheet } from "react-native";

const otherModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  orbContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  orbImage: {
    width: 200,
    height: 200,
  },
  closeButton: {
    position: "absolute",
    top: "55%",
    alignSelf: "center",
  },
  inputContainer: {
    backgroundColor: "#D4F1F4",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
    paddingVertical: 0,
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});

export default FocusSelectionContent;
