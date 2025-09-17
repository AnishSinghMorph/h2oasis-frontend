import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRookHealth } from "../hooks/useRookHealth";

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
    permissionsGranted,
    userConfigured,
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
              <Text style={styles.dataTitle}>          Today&apos;s Health Data</Text>
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
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  connectSection: {
    alignItems: "center",
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  connectButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 150,
    alignItems: "center",
  },
  connectButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  connectedSection: {
    alignItems: "center",
  },
  connectedText: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "500",
    marginBottom: 16,
  },
  dataSection: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    width: "100%",
  },
  dataTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  dataItem: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  lastSync: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
    fontStyle: "italic",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  syncButton: {
    backgroundColor: "#FFF",
    borderColor: "#007AFF",
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  syncButtonText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
  },
  disconnectButton: {
    backgroundColor: "#FFF",
    borderColor: "#FF5722",
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  disconnectButtonText: {
    color: "#FF5722",
    fontSize: 14,
    fontWeight: "600",
  },
  loadingText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
});
