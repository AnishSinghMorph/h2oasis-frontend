import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { wp } from "../../utils/responsive";

interface BackButtonProps {
  onPress?: () => void;
  style?: ViewStyle;
  color?: string;
  size?: number;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  style,
  color = "#FFFFFF",
  size = 24,
}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={handlePress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <BlurView intensity={40} tint="light" style={styles.blurContainer}>
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
          style={styles.gradientContainer}
        >
          <Ionicons name="chevron-back" size={size} color={color} />
        </LinearGradient>
      </BlurView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: wp(44),
    height: wp(44),
    borderRadius: wp(22),
    overflow: "hidden",
  },
  blurContainer: {
    flex: 1,
    borderRadius: wp(22),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  gradientContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BackButton;
