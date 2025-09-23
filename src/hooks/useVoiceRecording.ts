import { useState, useRef } from "react";
import { Audio } from "expo-av";
import { Alert } from "react-native";

interface VoiceRecordingState {
  isRecording: boolean;
  isProcessing: boolean;
  duration: number;
}

interface VoiceRecordingHook {
  state: VoiceRecordingState;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;
  cancelRecording: () => Promise<void>;
}

export const useVoiceRecording = (): VoiceRecordingHook => {
  const [state, setState] = useState<VoiceRecordingState>({
    isRecording: false,
    isProcessing: false,
    duration: 0,
  });

  const recordingRef = useRef<Audio.Recording | null>(null);
  const durationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Start voice recording
   */
  const startRecording = async (): Promise<void> => {
    try {
      console.log("🎤 Starting voice recording...");

      // Request permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant microphone permission to use voice recording.",
          [{ text: "OK" }],
        );
        return;
      }

      // Configure audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Create recording
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync({
        android: {
          extension: ".m4a",
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: ".m4a",
          outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: "audio/webm;codecs=opus",
          bitsPerSecond: 128000,
        },
      });

      recordingRef.current = recording;
      await recording.startAsync();

      setState((prev) => ({
        ...prev,
        isRecording: true,
        duration: 0,
      }));

      // Start duration timer
      durationTimerRef.current = setInterval(() => {
        setState((prev) => ({
          ...prev,
          duration: prev.duration + 1,
        }));
      }, 1000);

      console.log("✅ Voice recording started");
    } catch (error) {
      console.error("❌ Error starting recording:", error);
      Alert.alert(
        "Recording Error",
        "Failed to start voice recording. Please try again.",
        [{ text: "OK" }],
      );
    }
  };

  /**
   * Stop recording and return the audio file URI
   */
  const stopRecording = async (): Promise<string | null> => {
    try {
      console.log("🛑 Stopping voice recording...");

      if (!recordingRef.current) {
        console.log("❌ No active recording found");
        return null;
      }

      setState((prev) => ({
        ...prev,
        isRecording: false,
        isProcessing: true,
      }));

      // Clear timer
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
        durationTimerRef.current = null;
      }

      // Stop recording
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;

      setState((prev) => ({
        ...prev,
        isProcessing: false,
        duration: 0,
      }));

      console.log("✅ Voice recording stopped:", uri);
      return uri;
    } catch (error) {
      console.error("❌ Error stopping recording:", error);
      setState((prev) => ({
        ...prev,
        isRecording: false,
        isProcessing: false,
        duration: 0,
      }));
      return null;
    }
  };

  /**
   * Cancel recording without saving
   */
  const cancelRecording = async (): Promise<void> => {
    try {
      console.log("❌ Canceling voice recording...");

      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        recordingRef.current = null;
      }

      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
        durationTimerRef.current = null;
      }

      setState({
        isRecording: false,
        isProcessing: false,
        duration: 0,
      });

      console.log("✅ Voice recording canceled");
    } catch (error) {
      console.error("❌ Error canceling recording:", error);
    }
  };

  return {
    state,
    startRecording,
    stopRecording,
    cancelRecording,
  };
};
