import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useSamsungHealth } from '../hooks/useSamsungHealth';
import { useRookHealth } from '../hooks/useRookHealth';
import { useAuth } from '../context/AuthContext';
import { fetchAllHealthData } from '../services/rookDataService';

interface HealthDataDisplay {
  sleep?: any;
  physical?: any;
  body?: any;
}

export const SamsungHealthDataViewer = () => {
  const { syncData, isReady, isAvailable } = useSamsungHealth();
  const { firebaseUID } = useAuth();
  const rookHealth = useRookHealth();
  const [syncing, setSyncing] = useState(false);
  const [healthData, setHealthData] = useState<HealthDataDisplay | null>(null);

  // Auto-sync on mount (like Apple Health)
  useEffect(() => {
    if (isReady && isAvailable && !syncing) {
      handleSync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, isAvailable]);

  /**
   * Clean Firebase UID to match ROOK's user_id format
   */
  const getRookUserId = (): string | null => {
    if (!firebaseUID) return null;
    return firebaseUID.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  };

  /**
   * Sync and fetch health data
   */
  const handleSync = async () => {
    if (!isReady || !isAvailable) {
      Alert.alert('Not Ready', 'Samsung Health is not ready yet.');
      return;
    }

    setSyncing(true);
    try {
      // Ensure user is configured
      if (!rookHealth.userConfigured) {
        if (firebaseUID) {
          await rookHealth.configureUser(firebaseUID);
        }
      }

      // Sync yesterday's data (Samsung Health limitation)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      console.log('📊 Syncing Samsung Health data...');
      const syncResult = await syncData(yesterday);
      console.log('✅ Sync result:', syncResult);

      // Fetch data from ROOK API
      const rookUserId = getRookUserId();
      if (!rookUserId) {
        Alert.alert('Error', 'User ID not available');
        return;
      }

      // Wait for ROOK to process (increased to 15 seconds)
      console.log('⏳ Waiting 15 seconds for ROOK to process data...');
      await new Promise(resolve => setTimeout(resolve, 15000));

      const dateString = yesterday.toISOString().split('T')[0];
      console.log(`📅 Fetching data for date: ${dateString}`);
      const rookData = await fetchAllHealthData(rookUserId, dateString);
      
      setHealthData(rookData);
      
      const hasData = rookData.sleep || rookData.physical || rookData.body;
      if (hasData) {
        Alert.alert('Success!', 'Health data synced and loaded successfully!');
      } else {
        Alert.alert(
          'Samsung Partnership Required',
          'Sync completed, but Samsung Health Direct SDK requires developer approval to access data.\n\n' +
          '📋 REQUIRED STEPS:\n\n' +
          '1. Apply for partnership:\n' +
          '   developer.samsung.com/SHealth/partner/m20yrq4swlsx1chf\n\n' +
          '2. Wait for approval (1-2 weeks)\n' +
          '   You\'ll receive Client ID & Access Code via email\n\n' +
          '3. Enable developer mode:\n' +
          '   Samsung Health → Settings → About → Tap version 10x → Enter credentials\n\n' +
          '4. Restart app and sync again\n\n' +
          'This is a one-time setup required by Samsung for health data access.'
        );
      }
    } catch (error) {
      console.error('Error syncing:', error);
      Alert.alert('Error', 'Failed to sync data. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  /**
   * Render sleep data
   */
  const renderSleepData = (data: any) => {
    if (!data) return null;
    const sleepHealth = data.sleep_health || {};
    
    return (
      <View style={styles.dataSection}>
        <Text style={styles.dataTitle}>😴 Sleep</Text>
        
        {sleepHealth.sleep_duration_seconds && (
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Duration</Text>
            <Text style={styles.metricValue}>
              {(sleepHealth.sleep_duration_seconds / 3600).toFixed(1)} hrs
            </Text>
          </View>
        )}
        
        {sleepHealth.sleep_efficiency_percentage && (
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Efficiency</Text>
            <Text style={styles.metricValue}>{sleepHealth.sleep_efficiency_percentage}%</Text>
          </View>
        )}
        
        {sleepHealth.rem_sleep_duration_seconds && (
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>REM Sleep</Text>
            <Text style={styles.metricValue}>
              {(sleepHealth.rem_sleep_duration_seconds / 60).toFixed(0)} min
            </Text>
          </View>
        )}
        
        {sleepHealth.deep_sleep_duration_seconds && (
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Deep Sleep</Text>
            <Text style={styles.metricValue}>
              {(sleepHealth.deep_sleep_duration_seconds / 60).toFixed(0)} min
            </Text>
          </View>
        )}
      </View>
    );
  };

  /**
   * Render physical activity data
   */
  const renderPhysicalData = (data: any) => {
    if (!data) return null;
    const physicalHealth = data.physical_health || {};
    
    return (
      <View style={styles.dataSection}>
        <Text style={styles.dataTitle}>🏃 Activity</Text>
        
        {physicalHealth.steps && (
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Steps</Text>
            <Text style={styles.metricValue}>{physicalHealth.steps.toLocaleString()}</Text>
          </View>
        )}
        
        {physicalHealth.distance_meters && (
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Distance</Text>
            <Text style={styles.metricValue}>
              {(physicalHealth.distance_meters / 1000).toFixed(2)} km
            </Text>
          </View>
        )}
        
        {physicalHealth.calories_net_active_kcal && (
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Active Calories</Text>
            <Text style={styles.metricValue}>{Math.round(physicalHealth.calories_net_active_kcal)} kcal</Text>
          </View>
        )}
        
        {physicalHealth.active_seconds && (
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Active Time</Text>
            <Text style={styles.metricValue}>
              {(physicalHealth.active_seconds / 60).toFixed(0)} min
            </Text>
          </View>
        )}
      </View>
    );
  };

  /**
   * Render body metrics data
   */
  const renderBodyData = (data: any) => {
    if (!data) return null;
    const bodyHealth = data.body_health || {};
    
    return (
      <View style={styles.dataSection}>
        <Text style={styles.dataTitle}>💪 Body</Text>
        
        {bodyHealth.weight_kg && (
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Weight</Text>
            <Text style={styles.metricValue}>{bodyHealth.weight_kg.toFixed(1)} kg</Text>
          </View>
        )}
        
        {bodyHealth.height_cm && (
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Height</Text>
            <Text style={styles.metricValue}>{bodyHealth.height_cm.toFixed(0)} cm</Text>
          </View>
        )}
        
        {bodyHealth.bmi && (
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>BMI</Text>
            <Text style={styles.metricValue}>{bodyHealth.bmi.toFixed(1)}</Text>
          </View>
        )}
        
        {bodyHealth.hydration_ml && (
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Hydration</Text>
            <Text style={styles.metricValue}>{Math.round(bodyHealth.hydration_ml)} ml</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Samsung Health</Text>

      {/* Status */}
      <View style={styles.statusContainer}>
        <Text style={[styles.statusText, { color: isReady ? '#4CAF50' : '#999' }]}>
          {isReady ? '✅ Ready' : '⏳ Loading...'}
        </Text>
      </View>

      {/* Sync Button */}
      <TouchableOpacity
        style={[styles.button, (!isReady || syncing) && styles.buttonDisabled]}
        onPress={handleSync}
        disabled={!isReady || syncing}
      >
        {syncing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sync Data</Text>
        )}
      </TouchableOpacity>

      {/* Health Data Display */}
      {syncing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Syncing your health data...</Text>
        </View>
      )}

      {!syncing && healthData && (
        <ScrollView style={styles.dataContainer}>
          {renderSleepData(healthData.sleep)}
          {renderPhysicalData(healthData.physical)}
          {renderBodyData(healthData.body)}
        </ScrollView>
      )}

      {/* Empty State */}
      {!syncing && !healthData && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No data yet. Tap Sync Data to load your health information.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  statusContainer: {
    marginBottom: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#6200ee',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#555',
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: '#999',
    marginTop: 16,
    fontSize: 14,
  },
  dataContainer: {
    maxHeight: 400,
  },
  dataSection: {
    backgroundColor: '#252525',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  dataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 12,
  },
  metricCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  metricLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});
