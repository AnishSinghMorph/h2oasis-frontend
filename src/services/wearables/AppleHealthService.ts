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

  async connect(firebaseUID: string): Promise<WearableIntegrationResult> {
    try {
      console.log("🍎 Starting Apple Health connection...");

      if (!firebaseUID) {
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

      // Step 2: Configure user
      console.log("👤 Configuring user with ROOK...");
      const userSuccess = await this.rookHealth.configureUser(firebaseUID);

      if (!userSuccess) {
        return {
          success: false,
          error: "Failed to configure user profile with ROOK.",
        };
      }

      // Step 3: Sync initial data
      console.log("🔄 Syncing initial health data...");
      const syncResult = await this.rookHealth.syncTodayData();

      console.log("✅ Apple Health connection completed!");

      return {
        success: true,
        data: syncResult,
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
}
