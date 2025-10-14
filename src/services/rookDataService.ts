/**
 * ROOK Data Service
 * Fetches health data directly from ROOK's API
 */

import { ROOK_CONFIG } from "../config/rookConfig";

// Use the BASE_URL from config (respects sandbox vs production environment)
const ROOK_API_BASE_URL = ROOK_CONFIG.BASE_URL;

interface RookAPIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Fetch sleep health summary from ROOK API
 */
export const fetchSleepSummary = async (
  userId: string,
  date: string, // YYYY-MM-DD format
): Promise<RookAPIResponse> => {
  try {
    const url = `${ROOK_API_BASE_URL}/v2/processed_data/sleep_health/summary?user_id=${userId}&date=${date}`;

    // Create Basic Auth header - use btoa() like other wearable services
    const credentials = `${ROOK_CONFIG.CLIENT_UUID}:${ROOK_CONFIG.SECRET_KEY}`;
    const base64Credentials = btoa(credentials);

    console.log(`📥 Fetching sleep data from ROOK API for date: ${date}`);
    console.log(
      `🔑 Using client UUID: ${ROOK_CONFIG.CLIENT_UUID?.substring(0, 8)}...`,
    );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${base64Credentials}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 204) {
      console.log("ℹ️ No sleep data available for this date");
      return { success: true, data: null };
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ ROOK API error:", response.status, errorText);
      return { success: false, error: `API error: ${response.status}` };
    }

    const data = await response.json();
    console.log("✅ Sleep data fetched from ROOK:", data);
    return { success: true, data };
  } catch (error) {
    console.error("❌ Error fetching sleep data from ROOK:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * Fetch physical health summary from ROOK API
 */
export const fetchPhysicalSummary = async (
  userId: string,
  date: string, // YYYY-MM-DD format
): Promise<RookAPIResponse> => {
  try {
    const url = `${ROOK_API_BASE_URL}/v2/processed_data/physical_health/summary?user_id=${userId}&date=${date}`;

    const auth = btoa(`${ROOK_CONFIG.CLIENT_UUID}:${ROOK_CONFIG.SECRET_KEY}`);

    console.log(`📥 Fetching physical data from ROOK API for date: ${date}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 204) {
      console.log("ℹ️ No physical data available for this date");
      return { success: true, data: null };
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ ROOK API error:", response.status, errorText);
      return { success: false, error: `API error: ${response.status}` };
    }

    const data = await response.json();
    console.log("✅ Physical data fetched from ROOK:", data);
    return { success: true, data };
  } catch (error) {
    console.error("❌ Error fetching physical data from ROOK:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * Fetch body health summary from ROOK API
 */
export const fetchBodySummary = async (
  userId: string,
  date: string, // YYYY-MM-DD format
): Promise<RookAPIResponse> => {
  try {
    const url = `${ROOK_API_BASE_URL}/v2/processed_data/body_health/summary?user_id=${userId}&date=${date}`;

    const auth = btoa(`${ROOK_CONFIG.CLIENT_UUID}:${ROOK_CONFIG.SECRET_KEY}`);

    console.log(`📥 Fetching body data from ROOK API for date: ${date}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 204) {
      console.log("ℹ️ No body data available for this date");
      return { success: true, data: null };
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ ROOK API error:", response.status, errorText);
      return { success: false, error: `API error: ${response.status}` };
    }

    const data = await response.json();
    console.log("✅ Body data fetched from ROOK:", data);
    return { success: true, data };
  } catch (error) {
    console.error("❌ Error fetching body data from ROOK:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * Fetch all health summaries (sleep, physical, body) from ROOK API
 */
export const fetchAllHealthData = async (
  userId: string,
  date: string, // YYYY-MM-DD format
): Promise<{
  sleep: any;
  physical: any;
  body: any;
}> => {
  console.log(
    `📊 Fetching all health data from ROOK API for user ${userId}, date ${date}`,
  );

  const [sleepResult, physicalResult, bodyResult] = await Promise.all([
    fetchSleepSummary(userId, date),
    fetchPhysicalSummary(userId, date),
    fetchBodySummary(userId, date),
  ]);

  return {
    sleep: sleepResult.success ? sleepResult.data : null,
    physical: physicalResult.success ? physicalResult.data : null,
    body: bodyResult.success ? bodyResult.data : null,
  };
};
