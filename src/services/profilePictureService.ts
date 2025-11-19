import * as ImagePicker from "expo-image-picker";
import API_CONFIG from "../config/api";

export const profilePictureService = {
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("Error requesting permissions:", error);
      return false;
    }
  },

  async pickImage(): Promise<ImagePicker.ImagePickerAsset | null> {
    try {
      const hasPermission = await this.requestPermissions();

      if (!hasPermission) {
        throw new Error("Permission to access gallery was denied");
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0];
      }

      return null;
    } catch (error) {
      console.error("Error picking image:", error);
      throw error;
    }
  },

  // Upload image to backend
  async uploadProfilePicture(
    imageUri: string,
    firebaseUID: string,
  ): Promise<{ success: boolean; photoURL?: string; message?: string }> {
    try {
      const formData = new FormData();

      // Extract filename and type from URI
      const uriParts = imageUri.split(".");
      const fileType = uriParts[uriParts.length - 1];

      // @ts-ignore - FormData append types
      formData.append("profilePicture", {
        uri: imageUri,
        name: `profile-${Date.now()}.${fileType}`,
        type: `image/${fileType}`,
      });

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPLOAD_PROFILE_PICTURE}`,
        {
          method: "POST",
          headers: {
            "x-firebase-uid": firebaseUID,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          photoURL: data.photoURL,
          message: data.message,
        };
      } else {
        return {
          success: false,
          message: data.message || "Upload failed",
        };
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      return {
        success: false,
        message: "Failed to upload image",
      };
    }
  },

  // Delete profile picture
  async deleteProfilePicture(
    firebaseUID: string,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DELETE_PROFILE_PICTURE}`,
        {
          method: "DELETE",
          headers: {
            "x-firebase-uid": firebaseUID,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      return {
        success: response.ok,
        message: data.message,
      };
    } catch (error) {
      console.error("Error deleting profile picture:", error);
      return {
        success: false,
        message: "Failed to delete image",
      };
    }
  },
};
