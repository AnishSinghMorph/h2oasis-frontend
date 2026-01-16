import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  StatusBar,
  ImageBackground,
  Platform,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Session } from "../types/session.types";
import { styles } from "../styles/SessionDetailsScreen.styles";
import WhiteButton from "../components/WhiteButton";
import BottomNav from "../components/BottomNav";
import { useVoice } from "../context/VoiceContext";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SessionDetailsRouteProp = RouteProp<RootStackParamList, "SessionDetails">;

const { width } = Dimensions.get("window");

// Map activity names to image assets
const activityImages: Record<string, any> = {
  "hot-tub": require("../../assets/hot_tub.png"),
  "hot tub": require("../../assets/hot_tub.png"),
  hottub: require("../../assets/hot_tub.png"),
  spa: require("../../assets/hot_tub.png"),
  sauna: require("../../assets/sauna.png"),
  "cold-plunge": require("../../assets/cold_plunge.png"),
  "cold plunge": require("../../assets/cold_plunge.png"),
  coldplunge: require("../../assets/cold_plunge.png"),
};

const getActivityImage = (activity: string) => {
  const lowerActivity = activity.toLowerCase().replace(/\s+/g, "-");
  return activityImages[lowerActivity] || require("../../assets/hot_tub.png");
};

const SessionDetailsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<SessionDetailsRouteProp>();
  const { session } = route.params;
  const { selectedVoice } = useVoice();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<number>(
    session.TotalDurationMinutes,
  );

  const aiName = selectedVoice?.name || "Evy";

  const handleStartSession = () => {
    setEditModalVisible(false);
    navigation.navigate("ActiveSession", { session });
  };

  const handleEditSession = () => {
    setEditModalVisible(true);
  };

  const handleDurationSelect = (minutes: number) => {
    setSelectedDuration(minutes);
  };

  const insets = useSafeAreaInsets();

  // Only apply safe area insets on Android
  const bottomOffset = Platform.OS === "android" ? insets.bottom : 0;

  return (
    <ImageBackground
      source={require("../../assets/sessionDetailBg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <BlurView intensity={20} tint="light" style={styles.backButtonBlur}>
            <Ionicons name="chevron-back" size={28} color="#000000" />
          </BlurView>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Session</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.sessionTitle}>
            {session.Steps && session.Steps.length > 0
              ? session.Steps[0].Activity.charAt(0).toUpperCase() +
                session.Steps[0].Activity.slice(1)
              : session.SessionName}
          </Text>
          <Text style={styles.sessionSubtitle}>{session.RecommendedFor}</Text>
        </View>

        {/* Activity Image */}
        {session.Steps && session.Steps.length > 0 && (
          <View style={styles.imageContainer}>
            <Image
              source={getActivityImage(session.Steps[0].Activity)}
              style={styles.activityImage}
              resizeMode="cover"
            />
            <View style={styles.imageOverlay}>
              <View style={styles.durationBadge}>
                <Ionicons name="time-outline" size={16} color="#FFFFFF" />
                <Text style={styles.durationText}>
                  {session.TotalDurationMinutes} mins
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* AI Recommendation */}
        <Text style={styles.aiRecommendation}>
          {aiName} picked this one just for you
        </Text>

        {/* Description - Show Instructions instead of StartMessage */}
        <Text style={styles.description}>
          {session.Steps && session.Steps.length > 0
            ? session.Steps[0].Instructions
            : session.StartMessage}
        </Text>

        {/* Spacing at bottom for nav */}
        <View style={{ height: 200 }} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.buttonContainer, { bottom: 120 + bottomOffset }]}>
        <WhiteButton
          title="Start Session Now"
          onPress={handleStartSession}
          style={styles.startButton}
        />
        <TouchableOpacity style={styles.editButton} onPress={handleEditSession}>
          <Text style={styles.editButtonText}>Edit Session</Text>
        </TouchableOpacity>
      </View>

      <BottomNav />

      {/* Edit Session Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <BlurView intensity={40} tint="dark" style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Duration Section */}
            <Text style={styles.modalLabel}>Duration</Text>
            <View style={styles.durationOptions}>
              {[5, 10, 15, 20, 25, 30].map((mins) => (
                <TouchableOpacity
                  key={mins}
                  style={[
                    styles.durationOption,
                    selectedDuration === mins && styles.durationOptionSelected,
                  ]}
                  onPress={() => handleDurationSelect(mins)}
                >
                  <Text
                    style={[
                      styles.durationOptionText,
                      selectedDuration === mins &&
                        styles.durationOptionTextSelected,
                    ]}
                  >
                    {mins} mins
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Start Button */}
            <WhiteButton
              title="Start Session Now"
              onPress={handleStartSession}
              style={styles.modalStartButton}
            />

            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setEditModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    </ImageBackground>
  );
};

export default SessionDetailsScreen;
