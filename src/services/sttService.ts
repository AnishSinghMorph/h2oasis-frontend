import API_CONFIG from "../config/api";

interface STTResponse {
  success: boolean;
  transcription?: string;
  confidence?: number;
  error?: string;
}

export class STTService {
  /**
   * Convert speech to text using backend STT endpoint
   */
  static async speechToText(audioUri: string): Promise<string> {
    try {
      console.log("🎤 Sending audio to STT service...");
      console.log("📁 Audio URI:", audioUri);

      // Create FormData for file upload
      const formData = new FormData();

      // For React Native, we need to create a proper file object
      const fileInfo = {
        uri: audioUri,
        type: "audio/m4a", // Specify the correct MIME type
        name: "recording.m4a",
      };

      // @ts-ignore - React Native FormData accepts this format
      formData.append("file", fileInfo);

      console.log("📤 Sending STT request with file:", fileInfo);

      // Call backend STT endpoint
      const sttResponse = await fetch(
        `${API_CONFIG.BASE_URL}/api/stt/transcribe`,
        {
          method: "POST",
          body: formData,
          // Don't set Content-Type - let FormData set it with boundary
        },
      );

      console.log("📡 STT Response status:", sttResponse.status);

      if (!sttResponse.ok) {
        const errorText = await sttResponse.text();
        console.error("STT API Error Response:", errorText);
        throw new Error(
          `STT API error: ${sttResponse.status} ${sttResponse.statusText}`,
        );
      }

      const result: STTResponse = await sttResponse.json();

      if (!result.success || !result.transcription) {
        throw new Error(result.error || "Speech to text conversion failed");
      }

      console.log("✅ STT successful:", result.transcription);
      return result.transcription;
    } catch (error) {
      console.error("❌ STT Service Error:", error);
      throw error;
    }
  }

  /**
   * Check if STT service is available
   */
  static async checkAvailability(): Promise<boolean> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error("❌ STT Service availability check failed:", error);
      return false;
    }
  }
}
