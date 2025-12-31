/**
 * Notification Service
 * Handles local notification scheduling and permissions for H2Oasis app
 */

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

/**
 * Configure how notifications are displayed when app is in foreground
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request notification permissions from the user
 * Should be called once on app startup
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) {
    console.log("Notifications only work on physical devices");
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Failed to get notification permissions");
    return false;
  }

  // Configure Android notification channel
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#5BBFCF",
    });
  }

  return true;
}

/**
 * Convert hour (1-12), minute (0-59), and period (AM/PM) to tomorrow's Date
 * @param hour - Hour in 12-hour format (1-12)
 * @param minute - Minute (0-59)
 * @param period - "AM" or "PM"
 * @returns Date object for tomorrow at the specified time
 */
export function convertToTomorrowDate(
  hour: number,
  minute: number,
  period: "AM" | "PM",
): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Convert 12-hour to 24-hour format
  let hour24 = hour;
  if (period === "PM" && hour !== 12) {
    hour24 = hour + 12;
  } else if (period === "AM" && hour === 12) {
    hour24 = 0;
  }

  tomorrow.setHours(hour24, minute, 0, 0);
  return tomorrow;
}

/**
 * Schedule a local notification for a session
 * @param hour - Hour in 12-hour format (1-12)
 * @param minute - Minute (0-59)
 * @param period - "AM" or "PM"
 * @param sessionData - Optional session data to pass in notification
 * @returns Notification ID or null if failed
 */
export async function scheduleSessionNotification(
  hour: number,
  minute: number,
  period: "AM" | "PM",
  sessionData?: any,
): Promise<string | null> {
  try {
    const scheduledDate = convertToTomorrowDate(hour, minute, period);

    // Calculate seconds until scheduled time
    const now = new Date();
    const secondsUntilTrigger = Math.floor(
      (scheduledDate.getTime() - now.getTime()) / 1000,
    );

    if (secondsUntilTrigger <= 0) {
      console.error("Scheduled time is in the past");
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time for Your H2Oasis Session! 💧",
        body: "Your restoration session is ready. Let's begin your wellness journey.",
        sound: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
        data: {
          type: "session_reminder",
          session: sessionData,
          scheduledTime: scheduledDate.toISOString(),
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsUntilTrigger,
      },
    });

    console.log(
      `✅ Notification scheduled for ${scheduledDate.toLocaleString()}`,
    );
    console.log(`   Notification ID: ${notificationId}`);

    return notificationId;
  } catch (error) {
    console.error("Error scheduling notification:", error);
    return null;
  }
}

/**
 * Cancel a scheduled notification
 * @param notificationId - ID of the notification to cancel
 */
export async function cancelNotification(
  notificationId: string,
): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log(`Cancelled notification: ${notificationId}`);
  } catch (error) {
    console.error("Error cancelling notification:", error);
  }
}

/**
 * Get all scheduled notifications
 */
export async function getAllScheduledNotifications() {
  return await Notifications.getAllScheduledNotificationsAsync();
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log("All notifications cancelled");
}
