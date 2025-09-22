import { useState, useCallback, useRef } from 'react';
import { ttsService } from '../services/ttsService';
import { useVoice } from '../context/VoiceContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TTSState {
  [messageIndex: number]: {
    isLoading: boolean;
    isPlaying: boolean;
    audioUrl?: string;
    error?: string;
  };
}

// Rate limiting configuration
const RATE_LIMIT_DELAY = 2000; // 2 seconds between requests
const MAX_CONCURRENT_REQUESTS = 1;

export const useChatTTS = () => {
  const [ttsStates, setTTSStates] = useState<TTSState>({});
  const { selectedVoice } = useVoice();
  
  // Rate limiting state
  const lastRequestTime = useRef<number>(0);
  const activeRequestCount = useRef<number>(0);
  const requestQueue = useRef<Array<() => void>>([]);

  // Rate limiting helper
  const executeWithRateLimit = useCallback(async (fn: () => Promise<void>) => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime.current;
    
    // Check if we need to wait
    if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
      const waitTime = RATE_LIMIT_DELAY - timeSinceLastRequest;
      console.log(`⏳ Rate limiting: waiting ${waitTime}ms before next TTS request`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    // Check concurrent request limit
    if (activeRequestCount.current >= MAX_CONCURRENT_REQUESTS) {
      console.log('🚦 Max concurrent requests reached, queueing...');
      return new Promise<void>((resolve) => {
        requestQueue.current.push(async () => {
          await fn();
          resolve();
        });
      });
    }
    
    lastRequestTime.current = Date.now();
    activeRequestCount.current++;
    
    try {
      await fn();
    } finally {
      activeRequestCount.current--;
      
      // Process next item in queue
      const nextRequest = requestQueue.current.shift();
      if (nextRequest) {
        setTimeout(nextRequest, RATE_LIMIT_DELAY);
      }
    }
  }, []);

  // Get Firebase UID for authenticated TTS requests
  const getUserToken = async (): Promise<string | undefined> => {
    try {
      return await AsyncStorage.getItem('userId') || 'demo-user-123';
    } catch (error) {
      console.error('Error getting user token:', error);
      return 'demo-user-123';
    }
  };

  const generateTTS = useCallback(async (text: string, messageIndex: number) => {
    if (!selectedVoice) {
      console.warn('No voice selected for TTS');
      return;
    }

    // Check if already loading or has audio
    const currentState = ttsStates[messageIndex];
    if (currentState?.isLoading || currentState?.audioUrl) {
      console.log('🔄 TTS already in progress or exists for message', messageIndex);
      return;
    }

    // Set loading state
    setTTSStates(prev => ({
      ...prev,
      [messageIndex]: {
        ...prev[messageIndex],
        isLoading: true,
        error: undefined,
      }
    }));

    await executeWithRateLimit(async () => {
      try {
        const userToken = await getUserToken();
        
        console.log('🎤 Requesting TTS for message', messageIndex, 'with voice', selectedVoice.name);
        
        const result = await ttsService.textToSpeech({
          text,
          voiceKey: selectedVoice.key,
          speed: 1.0,
        }, userToken);

        if (result.success && result.audioUrl) {
          setTTSStates(prev => ({
            ...prev,
            [messageIndex]: {
              ...prev[messageIndex],
              isLoading: false,
              audioUrl: result.audioUrl,
            }
          }));
          console.log('✅ TTS generated successfully for message', messageIndex);
        } else {
          throw new Error(result.error || 'TTS generation failed');
        }
      } catch (error) {
        console.error('❌ TTS generation error:', error);
        setTTSStates(prev => ({
          ...prev,
          [messageIndex]: {
            ...prev[messageIndex],
            isLoading: false,
            error: error instanceof Error ? error.message : 'TTS failed',
          }
        }));
      }
    });
  }, [selectedVoice, ttsStates, executeWithRateLimit]);

  const stopTTS = useCallback(async () => {
    await ttsService.stopAudio();
    
    // Reset all playing states
    setTTSStates(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        updated[parseInt(key)].isPlaying = false;
      });
      return updated;
    });
  }, []);

  const playTTS = useCallback(async (messageIndex: number) => {
    const state = ttsStates[messageIndex];
    if (!state?.audioUrl) {
      console.warn('No audio URL available for message', messageIndex);
      return;
    }

    // Stop any currently playing audio first
    if (Object.values(ttsStates).some(s => s.isPlaying)) {
      console.log('🛑 Stopping previous audio before playing new one...');
      await stopTTS();
      // Small delay to ensure cleanup
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Set playing state
    setTTSStates(prev => ({
      ...prev,
      [messageIndex]: {
        ...prev[messageIndex],
        isPlaying: true,
      }
    }));

    try {
      const success = await ttsService.playAudio(state.audioUrl);
      if (!success) {
        throw new Error('Audio playback failed');
      }

      // Audio will stop automatically when finished
      // The TTS service handles the cleanup
      setTimeout(() => {
        setTTSStates(prev => ({
          ...prev,
          [messageIndex]: {
            ...prev[messageIndex],
            isPlaying: false,
          }
        }));
      }, 1000); // Small delay to allow playback to start

    } catch (error) {
      console.error('Audio playback error:', error);
      setTTSStates(prev => ({
        ...prev,
        [messageIndex]: {
          ...prev[messageIndex],
          isPlaying: false,
          error: 'Playback failed',
        }
      }));
    }
  }, [ttsStates, stopTTS]);

  const getTTSState = useCallback((messageIndex: number) => {
    return ttsStates[messageIndex] || {
      isLoading: false,
      isPlaying: false,
      audioUrl: undefined,
      error: undefined,
    };
  }, [ttsStates]);

  return {
    generateTTS,
    playTTS,
    stopTTS,
    getTTSState,
    selectedVoice,
    isAnyPlaying: Object.values(ttsStates).some(state => state.isPlaying),
  };
};