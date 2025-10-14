import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useSamsungHealth } from "../hooks/useSamsungHealth";

interface SamsungHealthSyncProps {
  userId?: string;
}

export const SamsungHealthSync: React.FC<SamsungHealthSyncProps> = ({
  userId,
}) => {
  const {
    isAvailable,
    hasPermissions,
    isLoading,
    data,
    isConnected,
    checkAvailability,
    connect,
    syncData,
    checkSyncStatus,
    enableSync,
    disableSync,
    refreshConnectionState,
  } = useSamsungHealth(userId);

  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncEnabled, setSyncEnabled] = useState<boolean>(false);

  // Check availability and sync status on component mount
  useEffect(() => {
    if (Platform.OS === "android") {
      checkAvailability();
    }
  }, [checkAvailability]);

  // Refresh connection state when component mounts to sync with any previous connections
  useEffect(() => {
    refreshConnectionState();
  }, [refreshConnectionState]);

  // Check Samsung sync status when connected
  useEffect(() => {
    if (isConnected && hasPermissions) {
      const checkSync = async () => {
        const syncStatus = await checkSyncStatus();
        setSyncEnabled(syncStatus);
      };
      checkSync();
    }
  }, [isConnected, hasPermissions, checkSyncStatus]);

  // Refresh connection state periodically to catch external connections
  useEffect(() => {
    const interval = setInterval(() => {
      refreshConnectionState();
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [refreshConnectionState]);

  const handleConnect = async () => {
    if (!isAvailable) {
      Alert.alert(
        "Samsung Health Not Available",
        "Samsung Health is not installed or not supported on this device.",
      );
      return;
    }

    try {
      // Connect to Samsung Health (handles permissions and setup)
      const success = await connect();

      if (success) {
        // Refresh connection state to ensure UI is updated
        await refreshConnectionState();

        // Check sync status after successful connection
        const syncStatus = await checkSyncStatus();
        setSyncEnabled(syncStatus);

        Alert.alert(
          "Success",
          "Samsung Health connected successfully! Data will sync automatically.",
        );
      } else {
        Alert.alert(
          "Connection Failed",
          "Samsung Health permissions are required to sync your health data.",
        );
      }
    } catch (error) {
      Alert.alert(
        "Connection Error",
        `Failed to connect Samsung Health: ${error}`,
      );
    }
  };

  const handleSync = async () => {
    if (!hasPermissions) {
      Alert.alert("No Permissions", "Please connect to Samsung Health first.");
      return;
    }

    try {
      const success = await syncData();
      if (success) {
        setLastSyncTime(new Date());
        Alert.alert("Success", "Samsung Health data synced successfully!");
      } else {
        Alert.alert("Sync Failed", "Unable to sync Samsung Health data.");
      }
    } catch (error) {
      Alert.alert("Sync Error", `Failed to sync data: ${error}`);
    }
  };

  const handleDisconnect = () => {
    Alert.alert(
      "Disable Samsung Health Sync",
      "Are you sure you want to disable Samsung Health data synchronization?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Disable Sync",
          style: "destructive",
          onPress: async () => {
            try {
              const success = await disableSync();
              if (success) {
                setSyncEnabled(false);
                Alert.alert(
                  "Sync Disabled",
                  "Samsung Health data synchronization has been disabled.",
                );
              } else {
                Alert.alert("Error", "Failed to disable Samsung Health sync.");
              }
            } catch (error) {
              Alert.alert("Error", `Failed to disable sync: ${error}`);
            }
          },
        },
      ],
    );
  };

  // Show Android-only message for non-Android platforms
  if (Platform.OS !== "android") {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>📱 Samsung Health</Text>
          <View style={[styles.statusDot, { backgroundColor: "#9E9E9E" }]} />
        </View>
        <View style={styles.unavailableSection}>
          <Text style={styles.unavailableText}>
            Samsung Health is only available on Android devices
          </Text>
        </View>
      </View>
    );
  }

  // Show unavailable message if Samsung Health is not available
  if (!isAvailable && !isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>📱 Samsung Health</Text>
          <View style={[styles.statusDot, { backgroundColor: "#FF5722" }]} />
        </View>
        <View style={styles.unavailableSection}>
          <Text style={styles.unavailableText}>
            Samsung Health is not available on this device
          </Text>
          <Text style={styles.developerNote}>
            Developer Mode: Install Samsung Health app and enable developer mode
            to test
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📱 Samsung Health</Text>
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
            Connect to Samsung Health to sync your health and fitness data with
            H2Oasis
          </Text>

          {isAvailable && (
            <Text style={styles.developerNote}>
              💡 Developer Mode: Samsung Health app detected. Ready for data
              sync.
            </Text>
          )}

          <TouchableOpacity
            style={styles.connectButton}
            onPress={handleConnect}
            disabled={isLoading || !isAvailable}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.connectButtonText}>
                Connect Samsung Health
              </Text>
            )}
          </TouchableOpacity>

          {!isAvailable && (
            <Text style={styles.helpText}>
              Install Samsung Health from Galaxy Store or Google Play
            </Text>
          )}
        </View>
      ) : (
        <View style={styles.connectedSection}>
          <Text style={styles.connectedText}>
            ✅ Connected to Samsung Health
          </Text>

          {data && Object.keys(data).length > 0 && (
            <View style={styles.dataSection}>
              <Text style={styles.dataTitle}>📊 Latest Health Data</Text>

              {data.physical && (
                <>
                  <Text style={styles.dataItem}>
                    Steps: {data.physical.steps || "No data"}
                  </Text>
                  <Text style={styles.dataItem}>
                    Calories: {data.physical.calories || "No data"}
                  </Text>
                  <Text style={styles.dataItem}>
                    Distance: {data.physical.distance || "No data"} m
                  </Text>
                </>
              )}

              {data.sleep && (
                <Text style={styles.dataItem}>
                  Sleep:{" "}
                  {data.sleep.duration
                    ? `${Math.round(data.sleep.duration / 60)} mins`
                    : "No data"}
                </Text>
              )}

              {data.body && (
                <>
                  {data.body.weight && (
                    <Text style={styles.dataItem}>
                      Weight: {data.body.weight} kg
                    </Text>
                  )}
                  {data.body.heartRate && (
                    <Text style={styles.dataItem}>
                      Heart Rate: {data.body.heartRate} bpm
                    </Text>
                  )}
                </>
              )}

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
                <ActivityIndicator size="small" color="#1976D2" />
              ) : (
                <Text style={styles.syncButtonText}>Sync Now</Text>
              )}
            </TouchableOpacity>

            {syncEnabled ? (
              <TouchableOpacity
                style={styles.disconnectButton}
                onPress={handleDisconnect}
                disabled={isLoading}
              >
                <Text style={styles.disconnectButtonText}>Disable Sync</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.enableButton}
                onPress={async () => {
                  try {
                    const success = await enableSync();
                    if (success) {
                      setSyncEnabled(true);
                      Alert.alert(
                        "Sync Enabled",
                        "Samsung Health auto-sync has been enabled.",
                      );
                    }
                  } catch (error) {
                    Alert.alert("Error", `Failed to enable sync: ${error}`);
                  }
                }}
                disabled={isLoading}
              >
                <Text style={styles.enableButtonText}>Enable Sync</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text
            style={[
              styles.autoSyncNote,
              { color: syncEnabled ? "#4CAF50" : "#FF9800" },
            ]}
          >
            {syncEnabled
              ? "🔄 Auto-sync enabled: Data syncs automatically"
              : "⏸️ Auto-sync disabled: Manual sync only"}
          </Text>
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
    marginBottom: 12,
    lineHeight: 20,
  },
  developerNote: {
    fontSize: 12,
    color: "#1976D2",
    textAlign: "center",
    marginBottom: 16,
    backgroundColor: "#E3F2FD",
    padding: 8,
    borderRadius: 6,
    width: "100%",
  },
  connectButton: {
    backgroundColor: "#1976D2",
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
  helpText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginTop: 12,
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
    borderColor: "#1976D2",
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  syncButtonText: {
    color: "#1976D2",
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
  enableButton: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  enableButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  autoSyncNote: {
    fontSize: 12,
    color: "#4CAF50",
    textAlign: "center",
    marginTop: 12,
  },
  unavailableSection: {
    alignItems: "center",
  },
  unavailableText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginBottom: 8,
  },
});
