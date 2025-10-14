import React from "react";
import { View } from "react-native";
import { WearableCard, WearableDevice } from "./WearableCard";
import { ConnectWearableStyles } from "../../styles/ConnectWearableStyles";

interface WearableGridProps {
  wearables: WearableDevice[];
  selectedWearable: string | null;
  loadingStates: Record<string, boolean>;
  connectionStates?: Record<string, boolean>; // New prop for connection status
  onWearablePress: (wearable: WearableDevice) => void;
}

export const WearableGrid: React.FC<WearableGridProps> = ({
  wearables,
  selectedWearable,
  loadingStates,
  connectionStates = {},
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

        return (
          <WearableCard
            key={wearable.id}
            wearable={wearable}
            isSelected={isSelected}
            isLoading={isLoading}
            isConnected={isConnected}
            onPress={onWearablePress}
            disabled={isLoading}
          />
        );
      })}
    </View>
  );
};
