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

      // Construct the correct ROOK API endpoint
      // Skip redirect_url for now since Postman test worked without it
      const url = `${this.config.baseUrl}/api/v1/user_id/${userId}/data_source/${dataSource}/authorizer`;
      console.log(`🌐 Full URL: ${url}`);

      // Create Basic Auth header (client_uuid:secret_key)
      const credentials = `${this.config.clientUUID}:${this.config.secretKey}`;
      const basicAuth = btoa(credentials); // Base64 encode
      console.log(
        `� Basic Auth created (credentials length: ${credentials.length})`,
      );

      const headers = {
        "User-Agent": "H2Oasis/1.0.0", // MANDATORY for WAF
        Authorization: `Basic ${basicAuth}`, // Correct format
        "Content-Type": "application/json",
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
        throw new Error(`${dataSource} is already connected to your account`);
      }

      // Check if authorization URL is provided
      if (!data.authorization_url) {
        throw new Error(`No authorization URL provided for ${dataSource}`);
      }

      return {
        authorizationURL: data.authorization_url,
        redirectURL: "", // Empty for now since we're not using custom redirect
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

        // Show user instructions
        Alert.alert(
          `Connect ${wearableName}`,
          `Please complete the authorization in your browser. You'll be redirected back to the app when done.`,
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
   * Step 5: Sync Data (Optional)
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
