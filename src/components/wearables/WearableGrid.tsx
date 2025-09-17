import React from "react";
import { View } from "react-native";
import { WearableCard, WearableDevice } from "./WearableCard";
import { ConnectWearableStyles } from "../../styles/ConnectWearableStyles";

interface WearableGridProps {
  wearables: WearableDevice[];
  selectedWearable: string | null;
  loadingStates: Record<string, boolean>;
  onWearablePress: (wearable: WearableDevice) => void;
}

export const WearableGrid: React.FC<WearableGridProps> = ({
  wearables,
  selectedWearable,
  loadingStates,
  onWearablePress,
}) => {
  return (
    <View style={ConnectWearableStyles.grid}>
      {wearables.map((wearable) => {
        const isSelected = selectedWearable === wearable.id;
        const isLoading = loadingStates[wearable.id] || false;

        return (
          <WearableCard
            key={wearable.id}
            wearable={wearable}
            isSelected={isSelected}
            isLoading={isLoading}
            onPress={onWearablePress}
            disabled={isLoading}
          />
        );
      })}
    </View>
  );
};
