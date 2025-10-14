import { useRookHealth } from "../../hooks/useRookHealth";

export interface WearableIntegrationResult {
  success: boolean;
  data?: any;
  error?: string;
  nextScreen?: string;
}

export class AppleHealthService {
  private rookHealth: ReturnType<typeof useRookHealth>;

  constructor(rookHealth: ReturnType<typeof useRookHealth>) {
    this.rookHealth = rookHealth;
  }

  async connect(userId: string): Promise<WearableIntegrationResult> {
    try {
      console.log("🍎 Starting Apple Health connection...");

      if (!userId) {
        return {
          success: false,
          error: "Authentication required",
        };
      }

      // Step 1: Request permissions
      console.log("📋 Requesting Apple Health permissions...");
      const permissionsSuccess =
        await this.rookHealth.requestHealthPermissions();

      if (!permissionsSuccess) {
        return {
          success: false,
          error:
            "Health permissions denied. Please grant permissions and try again.",
        };
      }

      // Step 2: Configure user with MongoDB ID for consistency
      console.log("👤 Configuring user with ROOK using MongoDB ID...");
      const userSuccess = await this.rookHealth.configureUser(userId);

      if (!userSuccess) {
        return {
          success: false,
          error: "Failed to configure user profile with ROOK.",
        };
      }

      console.log("✅ Apple Health connection completed!");
      console.log("🍎 Health data will be synced automatically via webhooks");

      return {
        success: true,
        data: {
          connected: true,
          type: "apple_health",
          dataSource: "apple",
          timestamp: new Date().toISOString(),
        },
        nextScreen: "AIAssistant",
      };
    } catch (error) {
      console.error("❌ Apple Health connection failed:", error);
      return {
        success: false,
        error: "Unable to connect to Apple Health. Please try again.",
      };
    }
  }

  isReady(): boolean {
    return this.rookHealth.rookReady;
  }

  getConnectionStatus() {
    return {
      isSetupComplete: this.rookHealth.isSetupComplete,
      permissionsGranted: this.rookHealth.permissionsGranted,
      userConfigured: this.rookHealth.userConfigured,
    };
  }

  /**
   * Test Apple Health data - get what data is available
   */
  async testAppleHealthData(): Promise<any> {
    try {
      console.log("🧪 Testing Apple Health data...");

      if (!this.rookHealth.isSetupComplete) {
        console.log("❌ Apple Health is not set up yet");
        return null;
      }

      // Get today's data
      console.log("📊 Getting today's health data...");
      const todayData = await this.rookHealth.syncTodayData();

      console.log("🍎 === APPLE HEALTH DATA TEST RESULTS ===");
      console.log("Today's Calories:", todayData?.calories || 0);
      console.log("Body Metrics Available:", todayData?.bodyMetrics || false);
      console.log("Training Data Available:", todayData?.training || false);
      console.log("Summary:", todayData?.summary || "No data");
      console.log("Has Any Data:", todayData?.hasAnyData || false);

      return {
        type: "apple_health",
        todayData: todayData,
        connectionStatus: this.getConnectionStatus(),
        message: "Apple Health data retrieved successfully",
      };
    } catch (error) {
      console.error("❌ Apple Health data test failed:", error);
      return {
        type: "apple_health",
        error: error instanceof Error ? error.message : String(error),
        connectionStatus: this.getConnectionStatus(),
        message: "Failed to retrieve Apple Health data",
      };
    }
  }
}
