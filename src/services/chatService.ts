import { API_BASE_URL } from "../config/api";

interface HealthData {
  steps?: number;
  heartRate?: number;
  sleepHours?: number;
  calories?: number;
  activeMinutes?: number;
  restingHeartRate?: number;
  hrv?: number;
  bodyTemperature?: number;
  bloodOxygen?: number;
  stressLevel?: number;
}

interface ProductContext {
  productName: string;
  productType: "cold_plunge" | "hot_tub" | "sauna" | "recovery_suite";
  features?: string[];
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface SendMessageRequest {
  message: string;
  userId: string;
  healthData?: HealthData;
  productContext?: ProductContext;
  chatHistory?: ChatMessage[];
}

interface SendMessageResponse {
  success: boolean;
  response: string;
  timestamp: string;
  context: {
    healthDataReceived: boolean;
    productContext: ProductContext;
  };
}

interface HealthContextResponse {
  success: boolean;
  healthData: HealthData;
  userId: string;
}

export class ChatService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/chat`;
  }

  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Chat service error:", error);
      throw new Error("Failed to send message to AI");
    }
  }

  async getHealthContext(userId: string): Promise<HealthContextResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/health-context/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Health context error:", error);
      throw new Error("Failed to fetch health context");
    }
  }

  async getChatHistory(userId: string): Promise<ChatMessage[]> {
    try {
      const response = await fetch(`${this.baseUrl}/history/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.history || [];
    } catch (error) {
      console.error("Chat history error:", error);
      return [];
    }
  }

  async clearChatHistory(userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/history/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Clear chat history error:", error);
      return false;
    }
  }
}

// Export singleton instance
export const chatService = new ChatService();
