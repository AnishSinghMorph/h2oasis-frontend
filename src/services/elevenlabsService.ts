import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config/api";

interface AgentConfig {
  agentId: string;
  features?: {
    voiceChat: boolean;
    maxSessionDuration: number;
  };
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp?: number;
}

interface CachedConfig extends AgentConfig {
  cachedAt: number;
  expiresAt: number;
}

class ElevenLabsService {
  private static readonly CACHE_KEY = "elevenlabs_agent_config";
  private static readonly CACHE_DURATION = 60 * 60 * 1000;

  async getAgentConfig(): Promise<AgentConfig> {
    try {
      const cachedConfig = await this.getCachedConfig();
      if (cachedConfig) {
        console.log("Using cached agent config");
        return cachedConfig;
      }

      console.log("Fetching fresh agent config from API...");
      console.log("🌐 API_BASE_URL:", API_BASE_URL);
      const freshConfig = await this.fetchFromAPI();
      await this.cacheConfig(freshConfig);

      return freshConfig;
    } catch (error) {
      console.error("Error getting agent config:", error);

      const expiredCache = await this.getCachedConfig(true);
      if (expiredCache) {
        console.log("using expired cache as fallback");
        return expiredCache;
      }
      throw new Error("Voice chat service unavailable. Please try again.");
    }
  }

  private async getCachedConfig(
    allowExpired: boolean = false,
  ): Promise<AgentConfig | null> {
    try {
      const cached = await AsyncStorage.getItem(ElevenLabsService.CACHE_KEY);
      if (!cached) return null;

      const cachedConfig: CachedConfig = JSON.parse(cached);
      const now = Date.now();

      if (!allowExpired && now > cachedConfig.expiresAt) {
        console.log("Cached config expired, need fresh data");
        return null;
      }

      return {
        agentId: cachedConfig.agentId,
        features: cachedConfig.features,
      };
    } catch (error) {
      console.error("error reading cache", error);
      return null;
    }
  }

  private async fetchFromAPI(): Promise<AgentConfig> {
    let token = await AsyncStorage.getItem("authToken");

    // TEMPORARY: For testing without login, use a test header
    if (!token) {
      console.log("⚠️ No auth token found, using test mode for voice chat");
      // You can either:
      // 1. Use the backend test header (if configured)
      // 2. Or throw error to force login

      // Option 1: Test mode (temporary)
      token = "test-token-for-voice-chat";
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Use test header if we're in test mode, otherwise use proper auth
    if (token === "test-token-for-voice-chat") {
      headers["x-firebase-uid"] = "test-user-voice-chat";
    } else {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const url = `${API_BASE_URL}/api/elevenlabs/agent-config`;
    console.log("🔗 Calling URL:", url);
    console.log("📋 Headers:", headers);

    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const result: ApiResponse<AgentConfig> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || "Invalid API response");
    }

    return result.data;
  }

  private async cacheConfig(config: AgentConfig): Promise<void> {
    try {
      const now = Date.now();
      const cachedConfig: CachedConfig = {
        ...config,
        cachedAt: now,
        expiresAt: now + ElevenLabsService.CACHE_DURATION,
      };

      await AsyncStorage.setItem(
        ElevenLabsService.CACHE_KEY,
        JSON.stringify(cachedConfig),
      );

      console.log("💾 Agent config cached successfully");
    } catch (error) {
      console.error("❌ Error caching config:", error);
    }
  }

  async clearCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ElevenLabsService.CACHE_KEY);
      console.log("🗑️ Agent config cache cleared");
    } catch (error) {
      console.error("❌ Error clearing cache:", error);
    }
  }

  async getCacheInfo(): Promise<{
    cached: boolean;
    expiresAt?: number;
    cachedAt?: number;
  }> {
    try {
      const cached = await AsyncStorage.getItem(ElevenLabsService.CACHE_KEY);
      if (!cached) return { cached: false };

      const cachedConfig: CachedConfig = JSON.parse(cached);
      return {
        cached: true,
        expiresAt: cachedConfig.expiresAt,
        cachedAt: cachedConfig.cachedAt,
      };
    } catch (error) {
      return { cached: false };
    }
  }
}

export const elevenlabsService = new ElevenLabsService();
