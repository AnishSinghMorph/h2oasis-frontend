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
  description?: string; // Description of what data the wearable provides
  dataTypes?: string[]; // Types of data available from this wearable
}

interface WearableCardProps {
  wearable: WearableDevice;
  isSelected: boolean;
  isLoading: boolean;
  isConnected?: boolean; // New prop for connection status
  healthData?: any; // New prop for health data
  onPress: (wearable: WearableDevice) => void;
  disabled?: boolean;
}

export const WearableCard: React.FC<WearableCardProps> = ({
  wearable,
  isSelected,
  isLoading,
  isConnected = false,
  healthData = null,
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
      {/* Display wearable name or health data */}
      {isLoading ? (
        <Text
          style={[
            ConnectWearableStyles.wearableText,
            { color: getTextColor() },
          ]}
        >
          Connecting...
        </Text>
      ) : isConnected && healthData && wearable.id === "apple" ? (
        // Show health data for connected Apple Health
        <View style={ConnectWearableStyles.healthDataContainer}>
          <Text
            style={[
              ConnectWearableStyles.wearableName,
              { color: getTextColor() },
            ]}
          >
            {wearable.name}
          </Text>
          {healthData.dataTypes && (
            <View style={ConnectWearableStyles.healthDataRow}>
              <Text
                style={[
                  ConnectWearableStyles.healthDataText,
                  { color: getTextColor() },
                ]}
              >
                🔥 {healthData.dataTypes.calories || 0} cal
              </Text>
              <Text
                style={[
                  ConnectWearableStyles.healthDataText,
                  { color: getTextColor() },
                ]}
              >
                � {healthData.dataTypes.bodyMetrics ? "Body ✓" : "No body"}
              </Text>
            </View>
          )}
        </View>
      ) : (
        // Show just the wearable name
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
