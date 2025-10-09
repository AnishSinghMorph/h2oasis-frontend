import { Alert, Linking } from "react-native";
import API_CONFIG from "../../config/api";

interface RookConfig {
  clientUUID: string;
  baseUrl: string;
  isSandbox: boolean;
  // secretKey removed - handled securely on backend
}

interface AuthorizerResponse {
  authorizationURL: string;
  redirectURL: string;
  isAlreadyConnected?: boolean;
}

export class RookAPIService {
  private config: RookConfig;

  constructor(config: RookConfig) {
    this.config = config;
  }

  /**
   * Step 1: Get Authorization URL from Backend (Secure)
   * This calls our backend API which handles ROOK OAuth securely
   */
  async getAuthorizationURL(
    userId: string,
    dataSource: string,
  ): Promise<AuthorizerResponse> {
    try {
      console.log(`🔐 Requesting auth URL from backend for ${dataSource}...`);

      // Call our backend endpoint instead of ROOK directly
      const url = `${API_CONFIG.BASE_URL}/api/health-data/rook-auth-url`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-firebase-uid": userId, // Firebase auth
        },
        body: JSON.stringify({
          mongoUserId: userId, // You may need to pass the actual MongoDB user ID
          dataSource: dataSource,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`🚫 Backend Error: ${errorText}`);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log(`📋 Backend Response:`, JSON.stringify(result, null, 2));

      if (!result.success) {
        throw new Error(result.error || "Failed to get authorization URL");
      }

      // Check if already authorized
      if (result.data.isAlreadyConnected) {
        return {
          authorizationURL: "",
          redirectURL: "",
          isAlreadyConnected: true,
        };
      }

      return {
        authorizationURL: result.data.authorizationURL,
        redirectURL: "",
        isAlreadyConnected: false,
      };
    } catch (error) {
      console.error(
        `❌ Failed to get authorization URL for ${dataSource}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Step 2: Open OAuth Flow
   * Opens the wearable's OAuth page in the device browser
   */
  async openOAuthFlow(
    authorizationURL: string,
    wearableName: string,
  ): Promise<void> {
    try {
      console.log(`🌐 Opening OAuth flow for ${wearableName}...`);

      const canOpen = await Linking.canOpenURL(authorizationURL);

      if (canOpen) {
        await Linking.openURL(authorizationURL);
        console.log(`✅ OAuth browser opened successfully for ${wearableName}`);
        // No alert needed - polling will start when user returns to app
      } else {
        throw new Error("Cannot open authorization URL");
      }
    } catch (error) {
      console.error(`❌ Failed to open OAuth flow for ${wearableName}:`, error);
      throw error;
    }
  }

  /**
   * Step 3: Check Connection Status (via Backend with Auto-Sync)
   * Syncs from ROOK first, then checks database for connection status
   */
  async checkConnectionStatus(
    userId: string,
    dataSource: string,
  ): Promise<boolean> {
    try {
      console.log(`🔍 Checking ${dataSource} connection status via backend...`);

      // First, sync connections from ROOK to update database
      console.log(`🔄 Syncing ROOK connections to database...`);
      const syncUrl = `${API_CONFIG.BASE_URL}/api/health-data/sync-rook`;

      await fetch(syncUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-firebase-uid": userId,
        },
        body: JSON.stringify({
          mongoUserId: userId,
        }),
      });

      // Then check connection status from database
      const url = `${API_CONFIG.BASE_URL}/api/health-data/wearable-connections`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-firebase-uid": userId,
        },
      });

      if (!response.ok) {
        return false;
      }

      const result = await response.json();

      // Map data source to wearable name
      const wearableMap: { [key: string]: string } = {
        oura: "oura",
        garmin: "garmin",
        fitbit: "fitbit",
        whoop: "whoop",
        polar: "polar",
      };

      const wearableName = wearableMap[dataSource];
      const isConnected = result.data?.[wearableName]?.connected || false;

      console.log(
        `${isConnected ? "✅" : "❌"} ${dataSource} connection status: ${isConnected}`,
      );
      return isConnected;
    } catch (error) {
      console.error(
        `❌ Failed to check connection status for ${dataSource}:`,
        error,
      );
      return false;
    }
  }

  /**
   * Step 4: Check All Connections
   * Get authorization status for all data sources
   */
  async checkAllConnections(
    userId: string,
    dataSources: string[],
  ): Promise<Record<string, boolean>> {
    try {
      const connectionStatuses: Record<string, boolean> = {};

      // Check each data source
      for (const dataSource of dataSources) {
        connectionStatuses[dataSource] = await this.checkConnectionStatus(
          userId,
          dataSource,
        );
      }

      return connectionStatuses;
    } catch (error) {
      console.error(`❌ Failed to check all connections:`, error);
      return {};
    }
  }

  /**
   * Step 5: Get Health Data from Backend (Secure)
   * Fetches actual health data via backend API
   */
  async getHealthData(
    userId: string,
    dataSource: string,
    _dataType: "sleep" | "activity" | "body" | "nutrition",
    date: string = new Date().toISOString().split("T")[0], // Default to today
  ): Promise<any> {
    try {
      console.log(
        `📊 Getting health data from ${dataSource} via backend for ${date}...`,
      );

      // Call backend fetch-rook-data endpoint
      const url = `${API_CONFIG.BASE_URL}/api/health-data/fetch-rook-data`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-firebase-uid": userId,
        },
        body: JSON.stringify({
          mongoUserId: userId,
          dataSource: dataSource,
          date: date,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`🚫 Backend Error: ${errorText}`);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch health data");
      }

      return result.data;
    } catch (error) {
      console.error(`❌ Failed to get health data from ${dataSource}:`, error);
      throw error;
    }
  }

  /**
   * Get All Available Data Types
   * Fetches all available data for testing
   */
  async getAllHealthData(
    userId: string,
    dataSource: string,
    date: string = new Date().toISOString().split("T")[0],
  ): Promise<Record<string, any>> {
    try {
      const dataTypes = ["sleep", "activity", "body", "nutrition"] as const;
      const allData: Record<string, any> = {};

      for (const dataType of dataTypes) {
        try {
          allData[dataType] = await this.getHealthData(
            userId,
            dataSource,
            dataType,
            date,
          );
        } catch (error) {
          console.warn(
            `⚠️ No ${dataType} data available for ${dataSource}:`,
            error,
          );
          allData[dataType] = null;
        }
      }

      return allData;
    } catch (error) {
      console.error(`❌ Failed to get all health data:`, error);
      throw error;
    }
  }

  /**
   * Step 6: Sync Data (Optional)
   * Note: ROOK typically delivers data via webhooks automatically after authorization
   * This method is kept for future use if manual sync endpoints become available
   */
  async syncData(
    userId: string,
    dataSource: string,
    _date?: string,
  ): Promise<void> {
    try {
      console.log(
        `ℹ️ Data sync for ${dataSource} - ROOK delivers data via webhooks automatically`,
      );
      console.log(
        `� Manual sync not implemented - data will be delivered via configured webhooks`,
      );

      // ROOK delivers data automatically via webhooks after successful authorization
      // Manual sync endpoints are not part of the standard ROOK API
      // Data will be available through the configured webhook endpoints
    } catch (error) {
      console.error(`❌ Sync info message failed for ${dataSource}:`, error);
      // Don't throw here - this is just informational
    }
  }
}
