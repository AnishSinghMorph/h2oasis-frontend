import { Alert } from "react-native";
import { RookAPIService } from "./RookAPIService";
import type { WearableIntegrationResult } from "./AppleHealthService";

export interface APIWearableConfig {
  clientUUID: string;
  secretKey: string;
  baseUrl: string;
  isSandbox: boolean;
}

export class APIBasedWearableService {
  private rookAPI: RookAPIService;

  constructor(config: APIWearableConfig) {
    this.rookAPI = new RookAPIService(config);
  }

  /**
   * Get authorization URL for OAuth flow
   */
  async getAuthorizationUrl(
    dataSource: string,
    userId: string,
  ): Promise<{
    success: boolean;
    authorizationUrl?: string;
    error?: string;
  }> {
    try {
      console.log(`🔗 Getting authorization URL for ${dataSource}...`);

      const authData = await this.rookAPI.getAuthorizationURL(
        userId,
        dataSource,
      );

      return {
        success: true,
        authorizationUrl: authData.authorizationURL,
      };
    } catch (error) {
      console.error(
        `❌ Failed to get authorization URL for ${dataSource}:`,
        error,
      );
      return {
        success: false,
        error: `Failed to get authorization URL: ${error}`,
      };
    }
  }

  /**
   * Complete OAuth connection with authorization code
   */
  async completeConnection(
    dataSource: string,
    userId: string,
    authCode: string,
    state: string,
  ): Promise<WearableIntegrationResult> {
    try {
      console.log(`✅ Completing ${dataSource} connection...`);

      // TODO: Call ROOK API to complete OAuth with auth code
      // This would typically involve exchanging the auth code for tokens

      return {
        success: true,
        error: undefined,
        nextScreen: "ConnectWearable",
        data: {
          dataSource,
          connected: true,
          authCode,
          state,
        },
      };
    } catch (error) {
      console.error(`❌ Failed to complete ${dataSource} connection:`, error);
      return {
        success: false,
        error: `Failed to complete connection: ${error}`,
        nextScreen: "ConnectWearable",
      };
    }
  }

  async connect(
    dataSource: string,
    wearableName: string,
    userId: string,
  ): Promise<WearableIntegrationResult> {
    try {
      console.log(`🔗 Starting ${wearableName} connection process...`);

      // Step 1: Get authorization URL from ROOK
      const authData = await this.rookAPI.getAuthorizationURL(
        userId,
        dataSource,
      );

      // Check if already connected
      if (authData.isAlreadyConnected) {
        console.log(`✅ ${wearableName} is already connected!`);
        Alert.alert(
          `${wearableName} Connected`,
          `Your ${wearableName} account is already connected and syncing data.`,
          [{ text: "OK" }],
        );

        return {
          success: true,
          error: undefined,
          nextScreen: "ConnectWearable",
          data: {
            dataSource,
            isConnected: true,
            connectionStatus: "connected",
          },
        };
      }

      // Step 2: Open OAuth flow in browser
      await this.rookAPI.openOAuthFlow(authData.authorizationURL, wearableName);

      // Step 3: Wait for user to complete OAuth and return to app
      console.log(`⏳ Waiting for ${wearableName} OAuth completion...`);

      return {
        success: true,
        error: undefined,
        nextScreen: "ConnectWearable", // Stay on same screen to show status
        data: {
          dataSource,
          authorizationURL: authData.authorizationURL,
          redirectURL: authData.redirectURL,
        },
      };
    } catch (error) {
      console.error(`❌ ${wearableName} connection failed:`, error);

      let errorMessage = `Failed to connect ${wearableName}`;
      if (error instanceof Error) {
        // Handle already connected case specially
        if (error.message.includes("already connected")) {
          console.log(
            `✅ ${wearableName} is already connected - showing success message`,
          );
          Alert.alert(
            `${wearableName} Already Connected`,
            `Your ${wearableName} account is already connected and syncing data.`,
            [{ text: "OK" }],
          );

          return {
            success: true,
            error: undefined,
            nextScreen: "ConnectWearable",
          };
        }

        errorMessage += `: ${error.message}`;
      }

      Alert.alert("Connection Error", errorMessage);

      return {
        success: false,
        error: errorMessage,
        nextScreen: "ConnectWearable",
      };
    }
  }

  /**
   * Verify connection after OAuth callback
   */
  async verifyConnection(
    dataSource: string,
    wearableName: string,
    userId: string,
  ): Promise<WearableIntegrationResult> {
    try {
      console.log(`🔍 Verifying ${wearableName} connection...`);

      // Check if connection was successful
      const isConnected = await this.rookAPI.checkConnectionStatus(
        userId,
        dataSource,
      );

      if (isConnected) {
        console.log(`✅ ${wearableName} connected successfully!`);

        // Optional: Trigger initial data sync
        try {
          await this.rookAPI.syncData(userId, dataSource);
        } catch (syncError) {
          console.log(`⚠️ Initial sync failed, but connection is valid`);
        }

        Alert.alert(
          "Success!",
          `${wearableName} has been connected successfully.`,
          [{ text: "Continue", onPress: () => {} }],
        );

        return {
          success: true,
          error: undefined,
          nextScreen: "AIAssistant",
        };
      } else {
        console.log(`❌ ${wearableName} connection verification failed`);

        Alert.alert(
          "Connection Failed",
          `${wearableName} connection was not completed. Please try again.`,
          [{ text: "OK" }],
        );

        return {
          success: false,
          error: `${wearableName} connection failed`,
          nextScreen: "ConnectWearable",
        };
      }
    } catch (error) {
      console.error(`❌ ${wearableName} verification failed:`, error);

      return {
        success: false,
        error: `Failed to verify ${wearableName} connection`,
        nextScreen: "ConnectWearable",
      };
    }
  }

  /**
   * Check all API wearable connections for a user
   */
  async checkAllConnections(
    userId: string,
    dataSources: string[],
  ): Promise<Record<string, boolean>> {
    return await this.rookAPI.checkAllConnections(userId, dataSources);
  }

  /**
   * Check single connection status
   */
  async checkConnection(userId: string, dataSource: string): Promise<boolean> {
    return await this.rookAPI.checkConnectionStatus(userId, dataSource);
  }

  /**
   * Check if a wearable is connected for a user
   */
  async checkConnectionStatus(
    dataSource: string,
    userId: string,
  ): Promise<boolean> {
    try {
      return await this.rookAPI.checkConnectionStatus(userId, dataSource);
    } catch (error) {
      console.error(
        `❌ Failed to check connection status for ${dataSource}:`,
        error,
      );
      return false;
    }
  }

  /**
   * Get connection status for all wearables
   */
  async getAllConnectionStatuses(
    userId: string,
  ): Promise<Record<string, boolean>> {
    const dataSources = ["fitbit", "garmin", "whoop", "oura", "apple"];
    try {
      return await this.rookAPI.checkAllConnections(userId, dataSources);
    } catch (error) {
      console.error(`❌ Failed to check all connection statuses:`, error);
      return {};
    }
  }
}
