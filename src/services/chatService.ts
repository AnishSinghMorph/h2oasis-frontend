import { API_BASE_URL } from "../config/api";
import {
  CreateSessionRequest,
  CreateSessionResponse,
} from "../types/session.types";

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
  userId?: string; // Optional since we send in header
  chatHistory?: ChatMessage[];
  tags?: string[];
  goals?: string[];
  mood?: string;
  isNewSession?: boolean;
}

interface SendMessageResponse {
  success: boolean;
  response: string;
  timestamp: string;
  action?: string; // Optional action like "CREATE_PLAN" or "CREATE_SESSION"
  session?: any; // Optional session object for CREATE_SESSION action
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
          "x-firebase-uid": request.userId || "",
        },
        body: JSON.stringify({
          message: request.message,
          chatHistory: request.chatHistory,
          tags: request.tags,
          goals: request.goals,
          mood: request.mood,
          isNewSession: request.isNewSession,
        }),
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

  async generatePlan(
    userId: string,
    chatHistory?: ChatMessage[],
  ): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/generate-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-firebase-uid": userId,
        },
        body: JSON.stringify({
          chatHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Generate plan error:", error);
      throw new Error("Failed to generate recovery plan");
    }
  }

  /**
   * Create a guided wellness session with timed steps
   */
  async createSession(
    userId: string,
    request: CreateSessionRequest,
  ): Promise<CreateSessionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/create-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-firebase-uid": userId,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
        );
      }

      return await response.json();
    } catch (error: any) {
      console.error("Create session error:", error);
      return {
        success: false,
        error: error.message || "Failed to create session",
      };
    }
  }
}

// Export singleton instance
export const chatService = new ChatService();
