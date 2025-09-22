import { Audio } from 'expo-av';
import { API_BASE_URL } from '../config/api';

interface TTSOptions {
  text: string;
  voiceKey: string;
  speed?: number;
}

interface TTSResponse {
  success: boolean;
  audioUrl?: string;
  error?: string;
}

export class TTSService {
  private static instance: TTSService;
  private sound: Audio.Sound | null = null;
  private isPlaying: boolean = false;

  private constructor() {
    // Configure audio mode for TTS
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  }

  public static getInstance(): TTSService {
    if (!TTSService.instance) {
      TTSService.instance = new TTSService();
    }
    return TTSService.instance;
  }

  /**
   * Convert text to speech using backend API
   */
  async textToSpeech(options: TTSOptions, userToken?: string): Promise<TTSResponse> {
    try {
      console.log('🎤 Requesting TTS from backend:', {
        text: options.text.substring(0, 50) + '...',
        voiceKey: options.voiceKey
      });

      const headers: any = {
        'Content-Type': 'application/json',
      };

      // Add auth header if user token provided
      if (userToken) {
        headers['x-firebase-uid'] = userToken;
      }

      const response = await fetch(`${API_BASE_URL}/api/tts/synthesize`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          text: options.text,
          voiceKey: options.voiceKey,
          speed: options.speed || 1.0,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('✅ TTS generated successfully');
        return {
          success: true,
          audioUrl: `${API_BASE_URL}${data.audioUrl}`,
        };
      } else {
        // Handle specific error codes
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
        }
        throw new Error(data.error || `TTS generation failed (${response.status})`);
      }

    } catch (error) {
      console.error('❌ TTS Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown TTS error',
      };
    }
  }

  /**
   * Play generated audio from URL
   */
  async playAudio(audioUrl: string): Promise<boolean> {
    try {
      // Prevent multiple simultaneous play attempts
      if (this.isPlaying) {
        console.log('� Audio already playing, stopping first...');
        await this.stopAudio();
        // Longer delay to ensure complete cleanup
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      console.log('🔊 Playing TTS audio from backend...');
      
      // Create sound with initial paused state to prevent race conditions
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: false, volume: 1.0 } // Start paused
      );

      this.sound = sound;

      // Listen for audio completion before starting playback
      sound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.isLoaded && status.didJustFinish) {
          console.log('🎵 Audio finished playing');
          this.isPlaying = false;
          this.cleanupAudio();
        } else if (status.error) {
          console.error('🔴 Audio playback error:', status.error);
          this.isPlaying = false;
          this.cleanupAudio();
        }
      });

      // Now start playback
      await sound.playAsync();
      this.isPlaying = true;
      console.log('✅ Audio playback started successfully');

      return true;
    } catch (error) {
      console.error('❌ Audio playback error:', error);
      this.isPlaying = false;
      return false;
    }
  }

  /**
   * Stop currently playing audio
   */
  async stopAudio(): Promise<void> {
    try {
      if (this.sound) {
        console.log('🛑 Stopping audio...');
        const status = await this.sound.getStatusAsync();
        if (status.isLoaded && status.isPlaying) {
          await this.sound.stopAsync();
        }
        await this.cleanupAudio();
        console.log('✅ Audio stopped and cleaned up');
      }
      this.isPlaying = false;
    } catch (error) {
      console.error('Error stopping audio:', error);
      this.isPlaying = false;
      this.sound = null;
    }
  }

  /**
   * Pause/resume audio
   */
  async pauseResumeAudio(): Promise<void> {
    if (this.sound) {
      const status = await this.sound.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await this.sound.pauseAsync();
        } else {
          await this.sound.playAsync();
        }
      }
    }
  }

  /**
   * Cleanup audio resources
   */
  private async cleanupAudio(): Promise<void> {
    try {
      if (this.sound) {
        console.log('🧹 Cleaning up audio resources...');
        await this.sound.unloadAsync();
        this.sound = null;
      }
      this.isPlaying = false;
    } catch (error) {
      console.error('Error cleaning up audio:', error);
      this.sound = null;
      this.isPlaying = false;
    }
  }

  /**
   * Get available voices from backend
   */
  async getAvailableVoices(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tts/voices`);
      
      if (response.ok) {
        const data = await response.json();
        return data.voices || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching voices:', error);
      return [];
    }
  }

  /**
   * Preview a voice with sample text
   */
  async previewVoice(voiceKey: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tts/preview/${voiceKey}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.audioUrl) {
          const fullAudioUrl = `${API_BASE_URL}${data.audioUrl}`;
          return await this.playAudio(fullAudioUrl);
        }
      }
      return false;
    } catch (error) {
      console.error('Error previewing voice:', error);
      return false;
    }
  }

  // Getters
  get playing(): boolean {
    return this.isPlaying;
  }
}

// Export singleton instance
export const ttsService = TTSService.getInstance();