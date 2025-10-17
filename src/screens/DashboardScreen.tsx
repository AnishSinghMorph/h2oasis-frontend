import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  AppState,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';

interface HealthData {
  sleep?: {
    duration_minutes?: number;
    efficiency_percentage?: number;
    sleep_start?: string;
    sleep_end?: string;
    deep_sleep_minutes?: number;
    rem_sleep_minutes?: number;
    light_sleep_minutes?: number;
    awake_minutes?: number;
    hrv?: {
      rmssd_avg_ms?: number;
    };
    breathing?: {
      avg_breaths_per_min?: number;
      spo2_avg_percentage?: number;
    };
  };
  physical?: {
    steps?: number;
    calories_kcal?: number;
    active_calories_kcal?: number;
    distance_meters?: number;
    floors_climbed?: number;
    active_minutes?: number;
    heart_rate?: {
      min_bpm?: number;
      max_bpm?: number;
      avg_bpm?: number;
    };
  };
  body?: {
    weight_kg?: number;
    height_cm?: number;
    bmi?: number;
    body_fat_percentage?: number;
    heart_rate_resting_bpm?: number;
  };
  activity_events?: Array<{
    activity_name?: string;
    activity_type?: string;
    duration_minutes?: number;
    calories_burned?: number;
  }>;
}

interface WearableData {
  id: string;
  name: string;
  connected: boolean;
  lastSync?: string;
  data?: HealthData | null;
}

interface UnifiedHealthData {
  wearables: {
    oura?: WearableData;
    fitbit?: WearableData;
    garmin?: WearableData;
    whoop?: WearableData;
    apple?: WearableData;
    samsung?: WearableData;
  };
}

const DashboardScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { firebaseUID } = useAuth();
  const [healthData, setHealthData] = useState<UnifiedHealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch health data from API
  const fetchHealthData = async () => {
    try {
      if (!firebaseUID) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/health-data`, {
        method: 'GET',
        headers: {
          'x-firebase-uid': firebaseUID,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        setHealthData(result.data);
        setError(null);
      } else {
        setError('Failed to fetch health data');
      }
    } catch (err) {
      console.error('Error fetching health data:', err);
      setError('Network error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchHealthData();
  }, [firebaseUID]);

  // ✅ Auto-refresh when screen comes into focus (when you open the app)
  useFocusEffect(
    React.useCallback(() => {
      console.log('📱 Dashboard focused - fetching latest health data...');
      fetchHealthData();
    }, [firebaseUID])
  );

  // ✅ Auto-refresh when app comes to foreground (from background)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        console.log('🔄 App came to foreground - refreshing health data...');
        fetchHealthData();
      }
    });

    return () => {
      subscription?.remove();
    };
  }, [firebaseUID]);

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchHealthData();
  };

  // Get best available data (prioritize Oura > Fitbit > Garmin > Whoop)
  const getBestData = (): HealthData | null => {
    const wearables = healthData?.wearables;
    if (!wearables) return null;

    // Try each wearable in priority order
    const sources = [
      wearables.oura,
      wearables.fitbit,
      wearables.garmin,
      wearables.whoop,
    ];

    for (const source of sources) {
      if (source?.data) {
        // Check if data is in new format (has sleep, physical, body fields)
        if (
          source.data.sleep ||
          source.data.physical ||
          source.data.body ||
          source.data.activity_events
        ) {
          return source.data;
        }
      }
    }

    return null;
  };

  const data = getBestData();

  // Helper functions
  const formatTime = (minutes?: number) => {
    if (!minutes) return '0h 0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDistance = (meters?: number) => {
    if (!meters) return '0 km';
    return `${(meters / 1000).toFixed(1)} km`;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading health data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>❌ {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchHealthData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Health Dashboard</Text>
        <Text style={styles.subtitle}>Your daily health metrics</Text>
      </View>

      {/* Sleep Data */}
      {data?.sleep && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>😴</Text>
            <Text style={styles.cardTitle}>Sleep</Text>
          </View>
          
          <View style={styles.metricsRow}>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>
                {formatTime(data.sleep.duration_minutes)}
              </Text>
              <Text style={styles.metricLabel}>Duration</Text>
            </View>
            
            <View style={styles.metric}>
              <Text style={styles.metricValue}>
                {data.sleep.efficiency_percentage}%
              </Text>
              <Text style={styles.metricLabel}>Efficiency</Text>
            </View>
            
            {data.sleep.hrv?.rmssd_avg_ms && (
              <View style={styles.metric}>
                <Text style={styles.metricValue}>
                  {data.sleep.hrv.rmssd_avg_ms.toFixed(1)}
                </Text>
                <Text style={styles.metricLabel}>HRV (ms)</Text>
              </View>
            )}
          </View>

          {/* Sleep Stages */}
          <View style={styles.sleepStages}>
            <View style={styles.sleepStage}>
              <View style={[styles.sleepBar, { backgroundColor: '#A8E6CF' }]}>
                <Text style={styles.sleepStageText}>
                  Light {formatTime(data.sleep.light_sleep_minutes)}
                </Text>
              </View>
            </View>
            <View style={styles.sleepStage}>
              <View style={[styles.sleepBar, { backgroundColor: '#FFD3B6' }]}>
                <Text style={styles.sleepStageText}>
                  REM {formatTime(data.sleep.rem_sleep_minutes)}
                </Text>
              </View>
            </View>
            <View style={styles.sleepStage}>
              <View style={[styles.sleepBar, { backgroundColor: '#AABFFF' }]}>
                <Text style={styles.sleepStageText}>
                  Deep {formatTime(data.sleep.deep_sleep_minutes)}
                </Text>
              </View>
            </View>
          </View>

          {/* Health Insight */}
          {data.sleep.efficiency_percentage && (
            <View style={styles.insight}>
              <Text style={styles.insightText}>
                {data.sleep.efficiency_percentage >= 90
                  ? '🏆 Excellent sleep quality!'
                  : data.sleep.efficiency_percentage >= 80
                  ? '✅ Good sleep quality'
                  : '⚠️ Sleep quality could be better'}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Physical Activity */}
      {data?.physical && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>🏃</Text>
            <Text style={styles.cardTitle}>Activity</Text>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>
                {data.physical.steps?.toLocaleString() || '0'}
              </Text>
              <Text style={styles.metricLabel}>Steps</Text>
            </View>

            <View style={styles.metric}>
              <Text style={styles.metricValue}>
                {data.physical.calories_kcal || '0'}
              </Text>
              <Text style={styles.metricLabel}>Calories</Text>
            </View>

            <View style={styles.metric}>
              <Text style={styles.metricValue}>
                {formatDistance(data.physical.distance_meters)}
              </Text>
              <Text style={styles.metricLabel}>Distance</Text>
            </View>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>
                {formatTime(data.physical.active_minutes)}
              </Text>
              <Text style={styles.metricLabel}>Active Time</Text>
            </View>

            <View style={styles.metric}>
              <Text style={styles.metricValue}>
                {data.physical.floors_climbed || '0'}
              </Text>
              <Text style={styles.metricLabel}>Floors</Text>
            </View>

            {data.physical.heart_rate?.avg_bpm && (
              <View style={styles.metric}>
                <Text style={styles.metricValue}>
                  {data.physical.heart_rate.avg_bpm}
                </Text>
                <Text style={styles.metricLabel}>Avg HR</Text>
              </View>
            )}
          </View>

          {/* Activity Insight */}
          {data.physical.steps && (
            <View style={styles.insight}>
              <Text style={styles.insightText}>
                {data.physical.steps >= 10000
                  ? '🏆 Great job! Hit 10k steps goal!'
                  : data.physical.steps >= 7500
                  ? '✅ Good activity level'
                  : `⚡ ${10000 - data.physical.steps} steps to reach goal`}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Body Metrics */}
      {data?.body && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>⚖️</Text>
            <Text style={styles.cardTitle}>Body Metrics</Text>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>
                {data.body.weight_kg?.toFixed(1) || '—'}
              </Text>
              <Text style={styles.metricLabel}>Weight (kg)</Text>
            </View>

            <View style={styles.metric}>
              <Text style={styles.metricValue}>
                {data.body.bmi?.toFixed(1) || '—'}
              </Text>
              <Text style={styles.metricLabel}>BMI</Text>
            </View>

            {data.body.body_fat_percentage && (
              <View style={styles.metric}>
                <Text style={styles.metricValue}>
                  {data.body.body_fat_percentage.toFixed(1)}%
                </Text>
                <Text style={styles.metricLabel}>Body Fat</Text>
              </View>
            )}
          </View>

          {data.body.heart_rate_resting_bpm && (
            <View style={styles.metricsRow}>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>
                  {data.body.heart_rate_resting_bpm}
                </Text>
                <Text style={styles.metricLabel}>Resting HR</Text>
              </View>
            </View>
          )}

          {/* BMI Insight */}
          {data.body.bmi && (
            <View style={styles.insight}>
              <Text style={styles.insightText}>
                {data.body.bmi < 18.5
                  ? '⚠️ Underweight'
                  : data.body.bmi <= 24.9
                  ? '✅ Healthy weight range'
                  : data.body.bmi <= 29.9
                  ? '⚠️ Overweight'
                  : '⚠️ Consult healthcare provider'}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Recent Activities */}
      {data?.activity_events && data.activity_events.length > 0 && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>🎯</Text>
            <Text style={styles.cardTitle}>Recent Workouts</Text>
          </View>

          {data.activity_events.slice(0, 3).map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={styles.activityHeader}>
                <Text style={styles.activityName}>
                  {activity.activity_name || activity.activity_type}
                </Text>
                <Text style={styles.activityDuration}>
                  {formatTime(activity.duration_minutes)}
                </Text>
              </View>
              <Text style={styles.activityCalories}>
                🔥 {activity.calories_burned} cal
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* No Data Message */}
      {!data?.sleep && !data?.physical && !data?.body && (
        <View style={styles.noDataCard}>
          <Text style={styles.noDataIcon}>📊</Text>
          <Text style={styles.noDataTitle}>No Health Data Yet</Text>
          <Text style={styles.noDataText}>
            Connect a wearable device to start tracking your health metrics
          </Text>
        </View>
      )}

      {/* Connected Wearables */}
      <View style={styles.wearablesSection}>
        <Text style={styles.sectionTitle}>Connected Devices</Text>
        <View style={styles.wearablesList}>
          {Object.entries(healthData?.wearables || {}).map(([key, wearable]) => (
            wearable?.connected && (
              <View key={key} style={styles.wearableChip}>
                <Text style={styles.wearableChipText}>
                  ✓ {wearable.name}
                </Text>
              </View>
            )
          ))}
        </View>
        
        {/* Connect More Wearables Button */}
        <TouchableOpacity
          style={styles.connectMoreButton}
          onPress={() => navigation.navigate('ConeectWearables')}
        >
          <Text style={styles.connectMoreButtonText}>
            ➕ Connect More Wearables
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          🔄 Pull down to refresh • Data updates automatically from wearables
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  metric: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 5,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  sleepStages: {
    marginTop: 10,
  },
  sleepStage: {
    marginBottom: 8,
  },
  sleepBar: {
    padding: 10,
    borderRadius: 8,
  },
  sleepStageText: {
    color: '#1A1A1A',
    fontWeight: '500',
    fontSize: 14,
  },
  insight: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  insightText: {
    color: '#1A1A1A',
    fontSize: 14,
    fontWeight: '500',
  },
  activityItem: {
    padding: 15,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 10,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  activityDuration: {
    fontSize: 14,
    color: '#6B7280',
  },
  activityCalories: {
    fontSize: 14,
    color: '#6B7280',
  },
  noDataCard: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  noDataIcon: {
    fontSize: 64,
    marginBottom: 15,
  },
  noDataTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  noDataText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  wearablesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  wearablesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  wearableChip: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  wearableChipText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  connectMoreButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  connectMoreButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default DashboardScreen;
