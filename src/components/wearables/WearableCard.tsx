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
  dataSource?: string; // ROOK API data source identifier (for API-based wearables)
  isComingSoon?: boolean;
}

interface WearableCardProps {
  wearable: WearableDevice;
  isSelected: boolean;
  isLoading: boolean;
  isConnected?: boolean; // New prop for connection status
  onPress: (wearable: WearableDevice) => void;
  disabled?: boolean;
}

export const WearableCard: React.FC<WearableCardProps> = ({
  wearable,
  isSelected,
  isLoading,
  isConnected = false,
  onPress,
  disabled = false,
}) => {
  // Determine card style based on connection status
  const getCardStyle = () => {
    if (isConnected) {
      return ConnectWearableStyles.wearableConnected; // Blue-green for connected
    }
    if (isSelected) {
      return ConnectWearableStyles.wearableSelected; // Selected state
    }
    return ConnectWearableStyles.wearableDefault; // Default state
  };

  const getTextColor = () => {
    if (isConnected || isSelected) {
      return "#fff"; // White text for connected/selected
    }
    return "#1A1A1A"; // Dark text for default
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(wearable)}
      activeOpacity={0.8}
      disabled={disabled || isLoading}
      style={[
        ConnectWearableStyles.wearableBtn,
        getCardStyle(),
        disabled && { opacity: 0.6 },
      ]}
    >
      <View style={ConnectWearableStyles.iconWrapper}>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={isConnected || isSelected ? "#fff" : "#007AFF"}
          />
        ) : (
          <>
            <Image source={wearable.icon} style={ConnectWearableStyles.icon} />
            {/* Tick mark for connected wearables */}
            {isConnected && (
              <View style={ConnectWearableStyles.connectedBadge}>
                <Text style={ConnectWearableStyles.connectedTick}>✓</Text>
              </View>
            )}
          </>
        )}
      </View>
      <Text
        style={[ConnectWearableStyles.wearableText, { color: getTextColor() }]}
      >
        {isLoading ? "Connecting..." : wearable.name}
      </Text>
    </TouchableOpacity>
  );
};
