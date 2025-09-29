import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConversationalAI from '../components/ConversationalAI';
import { elevenlabsService } from '../services/elevenlabsService';

const VoiceChatTestScreen = () => {
  const [agentId, setAgentId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAgentConfig();
  }, []);

  const loadAgentConfig = async () => {
    try {
      setLoading(true);
      
      // Get user ID from storage (or use test user)
      const storedUserId = await AsyncStorage.getItem('userId');
      setUserId(storedUserId || 'test-user');
      
      // Get agent configuration from backend via service
      console.log('🔄 Loading agent config...');
      const config = await elevenlabsService.getAgentConfig();
      console.log('✅ Agent config loaded:', config);
      
      setAgentId(config.agentId);
      
    } catch (err) {
      console.error('❌ Failed to load agent config:', err);
      setError('Failed to load voice chat configuration');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading voice chat...</Text>
      </View>
    );
  }

  if (error || !agentId) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>
          {error || 'Voice chat unavailable'}
        </Text>
        <Text style={styles.helpText}>
          Make sure you're logged in and the backend is running
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Debug info */}
      <View style={styles.debugContainer}>
        <Text style={styles.debugText}>Agent ID: {agentId.substring(0, 20)}...</Text>
        <Text style={styles.debugText}>User: {userId}</Text>
      </View>
      
      <ConversationalAI
        agentId={agentId}
        userId={userId || 'test-user'}
        onConversationStart={() => {
          console.log('🎤 Voice chat started!');
        }}
        onConversationEnd={() => {
          console.log('📞 Voice chat ended!');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  centered: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  helpText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  debugContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 10,
    borderRadius: 5,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
});

export default VoiceChatTestScreen;