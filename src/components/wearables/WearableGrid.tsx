import React from "react";
import { View } from "react-native";
import { WearableCard, WearableDevice } from "./WearableCard";
import { ConnectWearableStyles } from "../../styles/ConnectWearableStyles";

interface WearableGridProps {
  wearables: WearableDevice[];
  selectedWearable: string | null;
  loadingStates: Record<string, boolean>;
  connectionStates?: Record<string, boolean>; // New prop for connection status
  healthData?: Record<string, any>; // New prop for health data
  onWearablePress: (wearable: WearableDevice) => void;
}

export const WearableGrid: React.FC<WearableGridProps> = ({
  wearables,
  selectedWearable,
  loadingStates,
  connectionStates = {},
  healthData = {},
  onWearablePress,
}) => {
  return (
    <View style={ConnectWearableStyles.grid}>
      {wearables.map((wearable) => {
        const isSelected = selectedWearable === wearable.id;
        const isLoading = loadingStates[wearable.id] || false;

        // Check connection status - use dataSource for API wearables, id for SDK wearables (Apple Health)
        const connectionKey = wearable.dataSource || wearable.id;
        const isConnected = connectionStates[connectionKey] || false;
        const wearableHealthData = healthData[connectionKey] || null;

        return (
          <WearableCard
            key={wearable.id}
            wearable={wearable}
            isSelected={isSelected}
            isLoading={isLoading}
            isConnected={isConnected}
            healthData={wearableHealthData}
            onPress={onWearablePress}
            disabled={isLoading}
          />
        );
      })}
    </View>
  );
};
