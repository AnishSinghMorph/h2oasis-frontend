import AsyncStorage from "@react-native-async-storage/async-storage";
import { Session } from "../types/session.types";

/**
 * Optimistic rendering utilities for instant session display
 * Provides AsyncStorage-based session caching for zero-delay UX
 */

/**
 * Check for newly created session in AsyncStorage
 * Used for optimistic rendering before API call completes
 *
 * @returns Session object if found, null otherwise
 */
export const checkForOptimisticSession = async (): Promise<Session | null> => {
  try {
    const suggestedSessionStr = await AsyncStorage.getItem("suggestedSession");
    if (suggestedSessionStr) {
      const suggestedSession = JSON.parse(suggestedSessionStr) as Session;
      console.log(
        "✨ Optimistic render: Found suggested session:",
        suggestedSession.SessionName,
      );
      return suggestedSession;
    }
  } catch (e) {
    console.warn("Failed to load suggested session:", e);
  }
  return null;
};

/**
 * Merge optimistic session with API sessions, preventing duplicates
 *
 * @param optimisticSession - Session from AsyncStorage (may be null)
 * @param apiSessions - Sessions returned from backend API
 * @returns Merged array with duplicates removed
 */
export const mergeSessions = (
  optimisticSession: Session | null,
  apiSessions: Session[],
): Session[] => {
  if (!optimisticSession) {
    return apiSessions;
  }

  // Check if the optimistic session already exists in API results
  // Match by sessionId or exact name+duration combination
  const isDuplicate = apiSessions.some(
    (s) =>
      s.sessionId === optimisticSession.sessionId ||
      (s.SessionName === optimisticSession.SessionName &&
        s.TotalDurationMinutes === optimisticSession.TotalDurationMinutes),
  );

  if (isDuplicate) {
    console.log("📋 Session already in API results, no merge needed");
    return apiSessions;
  }

  // Add optimistic session at the beginning (most recent)
  console.log("📋 Merged optimistic session with API results");
  return [optimisticSession, ...apiSessions];
};

/**
 * Clear the suggested session from AsyncStorage
 * Called after session has been confirmed in API response
 */
export const clearOptimisticSession = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem("suggestedSession");
    console.log("🧹 Cleared suggested session from AsyncStorage");
  } catch (e) {
    console.warn("Failed to clear suggested session:", e);
  }
};

/**
 * Save a session to AsyncStorage for optimistic rendering
 * Used by ChatScreen and FocusGoal after session creation
 *
 * @param session - Session object to save
 */
export const saveOptimisticSession = async (
  session: Session,
): Promise<void> => {
  try {
    await AsyncStorage.setItem("suggestedSession", JSON.stringify(session));
    console.log(
      "💾 Saved session to AsyncStorage for optimistic rendering:",
      session.SessionName,
    );
  } catch (e) {
    console.error("Failed to save session to AsyncStorage:", e);
  }
};
