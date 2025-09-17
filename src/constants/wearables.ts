import { WearableDevice } from "../components/wearables/WearableCard";

/**
 * Wearable device configurations
 * Based on ROOK documentation: https://docs.tryrook.io/data-sources/
 */
export const WEARABLE_DEVICES: WearableDevice[] = [
  {
    id: "apple",
    name: "Apple Health",
    icon: require("../../assets/icons/apple.png"),
    type: "sdk", // SDK-based integration
  },
  {
    id: "samsung",
    name: "Samsung Health",
    icon: require("../../assets/icons/samsung.png"),
    type: "sdk", // SDK-based integration (via Health Connect)
    isComingSoon: true,
  },
  {
    id: "garmin",
    name: "Garmin",
    icon: require("../../assets/icons/garmin.png"),
    type: "api", // API-based integration
    isComingSoon: true,
  },
  {
    id: "fitbit",
    name: "Fitbit",
    icon: require("../../assets/icons/fitbit.png"),
    type: "api", // API-based integration
    isComingSoon: true,
  },
  {
    id: "whoop",
    name: "Whoop",
    icon: require("../../assets/icons/whoop.png"),
    type: "api", // API-based integration (requires developer account)
    isComingSoon: true,
  },
];

/**
 * Get wearable device by ID
 */
export const getWearableById = (id: string): WearableDevice | undefined => {
  return WEARABLE_DEVICES.find((device) => device.id === id);
};

/**
 * Get SDK-based wearables (Apple Health, Samsung Health via Health Connect)
 */
export const getSDKWearables = (): WearableDevice[] => {
  return WEARABLE_DEVICES.filter((device) => device.type === "sdk");
};

/**
 * Get API-based wearables (Garmin, Fitbit, Whoop, etc.)
 */
export const getAPIWearables = (): WearableDevice[] => {
  return WEARABLE_DEVICES.filter((device) => device.type === "api");
};

/**
 * Get available (not coming soon) wearables
 */
export const getAvailableWearables = (): WearableDevice[] => {
  return WEARABLE_DEVICES.filter((device) => !device.isComingSoon);
};

/**
 * Check if wearable requires developer account (Whoop, Dexcom)
 */
export const requiresDeveloperAccount = (wearableId: string): boolean => {
  return ["whoop", "dexcom"].includes(wearableId);
};

/**
 * Get wearable data types supported
 * Based on ROOK documentation data sources table
 */
export const getWearableDataTypes = (wearableId: string): string[] => {
  const dataTypeMap: Record<string, string[]> = {
    apple: ["Body", "Physical", "Sleep"],
    garmin: ["Body", "Physical", "Sleep"],
    fitbit: ["Body", "Physical", "Sleep"],
    whoop: ["Body", "Physical", "Sleep"],
    samsung: ["Body", "Physical", "Sleep"],
    oura: ["Body", "Physical", "Sleep"],
    polar: ["Body", "Physical", "Sleep"],
  };

  return dataTypeMap[wearableId] || [];
};
