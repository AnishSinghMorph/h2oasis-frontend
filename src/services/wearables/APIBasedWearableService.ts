import { WearableIntegrationResult } from "./AppleHealthService";

export interface APIWearableConfig {
  baseUrl: string;
  clientId: string;
  redirectUri: string;
  scopes: string[];
  isSandbox: boolean;
}

export class APIBasedWearableService {
  private config: APIWearableConfig;

  constructor(config: APIWearableConfig) {
    this.config = config;
  }

  /**
   * Initiate OAuth flow for API-based wearables (Garmin, Fitbit, Whoop)
   * This follows ROOK's authorizer endpoint pattern
   */
  async connect(
    wearableType: "garmin" | "fitbit" | "whoop" | "oura" | "polar",
    userId: string,
  ): Promise<WearableIntegrationResult> {
    try {
      console.log(`🔗 Starting ${wearableType} connection for user: ${userId}`);

      // For sandbox testing, we'll use ROOK's authorizer endpoint
      const authorizerUrl = this.buildAuthorizerUrl(wearableType, userId);

      console.log(`📱 Opening ${wearableType} authorization page...`);
      console.log(`🔗 Auth URL: ${authorizerUrl}`);

      // In a real implementation, you would:
      // 1. Open the authorizer URL in a WebView or browser
      // 2. Handle the redirect callback
      // 3. Extract the authorization code
      // 4. Exchange for access token via ROOK API

      // For now, return a placeholder response
      return {
        success: false,
        error: `${wearableType} integration is in development. This will open a secure authorization page.`,
        data: {
          authUrl: authorizerUrl,
          requiresWebView: true,
        },
      };
    } catch (error) {
      console.error(`❌ ${wearableType} connection failed:`, error);
      return {
        success: false,
        error: `Failed to connect to ${wearableType}. Please try again.`,
      };
    }
  }

  /**
   * Build ROOK authorizer URL for API-based wearables
   * Based on ROOK documentation: /api/v1/user_id/{user_id}/data_source/{data_source}/authorizer
   */
  private buildAuthorizerUrl(dataSource: string, userId: string): string {
    const baseUrl = this.config.isSandbox
      ? "https://sandbox-api.tryrook.io"
      : "https://api.tryrook.io";

    // Clean user ID (ROOK requirement: lowercase alphanumeric, 3+ chars)
    const cleanUserId = userId.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

    const authUrl = `${baseUrl}/api/v1/user_id/${cleanUserId}/data_source/${dataSource}/authorizer`;

    // Add required query parameters
    const params = new URLSearchParams({
      client_uuid: this.config.clientId,
      redirect_uri: this.config.redirectUri,
    });

    return `${authUrl}?${params.toString()}`;
  }

  /**
   * Handle OAuth callback and complete the connection
   */
  async handleCallback(
    callbackUrl: string,
    wearableType: string,
  ): Promise<WearableIntegrationResult> {
    try {
      // Parse callback URL for authorization code or error
      const url = new URL(callbackUrl);
      const code = url.searchParams.get("code");
      const error = url.searchParams.get("error");

      if (error) {
        return {
          success: false,
          error: `Authorization failed: ${error}`,
        };
      }

      if (!code) {
        return {
          success: false,
          error: "No authorization code received",
        };
      }

      // In a real implementation, you would exchange the code for tokens
      // via ROOK's API endpoints

      console.log(`✅ ${wearableType} authorization successful!`);

      return {
        success: true,
        data: { authorizationCode: code },
        nextScreen: "AIAssistant",
      };
    } catch (error) {
      console.error(`❌ ${wearableType} callback handling failed:`, error);
      return {
        success: false,
        error: "Failed to complete authorization",
      };
    }
  }

  /**
   * Check if the wearable service is properly configured
   */
  isConfigured(): boolean {
    return !!(
      this.config.clientId &&
      this.config.redirectUri &&
      this.config.baseUrl
    );
  }
}
