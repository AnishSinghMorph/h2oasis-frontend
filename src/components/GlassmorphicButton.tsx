/**
 * GlassmorphicButton - A reusable button with glassmorphic effect
 *
 * Features:
 * - Glass blur effect with BlurView
 * - Milky white gradient overlay (F5F5F5 at 40% to 262626 at 100%)
 * - Shadow effect (000000 at 15%)
 * - Fully customizable with style and textStyle props
 *
 * Usage:
 * ```tsx
 * <GlassmorphicButton
 *   title="Start"
 *   onPress={() => console.log('Button pressed')}
 *   style={{ marginTop: 10 }}
 *   textStyle={{ fontSize: 20 }}
 * />
 * ```
 *
 * Props:
 * - title: Button text
 * - onPress: Function to call when button is pressed
 * - style: Optional custom style for the button container
 * - textStyle: Optional custom style for the button text
 */

import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

interface GlassmorphicButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const GlassmorphicButton: React.FC<GlassmorphicButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Glass Effect with Blur */}
      <BlurView intensity={30} tint="light" style={styles.blurContainer}>
        {/* Milky White Gradient Overlay - More opaque for better visibility */}
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.95)", "rgba(255, 255, 255, 0.85)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientOverlay}
        >
          <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </LinearGradient>
      </BlurView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    overflow: "hidden",
    position: "relative",
  },
  shadow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 50,
    zIndex: 0,
  },
  blurContainer: {
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.9)",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  gradientOverlay: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Outfit_700Bold",
    color: "#000000",
  },
});
