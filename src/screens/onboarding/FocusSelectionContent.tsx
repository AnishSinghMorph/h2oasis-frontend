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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveOptimisticSession } from "../../utils/sessionOptimization";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useAuth } from "../../context/AuthContext";
import { useAppFlow } from "../../context/AppFlowContext";
import { BackButton } from "../../components/ui";
import { Ionicons } from "@expo/vector-icons";
import API_CONFIG from "../../config/api";
import { MoodPageStyles as styles } from "../../styles/MoodPageStyles";
import { chatService } from "../../services/chatService";
import SessionCreationLoader from "../../components/SessionCreationLoader";
import H2OLoader from "../../components/H2OLoader";

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
  const [creatingSession, setCreatingSession] = useState(false);
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

  // Complete onboarding, create session, and go to Dashboard
  const handleGetStarted = async () => {
    if (!firebaseUID) {
      Alert.alert("Error", "Authentication required");
      return;
    }

    setLoading(true);
    setCreatingSession(true);

    try {
      // Save focus goal first
      await saveFocusGoal();

      // Complete onboarding
      const onboardingResponse = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.COMPLETE_ONBOARDING}`,
        {
          method: "POST",
          headers: { "x-firebase-uid": firebaseUID },
        },
      );

      if (!onboardingResponse.ok) {
        const data = await onboardingResponse.json();
        console.error("❌ Failed to complete onboarding:", data);
        Alert.alert("Error", "Failed to complete setup. Please try again.");
        setLoading(false);
        setCreatingSession(false);
        return;
      }

      console.log("✅ Onboarding completed successfully");

      // Get selected products from AsyncStorage (multiple products)
      let productTags: string[] = [];
      try {
        const selectedProducts = await AsyncStorage.getItem("selectedProducts");
        if (selectedProducts) {
          const products = JSON.parse(selectedProducts);

          // Map product types to tags
          const productTagMap: Record<string, string> = {
            "cold-plunge": "Cold Plunge",
            "hot-tub": "Hot Tub",
            sauna: "Sauna",
          };

          productTags = products
            .map((type: string) => productTagMap[type])
            .filter(Boolean);
        }
      } catch (e) {
        console.warn("Failed to load selected products:", e);
      }

      if (productTags.length === 0) {
        Alert.alert("Error", "Please select at least one product first");
        setLoading(false);
        return;
      }

      console.log("🏷️ Using product tags:", productTags);

      // Create guided wellness session
      console.log("🧘 Creating guided session...");
      const sessionResponse = await chatService.createSession(firebaseUID, {
        tags: productTags, // Pass all selected products
        // Goals will be automatically picked from user's focusGoal by backend
      });

      if (sessionResponse.success && sessionResponse.session) {
        console.log("✅ Session created:", sessionResponse.session.SessionName);

        // Save session to AsyncStorage for optimistic rendering on Dashboard
        await saveOptimisticSession(sessionResponse.session);

        // Navigate to Dashboard - session will be loaded there
        navigation.reset({
          index: 0,
          routes: [{ name: "Dashboard" }],
        });
      } else {
        console.error("❌ Failed to create session:", sessionResponse.error);
        // Still navigate to Dashboard even if session creation fails
        navigation.reset({
          index: 0,
          routes: [{ name: "Dashboard" }],
        });
      }
    } catch (error) {
      console.error("❌ Error in handleGetStarted:", error);
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setLoading(false);
      setCreatingSession(false);
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
          What's the first thing you'd love to focus on?
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
        {loading ? (
          <View style={styles.loaderContainer}>
            <H2OLoader size={120} />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.getStartedButtonText}>Get Started</Text>
          </TouchableOpacity>
        )}
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

      {/* Session Creation Loader */}
      <SessionCreationLoader visible={creatingSession} />
    </SafeAreaView>
  );
};

// Modal styles
import { StyleSheet } from "react-native";
import { wp, hp, fontScale } from "../../utils/responsive";

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
    width: wp(200),
    height: wp(200),
  },
  closeButton: {
    position: "absolute",
    top: "55%",
    alignSelf: "center",
  },
  inputContainer: {
    backgroundColor: "#D4F1F4",
    borderTopLeftRadius: wp(24),
    borderTopRightRadius: wp(24),
    paddingHorizontal: wp(20),
    paddingTop: hp(30),
    paddingBottom: hp(40),
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: wp(30),
    paddingHorizontal: wp(16),
    paddingVertical: hp(12),
  },
  textInput: {
    flex: 1,
    fontSize: fontScale(16),
    color: "#333333",
    paddingVertical: 0,
  },
  micButton: {
    width: wp(44),
    height: wp(44),
    borderRadius: wp(22),
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: wp(8),
  },
  sendButton: {
    width: wp(44),
    height: wp(44),
    borderRadius: wp(22),
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: wp(8),
  },
});

export default FocusSelectionContent;
