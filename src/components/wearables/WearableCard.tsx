import React from "react";
import {
  TouchableOpacity,
  Image,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { ConnectWearableStyles } from "../../styles/ConnectWearableStyles";

export interface WearableDevice {
  id: string;
  name: string;
  icon: any;
  type: "sdk" | "api"; // SDK-based (Apple Health) or API-based (Garmin, Fitbit, etc.)
  isComingSoon?: boolean;
}

interface WearableCardProps {
  wearable: WearableDevice;
  isSelected: boolean;
  isLoading: boolean;
  onPress: (wearable: WearableDevice) => void;
  disabled?: boolean;
}

export const WearableCard: React.FC<WearableCardProps> = ({
  wearable,
  isSelected,
  isLoading,
  onPress,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(wearable)}
      activeOpacity={0.8}
      disabled={disabled || isLoading}
      style={[
        ConnectWearableStyles.wearableBtn,
        isSelected
          ? ConnectWearableStyles.wearableSelected
          : ConnectWearableStyles.wearableDefault,
        disabled && { opacity: 0.6 },
      ]}
    >
      <View style={ConnectWearableStyles.iconWrapper}>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={isSelected ? "#fff" : "#007AFF"}
          />
        ) : (
          <Image source={wearable.icon} style={ConnectWearableStyles.icon} />
        )}
      </View>
      <Text
        style={[
          ConnectWearableStyles.wearableText,
          { color: isSelected ? "#fff" : "#1A1A1A" },
        ]}
      >
        {isLoading ? "Connecting..." : wearable.name}
      </Text>
    </TouchableOpacity>
  );
};
