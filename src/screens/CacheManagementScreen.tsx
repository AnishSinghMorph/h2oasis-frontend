import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FastImage from "react-native-fast-image";
import { styles } from "../styles/CacheManagementScreen.styles";

const CacheManagementScreen = () => {
  const navigation = useNavigation();
  const [totalSize, setTotalSize] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    calculateCacheSize();
  }, []);

  const calculateCacheSize = async () => {
    setLoading(true);
    try {
      const keys = await AsyncStorage.getAllKeys();
      let total = 0;

      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          const size = new Blob([value]).size;
          total += size;
        }
      }

      setTotalSize(total);
      setItemCount(keys.length);
    } catch (error) {
      console.error("Error calculating cache size:", error);
      Alert.alert("Error", "Failed to calculate cache size");
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const clearAllCache = async () => {
    Alert.alert(
      "Clear All Cache",
      "This will remove all cached data including login session. You will need to log in again.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            setClearing(true);
            try {
              await AsyncStorage.clear();
              await FastImage.clearMemoryCache();
              await FastImage.clearDiskCache();

              Alert.alert("Success", "All cache cleared successfully", [
                {
                  text: "OK",
                  onPress: () =>
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "Landing" as never }],
                    }),
                },
              ]);
            } catch (error) {
              console.error("Error clearing cache:", error);
              Alert.alert("Error", "Failed to clear cache");
            } finally {
              setClearing(false);
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#1E3A3A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cache Management</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#89D5D5" />
          <Text style={styles.loadingText}>Calculating cache size...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#1E3A3A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cache Management</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <View style={styles.cacheInfoRow}>
            <Ionicons name="server-outline" size={64} color="#89D5D5" />
            <View style={styles.cacheInfoText}>
              <Text style={styles.summaryTitle}>Total Cache Size</Text>
              <Text style={styles.summarySize}>{formatBytes(totalSize)}</Text>
              <Text style={styles.summarySubtext}>
                {itemCount} items stored
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearAllCache}
            disabled={clearing}
          >
            <Ionicons name="trash-outline" size={20} color="#fff" />
            <Text style={styles.clearButtonText}>Clear Cache</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {clearing && (
        <View style={styles.clearingOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.clearingText}>Clearing cache...</Text>
        </View>
      )}
    </View>
  );
};

export default CacheManagementScreen;
