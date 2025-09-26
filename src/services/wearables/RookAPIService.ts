import { Alert, Linking } from "react-native";

interface RookConfig {
  clientUUID: string;
  secretKey: string;
  baseUrl: string;
  isSandbox: boolean;
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
   * Step 1: Get Authorization URL from ROOK
   * This creates the OAuth URL that users will visit to connect their wearable
   */
  async getAuthorizationURL(
    userId: string,
    dataSource: string,
  ): Promise<AuthorizerResponse> {
    try {
      // Use redirect URL for OAuth callback (from environment or ngrok)
      const redirectUri =
        process.env.EXPO_PUBLIC_OAUTH_REDIRECT_URL ||
        "https://preoccupiedly-nonmicrobic-reta.ngrok-free.dev/oauth/wearable/callback";
      const url = `${this.config.baseUrl}/api/v1/user_id/${userId}/data_source/${dataSource}/authorizer?redirect_url=${encodeURIComponent(redirectUri)}`;

      // Create Basic Auth header (client_uuid:secret_key)
      const credentials = `${this.config.clientUUID}:${this.config.secretKey}`;
      const basicAuth = btoa(credentials); // Base64 encode
      console.log(
        `🔐 Basic Auth created (credentials length: ${credentials.length})`,
      );

      const headers = {
        "User-Agent": "H2Oasis/1.0.0", // MANDATORY for WAF
        Authorization: `Basic ${basicAuth}`, // Correct format
        Accept: "application/json", // Change from Content-Type to Accept
      };

      // Use GET method (not POST)
      const response = await fetch(url, {
        method: "GET", // Changed from POST to GET
        headers,
        // No body for GET request
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`🚫 API Error Response: ${errorText}`);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log(
        `📋 ROOK API Response for ${dataSource}:`,
        JSON.stringify(data, null, 2),
      );

      // Check if already authorized
      if (data.authorized === true) {
        return {
          authorizationURL: "", // No URL needed
          redirectURL: "",
          isAlreadyConnected: true,
        };
      }

      // Check if authorization URL is provided
      if (!data.authorization_url) {
        throw new Error(`No authorization URL provided for ${dataSource}`);
      }

      return {
        authorizationURL: data.authorization_url,
        redirectURL: "", // Empty for now until we fix the redirect
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

        // Show user instructions - no error handling for user cancellation
        Alert.alert(
          `Connect ${wearableName}`,
          `Please complete the authorization in your browser. Use the "Check Connections" button below to verify your connection status.`,
          [{ text: "OK" }],
        );
      } else {
        throw new Error("Cannot open authorization URL");
      }
    } catch (error) {
      console.error(`❌ Failed to open OAuth flow for ${wearableName}:`, error);
      throw error;
    }
  }

  /**
   * Step 3: Check Connection Status
   * Verifies if the wearable is successfully connected
   */
  async checkConnectionStatus(
    userId: string,
    dataSource: string,
  ): Promise<boolean> {
    try {
      // Use the correct API endpoint for checking authorization status
      const url = `${this.config.baseUrl}/api/v1/user_id/${userId}/data_source/${dataSource}/authorizer`;

      // Create Basic Auth header
      const credentials = `${this.config.clientUUID}:${this.config.secretKey}`;
      const basicAuth = btoa(credentials);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "H2Oasis/1.0.0", // MANDATORY for WAF
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      const isConnected = data.authorized === true;

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
   * Step 5: Get Health Data from ROOK
   * Fetches actual health data for testing purposes
   */
  async getHealthData(
    userId: string,
    dataSource: string,
    dataType: "sleep" | "activity" | "body" | "nutrition",
    date: string = new Date().toISOString().split("T")[0], // Default to today
  ): Promise<any> {
    try {
      console.log(
        `📊 Getting ${dataType} data from ${dataSource} for ${date}...`,
      );

      // ROOK API v2 endpoint for getting processed data
      let url: string;

      if (dataType === "sleep") {
        url = `${this.config.baseUrl}/v2/processed_data/sleep_health/summary?user_id=${userId}&date=${date}`;
      } else if (dataType === "activity") {
        url = `${this.config.baseUrl}/v2/processed_data/physical_health/summary?user_id=${userId}&date=${date}`;
      } else if (dataType === "body") {
        url = `${this.config.baseUrl}/v2/processed_data/body_health/summary?user_id=${userId}&date=${date}`;
      } else if (dataType === "nutrition") {
        url = `${this.config.baseUrl}/v2/processed_data/body_health/events/nutrition?user_id=${userId}&date=${date}`;
      } else {
        throw new Error(`Unsupported data type: ${dataType}`);
      }

      // Create Basic Auth header
      const credentials = `${this.config.clientUUID}:${this.config.secretKey}`;
      const basicAuth = btoa(credentials);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "H2Oasis/1.0.0",
          Authorization: `Basic ${basicAuth}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`🚫 Data API Error: ${errorText}`);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error(
        `❌ Failed to get ${dataType} data from ${dataSource}:`,
        error,
      );
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
    date?: string,
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
