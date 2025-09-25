import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useRookHealth } from "../hooks/useRookHealth";

/**
 * Demo screen for testing ROOK health data integration
 */
export const HealthDataDemo: React.FC = () => {
  const {
    rookReady,
    isSetupComplete,
    permissionsGranted,
    userConfigured,
    requestHealthPermissions,
    configureUser,
    completeRookSetup,
    syncHealthData,
    syncTodayData,
    syncAdvancedHealthData,
    retryFailedSyncs,
    checkCurrentPermissions,
  } = useRookHealth();

  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState<string>("");
  const [userId, setUserId] = useState("h2oasisuser123"); // Updated format without underscores

  const handleRequestPermissions = async () => {
    setLoading(true);
    setLastError("");
    try {
      const success = await requestHealthPermissions();
      if (success) {
        Alert.alert("Success", "Health permissions granted!", [{ text: "OK" }]);
      } else {
        const errorMsg =
          "Failed to get permissions. Check console for details.";
        setLastError(errorMsg);
        Alert.alert("Error", errorMsg, [{ text: "OK" }]);
      }
    } catch (error) {
      const errorMsg = `Permission error: ${error}`;
      setLastError(errorMsg);
      Alert.alert("Error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigureUser = async () => {
    setLoading(true);
    try {
      const success = await configureUser(userId);
      Alert.alert(
        "User Configuration",
        success ? "User configured successfully!" : "Failed to configure user",
        [{ text: "OK" }],
      );
    } catch (error) {
      Alert.alert("Error", "Failed to configure user");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSetup = async () => {
    setLoading(true);
    try {
      const success = await completeRookSetup(userId);
      Alert.alert(
        "Setup",
        success ? "ROOK setup completed successfully!" : "Setup failed",
        [{ text: "OK" }],
      );
    } catch (error) {
      Alert.alert("Error", "Setup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSyncToday = async () => {
    setLoading(true);
    setLastError("");
    try {
      const result = await syncTodayData();
      if (result) {
        if (result.hasAnyData) {
          Alert.alert("Today's Data Synced", result.summary, [{ text: "OK" }]);
        } else {
          Alert.alert(
            "No Data Available",
            "This is normal if:\n• You're using iOS Simulator\n• New device with no health data\n• Need to use Health app first",
            [{ text: "OK" }],
          );
        }
      } else {
        setLastError("Failed to sync today's data");
        Alert.alert("Error", "Failed to sync today's data");
      }
    } catch (error) {
      const errorMsg = `Sync error: ${error}`;
      setLastError(errorMsg);
      Alert.alert("Error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncYesterday = async () => {
    setLoading(true);
    setLastError("");
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dateString = yesterday.toISOString().split("T")[0];

      const result = await syncHealthData(dateString);
      if (result.success) {
        Alert.alert("Yesterday's Data Synced", result.summary, [
          { text: "OK" },
        ]);
      } else {
        Alert.alert(
          "Limited Data Available",
          `${result.summary}\n\nThis is normal if you don't have much health data yet.`,
          [{ text: "OK" }],
        );
      }
    } catch (error) {
      const errorMsg = `Sync error: ${error}`;
      setLastError(errorMsg);
      Alert.alert("Error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRetryFailed = async () => {
    setLoading(true);
    try {
      const success = await retryFailedSyncs();
      Alert.alert(
        "Retry Failed Syncs",
        success
          ? "Successfully retried failed syncs!"
          : "No failed syncs to retry",
        [{ text: "OK" }],
      );
    } catch (error) {
      Alert.alert("Error", "Failed to retry syncs");
    } finally {
      setLoading(false);
    }
  };

  const handleSyncAdvanced = async () => {
    setLoading(true);
    setLastError("");
    try {
      const result = await syncAdvancedHealthData();
      Alert.alert(
        "Advanced Health Data Sync",
        `${result.summary}\n\nData Available: ${result.hasData ? "Yes" : "No"}`,
        [{ text: "OK" }],
      );
    } catch (error) {
      const errorMsg = `Advanced sync error: ${error}`;
      setLastError(errorMsg);
      Alert.alert("Error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const StatusIndicator = ({
    label,
    status,
  }: {
    label: string;
    status: boolean;
  }) => (
    <View style={styles.statusRow}>
      <Text style={styles.statusLabel}>{label}:</Text>
      <Text
        style={[styles.statusValue, { color: status ? "#4CAF50" : "#F44336" }]}
      >
        {status ? "✅ Yes" : "❌ No"}
      </Text>
    </View>
  );

  const ActionButton = ({
    title,
    onPress,
    disabled = false,
  }: {
    title: string;
    onPress: () => void;
    disabled?: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏥 ROOK Health Integration</Text>
        <Text style={styles.subtitle}>H2Oasis Demo</Text>
      </View>

      {/* Error Display */}
      {lastError && (
        <View style={styles.errorSection}>
          <Text style={styles.errorTitle}>🚨 Last Error:</Text>
          <Text style={styles.errorText}>{lastError}</Text>
          <TouchableOpacity
            style={styles.clearErrorButton}
            onPress={() => setLastError("")}
          >
            <Text style={styles.clearErrorText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Status Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Current Status</Text>
        <StatusIndicator label="ROOK SDK Ready" status={rookReady} />
        <StatusIndicator label="Setup Complete" status={isSetupComplete} />
        <StatusIndicator
          label="Permissions Granted"
          status={permissionsGranted}
        />
        <StatusIndicator label="User Configured" status={userConfigured} />
      </View>

      {/* Setup Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Setup Actions</Text>

        <View style={styles.userIdContainer}>
          <Text style={styles.userIdLabel}>User ID:</Text>
          <TextInput
            style={styles.userIdInput}
            value={userId}
            onChangeText={setUserId}
            placeholder="Enter user ID (alphanumeric only)"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <ActionButton
          title="1. Request Health Permissions"
          onPress={handleRequestPermissions}
          disabled={!rookReady || permissionsGranted}
        />

        <ActionButton
          title="2. Configure User"
          onPress={handleConfigureUser}
          disabled={!rookReady || userConfigured || !permissionsGranted}
        />

        <ActionButton
          title="3. Complete Full Setup"
          onPress={handleCompleteSetup}
          disabled={!rookReady || isSetupComplete}
        />
      </View>

      {/* Data Sync Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📱 Data Sync Actions</Text>

        <ActionButton
          title="Sync Today's Data"
          onPress={handleSyncToday}
          disabled={!rookReady || !isSetupComplete}
        />

        <ActionButton
          title="Sync Yesterday's Data"
          onPress={handleSyncYesterday}
          disabled={!rookReady || !isSetupComplete}
        />

        <ActionButton
          title="Retry Failed Syncs"
          onPress={handleRetryFailed}
          disabled={!rookReady || !isSetupComplete}
        />

        <ActionButton
          title="Sync Advanced Health Data (BP, SpO2, HR)"
          onPress={handleSyncAdvanced}
          disabled={!rookReady || !isSetupComplete}
        />
      </View>

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Processing...</Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>User ID: {userId}</Text>
        <Text style={styles.footerNote}>
          💡 Make sure you&apos;ve added HealthKit capability in Xcode before
          testing
        </Text>
        {!rookReady && (
          <Text style={styles.footerNote}>
            ⏳ Waiting for ROOK SDK to initialize...
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 20,
    backgroundColor: "#007AFF",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  section: {
    margin: 15,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  statusLabel: {
    fontSize: 16,
    color: "#333",
  },
  statusValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 5,
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonTextDisabled: {
    color: "#888888",
  },
  loadingContainer: {
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  footerNote: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    fontStyle: "italic",
  },
  errorSection: {
    margin: 15,
    padding: 15,
    backgroundColor: "#ffebee",
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#f44336",
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#d32f2f",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: "#d32f2f",
    marginBottom: 10,
  },
  clearErrorButton: {
    alignSelf: "flex-end",
    backgroundColor: "#f44336",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  clearErrorText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  userIdContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  userIdLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  userIdInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    backgroundColor: "white",
  },
});
