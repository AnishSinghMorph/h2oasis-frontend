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
  isConnected?: boolean;
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
    if (isConnected || isSelected) {
      return ConnectWearableStyles.wearableConnected;
    }
    return ConnectWearableStyles.wearableDefault;
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
      {/* Icon on the left */}
      <View style={ConnectWearableStyles.iconWrapper}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#007AFF" />
        ) : (
          <Image source={wearable.icon} style={ConnectWearableStyles.icon} />
        )}
      </View>

      {/* Name and status in the middle */}
      <View style={ConnectWearableStyles.wearableTextContainer}>
        <Text style={ConnectWearableStyles.wearableText}>{wearable.name}</Text>
        {isLoading && (
          <Text style={ConnectWearableStyles.wearableSubtext}>
            Connecting...
          </Text>
        )}
        {isConnected && !isLoading && (
          <Text style={ConnectWearableStyles.wearableSubtext}>Connected</Text>
        )}
      </View>

      {/* Checkmark on the right if connected */}
      {isConnected && !isLoading && (
        <View style={ConnectWearableStyles.connectedBadge}>
          <Text style={ConnectWearableStyles.connectedTick}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
