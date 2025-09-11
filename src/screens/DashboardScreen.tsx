import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../context/AuthContext";

type DashboardScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Dashboard"
>;

const DashboardScreen = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate("Landing");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.content}>
        <Text style={styles.title}>Welcome to H2Oasis!</Text>
        <Text style={styles.subtitle}>
          Your wellness dashboard - main app features will go here
        </Text>

        <View style={styles.placeholderSection}>
          <Text style={styles.sectionTitle}>
            Dashboard Features (Coming Soon):
          </Text>
          <Text style={styles.featureItem}>
            • View your selected wellness device
          </Text>
          <Text style={styles.featureItem}>• Track your wellness sessions</Text>
          <Text style={styles.featureItem}>• Connect with wearables</Text>
          <Text style={styles.featureItem}>• View progress and stats</Text>
          <Text style={styles.featureItem}>• Manage settings</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },
  placeholderSection: {
    backgroundColor: "#f8fafc",
    padding: 20,
    borderRadius: 12,
    marginBottom: 40,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 16,
  },
  featureItem: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
    lineHeight: 20,
  },
  logoutButton: {
    backgroundColor: "#dc2626",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DashboardScreen;
