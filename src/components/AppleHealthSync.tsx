import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRookHealth } from "../hooks/useRookHealth";
import { wp, hp, fontScale } from "../utils/responsive";

interface AppleHealthSyncProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const AppleHealthSync: React.FC<AppleHealthSyncProps> = ({
  isConnected,
  onConnect,
  onDisconnect,
}) => {
  const {
    rookReady,
    isSetupComplete,
    requestHealthPermissions,
    configureUser,
    syncTodayData,
  } = useRookHealth();

  const [isLoading, setIsLoading] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [healthData, setHealthData] = useState<any>(null);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      // Step 1: Request permissions
      const permissionsGranted = await requestHealthPermissions();
      if (!permissionsGranted) {
        Alert.alert(
          "Error",
          "Health permissions are required to connect Apple Health",
        );
        setIsLoading(false);
        return;
      }

      // Step 2: Configure user with a unique ID
      const userId = `h2oasis_${Date.now()}`;
      const userConfigured = await configureUser(userId);
      if (!userConfigured) {
        Alert.alert("Error", "Failed to configure user for health data sync");
        setIsLoading(false);
        return;
      }

      // Step 3: Initial sync
      const syncResult = await syncTodayData();
      setHealthData(syncResult);
      setLastSyncTime(new Date());

      onConnect();
      Alert.alert("Success", "Apple Health connected successfully!");
    } catch (error) {
      Alert.alert("Error", `Failed to connect Apple Health: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    Alert.alert(
      "Disconnect Apple Health",
      "Are you sure you want to disconnect from Apple Health?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Disconnect",
          style: "destructive",
          onPress: () => {
            setHealthData(null);
            setLastSyncTime(null);
            onDisconnect();
          },
        },
      ],
    );
  };

  const handleSync = async () => {
    if (!isSetupComplete) return;

    setIsLoading(true);
    try {
      const syncResult = await syncTodayData();
      setHealthData(syncResult);
      setLastSyncTime(new Date());
      Alert.alert("Success", "Health data synced successfully!");
    } catch (error) {
      Alert.alert("Error", `Sync failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!rookReady) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Initializing Apple Health...</Text>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🍎 Apple Health</Text>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: isConnected ? "#4CAF50" : "#FF5722" },
          ]}
        />
      </View>

      {!isConnected ? (
        <View style={styles.connectSection}>
          <Text style={styles.description}>
            Connect to Apple Health to track your hydration alongside your
            health metrics
          </Text>
          <TouchableOpacity
            style={styles.connectButton}
            onPress={handleConnect}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.connectButtonText}>Connect Apple Health</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.connectedSection}>
          <Text style={styles.connectedText}>✅ Connected to Apple Health</Text>

          {healthData && (
            <View style={styles.dataSection}>
              <Text style={styles.dataTitle}> Today&apos;s Health Data</Text>
              <Text style={styles.dataItem}>
                Steps: {healthData.stepsData?.steps || "No data"}
              </Text>
              <Text style={styles.dataItem}>
                Calories: {healthData.caloriesData?.total || "No data"}
              </Text>
              {lastSyncTime && (
                <Text style={styles.lastSync}>
                  Last sync: {lastSyncTime.toLocaleTimeString()}
                </Text>
              )}
            </View>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.syncButton}
              onPress={handleSync}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#007AFF" />
              ) : (
                <Text style={styles.syncButtonText}>Sync Now</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.disconnectButton}
              onPress={handleDisconnect}
              disabled={isLoading}
            >
              <Text style={styles.disconnectButtonText}>Disconnect</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F9FA",
    borderRadius: wp(12),
    padding: wp(16),
    marginVertical: hp(8),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp(12),
  },
  title: {
    fontSize: fontScale(18),
    fontWeight: "600",
    color: "#333",
  },
  statusDot: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
  },
  connectSection: {
    alignItems: "center",
  },
  description: {
    fontSize: fontScale(14),
    color: "#666",
    textAlign: "center",
    marginBottom: hp(16),
    lineHeight: hp(20),
  },
  connectButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: wp(24),
    paddingVertical: hp(12),
    borderRadius: wp(8),
    minWidth: wp(150),
    alignItems: "center",
  },
  connectButtonText: {
    color: "#FFF",
    fontSize: fontScale(16),
    fontWeight: "600",
  },
  connectedSection: {
    alignItems: "center",
  },
  connectedText: {
    fontSize: fontScale(16),
    color: "#4CAF50",
    fontWeight: "500",
    marginBottom: hp(16),
  },
  dataSection: {
    backgroundColor: "#FFF",
    borderRadius: wp(8),
    padding: wp(12),
    marginBottom: hp(16),
    width: "100%",
  },
  dataTitle: {
    fontSize: fontScale(14),
    fontWeight: "600",
    color: "#333",
    marginBottom: hp(8),
  },
  dataItem: {
    fontSize: fontScale(14),
    color: "#666",
    marginBottom: hp(4),
  },
  lastSync: {
    fontSize: fontScale(12),
    color: "#999",
    marginTop: hp(8),
    fontStyle: "italic",
  },
  buttonRow: {
    flexDirection: "row",
    gap: wp(12),
  },
  syncButton: {
    backgroundColor: "#FFF",
    borderColor: "#007AFF",
    borderWidth: 1,
    paddingHorizontal: wp(20),
    paddingVertical: hp(10),
    borderRadius: wp(8),
    minWidth: wp(100),
    alignItems: "center",
  },
  syncButtonText: {
    color: "#007AFF",
    fontSize: fontScale(14),
    fontWeight: "600",
  },
  disconnectButton: {
    backgroundColor: "#FFF",
    borderColor: "#FF5722",
    borderWidth: 1,
    paddingHorizontal: wp(20),
    paddingVertical: hp(10),
    borderRadius: wp(8),
    minWidth: wp(100),
    alignItems: "center",
  },
  disconnectButtonText: {
    color: "#FF5722",
    fontSize: fontScale(14),
    fontWeight: "600",
  },
  loadingText: {
    fontSize: fontScale(14),
    color: "#666",
    textAlign: "center",
    marginBottom: hp(8),
  },
});
