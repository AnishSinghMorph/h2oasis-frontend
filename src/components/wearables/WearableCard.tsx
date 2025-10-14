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
  type: "sdk" | "api";
  dataSource?: string;
  isComingSoon?: boolean;
  description?: string;
  dataTypes?: string[];
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
  const getCardStyle = () => {
    if (isConnected) {
      return ConnectWearableStyles.wearableConnected;
    }
    if (isSelected) {
      return ConnectWearableStyles.wearableSelected;
    }
    return ConnectWearableStyles.wearableDefault;
  };

  const getTextColor = () => {
    if (isConnected || isSelected) {
      return "#fff";
    }
    return "#1A1A1A";
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
            {isConnected && (
              <View style={ConnectWearableStyles.connectedBadge}>
                <Text style={ConnectWearableStyles.connectedTick}>✓</Text>
              </View>
            )}
          </>
        )}
      </View>
      {isLoading ? (
        <Text
          style={[
            ConnectWearableStyles.wearableText,
            { color: getTextColor() },
          ]}
        >
          Connecting...
        </Text>
      ) : (
        <Text
          style={[
            ConnectWearableStyles.wearableText,
            { color: getTextColor() },
          ]}
        >
          {wearable.name}
        </Text>
      )}
    </TouchableOpacity>
  );
};
