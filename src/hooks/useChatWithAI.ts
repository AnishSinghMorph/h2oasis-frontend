import { useState, useCallback, useEffect } from "react";
import { chatService } from "../services/chatService";
import { productService } from "../services/productService";
import API_CONFIG from "../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface VoicePersona {
  key: string;
  name: string;
  subtitle: string;
  description: string;
  image?: any;
  gender?: "male" | "female";
  accent?: string;
}

interface ProductContext {
  productName: string;
  productType: "cold_plunge" | "hot_tub" | "sauna" | "recovery_suite";
  features?: string[];
}

const CHAT_HISTORY_KEY = "chat_history_";

export const useChatWithAI = (
  userId: string,
  productContext?: ProductContext,
  selectedVoice?: VoicePersona | null,
) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [realProductContext, setRealProductContext] = useState<
    ProductContext | undefined
  >(productContext);
  const [healthData, setHealthData] = useState<any>(null);
  const [fullHealthProfile, setFullHealthProfile] = useState<any>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  // Load chat history from AsyncStorage on mount
  useEffect(() => {
    const loadChatHistory = async () => {
      if (userId) {
        try {
          const storageKey = `${CHAT_HISTORY_KEY}${userId}`;
          const savedHistory = await AsyncStorage.getItem(storageKey);
          if (savedHistory) {
            const parsedHistory = JSON.parse(savedHistory);
            console.log(
              "📚 Loaded chat history:",
              parsedHistory.length,
              "messages",
            );
            setMessages(parsedHistory);
          }
        } catch (error) {
          console.error("Failed to load chat history:", error);
        } finally {
          setIsHistoryLoaded(true);
        }
      }
    };

    loadChatHistory();
  }, [userId]);

  // Save chat history to AsyncStorage whenever messages change
  useEffect(() => {
    const saveChatHistory = async () => {
      if (userId && isHistoryLoaded && messages.length > 0) {
        try {
          const storageKey = `${CHAT_HISTORY_KEY}${userId}`;
          await AsyncStorage.setItem(storageKey, JSON.stringify(messages));
          console.log("💾 Saved chat history:", messages.length, "messages");
        } catch (error) {
          console.error("Failed to save chat history:", error);
        }
      }
    };

    saveChatHistory();
  }, [messages, userId, isHistoryLoaded]);

  // Fetch unified health data from our API
  useEffect(() => {
    const fetchHealthData = async () => {
      if (userId && !healthData) {
        try {
          console.log("🩺 Fetching health data from API...");
          console.log("👤 Using userId:", userId);
          console.log("🔗 API URL:", `${API_CONFIG.BASE_URL}/api/health-data`);

          const response = await fetch(
            `${API_CONFIG.BASE_URL}/api/health-data`,
            {
              headers: {
                "x-firebase-uid": userId,
                "Content-Type": "application/json",
              },
            },
          );

          console.log("📡 Response status:", response.status);

          if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ API Error:", errorText);
            throw new Error("Failed to fetch health data");
          }

          const result = await response.json();
          console.log("📦 Full API Response:", JSON.stringify(result, null, 2));

          if (result.success) {
            const data = result.data;
            setFullHealthProfile(data); // Store full profile

            // Set product context from API
            if (data.selectedProduct) {
              setRealProductContext({
                productName: data.selectedProduct.name,
                productType: mapProductType(data.selectedProduct.type),
                features: [],
              });
            }

            // Extract health metrics from connected wearables
            const wearables = data.wearables;
            console.log(
              "🔍 Checking wearables for data:",
              Object.keys(wearables),
            );

            // Debug: Log each wearable's status
            Object.entries(wearables).forEach(([key, w]: [string, any]) => {
              console.log(`🔍 ${key}:`, {
                connected: w.connected,
                hasData: !!w.data,
                dataKeys: w.data ? Object.keys(w.data) : [],
              });
            });

            // Find first wearable with actual health data (physical, sleep, or body)
            const connectedWearable = Object.values(wearables).find(
              (w: any) => {
                console.log("🔍 Checking wearable:", w.name, {
                  connected: w.connected,
                  hasData: !!w.data,
                  hasPhysical: w.data?.physical,
                  hasSleep: w.data?.sleep,
                  hasBody: w.data?.body,
                });

                if (!w.connected) {
                  console.log(`❌ ${w.name} not connected`);
                  return false;
                }

                if (!w.data) {
                  console.log(`❌ ${w.name} has no data object`);
                  return false;
                }

                // Skip if data looks like raw webhook payload (has body_health, physical_health, etc.)
                if (
                  w.data.body_health ||
                  w.data.physical_health ||
                  w.data.sleep_health
                ) {
                  console.log(
                    `⚠️ ${w.name} has corrupted/raw webhook data, skipping`,
                  );
                  return false;
                }

                // Check if data has at least one of the health metrics
                const hasHealthData = !!(
                  w.data.physical ||
                  w.data.sleep ||
                  w.data.body
                );
                console.log(
                  `${hasHealthData ? "✅" : "❌"} ${w.name} health data check:`,
                  hasHealthData,
                );

                return hasHealthData;
              },
            );

            if (connectedWearable && (connectedWearable as any).data) {
              const healthMetrics = (connectedWearable as any).data;
              setHealthData({
                physical: healthMetrics.physical || null,
                sleep: healthMetrics.sleep || null,
                body: healthMetrics.body || null,
                lastSync: (connectedWearable as any).lastSync,
                source: (connectedWearable as any).name,
              });
              console.log(
                "✅ Health data fetched from:",
                (connectedWearable as any).name,
              );
              console.log("📊 Data contains:", {
                physical: !!healthMetrics.physical,
                sleep: !!healthMetrics.sleep,
                body: !!healthMetrics.body,
              });
            } else {
              console.log("⚠️ No health data available from wearables");
              console.log(
                "Connected wearables:",
                Object.entries(wearables)
                  .filter(([_, w]: [string, any]) => w.connected)
                  .map(
                    ([key, w]: [string, any]) =>
                      `${key}: connected=${w.connected}, data=${!!w.data}`,
                  ),
              );
              setHealthData({
                note: "No wearable data available - connect a device",
              });
            }
          }
        } catch (error) {
          console.error("Failed to fetch health data:", error);
          setHealthData({
            error: "Failed to sync health data",
          });
        }
      }
    };

    fetchHealthData();
  }, [userId]);

  const mapProductType = (type: string): ProductContext["productType"] => {
    if (type.includes("cold") || type.includes("plunge")) return "cold_plunge";
    if (type.includes("hot") || type.includes("tub")) return "hot_tub";
    if (type.includes("sauna")) return "sauna";
    return "recovery_suite";
  };

  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim()) return;

      setIsLoading(true);
      setError(null);

      // Add user message immediately
      const userChatMessage: ChatMessage = {
        role: "user",
        content: userMessage.trim(),
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userChatMessage]);

      try {
        // Prepare health data for AI
        const healthDataToSend =
          healthData &&
          (healthData.physical || healthData.sleep || healthData.body)
            ? {
                physical: healthData.physical || {},
                sleep: healthData.sleep || {},
                body: healthData.body || {},
                lastSync: healthData.lastSync,
                source: healthData.source,
                dataStatus: "available",
              }
            : {
                dataStatus: healthData?.error
                  ? "error"
                  : healthData?.note
                    ? "no_data"
                    : "loading",
                note:
                  healthData?.error ||
                  healthData?.note ||
                  "Health data is being loaded...",
              };

        // Send to AI (backend will fetch health data and product context)
        const response = await chatService.sendMessage({
          message: userMessage.trim(),
          userId,
          chatHistory: messages.slice(-10), // Send last 10 messages for context
        });

        // Check for action in response
        if (response.action === "CREATE_PLAN") {
          setPendingAction("CREATE_PLAN");
        } else {
          setPendingAction(null);
        }

        // Add AI response
        const aiChatMessage: ChatMessage = {
          role: "assistant",
          content: response.response,
          timestamp: response.timestamp,
        };

        setMessages((prev) => [...prev, aiChatMessage]);
      } catch (error) {
        console.error("Send message error:", error);
        setError("Failed to get AI response. Please try again.");

        // Add error message to chat
        const errorMessage: ChatMessage = {
          role: "assistant",
          content:
            "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [userId, productContext, messages],
  );

  const clearChat = useCallback(async () => {
    setMessages([]);
    setError(null);

    // Clear from AsyncStorage
    if (userId) {
      try {
        const storageKey = `${CHAT_HISTORY_KEY}${userId}`;
        await AsyncStorage.removeItem(storageKey);
        console.log("🗑️ Cleared chat history from storage");
      } catch (error) {
        console.error("Failed to clear chat history:", error);
      }
    }
  }, [userId]);

  const refreshHealthData = useCallback(async () => {
    if (userId) {
      try {
        console.log("🔄 Refreshing health data from API...");
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/health-data`, {
          headers: {
            "x-firebase-uid": userId,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to refresh health data");
        }

        const result = await response.json();

        if (result.success) {
          const data = result.data;
          setFullHealthProfile(data);

          const wearables = data.wearables;
          // Find first wearable with actual health data, skip corrupted data
          const connectedWearable = Object.values(wearables).find((w: any) => {
            if (!w.connected || !w.data) return false;
            // Skip corrupted/raw webhook data
            if (
              w.data.body_health ||
              w.data.physical_health ||
              w.data.sleep_health
            )
              return false;
            return w.data.physical || w.data.sleep || w.data.body;
          });

          if (connectedWearable && (connectedWearable as any).data) {
            const healthMetrics = (connectedWearable as any).data;
            setHealthData({
              physical: healthMetrics.physical || null,
              sleep: healthMetrics.sleep || null,
              body: healthMetrics.body || null,
              lastSync: (connectedWearable as any).lastSync,
              source: (connectedWearable as any).name,
            });
            console.log(
              "✅ Health data refreshed from:",
              (connectedWearable as any).name,
            );
          }
        }
      } catch (error) {
        console.error("Failed to refresh health data:", error);
      }
    }
  }, [userId]);

  const initializeWithWelcome = useCallback(async () => {
    if (messages.length === 0 && isHistoryLoaded) {
      // Create dynamic welcome message based on actual data
      const productName =
        realProductContext?.productName || "our recovery system";

      let healthStatus = "";
      if (healthData?.physical) {
        healthStatus = `I can see your activity data: ${healthData.physical.steps || 0} steps, ${healthData.physical.calories_kcal || 0} calories`;
      } else if (healthData?.sleep) {
        healthStatus = `I can see your sleep data`;
      } else if (healthData?.error) {
        healthStatus = "I'm having trouble accessing your health data";
      } else if (healthData?.note) {
        healthStatus =
          "Connect a wearable device to get personalized recommendations";
      } else {
        healthStatus = "I'm connecting to your health data";
      }

      const welcomeMessage: ChatMessage = {
        role: "assistant",
        content: `Hi! I'm ${selectedVoice?.name || "Evy"}, your H2Oasis recovery specialist. I can see you have ${productName}. ${healthStatus}. I'm here to help you optimize your recovery routine. Ask me to create a personalized recovery plan!`,
        timestamp: new Date().toISOString(),
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
    hasHealthData:
      healthData?.physical || healthData?.sleep || healthData?.body,
    healthData: healthData,
    fullHealthProfile: fullHealthProfile,
    productContext: realProductContext,
    pendingAction,
    setPendingAction,
  };
};
