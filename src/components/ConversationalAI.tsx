import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
} from "react-native";
import { useConversation } from "@elevenlabs/react-native";
import { Audio } from "expo-av";

interface ConversationalAIProps {
  agentId: string;
  userId?: string;
  onConversationStart?: () => void;
  onConversationEnd?: () => void;
  onEndSessionRef?: (endSession: () => Promise<void>) => void;
}

export const ConversationalAI: React.FC<ConversationalAIProps> = ({
  agentId,
  userId,
  onConversationStart,
  onConversationEnd,
  onEndSessionRef,
}) => {
  const pulseAnimation = new Animated.Value(1);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Initialize ElevenLabs conversation hook
  const conversation = useConversation({
    onConnect: () => {
      console.log("✅ Connected to ElevenLabs agent");
      setIsConnecting(false);
      onConversationStart?.();
    },
    onDisconnect: () => {
      console.log("✅ Disconnected from ElevenLabs agent");
      setIsConnecting(false);
      onConversationEnd?.();
    },
    onError: (error) => {
      console.error("❌ ElevenLabs conversation error:", error);
      setIsConnecting(false);
      Alert.alert(
        "Voice Chat Error",
        "There was an issue with the voice chat. Please try again.",
      );
    },
    onStatusChange: (status) => {
      console.log("📊 ElevenLabs status change:", status);
    },
  });

  // Compute connection status from conversation state
  const isConnected = conversation.status === "connected";

  // Request microphone permissions
  const requestPermissions = async (): Promise<boolean> => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status === "granted") {
        setHasPermissions(true);
        console.log("✅ Microphone permissions granted");
        return true;
      } else {
        console.log("❌ Microphone permissions denied");
        Alert.alert(
          "Permission Required",
          "Microphone access is required for voice chat.",
        );
        return false;
      }
    } catch (error) {
      console.error("Error requesting permissions:", error);
      return false;
    }
  };

  // Initialize permissions on component mount
  useEffect(() => {
    requestPermissions();
    // Pass endConversation function to parent
    if (onEndSessionRef) {
      onEndSessionRef(endConversation);
    }
  }, []);

  // Handle connection to ElevenLabs agent
  const startConversation = async () => {
    if (!hasPermissions) {
      const granted = await requestPermissions();
      if (!granted) return;
    }

    try {
      setIsConnecting(true);
      console.log("🔌 Connecting to ElevenLabs agent:", agentId);
      console.log("👤 User ID:", userId);
      await conversation.startSession({
        agentId: agentId,
        userId: userId,
      });
    } catch (error) {
      console.error("Error connecting to agent:", error);
      Alert.alert(
        "Connection Error",
        "Failed to connect to voice agent. Please try again.",
      );
      setIsConnecting(false);
    }
  };

  const endConversation = async () => {
    try {
      console.log("🔌 Disconnecting from ElevenLabs agent");
      await conversation.endSession();
    } catch (error) {
      console.error("Error disconnecting from agent:", error);
    }
  };

  // Pulse animation for visual feedback
  useEffect(() => {
    if (conversation.status === "connected") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      pulseAnimation.stopAnimation();
      pulseAnimation.setValue(1);
    }
  }, [conversation.status, pulseAnimation]);

  return (
    <View style={styles.container}>
      {/* Connection status indicator */}
      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: isConnected ? "#4CAF50" : "#9E9E9E" },
          ]}
        />
        <Text style={styles.statusText}>
          {isConnected ? "Connected" : "Not Connected"}
        </Text>
      </View>

      {/* Main call button with pulsing animation */}
      <Animated.View style={{ transform: [{ scale: pulseAnimation }] }}>
        <TouchableOpacity
          style={[
            styles.callButton,
            { backgroundColor: isConnected ? "#f44336" : "#2196F3" },
          ]}
          onPress={() => {
            console.log("🎯 BUTTON PRESSED! isConnected:", isConnected);
            if (isConnected) {
              endConversation();
            } else {
              startConversation();
            }
          }}
          disabled={isConnecting}
        >
          <Text style={styles.buttonText}>
            {isConnecting
              ? "Connecting..."
              : isConnected
                ? "End Call"
                : "Start Voice Chat"}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Status text */}
      {isConnected && (
        <Text style={styles.statusMessage}>
          {conversation.isSpeaking ? "🗣️ AI is speaking..." : "👂 Listening..."}
        </Text>
      )}

      {/* Helper text */}
      <Text style={styles.helperText}>
        {!hasPermissions
          ? "Tap to enable microphone and start voice chat"
          : isConnecting
            ? "Establishing secure connection..."
            : !isConnected
              ? "Tap the button below to start"
              : "Speak normally - AI will respond when you finish"}
      </Text>

      {/* Debug info */}
      <Text style={styles.debugText}>
        Status: {conversation.status} | Agent: {agentId.substring(0, 8)}...
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  callButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  statusMessage: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
    textAlign: "center",
  },
  helperText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    maxWidth: 250,
    lineHeight: 18,
    marginBottom: 10,
  },
  debugText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
});

export default ConversationalAI;
