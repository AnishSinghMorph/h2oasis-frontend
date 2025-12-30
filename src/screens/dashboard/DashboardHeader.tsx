import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../../styles/dashboard/DashboardHeader.styles";

interface DashboardHeaderProps {
  photoURL: string | null;
  userInitials: string;
  formattedDate: string;
}

const DashboardHeader = React.memo<DashboardHeaderProps>(
  ({ photoURL, userInitials, formattedDate }) => {
    return (
      <View style={styles.header}>
        <View style={styles.avatar}>
          {photoURL ? (
            <Image
              source={{ uri: photoURL }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.avatarText}>{userInitials}</Text>
          )}
        </View>
        <Text style={styles.dateText}>{formattedDate}</Text>
        <View style={styles.spacer} />
        <View style={styles.notificationButton}>
          <BlurView intensity={40} tint="light" style={styles.notificationBlur}>
            <LinearGradient
              colors={[
                "rgba(255, 255, 255, 0.4)",
                "rgba(255, 255, 255, 0.1)",
                "rgba(255, 255, 255, 0.1)",
                "rgba(255, 255, 255, 0.4)",
              ]}
              locations={[0, 0.3, 0.7, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.notificationGradient}
            >
              <Image
                source={require("../../../assets/notifcation.png")}
                style={styles.notificationIcon}
                resizeMode="contain"
              />
            </LinearGradient>
          </BlurView>
        </View>
      </View>
    );
  },
);

DashboardHeader.displayName = "DashboardHeader";

export default DashboardHeader;
