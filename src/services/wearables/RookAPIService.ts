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
      console.log(`🔗 Getting authorization URL for ${dataSource}...`);
      console.log(`📍 Base URL: ${this.config.baseUrl}`);
      console.log(`👤 User ID: ${userId}`);
      console.log(`🔑 Client UUID: ${this.config.clientUUID}`);

      // Get redirect URI - use HTTP endpoint that will redirect to deep link
      const httpRedirectUri = "http://localhost:3000/oauth/wearable/callback";
      console.log(`🔗 HTTP Redirect URI: ${httpRedirectUri}`);

      // Construct the correct ROOK API endpoint with HTTP redirect URL
      // Temporarily try without redirect_url to test API access
      const url = `${this.config.baseUrl}/api/v1/user_id/${userId}/data_source/${dataSource}/authorizer`;
      console.log(`🌐 Full URL: ${url}`);

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
      console.log(`📦 Headers:`, headers);

      // Use GET method (not POST)
      const response = await fetch(url, {
        method: "GET", // Changed from POST to GET
        headers,
        // No body for GET request
      });

      console.log(
        `📡 Response status: ${response.status} ${response.statusText}`,
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`🚫 API Error Response: ${errorText}`);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log(`✅ Authorization URL received for ${dataSource}:`, data);

      // Check if already authorized
      if (data.authorized === true) {
        console.log(`✅ ${dataSource} is already connected!`);
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
        console.log(`✅ OAuth flow opened for ${wearableName}`);

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
      console.log(`🔍 Checking connection status for ${dataSource}...`);

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
        console.log(`⚠️ Failed to check connection status for ${dataSource}`);
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
      console.log(`🔍 Checking all connections for user: ${userId}`);

      const connectionStatuses: Record<string, boolean> = {};

      // Check each data source
      for (const dataSource of dataSources) {
        connectionStatuses[dataSource] = await this.checkConnectionStatus(
          userId,
          dataSource,
        );
      }

      console.log(`📊 Connection summary:`, connectionStatuses);
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

      console.log(`🌐 Data URL: ${url}`);

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
      console.log(`✅ ${dataType} data received from ${dataSource}:`, data);
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
      console.log(`📈 Getting all health data from ${dataSource}...`);

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
