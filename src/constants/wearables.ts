import { WearableDevice } from "../components/wearables/WearableCard";

export const WEARABLE_DEVICES: WearableDevice[] = [
  {
    id: "apple",
    name: "Apple Health",
    icon: require("../../assets/icons/apple.png"),
    type: "sdk", // SDK-based integration
    description: "Access health data from your iPhone and connected devices",
    dataTypes: ["sleep", "activity", "heart_rate", "body_metrics", "nutrition"],
  },
  {
    id: "samsung",
    name: "Samsung Health",
    icon: require("../../assets/icons/samsung.png"),
    type: "sdk", // SDK-based integration (via ROOK Samsung Health SDK)
    description:
      "Integrate with Samsung Health for comprehensive health tracking",
    dataTypes: ["sleep", "activity", "heart_rate", "body_metrics"],
    // Samsung Health is now fully implemented with ROOK SDK + AAR file
  },
  {
    id: "garmin",
    name: "Garmin",
    type: "api",
    dataSource: "garmin", // ROOK data source identifier (must match ROOK API)
    icon: require("../../assets/icons/garmin.png"),
    description:
      "Connect your Garmin watch for comprehensive fitness and health tracking",
    dataTypes: ["sleep", "activity", "heart_rate", "body_metrics", "stress"],
  },
  {
    id: "fitbit",
    name: "Fitbit",
    type: "api",
    dataSource: "fitbit", // ROOK data source identifier (must match ROOK API)
    icon: require("../../assets/icons/fitbit.png"),
    description:
      "Track activity, sleep, and health metrics from your Fitbit device",
    dataTypes: ["sleep", "activity", "heart_rate", "body_metrics"],
  },
  {
    id: "whoop",
    name: "Whoop",
    type: "api",
    dataSource: "whoop", // ROOK data source identifier (must match ROOK API)
    icon: require("../../assets/icons/whoop.png"),
    description:
      "Get recovery, strain, and sleep insights from your Whoop strap",
    dataTypes: ["sleep", "activity", "heart_rate", "recovery"],
  },
  {
    id: "oura",
    name: "Oura Ring",
    type: "api",
    dataSource: "oura", // ROOK data source identifier (must match ROOK API)
    icon: require("../../assets/oura.png"),
    description: "Track sleep, readiness, and activity with your Oura Ring",
    dataTypes: [
      "sleep",
      "activity",
      "heart_rate",
      "body_temperature",
      "readiness",
    ],
  },
];

/**
 * Get wearable device by ID
 */
export const getWearableById = (id: string): WearableDevice | undefined => {
  return WEARABLE_DEVICES.find((device) => device.id === id);
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
