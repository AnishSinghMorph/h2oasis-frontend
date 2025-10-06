import { useState, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import {
  useRookPermissions,
  useRookConfiguration,
  useRookSync,
  SDKDataSource,
} from 'react-native-rook-sdk';

/**
 * Custom hook for Samsung Health integration via ROOK SDK
 * 
 * This hook wraps the ROOK SDK's Samsung Health functionality and provides
 * a clean interface for:
 * - Checking if Samsung Health is available (Android only)
 * - Requesting Samsung Health permissions
 * - Syncing health data from Samsung Health
 * - Checking SDK readiness
 * 
 * Note: Samsung Health uses the same ROOK SDK hooks as Apple Health,
 * but with Android-specific behavior. The SDK automatically detects
 * the platform and uses the appropriate health data source.
 * 
 * @returns {Object} Samsung Health operations and status
 * 
 * @example
 * const { isReady, requestPermissions, syncData } = useSamsungHealth();
 * 
 * // Check if ready
 * if (isReady) {
 *   await requestPermissions();
 *   await syncData(new Date());
 * }
 */
export const useSamsungHealth = () => {
  const [isReady, setIsReady] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  
  // ROOK SDK hooks (same as Apple Health but for Android/Samsung Health)
  const {
    requestAllPermissions,
    ready: permissionsReady,
  } = useRookPermissions();

  const {
    syncUserTimeZone,
    enableSamsungSync,
    isSamsungSyncEnabled,
    ready: configReady,
  } = useRookConfiguration();

  const {
    sync,
    syncEvents,
  } = useRookSync();

  // Combined ready state
  useEffect(() => {
    const ready = permissionsReady && configReady;
    setIsReady(ready);
    console.log('🏥 Samsung Health SDK Ready:', ready, {
      permissionsReady,
      configReady,
    });
  }, [permissionsReady, configReady]);

  useEffect(() => {
    // Samsung Health is only available on Android
    const available = Platform.OS === 'android';
    setIsAvailable(available);
    
    if (!available) {
      console.log('⚠️ Samsung Health is only available on Android devices');
    }
  }, []);

  /**
   * Check if Samsung Health is available on this device
   * @returns {Promise<boolean>} True if available
   */
  const checkAvailability = async (): Promise<boolean> => {
    try {
      // Samsung Health only works on Android
      if (Platform.OS !== 'android') {
        return false;
      }
      
      // Check if ROOK SDK is ready
      if (!isReady) {
        console.warn('⚠️ Samsung Health SDK not ready yet');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error checking Samsung Health availability:', error);
      return false;
    }
  };

  /**
   * Request permissions for Samsung Health (Android)
   * Opens Samsung Health app to request permissions
   * @returns {Promise<boolean>} True if permissions granted
   */
  const requestSamsungPermissions = async (): Promise<boolean> => {
    try {
      if (!isReady) {
        Alert.alert('Not Ready', 'Samsung Health SDK is not ready yet. Please try again.');
        return false;
      }

      if (Platform.OS !== 'android') {
        console.warn('⚠️ Samsung Health is only available on Android');
        return false;
      }

      console.log('📋 Requesting Samsung Health permissions...');
      console.log('🚀 This will open Samsung Health app...');
      
      // Request all permissions - this opens Samsung Health
      await requestAllPermissions();
      
      console.log('✅ Permission request sent to Samsung Health');
      
      // Enable Samsung Health sync
      await enableSamsungSync();
      console.log('✅ Samsung Health sync enabled');
      
      return true;
    } catch (error: any) {
      console.error('❌ Error requesting Samsung Health permissions:', error);
      
      // Check if it's an authorization error
      if (error?.message?.includes('2003') || error?.message?.includes('authorization')) {
        Alert.alert(
          'Samsung Partnership Required',
          'Samsung Health requires developer approval.\n\n' +
          'To access health data:\n' +
          '1. Apply at: developer.samsung.com/SHealth/partner\n' +
          '2. Get Client ID & Access Code (1-2 weeks)\n' +
          '3. Enable developer mode in Samsung Health\n\n' +
          'This is required by Samsung for security.'
        );
      } else {
        Alert.alert('Error', `Failed to request permissions: ${error?.message || 'Unknown error'}`);
      }
      
      return false;
    }
  };

  /**
   * Get user's timezone for data syncing
   * @returns {Promise<string>} User's timezone string
   */
  const getUserTimeZone = async (): Promise<string> => {
    try {
      // Sync timezone first
      await syncUserTimeZone();
      
      // Get device timezone
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      console.log('🌍 User timezone:', timezone);
      return timezone;
    } catch (error) {
      console.error('❌ Error getting user timezone:', error);
      return 'UTC';
    }
  };

  /**
   * Sync health data from Samsung Health for a specific date
   * @param {Date} date - The date to sync data for
   * @returns {Promise<{sleep: boolean, physical: boolean, body: boolean}>} Sync results
   */
  const syncData = async (date: Date): Promise<{sleep: boolean, physical: boolean, body: boolean}> => {
    try {
      if (!isReady) {
        throw new Error('Samsung Health SDK not ready');
      }

      if (Platform.OS !== 'android') {
        throw new Error('Samsung Health is only available on Android');
      }

      // Enable Samsung Health sync if needed
      const syncEnabled = await isSamsungSyncEnabled();
      if (!syncEnabled) {
        console.log('🔧 Enabling Samsung sync...');
        await enableSamsungSync();
      }

      // Format date as YYYY-MM-DD
      let dateString = date.toISOString().split('T')[0];
      
      // Use yesterday for summaries if today is passed
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      
      if (targetDate.getTime() === today.getTime()) {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        dateString = yesterday.toISOString().split('T')[0];
      }
      
      console.log(`📅 Syncing data for date: ${dateString}`);
      
      // Results object
      const results = {
        sleep: false,
        physical: false,
        body: false,
      };
      
      const summaryTypes: Array<'sleep' | 'physical' | 'body'> = ['sleep', 'physical', 'body'];
      
      for (const summaryType of summaryTypes) {
        console.log(`📊 Syncing ${summaryType}...`);
        
        await new Promise<void>((resolve) => {
          sync(
            (result) => {
              console.log(`📦 ${summaryType} result:`, result);
              
              if (result.samsungHealth?.status) {
                console.log(`✅ ${summaryType} synced successfully`);
                results[summaryType] = true;
              } else if (result.samsungHealth?.error) {
                console.error(`❌ ${summaryType} error:`, result.samsungHealth.error);
              } else {
                console.warn(`⚠️ ${summaryType} - no status returned`);
              }
              resolve();
            },
            {
              date: dateString,
              summary: summaryType,
              sources: [SDKDataSource.SAMSUNG_HEALTH],
            }
          );
        });
      }
      
      console.log('✅ Sync complete. Results:', results);
      
      return results;
    } catch (error: any) {
      console.error('❌ Sync error:', error);
      console.error('❌ Error details:', error?.message, error?.code);
      throw error;
    }
  };

  /**
   * Sync data for the last N days
   * @param {number} days - Number of days to sync (default: 7)
   * @returns {Promise<{success: number, failed: number}>} Sync results
   */
  const syncLastNDays = async (days: number = 7): Promise<{ success: number; failed: number }> => {
    let successCount = 0;
    let failedCount = 0;

    try {
      const today = new Date();
      
      for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        try {
          const result = await syncData(date);
          if (result) {
            successCount++;
          } else {
            failedCount++;
          }
        } catch (error) {
          console.error(`❌ Failed to sync data for ${date.toISOString()}:`, error);
          failedCount++;
        }
      }

      console.log(`📊 Sync complete: ${successCount} success, ${failedCount} failed`);
      return { success: successCount, failed: failedCount };
    } catch (error) {
      console.error('❌ Error syncing last N days:', error);
      throw error;
    }
  };

  return {
    // Status
    isReady,
    isAvailable,
    
    // Functions
    checkAvailability,
    requestPermissions: requestSamsungPermissions,
    getUserTimeZone,
    syncData,
    syncLastNDays,
  };
};
