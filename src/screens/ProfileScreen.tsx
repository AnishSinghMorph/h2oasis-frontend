import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";
import { useAuth } from "../context/AuthContext";
import API_CONFIG from "../config/api";
import { styles } from "../styles/ProfileScreen.styles";
import { UserProfile, MenuItem } from "../types/ProfileScreen.types";
import {
  getGeneralMenuItems,
  supportMenuItems,
} from "../utils/profileMenuItems";
import BottomNav from "../components/BottomNav";
import { profilePictureService } from "../services/profilePictureService";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const {
    firebaseUID,
    logout,
    deleteAccount,
    photoURL: contextPhotoURL,
    updatePhotoURL,
    userName,
  } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    email: "",
  });
  const [uploading, setUploading] = useState(false);

  const generalMenuItems = getGeneralMenuItems(navigation);

  // Use photoURL from context if available, otherwise from local state
  const displayPhotoURL = contextPhotoURL || userProfile.photoURL;

  useEffect(() => {
    fetchUserProfile();
  }, [firebaseUID]);

  const fetchUserProfile = async () => {
    if (!firebaseUID) return;

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROFILE}`,
        {
          method: "GET",
          headers: {
            "x-firebase-uid": firebaseUID,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setUserProfile({
          name: data.user?.fullName || data.user?.displayName || "User",
          email: data.user?.email || "",
          photoURL: data.user?.photoURL,
        });
        // Also update context if photoURL changed
        if (data.user?.photoURL && data.user?.photoURL !== contextPhotoURL) {
          updatePhotoURL(data.user.photoURL);
        }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleUploadPicture = async () => {
    if (!firebaseUID) return;

    try {
      const imageAsset = await profilePictureService.pickImage();

      if (imageAsset) {
        // Show image immediately from local URI
        setUserProfile((prev) => ({ ...prev, photoURL: imageAsset.uri }));
        updatePhotoURL(imageAsset.uri); // Update context immediately for optimistic UI
        setUploading(true);

        // Upload in background
        const result = await profilePictureService.uploadProfilePicture(
          imageAsset.uri,
          firebaseUID,
        );

        if (result.success && result.photoURL) {
          // Update with S3/CloudFront URL after upload
          setUserProfile((prev) => ({ ...prev, photoURL: result.photoURL }));
          updatePhotoURL(result.photoURL); // Update context with final URL
          Alert.alert("Success", "Profile picture updated successfully!");
        } else {
          // Revert to old photo on error
          await fetchUserProfile();
          Alert.alert("Error", result.message || "Failed to upload picture");
        }
      }
    } catch (error) {
      console.error("Error uploading picture:", error);
      await fetchUserProfile(); // Revert on error
      Alert.alert("Error", "Failed to upload picture. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePicture = async () => {
    if (!firebaseUID) return;

    Alert.alert(
      "Delete Profile Picture",
      "Are you sure you want to remove your profile picture?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setUploading(true);
              const result =
                await profilePictureService.deleteProfilePicture(firebaseUID);

              if (result.success) {
                setUserProfile((prev) => ({ ...prev, photoURL: undefined }));
                updatePhotoURL(null); // Clear context
                Alert.alert("Success", "Profile picture removed");
              } else {
                Alert.alert(
                  "Error",
                  result.message || "Failed to delete picture",
                );
              }
            } catch (error) {
              console.error("Error deleting picture:", error);
              Alert.alert("Error", "Failed to delete picture");
            } finally {
              setUploading(false);
            }
          },
        },
      ],
    );
  };

  const handleProfilePicturePress = () => {
    if (uploading) return;

    if (displayPhotoURL) {
      Alert.alert(
        "Profile Picture",
        "Choose an action",
        [
          {
            text: "Change Picture",
            onPress: handleUploadPicture,
          },
          {
            text: "Remove Picture",
            style: "destructive",
            onPress: handleDeletePicture,
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ],
        { cancelable: true },
      );
    } else {
      handleUploadPicture();
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              navigation.reset({
                index: 0,
                routes: [{ name: "Landing" as never }],
              });
            } catch (error) {
              console.error("Error signing out:", error);
              Alert.alert("Error", "Failed to sign out. Please try again.");
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your account? This action cannot be undone and all your data will be lost.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAccount();
              navigation.reset({
                index: 0,
                routes: [{ name: "Landing" as never }],
              });
            } catch (error: any) {
              console.error("Error deleting account:", error);
              Alert.alert(
                "Error",
                error.message || "Failed to delete account. Please try again.",
              );
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const renderMenuItem = (item: MenuItem, isLast: boolean) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.menuItem, !isLast && styles.menuItemBorder]}
      onPress={item.onPress}
    >
      <View style={styles.menuItemLeft}>
        {item.iconType === "image" && item.imageSource ? (
          <Image
            source={item.imageSource}
            style={{ width: 24, height: 24 }}
            resizeMode="contain"
          />
        ) : (
          <Ionicons name={item.icon as any} size={24} color="#1E3A3A" />
        )}
        <Text style={styles.menuItemText}>{item.label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#1E3A3A" />
    </TouchableOpacity>
  );

  const insets = useSafeAreaInsets();
  
  // Only apply safe area insets on Android
  const bottomOffset = Platform.OS === "android" ? insets.bottom : 0;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Profile</Text>

        <View style={styles.profileSection}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleProfilePicturePress}
            disabled={uploading}
          >
            {displayPhotoURL ? (
              <FastImage
                source={{ uri: displayPhotoURL }}
                style={styles.avatar}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="camera" size={48} color="#1E3A3A" />
              </View>
            )}
            {uploading && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator size="large" color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.userName}>{userProfile.name}</Text>
          <Text style={styles.userEmail}>{userProfile.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          <View style={styles.menuContainer}>
            {generalMenuItems.map((item: MenuItem, index: number) =>
              renderMenuItem(item, index === generalMenuItems.length - 1),
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuContainer}>
            {supportMenuItems.map((item: MenuItem, index: number) =>
              renderMenuItem(item, index === supportMenuItems.length - 1),
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.signOutButton,
            { backgroundColor: "#FEE2E2", marginTop: 12 },
          ]}
          onPress={handleDeleteAccount}
        >
          <Text style={[styles.signOutText, { color: "#DC2626" }]}>
            Delete Account
          </Text>
        </TouchableOpacity>

        <View style={[styles.bottomSpacer, { height: 20 + bottomOffset }]} />
      </ScrollView>

      <BottomNav />
    </View>
  );
};

export default ProfileScreen;
