import { useState, useEffect } from "react";
// Temporarily commented out for build - will re-enable with Samsung SDK
/*
import {
  useRookPermissions,
  useRookConfiguration,
  useRookSummaries,
  useRookEvents,
  useRookAppleHealth,
} from "react-native-rook-sdk";
*/

/**
 * Custom hook for ROOK health data integration
 * Handles permissions, user setup, and health data syncing to ROOK servers
 */
export const useRookHealth = () => {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [userConfigured, setUserConfigured] = useState(false);

  // Update setup complete status when permissions and user are ready
  useEffect(() => {
    const shouldBeSetupComplete = permissionsGranted && userConfigured;
    if (shouldBeSetupComplete !== isSetupComplete) {
      setIsSetupComplete(shouldBeSetupComplete);
    }
  }, [permissionsGranted, userConfigured, isSetupComplete]);

  // ROOK SDK hooks - temporarily commented out for build
  /*
  const {
    requestAllAppleHealthPermissions,
    appleHealthHasPermissions,
    ready: permissionsReady,
  } = useRookPermissions();

  const {
    updateUserID,
    getUserID,
    enableAppleHealthSync,
    syncUserTimeZone,
    ready: configReady,
  } = useRookConfiguration();

  const {
    syncBodySummary,
    syncSleepSummary,
    syncPhysicalSummary,
    reSyncFailedSummaries,
    ready: summariesReady,
  } = useRookSummaries();

  const {
    syncTodayCaloriesCount,
    syncBodyMetricsEvent,
    syncTrainingEvent,
    reSyncFailedEvents,
    ready: eventsReady,
  } = useRookEvents();

  const { enableBackGroundUpdates, ready: appleHealthReady } =
    useRookAppleHealth();

  // Overall ROOK readiness
  const rookReady =
    permissionsReady &&
    configReady &&
    summariesReady &&
    eventsReady &&
    appleHealthReady;
  */

  // Temporary mock values for build
  const requestAllAppleHealthPermissions = () => Promise.resolve("ALREADY_GRANTED");
  const appleHealthHasPermissions = () => Promise.resolve("PERMISSION_GRANTED");
  const updateUserID = (userId: string) => Promise.resolve(true);
  const getUserID = () => Promise.resolve(null);
  const enableAppleHealthSync = () => Promise.resolve();
  const syncUserTimeZone = () => Promise.resolve();
  const syncBodySummary = (date: string) => Promise.resolve(true);
  const syncSleepSummary = (date: string) => Promise.resolve(true);
  const syncPhysicalSummary = (date: string) => Promise.resolve(true);
  const reSyncFailedSummaries = () => Promise.resolve(true);
  const syncTodayCaloriesCount = () => Promise.resolve();
  const syncBodyMetricsEvent = (date: string) => Promise.resolve(true);
  const syncTrainingEvent = (date: string) => Promise.resolve(true);
  const reSyncFailedEvents = () => Promise.resolve(true);
  const enableBackGroundUpdates = () => Promise.resolve();
  const rookReady = false;

  /**
   * Request comprehensive health permissions from Apple Health
   */
  const requestHealthPermissions = async (): Promise<boolean> => {
    try {
      if (!rookReady) {
        console.error("❌ ROOK SDK not ready yet");
        return false;
      }

      console.log("🔒 Requesting comprehensive health permissions...");
      console.log("📱 This will show an iOS Health permissions dialog");
      console.log(
        "📋 Requesting permissions for: Activity, Steps, Heart Rate, Sleep, Body Measurements (Height, Weight), Calories, and more",
      );

      // Request all available Apple Health permissions (includes height, weight, BMI, body measurements)
      const result = await requestAllAppleHealthPermissions();
      console.log("🔒 Permission request result:", result);

      if (result === "ALREADY_GRANTED") {
        console.log("✅ Permissions were already granted");
        setPermissionsGranted(true);
        return true;
      } else if (result === "REQUEST_SENT") {
        console.log("📋 Permission dialog was shown to user");

        // Wait a moment for permissions to be processed
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Verify permissions were actually granted
        const verification = await checkCurrentPermissions();

        if (verification) {
          setPermissionsGranted(true);
          console.log("✅ Health permissions granted and verified");
          return true;
        } else {
          console.log("⚠️ Permissions request sent but not yet granted");
          console.log(
            "💡 Please check: 1) HealthKit capability in Xcode, 2) iOS Settings > Privacy & Security > Health",
          );
          return false;
        }
      } else {
        console.error("❌ Health permissions denied or failed:", result);
        console.log(
          "💡 Common issues: 1) Missing HealthKit capability in Xcode, 2) iOS Simulator limitations, 3) User denied permissions",
        );
        return false;
      }
    } catch (error) {
      console.error("❌ Error requesting permissions:", error);
      console.log(
        "💡 This usually means: 1) HealthKit capability missing in Xcode, 2) Invalid ROOK credentials, 3) SDK not properly initialized",
      );
      return false;
    }
  };

  /**
   * Configure user in ROOK system
   */
  const configureUser = async (userId: string): Promise<boolean> => {
    try {
      // Validate user ID format
      if (!userId || userId.length < 3) {
        console.error("❌ User ID must be at least 3 characters long");
        return false;
      }

      // Remove any special characters and make lowercase
      const cleanUserId = userId.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

      if (cleanUserId !== userId) {
        console.log(`🔧 Cleaned user ID from "${userId}" to "${cleanUserId}"`);
      }

      console.log("👤 Configuring user in ROOK:", cleanUserId);

      const result = await updateUserID(cleanUserId);

      if (result) {
        setUserConfigured(true);
        console.log("✅ User configured successfully");

        // Enable Apple Health sync
        try {
          await enableAppleHealthSync();
          console.log("✅ Apple Health sync enabled");
        } catch (syncError) {
          console.warn(
            "⚠️ Apple Health sync enable failed (this may be normal if permissions not fully granted):",
            syncError,
          );
        }

        // Sync user timezone
        try {
          await syncUserTimeZone();
          console.log("✅ User timezone synced");
        } catch (tzError) {
          console.warn("⚠️ Timezone sync failed:", tzError);
        }

        return true;
      } else {
        console.error("❌ Failed to configure user");
        return false;
      }
    } catch (error) {
      console.error("❌ Error configuring user:", error);

      // Parse ROOK API error for better user feedback
      if (error && typeof error === "object" && "message" in error) {
        const errorMessage = error.message as string;
        if (
          errorMessage.includes("user_id") &&
          errorMessage.includes("invalid")
        ) {
          console.log(
            "💡 User ID format issue. Try: lowercase alphanumeric only, 3+ characters",
          );
        }
      }

      return false;
    }
  };

  /**
   * Complete ROOK setup (permissions + user configuration)
   */
  const completeRookSetup = async (userId: string): Promise<boolean> => {
    try {
      console.log("🚀 Starting ROOK setup...");

      // Step 1: Request health permissions
      const permissionsGranted = await requestHealthPermissions();
      if (!permissionsGranted) {
        return false;
      }

      // Step 2: Configure user
      const userConfigured = await configureUser(userId);
      if (!userConfigured) {
        return false;
      }

      // Step 3: Enable background sync after everything is set up
      try {
        await enableBackGroundUpdates();
        console.log("✅ Background sync enabled after complete setup");
      } catch (bgError) {
        console.warn(
          "⚠️ Background sync setup warning (may be normal):",
          bgError,
        );
      }

      setIsSetupComplete(true);
      console.log("🎉 ROOK setup completed successfully!");
      return true;
    } catch (error) {
      console.error("❌ ROOK setup failed:", error);
      return false;
    }
  };

  /**
   * Sync health data for a specific date to ROOK servers
   * Uses summaries instead of events for better data coverage
   */
  const syncHealthData = async (date: string) => {
    try {
      console.log("📊 Syncing health summaries for:", date);

      const results = [];

      // Try body summary
      try {
        const bodySync = await syncBodySummary(date);
        console.log("📏 Body summary sync result:", bodySync);
        results.push(`Body Summary: ${bodySync ? "✅ Success" : "❌ No data"}`);
      } catch (bodyError) {
        console.warn("⚠️ Body summary sync failed:", bodyError);
        results.push("Body Summary: No data available");
      }

      // Try physical summary
      try {
        const physicalSync = await syncPhysicalSummary(date);
        console.log("🏃 Physical summary sync result:", physicalSync);
        results.push(
          `Physical Summary: ${physicalSync ? "✅ Success" : "❌ No data"}`,
        );
      } catch (physicalError) {
        console.warn("⚠️ Physical summary sync failed:", physicalError);
        results.push("Physical Summary: No data available");
      }

      // Try sleep summary
      try {
        const sleepSync = await syncSleepSummary(date);
        console.log("😴 Sleep summary sync result:", sleepSync);
        results.push(
          `Sleep Summary: ${sleepSync ? "✅ Success" : "❌ No data"}`,
        );
      } catch (sleepError) {
        console.warn("⚠️ Sleep summary sync failed:", sleepError);
        results.push("Sleep Summary: No data available");
      }

      console.log("📊 Health summary results:", results);

      return {
        body: results[0]?.includes("Success"),
        physical: results[1]?.includes("Success"),
        sleep: results[2]?.includes("Success"),
        summary: results.join("\n"),
        success: results.some((r) => r.includes("Success")),
      };
    } catch (error) {
      console.error("❌ Error syncing health data:", error);
      return {
        body: false,
        physical: false,
        sleep: false,
        summary: "Sync failed",
        success: false,
      };
    }
  };

  /**
   * Sync today's calories and events plus body measurements
   */
  const syncTodayData = async () => {
    try {
      console.log("📊 Syncing today's data...");

      const todayDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
      console.log("📅 Today's date:", todayDate);

      const results = [];
      let calories = 0;
      let bodyMetrics = false;
      let training = false;
      let bodyMeasurements = null;

      // Try calories with error handling
      try {
        const caloriesResult = await syncTodayCaloriesCount();
        console.log("🔥 Calories sync result:", caloriesResult);

        // Handle different return types from ROOK SDK
        if (typeof caloriesResult === "object" && caloriesResult !== null) {
          // If it's an object with basal/active properties
          const resultObj = caloriesResult as any;
          const totalCalories =
            (resultObj.basal || 0) + (resultObj.active || 0);
          calories = totalCalories;
          results.push(
            `Calories: ${resultObj.basal} basal + ${resultObj.active} active = ${totalCalories} total`,
          );
        } else if (typeof caloriesResult === "number") {
          // If it's a number
          calories = caloriesResult;
          results.push(`Calories: ${calories} kcal`);
        } else {
          results.push("Calories: No data available");
        }
      } catch (caloriesError) {
        console.warn("⚠️ Calories sync failed:", caloriesError);
        results.push("Calories: No data available");
      }

      // Try body summary and body metrics events for height, weight, etc.
      try {
        console.log("📏 Syncing body summary for measurements...");

        // First sync body summary - this uploads body data to ROOK servers
        const bodySummaryResult = await syncBodySummary(todayDate);
        console.log("📏 Body summary sync result:", bodySummaryResult);

        // Then try body metrics event sync - this handles individual body measurements
        console.log("📊 Syncing body metrics event...");
        bodyMetrics = await syncBodyMetricsEvent(todayDate);
        console.log("📊 Body metrics event result:", bodyMetrics);

        // Check if either method found body data
        const hasBodyData = bodySummaryResult || bodyMetrics;

        if (hasBodyData) {
          results.push("Body Metrics: ✅ Height, Weight, BMI available");
          bodyMeasurements = {
            hasData: true,
            message: "Body measurements synced from Health app",
            summary: bodySummaryResult,
            events: bodyMetrics,
          };
          // Update the bodyMetrics flag to show success
          bodyMetrics = true;
        } else {
          results.push("Body Metrics: No measurements found in Health app");
          console.log(
            "💡 To fix: Add height/weight data in Health app > Browse > Body Measurements",
          );
        }
      } catch (bodyError) {
        console.warn("⚠️ Body measurements sync failed:", bodyError);
        const errorMessage =
          bodyError instanceof Error ? bodyError.message : String(bodyError);

        if (errorMessage.toLowerCase().includes("no data")) {
          results.push("Body Metrics: No measurements in Health app");
          console.log(
            "💡 Add height and weight in Health app to enable body metrics",
          );
        } else {
          results.push("Body Metrics: Sync error occurred");
          console.error("Body metrics error details:", bodyError);
        }
      }

      // Try training with error handling
      try {
        training = await syncTrainingEvent(todayDate);
        console.log("🏃 Training sync result:", training);
        results.push(`Training: ${training ? "✅" : "No data"}`);
      } catch (trainingError) {
        console.warn("⚠️ Training sync failed:", trainingError);
        results.push("Training: No data available");
      }

      console.log("📊 Today sync results summary:", results);

      return {
        calories,
        bodyMetrics,
        bodyMeasurements,
        training,
        summary: results.join("\n"),
        hasAnyData: calories > 0 || bodyMetrics || training,
      };
    } catch (error) {
      console.error("❌ Error syncing today's data:", error);

      // Check if it's a "no data" error vs a real error
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (
        errorMessage.toLowerCase().includes("no data") ||
        errorMessage.toLowerCase().includes("denied")
      ) {
        console.log("💡 This is normal if:");
        console.log("   • You're using iOS Simulator (limited health data)");
        console.log("   • This is a new device with no health data yet");
        console.log("   • You need to walk around or use Health app first");
        return {
          calories: 0,
          bodyMetrics: false,
          bodyMeasurements: null,
          training: false,
          summary: "No health data available yet",
          hasAnyData: false,
        };
      }

      return null;
    }
  };

  /**
   * Re-sync any failed data uploads
   */
  const retryFailedSyncs = async () => {
    try {
      console.log("🔄 Retrying failed syncs...");

      const [summariesRetry, eventsRetry] = await Promise.all([
        reSyncFailedSummaries(),
        reSyncFailedEvents(),
      ]);

      console.log("🔄 Retry results:", {
        summaries: summariesRetry ? "✅" : "❌",
        events: eventsRetry ? "✅" : "❌",
      });

      return summariesRetry && eventsRetry;
    } catch (error) {
      console.error("❌ Error retrying failed syncs:", error);
      return false;
    }
  };

  /**
   * Check current permission status
   */
  const checkCurrentPermissions = async () => {
    if (!rookReady) {
      console.log("⏳ ROOK SDK not ready yet, skipping permission check");
      return false;
    }

    try {
      console.log("🔍 Checking current health permissions...");
      const hasPermissions = await appleHealthHasPermissions();
      console.log("🔍 Permission check result:", hasPermissions);

      const permissionGranted = hasPermissions === "PERMISSION_GRANTED";
      setPermissionsGranted(permissionGranted);

      if (permissionGranted) {
        console.log("✅ Health permissions are granted");
      } else {
        console.log(
          "❌ Health permissions not granted. Status:",
          hasPermissions,
        );
      }

      return permissionGranted;
    } catch (error) {
      console.error("❌ Error checking permissions:", error);
      console.log(
        "💡 This might indicate: 1) HealthKit capability missing, 2) ROOK SDK not properly initialized",
      );
      return false;
    }
  };

  // Check permissions and user status on hook initialization
  useEffect(() => {
    const checkInitialStatus = async () => {
      if (!rookReady) {
        console.log("⏳ ROOK SDK not ready yet, will check status later");
        return;
      }

      console.log("✅ ROOK SDK ready, checking initial status");
      await checkCurrentPermissions();

      try {
        const currentUser = await getUserID();
        // Handle empty user ID gracefully
        const hasValidUser = !!(
          currentUser &&
          typeof currentUser === 'string' &&
          currentUser.length > 0 &&
          currentUser !== ""
        );
        setUserConfigured(hasValidUser);
        console.log(
          "👤 Current user status:",
          hasValidUser ? "Configured" : "Not configured",
        );
      } catch (error) {
        // Don't log error for empty user ID - this is expected on first run
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        if (errorMessage.toLowerCase().includes("empty user id")) {
          console.log(
            "👤 No user configured yet (this is normal on first run)",
          );
          setUserConfigured(false);
        } else {
          console.error("Error checking user status:", error);
          setUserConfigured(false);
        }
      }
    };

    checkInitialStatus();
  }, [rookReady]); // Re-run when ROOK becomes ready

  /**
   * Sync available health data (simplified version)
   */
  const syncAdvancedHealthData = async () => {
    if (!rookReady) {
      console.log("❌ ROOK SDK not ready for sync");
      return {
        summary: "ROOK SDK not ready",
        hasData: false,
      };
    }

    console.log("🩺 Starting available health data sync...");
    const today = new Date().toISOString().split("T")[0];

    try {
      // Use the working ROOK SDK methods for data syncing
      console.log("❤️ Syncing available health data...");

      // Try syncing body summary (includes heart rate, activity data)
      try {
        await syncBodySummary(today);
        console.log("✅ Body summary sync completed");
      } catch (error) {
        console.warn("⚠️ Body summary sync failed:", error);
      }

      // Try syncing sleep summary
      try {
        await syncSleepSummary(today);
        console.log("✅ Sleep summary sync completed");
      } catch (error) {
        console.warn("⚠️ Sleep summary sync failed:", error);
      }

      return {
        summary: "Health data sync completed",
        hasData: true,
      };
    } catch (error) {
      console.warn("⚠️ Health data sync failed:", error);
      return {
        summary: "Limited health data available",
        hasData: false,
      };
    }
  };

  return {
    // Status
    rookReady,
    isSetupComplete,
    permissionsGranted,
    userConfigured,

    // Actions
    requestHealthPermissions,
    configureUser,
    completeRookSetup,
    syncHealthData,
    syncTodayData,
    syncAdvancedHealthData,
    retryFailedSyncs,
    checkCurrentPermissions,
  };
};
