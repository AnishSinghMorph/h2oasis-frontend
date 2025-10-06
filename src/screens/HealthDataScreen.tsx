import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useRookHealth } from "../hooks/useRookHealth";

const HealthDataScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [refreshing, setRefreshing] = useState(false);
  const [healthData, setHealthData] = useState<any>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string>("");

  const { rookReady, isSetupComplete, syncTodayData } = useRookHealth();

  const fetchHealthData = async () => {
    if (!rookReady || !isSetupComplete) {
      Alert.alert(
        "Setup Required",
        "Please complete Apple Health setup first.",
      );
      return;
    }

    try {
      console.log("🔄 Fetching health data...");
      const result = await syncTodayData();
      setHealthData(result);
      setLastSyncTime(new Date().toLocaleTimeString());
      console.log("✅ Health data fetched:", result);
    } catch (error) {
      console.error("❌ Failed to fetch health data:", error);
      Alert.alert("Error", "Failed to fetch health data");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHealthData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchHealthData();
  }, [rookReady, isSetupComplete]);

  const StatusCard = ({
    title,
    value,
    status,
  }: {
    title: string;
    value: string;
    status: "success" | "warning" | "error";
  }) => {
    const statusColors = {
      success: "#4CAF50",
      warning: "#FF9800",
      error: "#F44336",
    };

    return (
      <View style={[styles.card, { borderLeftColor: statusColors[status] }]}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardValue}>{value}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Apple Health Data</Text>
        <TouchableOpacity onPress={fetchHealthData}>
          <Text style={styles.refreshButton}>🔄</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Status Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔧 Setup Status</Text>
          <StatusCard
            title="ROOK SDK"
            value={rookReady ? "Ready ✅" : "Not Ready ❌"}
            status={rookReady ? "success" : "error"}
          />
          <StatusCard
            title="Apple Health Setup"
            value={isSetupComplete ? "Complete ✅" : "Incomplete ❌"}
            status={isSetupComplete ? "success" : "error"}
          />
          {lastSyncTime && (
            <StatusCard
              title="Last Sync"
              value={lastSyncTime}
              status="success"
            />
          )}
        </View>

        {/* Health Data Section */}
        {healthData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 Today&apos;s Health Data</Text>

            {/* Steps Data */}
            {healthData.stepsData && (
              <StatusCard
                title="Steps"
                value={`${healthData.stepsData.steps || 0} steps`}
                status={healthData.stepsData.steps > 0 ? "success" : "warning"}
              />
            )}

            {/* Calories Data */}
            {healthData.caloriesData && (
              <>
                <StatusCard
                  title="Total Calories"
                  value={`${healthData.caloriesData.total || 0} cal`}
                  status={
                    healthData.caloriesData.total > 0 ? "success" : "warning"
                  }
                />
                <StatusCard
                  title="Active Calories"
                  value={`${healthData.caloriesData.active || 0} cal`}
                  status={
                    healthData.caloriesData.active > 0 ? "success" : "warning"
                  }
                />
                <StatusCard
                  title="Basal Calories"
                  value={`${healthData.caloriesData.basal || 0} cal`}
                  status={
                    healthData.caloriesData.basal > 0 ? "success" : "warning"
                  }
                />
              </>
            )}

            {/* Distance Data */}
            {healthData.distanceData && (
              <StatusCard
                title="Distance"
                value={`${(healthData.distanceData.distance || 0).toFixed(2)} km`}
                status={
                  healthData.distanceData.distance > 0 ? "success" : "warning"
                }
              />
            )}

            {/* Heart Rate Data */}
            {healthData.heartRateData && (
              <>
                <StatusCard
                  title="Average Heart Rate"
                  value={`${healthData.heartRateData.average || 0} bpm`}
                  status={
                    healthData.heartRateData.average > 0 ? "success" : "warning"
                  }
                />
                <StatusCard
                  title="Max Heart Rate"
                  value={`${healthData.heartRateData.max || 0} bpm`}
                  status={
                    healthData.heartRateData.max > 0 ? "success" : "warning"
                  }
                />
                <StatusCard
                  title="Min Heart Rate"
                  value={`${healthData.heartRateData.min || 0} bpm`}
                  status={
                    healthData.heartRateData.min > 0 ? "success" : "warning"
                  }
                />
              </>
            )}

            {/* Sleep Data */}
            {healthData.sleepData && (
              <StatusCard
                title="Sleep Duration"
                value={`${(healthData.sleepData.duration || 0).toFixed(1)} hours`}
                status={
                  healthData.sleepData.duration > 0 ? "success" : "warning"
                }
              />
            )}

            {/* Summary */}
            <StatusCard
              title="Sync Summary"
              value={
                healthData.summary ||
                "            No data available yet. Make sure you&apos;ve granted Health permissions"
              }
              status={healthData.success ? "success" : "warning"}
            />
          </View>
        )}

        {/* Raw Data Section */}
        {healthData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔍 Raw Data (Debug)</Text>
            <View style={styles.rawDataContainer}>
              <Text style={styles.rawDataText}>
                {JSON.stringify(healthData, null, 2)}
              </Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={fetchHealthData}
            disabled={!rookReady || !isSetupComplete}
          >
            <Text style={styles.actionButtonText}>🔄 Refresh Data</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => navigation.navigate("AIAssistant")}
          >
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
              Continue to AI Assistant →
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    fontSize: 16,
    color: "#007AFF",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  refreshButton: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    margin: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  rawDataContainer: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  rawDataText: {
    fontSize: 12,
    fontFamily: "Courier",
    color: "#333",
  },
  actionButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  secondaryButtonText: {
    color: "#007AFF",
  },
});

export default HealthDataScreen;
