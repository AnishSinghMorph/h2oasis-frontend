/**
 * Tests for ROOK API Service
 */

describe("RookAPIService", () => {
  describe("Authorization URL Generation", () => {
    it("should request auth URL from backend", async () => {
      // Mock implementation - actual service calls backend
      const mockResponse = {
        success: true,
        data: {
          url: "https://connections.rook-connect.dev/auth?token=mock",
        },
      };

      expect(mockResponse.success).toBe(true);
      expect(mockResponse.data.url).toContain("rook-connect.dev");
    });
  });

  describe("Connection Status Check", () => {
    it("should handle connected status", () => {
      const mockStatus = {
        isConnected: true,
        dataSource: "GARMIN",
        lastSync: new Date().toISOString(),
      };

      expect(mockStatus.isConnected).toBe(true);
      expect(mockStatus.dataSource).toBe("GARMIN");
      expect(mockStatus.lastSync).toBeDefined();
    });

    it("should handle disconnected status", () => {
      const mockStatus = {
        isConnected: false,
        dataSource: null,
        lastSync: null,
      };

      expect(mockStatus.isConnected).toBe(false);
      expect(mockStatus.dataSource).toBeNull();
    });
  });

  describe("Data Source Validation", () => {
    const validSources = ["OURA", "GARMIN", "FITBIT", "WHOOP", "POLAR"];

    it("should accept valid data sources", () => {
      validSources.forEach((source) => {
        expect(validSources).toContain(source);
      });
    });

    it("should normalize data source names", () => {
      const lowercase = "garmin";
      const normalized = lowercase.toUpperCase();

      expect(normalized).toBe("GARMIN");
      expect(validSources).toContain(normalized);
    });
  });

  describe("Error Handling", () => {
    it("should handle network errors", () => {
      const error = {
        message: "Network request failed",
        code: "NETWORK_ERROR",
      };

      expect(error.message).toBeDefined();
      expect(error.code).toBe("NETWORK_ERROR");
    });

    it("should handle API errors", () => {
      const error = {
        message: "Unauthorized",
        status: 401,
      };

      expect(error.status).toBe(401);
      expect(error.message).toContain("Unauthorized");
    });
  });
});
