import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  StatusBar,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "../styles/globalStyles";
import { ChatScreenStyles } from "../styles/ChatScreenStyles";
import { useChatWithAI } from "../hooks/useChatWithAI";
import { useChatTTS } from "../hooks/useChatTTS";
import { useVoice } from "../context/VoiceContext";
import { useVoiceRecording } from "../hooks/useVoiceRecording";
import { STTService } from "../services/sttService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveOptimisticSession } from "../utils/sessionOptimization";
import { VoiceCallModal } from "../components/VoiceCallModal";
import { useNavigation } from "@react-navigation/native";
import { chatService } from "../services/chatService";
import API_CONFIG from "../config/api";
import { useAuth } from "../context/AuthContext";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ProductContext {
  productName: string;
  productType: "cold_plunge" | "hot_tub" | "sauna" | "recovery_suite";
  features?: string[];
}

// Session type options for the quick create modal
const SESSION_TYPES = [
  { label: "🧘 Relaxation", tags: ["Spa", "Relaxation", "Calm"] },
  { label: "💪 Recovery", tags: ["Recovery", "Muscle", "Sports"] },
  { label: "😴 Better Sleep", tags: ["Sleep", "Rest", "Night"] },
  { label: "⚡ Energy Boost", tags: ["Energy", "Morning", "Vitality"] },
  { label: "🧊 Cold Therapy", tags: ["Cold Plunge", "Ice", "Contrast"] },
];

const ChatScreen = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [productContext, setProductContext] = useState<
    ProductContext | undefined
  >();
  const [autoPlayAttempted, setAutoPlayAttempted] = useState<Set<number>>(
    new Set(),
  );
  const [isVoiceMode, setIsVoiceMode] = useState<boolean>(false);
  const [showVoiceChat, setShowVoiceChat] = useState<boolean>(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);
  const [showSessionModal, setShowSessionModal] = useState<boolean>(false);
  const [isCreatingSession, setIsCreatingSession] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const navigation = useNavigation();

  // Get authenticated user ID
  const { firebaseUID } = useAuth();
  const userId = firebaseUID || "";

  // Get voice context
  const { selectedVoice } = useVoice();

  // Voice recording hook
  const voiceRecording = useVoiceRecording();

  // Initialize chat with AI
  const {
    messages,
    setMessages,
    isLoading,
    error,
    sendMessage,
    initializeWithWelcome,
    hasHealthData,
    fullHealthProfile,
    pendingAction,
    setPendingAction,
  } = useChatWithAI(userId, productContext, selectedVoice);

  // Initialize TTS functionality
  const { generateTTS, playTTS, stopTTS, getTTSState } = useChatTTS();

  // Load user data and product context on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  // Initialize welcome message once user data is loaded
  useEffect(() => {
    if (userId && productContext) {
      initializeWithWelcome();
    }
  }, [userId, productContext, initializeWithWelcome]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Auto-play TTS for AI responses when in voice mode
  useEffect(() => {
    if (isVoiceMode && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];

      // If the last message is from AI and we haven't auto-played it yet
      if (
        lastMessage.role === "assistant" &&
        !autoPlayAttempted.has(messages.length - 1)
      ) {
        const messageIndex = messages.length - 1;
        setAutoPlayAttempted((prev) => new Set(prev).add(messageIndex));

        // Auto-play TTS for AI response
        setTimeout(async () => {
          try {
            console.log("🔊 Auto-playing TTS for AI response in voice mode");
            const audioUrl = await generateTTS(
              lastMessage.content,
              messageIndex,
            );
            if (audioUrl) {
              console.log("🎵 Playing audio directly with URL:", audioUrl);
              // Play audio directly using the returned URL
              const ttsService = (
                await import("../services/ttsService")
              ).TTSService.getInstance();
              await ttsService.playAudio(audioUrl);
            } else {
              console.warn("❌ No audio URL returned from generateTTS");
            }

            // Reset voice mode after playing response
            setTimeout(() => {
              setIsVoiceMode(false);
            }, 2000);
          } catch (error) {
            console.error("❌ Auto-TTS error:", error);
            setIsVoiceMode(false);
          }
        }, 500);
      }
    }
  }, [
    messages,
    isVoiceMode,
    selectedVoice,
    autoPlayAttempted,
    generateTTS,
    playTTS,
  ]);

  const loadUserData = async () => {
    try {
      console.log("👤 ChatScreen using Firebase UID:", userId);

      // Get selected product from AsyncStorage
      const storedProduct = await AsyncStorage.getItem("selectedProduct");
      if (storedProduct) {
        const productData = JSON.parse(storedProduct);
        setProductContext({
          productName: productData.name || "H2Oasis Recovery System",
          productType: mapProductType(productData.type || productData.name),
          features: productData.features || [],
        });
      } else {
        // Default product context
        setProductContext({
          productName: "H2Oasis Recovery System",
          productType: "recovery_suite",
          features: ["Cold Plunge", "Hot Tub", "Sauna"],
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      // Set default product context (userId comes from AuthContext)
      setProductContext({
        productName: "H2Oasis Recovery System",
        productType: "recovery_suite",
        features: ["Cold Plunge", "Hot Tub", "Sauna"],
      });
    }
  };

  const mapProductType = (
    productName: string,
  ): ProductContext["productType"] => {
    const name = productName.toLowerCase();
    if (name.includes("cold") || name.includes("plunge")) return "cold_plunge";
    if (name.includes("hot") || name.includes("tub")) return "hot_tub";
    if (name.includes("sauna")) return "sauna";
    return "recovery_suite";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const messageToSend = inputValue.trim();
    setInputValue("");

    try {
      await sendMessage(messageToSend);
    } catch (error) {
      Alert.alert("Error", "Failed to send message. Please try again.");
    }
  };

  const handleVoiceRecording = async () => {
    try {
      if (voiceRecording.state.isRecording) {
        // Stop recording and process
        console.log("🛑 Stopping voice recording...");
        const audioUri = await voiceRecording.stopRecording();

        if (audioUri) {
          console.log("🎤 Processing voice message...");
          // Convert speech to text
          const transcription = await STTService.speechToText(audioUri);

          if (transcription.trim()) {
            console.log("✅ Voice transcribed:", transcription);
            // Send the transcribed message
            await sendMessage(transcription);

            // Enable voice mode for response
            setIsVoiceMode(true);
          } else {
            Alert.alert(
              "Voice Recording",
              "No speech detected. Please try again.",
            );
          }
        }
      } else {
        // Start recording
        console.log("🎤 Starting voice recording...");
        await voiceRecording.startRecording();
      }
    } catch (error) {
      console.error("❌ Voice recording error:", error);
      Alert.alert(
        "Voice Recording Error",
        "Failed to process voice recording. Please try again.",
      );
      // Reset recording state
      await voiceRecording.cancelRecording();
    }
  };

  const handleVoiceChat = () => {
    console.log("🎙️ Opening voice chat...");
    setShowVoiceChat(true);
  };

  const handleCreateSession = async (tags: string[]) => {
    try {
      setIsCreatingSession(true);
      setShowSessionModal(false);
      console.log("🛁 Creating session with tags:", tags);

      const response = await chatService.createSession(userId, {
        tags,
        mood: "relaxed",
        message: `Create a personalized wellness session for ${tags.join(", ").toLowerCase()}`,
      });

      if (response.success && response.session) {
        // Save session to AsyncStorage for optimistic rendering
        await saveOptimisticSession(response.session);

        // Add confirmation message to chat
        const sessionMessage: Message = {
          role: "assistant",
          content: `I've created a "${response.session.SessionName}" session for you! It's ${response.session.TotalDurationMinutes} minutes with ${response.session.Steps?.length || 0} steps. Tap 'View Session' below to start.`,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev: Message[]) => [...prev, sessionMessage]);

        // Set pending action to show button
        if (setPendingAction) {
          setPendingAction("CREATE_SESSION");
        }
      } else {
        Alert.alert("Error", response.error || "Failed to create session");
      }
    } catch (error) {
      console.error("❌ Create session error:", error);
      Alert.alert("Error", "Failed to create session. Please try again.");
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleCreatePlan = async () => {
    try {
      setIsGeneratingPlan(true);
      console.log("📋 Generating recovery plan...");

      const response = await chatService.generatePlan(
        userId,
        messages.slice(-10), // Send recent chat context
      );

      if (response.success && response.plan) {
        // Save plan to AsyncStorage
        await AsyncStorage.setItem(
          "recoveryPlan",
          JSON.stringify(response.plan),
        );
        console.log("✅ Plan saved to storage");

        // Clear pending action
        if (setPendingAction) {
          setPendingAction(null);
        }

        // Navigate to Dashboard
        navigation.navigate("Dashboard" as never);
      } else {
        Alert.alert("Error", "Failed to generate recovery plan");
      }
    } catch (error) {
      console.error("❌ Create plan error:", error);
      Alert.alert(
        "Error",
        "Failed to generate recovery plan. Please try again.",
      );
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const renderMessage = (message: Message, index: number) => {
    const isUser = message.role === "user";
    const time = new Date(message.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Check if this is the last AI message and has pending action
    const isLastMessage = index === messages.length - 1;
    const showPlanButton =
      !isUser && isLastMessage && pendingAction === "CREATE_PLAN";
    const showSessionButton =
      !isUser && isLastMessage && pendingAction === "CREATE_SESSION";

    // Get TTS state for this message (only for AI messages)
    const ttsState = !isUser ? getTTSState(index) : null;

    // TODO: Re-enable TTS action handler when needed
    // const handleTTSAction = async () => {
    //   if (!ttsState) return;
    //   if (ttsState.isPlaying) {
    //     await stopTTS();
    //   } else if (ttsState.audioUrl) {
    //     await playTTS(index);
    //   } else {
    //     await generateTTS(message.content, index);
    //   }
    // };

    return (
      <View key={index} style={ChatScreenStyles.messageWrapper}>
        <View
          style={[
            ChatScreenStyles.message,
            isUser ? ChatScreenStyles.userMessage : ChatScreenStyles.botMessage,
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Text
              style={[
                isUser ? ChatScreenStyles.userText : ChatScreenStyles.botText,
              ]}
            >
              {message.content}
            </Text>

            {/* TTS Controls removed - now auto-play */}
          </View>

          {/* Error display for TTS */}
          {ttsState?.error && (
            <Text style={ChatScreenStyles.ttsError}>{ttsState.error}</Text>
          )}

          {/* Plan Generation Button */}
          {showPlanButton && (
            <TouchableOpacity
              style={{
                marginTop: 12,
                backgroundColor: "#3B82F6",
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 25,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
              }}
              onPress={handleCreatePlan}
              disabled={isGeneratingPlan}
            >
              {isGeneratingPlan ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <Text
                    style={{ fontSize: 16, color: "#FFF", fontWeight: "600" }}
                  >
                    View My Plan
                  </Text>
                  <Text style={{ fontSize: 18, marginLeft: 6 }}>📋</Text>
                </>
              )}
            </TouchableOpacity>
          )}
          {showSessionButton && (
            <TouchableOpacity
              style={{
                marginTop: 12,
                backgroundColor: "#10B981",
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 25,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
              }}
              onPress={async () => {
                try {
                  // Clear pending action and navigate to Dashboard where suggested session is shown
                  if (setPendingAction) setPendingAction(null);
                  navigation.navigate("Dashboard" as never);
                } catch (e) {
                  console.error("Failed to open session:", e);
                  Alert.alert("Error", "Unable to open session");
                }
              }}
            >
              <Text style={{ fontSize: 16, color: "#FFF", fontWeight: "600" }}>
                View Session
              </Text>
              <Text style={{ fontSize: 18, marginLeft: 6 }}>✨</Text>
            </TouchableOpacity>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: isUser ? "flex-end" : "flex-start",
            alignItems: "center",
          }}
        >
          <Text
            style={[
              ChatScreenStyles.timeText,
              isUser ? ChatScreenStyles.userTime : ChatScreenStyles.botTime,
            ]}
          >
            {time}
          </Text>
        </View>
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isLoading) return null;

    return (
      <View style={ChatScreenStyles.messageWrapper}>
        <View style={[ChatScreenStyles.message, ChatScreenStyles.botMessage]}>
          <View style={ChatScreenStyles.typingIndicator}>
            <ActivityIndicator size="small" color="#666" />
            <Text style={[ChatScreenStyles.botText, { marginLeft: 8 }]}>
              {selectedVoice ? selectedVoice.name : "Evy"} is thinking...
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // TODO: Re-enable health status renderer when needed
  // const renderHealthStatus = () => {
  //   if (!isRookReady) {
  //     return (
  //       <View style={ChatScreenStyles.healthStatus}>
  //         <Text style={ChatScreenStyles.healthStatusText}>
  //           🔄 Connecting to health data...
  //         </Text>
  //       </View>
  //     );
  //   }
  //   if (hasHealthData) {
  //     return (
  //       <View style={ChatScreenStyles.healthStatus}>
  //         <Text style={ChatScreenStyles.healthStatusText}>
  //           ✅ Health data connected - AI recommendations will be personalized
  //         </Text>
  //       </View>
  //     );
  //   }
  //   return (
  //     <View style={ChatScreenStyles.healthStatus}>
  //       <Text style={ChatScreenStyles.healthStatusText}>
  //         ⚠️ No health data available - AI will provide general recommendations
  //       </Text>
  //     </View>
  //   );
  // };

  return (
    <SafeAreaView style={globalStyles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Navigation Header */}
      <View style={ChatScreenStyles.navigationHeader}>
        <View style={ChatScreenStyles.navButton} />

        <Text style={ChatScreenStyles.headerTitle}>
          Chat with {selectedVoice ? selectedVoice.name : "Evy"}
        </Text>

        <TouchableOpacity
          style={ChatScreenStyles.navButton}
          onPress={() => navigation.navigate("Dashboard" as never)}
        >
          <Text style={ChatScreenStyles.navButtonText}>Next</Text>
          <Ionicons name="arrow-forward" size={24} color="#333333" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={ChatScreenStyles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          <View style={ChatScreenStyles.mainContainer}>
            <ImageBackground
              source={require("../../assets/app_bg.png")}
              style={ChatScreenStyles.backgroundImage}
              resizeMode="cover"
            >
              <View style={ChatScreenStyles.logoSection}>
                <Image
                  source={require("../../assets/evy.png")}
                  style={ChatScreenStyles.logo}
                  resizeMode="contain"
                />
                <Text style={ChatScreenStyles.logoText}>
                  {selectedVoice ? selectedVoice.name : "Evy"} - Your Recovery
                  Specialist
                </Text>
                {productContext && (
                  <Text style={ChatScreenStyles.productText}>
                    {productContext.productName}
                  </Text>
                )}
              </View>
              <View style={ChatScreenStyles.messagesContainer}>
                {messages.map((message, index) => {
                  return renderMessage(message, index);
                })}
                {renderTypingIndicator()}
              </View>

              {/* Error Display */}
              {error && (
                <View style={ChatScreenStyles.errorContainer}>
                  <Text style={ChatScreenStyles.errorText}>{error}</Text>
                </View>
              )}

              {/* Quick Actions - Create Session Button */}
              {messages.length <= 2 && !isLoading && (
                <View
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    backgroundColor: "rgba(255,255,255,0.9)",
                    borderRadius: 12,
                    marginHorizontal: 16,
                    marginBottom: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#666",
                      marginBottom: 8,
                      textAlign: "center",
                    }}
                  >
                    💡 Quick tip: Create a personalized wellness session
                  </Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#10B981",
                      paddingVertical: 12,
                      paddingHorizontal: 20,
                      borderRadius: 25,
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                    onPress={() => setShowSessionModal(true)}
                    disabled={isCreatingSession}
                  >
                    {isCreatingSession ? (
                      <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                      <>
                        <Ionicons name="sparkles" size={18} color="#FFF" />
                        <Text
                          style={{
                            fontSize: 15,
                            color: "#FFF",
                            fontWeight: "600",
                            marginLeft: 8,
                          }}
                        >
                          Create Session
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              )}

              {/* Input */}
              <View style={ChatScreenStyles.inputBox}>
                <TextInput
                  style={ChatScreenStyles.textInput}
                  value={inputValue}
                  onChangeText={(text) => {
                    setInputValue(text);
                  }}
                  placeholder={`Ask ${selectedVoice ? selectedVoice.name : "Evy"} about your recovery routine...`}
                  onSubmitEditing={handleSendMessage}
                  editable={!isLoading}
                  multiline
                  maxLength={500}
                />

                {/* Buttons Container */}
                <View style={ChatScreenStyles.buttonsContainer}>
                  {/* Mic/Send Button */}
                  <TouchableOpacity
                    style={
                      inputValue.trim() && !isLoading
                        ? ChatScreenStyles.sendButton
                        : voiceRecording.state.isRecording
                          ? ChatScreenStyles.recordingButton
                          : ChatScreenStyles.voiceButton
                    }
                    onPress={
                      inputValue.trim()
                        ? handleSendMessage
                        : handleVoiceRecording
                    }
                    disabled={isLoading || voiceRecording.state.isProcessing}
                  >
                    {inputValue.trim() && !isLoading ? (
                      <Image
                        source={require("../../assets/send.png")}
                        style={{ width: 43, height: 43 }}
                        resizeMode="contain"
                      />
                    ) : voiceRecording.state.isRecording ? (
                      <View style={ChatScreenStyles.recordingIndicator}>
                        <Text style={ChatScreenStyles.recordingText}>
                          {Math.floor(voiceRecording.state.duration / 60)}:
                          {(voiceRecording.state.duration % 60)
                            .toString()
                            .padStart(2, "0")}
                        </Text>
                        <Image
                          source={require("../../assets/mic.png")}
                          style={{
                            width: 30,
                            height: 30,
                            tintColor: "#FF4444",
                          }}
                          resizeMode="contain"
                        />
                      </View>
                    ) : voiceRecording.state.isProcessing ? (
                      <ActivityIndicator size="small" color="#007AFF" />
                    ) : (
                      <Image
                        source={require("../../assets/mic.png")}
                        style={{
                          width: 43,
                          height: 43,
                          opacity: isLoading ? 0.5 : 1,
                        }}
                        resizeMode="contain"
                      />
                    )}
                  </TouchableOpacity>

                  {/* Voice Chat Button */}
                  <TouchableOpacity
                    style={ChatScreenStyles.voiceCallButton}
                    onPress={handleVoiceChat}
                    disabled={isLoading}
                  >
                    <Image
                      source={require("../../assets/call.png")}
                      style={{
                        width: 43,
                        height: 43,
                        opacity: isLoading ? 0.5 : 1,
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Voice Call Modal */}
      <VoiceCallModal
        visible={showVoiceChat}
        onClose={() => setShowVoiceChat(false)}
        userId={userId}
      />

      {/* Session Type Selection Modal */}
      <Modal
        visible={showSessionModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSessionModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#FFF",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              paddingBottom: 40,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text
                style={{ fontSize: 20, fontWeight: "700", color: "#1F2937" }}
              >
                Choose Session Type
              </Text>
              <TouchableOpacity onPress={() => setShowSessionModal(false)}>
                <Ionicons name="close" size={28} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 16 }}>
              Select what you'd like to focus on, and I'll create a personalized
              session for you.
            </Text>

            {SESSION_TYPES.map((type, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  backgroundColor: "#F3F4F6",
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  borderRadius: 12,
                  marginBottom: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => handleCreateSession(type.tags)}
              >
                <Text style={{ fontSize: 17, color: "#1F2937", flex: 1 }}>
                  {type.label}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ChatScreen;
