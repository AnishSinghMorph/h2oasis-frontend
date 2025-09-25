import API_CONFIG from "../config/api";

export interface UnifiedHealthData {
  userId: string;
  profile: {
    name?: string;
    email?: string;
    uid: string;
  };
  selectedProduct: {
    id: string;
    name: string;
    type: string;
    selectedAt: string;
  } | null;
  wearableConnections: {
    apple?: boolean;
    garmin?: boolean;
    fitbit?: boolean;
    whoop?: boolean;
    oura?: boolean;
  };
  healthData: {
    calories: {
      active: number;
      basal: number;
      total: number;
      lastUpdated: string;
    };
    bodyMetrics: {
      weight?: number;
      height?: number;
      bmi?: number;
      bodyFat?: number;
      lastUpdated?: string;
    } | null;
    sleep: {
      duration?: number;
      quality?: number;
      deepSleep?: number;
      remSleep?: number;
      lastUpdated?: string;
    } | null;
    activity: {
      steps?: number;
      distance?: number;
      activeMinutes?: number;
      workouts?: Array<{
        type: string;
        duration: number;
        calories: number;
        startTime: string;
      }>;
      lastUpdated?: string;
    } | null;
  };
  preferences: {
    voiceId?: string;
    voiceName?: string;
    units: "metric" | "imperial";
    timezone: string;
  };
  lastSync: string;
  dataQuality: {
    completeness: number;
    sources: string[];
    gaps: string[];
  };
}

export interface HealthDataPreferences {
  voiceId?: string;
  voiceName?: string;
  units?: "metric" | "imperial";
  timezone?: string;
}

class HealthDataService {
  private static instance: HealthDataService;

  static getInstance(): HealthDataService {
    if (!HealthDataService.instance) {
      HealthDataService.instance = new HealthDataService();
    }
    return HealthDataService.instance;
  }

  /**
   * Get unified health data for the authenticated user
   */
  async getUnifiedHealthData(firebaseUID: string): Promise<UnifiedHealthData> {
    console.log("📊 Fetching unified health data for user:", firebaseUID);

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/health-data`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-firebase-uid": firebaseUID,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch health data");
      }

      if (!data.success) {
        throw new Error(data.error || "API request unsuccessful");
      }

      console.log("✅ Unified health data fetched successfully");
      return data.data;
    } catch (error) {
      console.error("❌ Error fetching unified health data:", error);
      throw error;
    }
  }

  /**
   * Update user health data preferences
   */
  async updatePreferences(
    firebaseUID: string,
    preferences: HealthDataPreferences,
  ): Promise<void> {
    console.log("⚙️ Updating health data preferences");

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/health-data/preferences`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-firebase-uid": firebaseUID,
          },
          body: JSON.stringify(preferences),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update preferences");
      }

      if (!data.success) {
        throw new Error(data.error || "API request unsuccessful");
      }

      console.log("✅ Health data preferences updated successfully");
    } catch (error) {
      console.error("❌ Error updating preferences:", error);
      throw error;
    }
  }

  /**
   * Format health data for AI consumption
   */
  formatForAI(healthData: UnifiedHealthData): string {
    const sections = [];

    // User Profile
    if (healthData.profile.name) {
      sections.push(`User: ${healthData.profile.name}`);
    }

    // Selected Product Context
    if (healthData.selectedProduct) {
      sections.push(
        `Recovery Product: ${healthData.selectedProduct.name} (${healthData.selectedProduct.type})`,
      );
    }

    // Connected Wearables
    const connectedWearables = healthData.wearableConnections
      ? Object.entries(healthData.wearableConnections)
          .filter(([_, connected]) => connected)
          .map(([device, _]) => device)
      : [];

    if (connectedWearables.length > 0) {
      sections.push(`Connected Devices: ${connectedWearables.join(", ")}`);
    }

    // Health Metrics
    if (healthData.healthData) {
      const { calories, bodyMetrics, sleep, activity } = healthData.healthData;

      if (calories) {
        sections.push(
          `Calories Today: ${calories.total || 0} total (${calories.active || 0} active, ${calories.basal || 0} basal)`,
        );
      }

      if (bodyMetrics) {
        const metrics = [];
        if (bodyMetrics.weight) metrics.push(`Weight: ${bodyMetrics.weight}kg`);
        if (bodyMetrics.bmi) metrics.push(`BMI: ${bodyMetrics.bmi}`);
        if (bodyMetrics.bodyFat)
          metrics.push(`Body Fat: ${bodyMetrics.bodyFat}%`);
        if (metrics.length > 0) {
          sections.push(`Body Metrics: ${metrics.join(", ")}`);
        }
      }

      if (sleep) {
        const sleepData = [];
        if (sleep.duration)
          sleepData.push(`Duration: ${Math.round(sleep.duration / 60)}h`);
        if (sleep.quality) sleepData.push(`Quality: ${sleep.quality}%`);
        if (sleepData.length > 0) {
          sections.push(`Sleep: ${sleepData.join(", ")}`);
        }
      }

      if (activity) {
        const activityData = [];
        if (activity.steps) activityData.push(`Steps: ${activity.steps}`);
        if (activity.distance)
          activityData.push(`Distance: ${activity.distance}km`);
        if (activity.activeMinutes)
          activityData.push(`Active: ${activity.activeMinutes}min`);
        if (activityData.length > 0) {
          sections.push(`Activity: ${activityData.join(", ")}`);
        }
      }
    }

    // Data Quality
    if (healthData.dataQuality) {
      sections.push(
        `Data Quality: ${healthData.dataQuality.completeness || 0}% complete from ${healthData.dataQuality.sources?.join(", ") || "no sources"}`,
      );
    }

    return sections.join("\n");
  }

  /**
   * Get health data summary for quick display
   */
  getHealthSummary(healthData: UnifiedHealthData): {
    calories: number;
    connectedDevices: number;
    dataQuality: number;
    lastSync: string;
  } {
    const connectedDevices = Object.values(
      healthData.wearableConnections,
    ).filter((connected) => connected).length;

    return {
      calories: healthData.healthData.calories.total,
      connectedDevices,
      dataQuality: healthData.dataQuality.completeness,
      lastSync: healthData.lastSync,
    };
  }
}

export default HealthDataService.getInstance();
