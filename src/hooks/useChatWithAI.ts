import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { chatService } from '../services/chatService';
import { productService } from '../services/productService';
import { useRookHealth } from './useRookHealth';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface VoicePersona {
  key: string;
  name: string;
  subtitle: string;
  description: string;
  image?: any;
  gender?: 'male' | 'female';
  accent?: string;
}

interface ProductContext {
  productName: string;
  productType: 'cold_plunge' | 'hot_tub' | 'sauna' | 'recovery_suite';
  features?: string[];
}

export const useChatWithAI = (userId: string, productContext?: ProductContext, selectedVoice?: VoicePersona | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [realProductContext, setRealProductContext] = useState<ProductContext | undefined>(productContext);
  const [healthData, setHealthData] = useState<any>(null);
  
  // Get health data from ROOK
  const { 
    rookReady, 
    syncHealthData,
    syncTodayData
  } = useRookHealth();

  // Fetch user's selected product
  useEffect(() => {
    const fetchSelectedProduct = async () => {
      if (userId && !realProductContext) {
        try {
          const selection = await productService.getMySelection(userId);
          if (selection) {
            setRealProductContext({
              productName: selection.productId.name,
              productType: mapProductType(selection.productId.type),
              features: []
            });
          }
        } catch (error) {
          console.error('Failed to fetch selected product:', error);
        }
      }
    };

    fetchSelectedProduct();
  }, [userId, realProductContext]);

  // Fetch real health data from ROOK
  useEffect(() => {
    const fetchHealthData = async () => {
      if (rookReady && userId && !healthData) { // Only fetch if we don't have data yet
        try {
          console.log('🩺 Fetching real health data from ROOK...');
          const todayData = await syncTodayData();
          
          if (todayData && todayData.hasAnyData) {
            setHealthData({
              calories: todayData.calories,
              hasBodyMetrics: todayData.bodyMetrics,
              hasTraining: todayData.training,
              lastSync: new Date().toISOString()
            });
            console.log('✅ Real health data fetched:', todayData.calories, 'calories');
          } else {
            console.log('⚠️ No health data available from ROOK');
            // Set fallback data
            setHealthData({
              calories: 0,
              hasBodyMetrics: false,
              hasTraining: false,
              lastSync: new Date().toISOString(),
              note: 'No health data available - check Apple Health permissions'
            });
          }
        } catch (error) {
          console.error('Failed to fetch health data:', error);
          // Set fallback data on error
          setHealthData({
            calories: 0,
            hasBodyMetrics: false,
            hasTraining: false,
            lastSync: new Date().toISOString(),
            error: 'Failed to sync health data'
          });
        }
      }
    };

    fetchHealthData();
  }, [rookReady, userId]); // Removed syncTodayData and healthData from dependencies

  const mapProductType = (type: string): ProductContext['productType'] => {
    if (type.includes('cold') || type.includes('plunge')) return 'cold_plunge';
    if (type.includes('hot') || type.includes('tub')) return 'hot_tub';
    if (type.includes('sauna')) return 'sauna';
    return 'recovery_suite';
  };

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim()) return;

    setIsLoading(true);
    setError(null);

    // Add user message immediately
    const userChatMessage: ChatMessage = {
      role: 'user',
      content: userMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userChatMessage]);

    try {
      // Use real health data if available, otherwise provide helpful context
      const healthDataToSend = healthData ? {
        calories: healthData.calories || 0,
        hasBodyMetrics: healthData.hasBodyMetrics || false,
        hasTraining: healthData.hasTraining || false,
        lastSync: healthData.lastSync,
        dataStatus: healthData.error ? 'error' : healthData.note ? 'no_permissions' : 'available'
      } : {
        calories: 0,
        hasBodyMetrics: false,
        hasTraining: false,
        dataStatus: 'loading',
        note: 'Health data is being loaded...'
      };

      console.log('📊 Sending health data to AI:', healthDataToSend);

      // Send to AI
      const response = await chatService.sendMessage({
        message: userMessage.trim(),
        userId,
        healthData: healthDataToSend,
        productContext: realProductContext,
        chatHistory: messages.slice(-10) // Send last 10 messages for context
      });

      // Add AI response
      const aiChatMessage: ChatMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: response.timestamp
      };

      setMessages(prev => [...prev, aiChatMessage]);

    } catch (error) {
      console.error('Send message error:', error);
      setError('Failed to get AI response. Please try again.');
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble responding right now. Please try again in a moment.',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [userId, productContext, messages]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const refreshHealthData = useCallback(async () => {
    if (rookReady && userId) {
      try {
        console.log('🔄 Refreshing health data from ROOK...');
        const todayData = await syncTodayData();
        
        if (todayData && todayData.hasAnyData) {
          setHealthData({
            calories: todayData.calories,
            hasBodyMetrics: todayData.bodyMetrics,
            hasTraining: todayData.training,
            lastSync: new Date().toISOString()
          });
          console.log('✅ Health data refreshed:', todayData.calories, 'calories');
        }
      } catch (error) {
        console.error('Failed to refresh health data:', error);
      }
    }
  }, [rookReady, userId, syncTodayData]);

  const initializeWithWelcome = useCallback(async () => {
    if (messages.length === 0) {
      // Create dynamic welcome message based on actual data
      const productName = realProductContext?.productName || 'our recovery system';
      const healthStatus = healthData ? 
        (healthData.calories > 0 ? `I can see your current activity data (${healthData.calories} calories today)` :
         healthData.error ? 'I\'m having trouble accessing your health data' :
         'I\'m ready to work with your health data once synced') :
        'I\'m connecting to your health data';
      
      const welcomeMessage: ChatMessage = {
        role: 'assistant',
        content: `Hi! I'm ${selectedVoice?.name || 'Evy'}, your H2Oasis recovery specialist. I can see you have ${productName}. ${healthStatus}. I'm here to help you optimize your recovery routine. What would you like to know about your recovery protocols?`,
        timestamp: new Date().toISOString()
      };
      
      setMessages([welcomeMessage]);
    }
  }, [messages.length, realProductContext, healthData, selectedVoice]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    refreshHealthData,
    initializeWithWelcome,
    isRookReady: rookReady,
    hasHealthData: healthData?.calories > 0 || healthData?.hasBodyMetrics || healthData?.hasTraining,
    healthData: healthData,
    productContext: realProductContext
  };
};