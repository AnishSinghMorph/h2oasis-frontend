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
  const scrollViewRef = useRef<ScrollView>(null);

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
  } = useChatWithAI(userId, productContext);

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

    return (
      <View key={index} style={ChatScreenStyles.messageWrapper}>
        <View
          style={[
            ChatScreenStyles.message,
            isUser ? ChatScreenStyles.userMessage : ChatScreenStyles.botMessage,
          ]}
        >
          <Text
            style={isUser ? ChatScreenStyles.userText : ChatScreenStyles.botText}
          >
            {message.content}
          </Text>
        </View>

        <Text
          style={[
            ChatScreenStyles.timeText,
            isUser ? ChatScreenStyles.userTime : ChatScreenStyles.botTime,
          ]}
        >
          {time}
        </Text>
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
              Evy is thinking...
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
                  Evy - Your Recovery Specialist
                </Text>
                {productContext && (
                  <Text style={ChatScreenStyles.productText}>
                    {productContext.productName}
                  </Text>
                )}
              </View>

              {/* Health Status Indicator */}
              {renderHealthStatus()}

              {/* Messages */}
              <View style={ChatScreenStyles.messagesContainer}>
                {messages.map((message, index) => renderMessage(message, index))}
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
                  onChangeText={setInputValue}
                  placeholder="Ask Evy about your recovery routine..."
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