import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ConversationalAI } from "./ConversationalAI";
import { AnimatedVoiceOrb } from "./AnimatedVoiceOrb";
import { elevenlabsService } from "../services/elevenlabsService";
import { VoiceCallModalStyles as styles } from "../styles/VoiceCallModalStyles";

interface VoiceCallModalProps {
  visible: boolean;
  onClose: () => void;
  userId?: string;
}

export const VoiceCallModal: React.FC<VoiceCallModalProps> = ({
  visible,
  onClose,
  userId,
}) => {
  const [agentConfig, setAgentConfig] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(true);
  const [endSessionFn, setEndSessionFn] = useState<
    (() => Promise<void>) | null
  >(null);

  // Load agent configuration when modal opens
  useEffect(() => {
    if (visible) {
      loadAgentConfig();
    }
  }, [visible]);

  const loadAgentConfig = async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading agent config for voice call...");
      const config = await elevenlabsService.getAgentConfig();
      setAgentConfig(config);
      console.log("✅ Agent config loaded for voice call:", config);
    } catch (error) {
      console.error("❌ Error loading agent config:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConversationStart = () => {
    console.log("🎉 Voice conversation started");
    setIsConnected(true);
    setIsListening(true);
  };

  const handleConversationEnd = () => {
    console.log("📞 Voice conversation ended");
    setIsConnected(false);
    setIsSpeaking(false);
    setIsListening(false);
  };

  const handleClose = async () => {
    // End conversation if it's active
    if (isConnected && endSessionFn) {
      console.log("🔴 Ending active session before close");
      await endSessionFn();
      // Wait a moment for cleanup
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        {/* Main Content */}
        <View style={styles.content}>
          {/* Status Text */}
          <View style={styles.statusContainer}>
            <Text style={styles.statusTitle}>
              {loading
                ? "Connecting..."
                : !isConnected
                  ? "Ready to Chat"
                  : isSpeaking
                    ? "AI is speaking"
                    : isListening
                      ? "Listening..."
                      : "Connected"}
            </Text>
            <Text style={styles.statusSubtitle}>
              {loading
                ? "Setting up your AI assistant"
                : !isConnected
                  ? "Tap the button below to start"
                  : "Speak naturally, AI will respond"}
            </Text>
          </View>

          {/* Animated Voice Orb */}
          <View style={styles.orbContainer}>
            <AnimatedVoiceOrb
              isConnected={isConnected}
              isSpeaking={isSpeaking}
              isListening={isListening}
              size={250}
            />
          </View>

          {/* Conversational AI Component */}
          {agentConfig && !loading && (
            <View style={styles.aiContainer}>
              <ConversationalAI
                agentId={agentConfig.agentId}
                userId={userId}
                onConversationStart={handleConversationStart}
                onConversationEnd={handleConversationEnd}
                onEndSessionRef={(endFn) => setEndSessionFn(() => endFn)}
              />
            </View>
          )}

          {/* Loading State */}
          {loading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>
                Preparing your AI assistant...
              </Text>
            </View>
          )}
        </View>

        {/* Footer with Close Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.closeButtonBottom}
            onPress={handleClose}
          >
            <Text style={styles.closeButtonBottomText}>Close</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default VoiceCallModal;
