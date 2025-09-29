import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StatusBar,
  SafeAreaView,
} from "react-native";
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

  const handleClose = () => {
    // End conversation if it's active
    if (isConnected) {
      handleConversationEnd();
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
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Voice Chat</Text>
          <View style={styles.placeholder} />
        </View>

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

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            H2Oasis AI Assistant - Your Recovery Companion
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default VoiceCallModal;
