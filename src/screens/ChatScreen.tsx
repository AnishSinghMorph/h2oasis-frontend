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
} from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { ChatScreenStyles } from "../styles/ChatScreenStyles";
import { useChatWithAI } from "../hooks/useChatWithAI";
import { useChatTTS } from "../hooks/useChatTTS";
import { useVoice } from "../context/VoiceContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ProductContext {
  productName: string;
  productType: 'cold_plunge' | 'hot_tub' | 'sauna' | 'recovery_suite';
  features?: string[];
}

const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const ChatScreen = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [productContext, setProductContext] = useState<ProductContext | undefined>();
  const [autoPlayAttempted, setAutoPlayAttempted] = useState<Set<number>>(new Set());
  const scrollViewRef = useRef<ScrollView>(null);

  // Get voice context
  const { selectedVoice, isLoading: voiceLoading } = useVoice();

  // Initialize chat with AI
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    initializeWithWelcome,
    isRookReady,
    hasHealthData
  } = useChatWithAI(userId, productContext, selectedVoice);

  // Initialize TTS functionality
  const {
    generateTTS,
    playTTS,
    stopTTS,
    getTTSState,
    isAnyPlaying,
  } = useChatTTS();

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

  // Auto-generate and play TTS for new AI messages (simplified to prevent conflicts)
  useEffect(() => {
    if (messages.length > 0 && selectedVoice && !voiceLoading && !isLoading) {
      const lastMessage = messages[messages.length - 1];
      const lastMessageIndex = messages.length - 1;
      
      // Only auto-generate TTS for AI messages that haven't been processed yet
      if (lastMessage.role === 'assistant' && !autoPlayAttempted.has(lastMessageIndex)) {
        const currentState = getTTSState(lastMessageIndex);
        
        if (!currentState.audioUrl && !currentState.isLoading && !currentState.error) {
          console.log('🎤 Auto-generating TTS for new AI message', lastMessageIndex);
          
          // Mark this message as being processed
          setAutoPlayAttempted(prev => new Set([...prev, lastMessageIndex]));
          
          // Generate TTS with auto-play after completion
          const generateAndPlay = async () => {
            try {
              await generateTTS(lastMessage.content, lastMessageIndex);
              
              // Wait for TTS to be ready, then auto-play
              const checkAndPlay = (attempts = 0) => {
                if (attempts > 10) {
                  console.log('⏰ Auto-play timeout after 10 attempts');
                  return;
                }
                
                const state = getTTSState(lastMessageIndex);
                if (state.audioUrl && !state.isPlaying && !state.error && !isAnyPlaying) {
                  console.log('🔊 Auto-playing generated TTS...');
                  playTTS(lastMessageIndex);
                } else if (!state.audioUrl && !state.error) {
                  // Still generating, check again in a bit
                  setTimeout(() => checkAndPlay(attempts + 1), 500);
                }
              };
              
              // Start checking after a delay
              setTimeout(() => checkAndPlay(0), 1000);
              
            } catch (error) {
              console.error('Auto-TTS generation failed:', error);
            }
          };
          
          // Small delay to let the message render
          setTimeout(generateAndPlay, 300);
        }
      }
    }
  }, [messages, selectedVoice, voiceLoading, isLoading, generateTTS, getTTSState, playTTS, isAnyPlaying, autoPlayAttempted]);

  const loadUserData = async () => {
    try {
      // Get user ID (you might have this stored differently)
      const storedUserId = await AsyncStorage.getItem('userId') || 'demo-user-123';
      setUserId(storedUserId);

      // Get selected product from AsyncStorage
      const storedProduct = await AsyncStorage.getItem('selectedProduct');
      if (storedProduct) {
        const productData = JSON.parse(storedProduct);
        setProductContext({
          productName: productData.name || 'H2Oasis Recovery System',
          productType: mapProductType(productData.type || productData.name),
          features: productData.features || []
        });
      } else {
        // Default product context
        setProductContext({
          productName: 'H2Oasis Recovery System',
          productType: 'recovery_suite',
          features: ['Cold Plunge', 'Hot Tub', 'Sauna']
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Set defaults
      setUserId('demo-user-123');
      setProductContext({
        productName: 'H2Oasis Recovery System',
        productType: 'recovery_suite',
        features: ['Cold Plunge', 'Hot Tub', 'Sauna']
      });
    }
  };

  const mapProductType = (productName: string): ProductContext['productType'] => {
    const name = productName.toLowerCase();
    if (name.includes('cold') || name.includes('plunge')) return 'cold_plunge';
    if (name.includes('hot') || name.includes('tub')) return 'hot_tub';
    if (name.includes('sauna')) return 'sauna';
    return 'recovery_suite';
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const messageToSend = inputValue.trim();
    setInputValue("");

    try {
      await sendMessage(messageToSend);
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const renderMessage = (message: Message, index: number) => {
    const isUser = message.role === 'user';
    const time = new Date(message.timestamp).toLocaleTimeString([], { 
      hour: "2-digit", 
      minute: "2-digit" 
    });

    // Get TTS state for this message (only for AI messages)
    const ttsState = !isUser ? getTTSState(index) : null;

    const handleTTSAction = async () => {
      if (!ttsState) return;

      if (ttsState.isPlaying) {
        await stopTTS();
      } else if (ttsState.audioUrl) {
        await playTTS(index);
      } else {
        // Generate TTS for the first time
        await generateTTS(message.content, index);
      }
    };

    return (
      <View key={index} style={ChatScreenStyles.messageWrapper}>
        <View
          style={[
            ChatScreenStyles.message,
            isUser ? ChatScreenStyles.userMessage : ChatScreenStyles.botMessage,
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Text
              style={[
                isUser ? ChatScreenStyles.userText : ChatScreenStyles.botText
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
        </View>

        <View style={{ flexDirection: 'row', justifyContent: isUser ? 'flex-end' : 'flex-start', alignItems: 'center' }}>
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
              {selectedVoice ? selectedVoice.name : 'Evy'} is thinking...
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderHealthStatus = () => {
    if (!isRookReady) {
      return (
        <View style={ChatScreenStyles.healthStatus}>
          <Text style={ChatScreenStyles.healthStatusText}>
            🔄 Connecting to health data...
          </Text>
        </View>
      );
    }

    if (hasHealthData) {
      return (
        <View style={ChatScreenStyles.healthStatus}>
          <Text style={ChatScreenStyles.healthStatusText}>
            ✅ Health data connected - AI recommendations will be personalized
          </Text>
        </View>
      );
    }

    return (
      <View style={ChatScreenStyles.healthStatus}>
        <Text style={ChatScreenStyles.healthStatusText}>
          ⚠️ No health data available - AI will provide general recommendations
        </Text>
      </View>
    );
  };

  return (
    <View style={globalStyles.container}>
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
                  {selectedVoice ? selectedVoice.name : 'Evy'} - Your Recovery Specialist
                </Text>
                {productContext && (
                  <Text style={ChatScreenStyles.productText}>
                    {productContext.productName}
                  </Text>
                )}
              </View>

              {/* Health Status Indicator - REMOVED */}

              {/* Voice Selection Indicator - REMOVED */}

              {/* Messages */}
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

              {/* Input */}
              <View style={ChatScreenStyles.inputBox}>
                <TextInput
                  style={ChatScreenStyles.textInput}
                  value={inputValue}
                  onChangeText={(text) => {
                    setInputValue(text);
                  }}
                  placeholder={`Ask ${selectedVoice ? selectedVoice.name : 'Evy'} about your recovery routine...`}
                  onSubmitEditing={handleSendMessage}
                  editable={!isLoading}
                  multiline
                  maxLength={500}
                />
                <TouchableOpacity
                  style={
                    inputValue.trim() && !isLoading
                      ? ChatScreenStyles.sendButton
                      : ChatScreenStyles.voiceButton
                  }
                  onPress={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                >
                  {inputValue.trim() && !isLoading ? (
                    <Image
                      source={require("../../assets/send.png")}
                      style={{ width: 43, height: 43 }}
                      resizeMode="contain"
                    />
                  ) : (
                    <Image
                      source={require("../../assets/mic.png")}
                      style={{ 
                        width: 43, 
                        height: 43,
                        opacity: isLoading ? 0.5 : 1
                      }}
                      resizeMode="contain"
                    />
                  )}
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatScreen;