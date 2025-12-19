import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export function GlassCard({ children, style }: GlassCardProps) {
  return (
    <View style={[styles.container, style]}>
      {/* Vignette effect - darker edges */}
      <LinearGradient
        colors={[
          "rgba(0, 60, 80, 0.4)",
          "rgba(0, 80, 100, 0.15)",
          "rgba(0, 80, 100, 0.15)",
          "rgba(0, 60, 80, 0.4)",
        ]}
        locations={[0, 0.15, 0.85, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.vignetteHorizontal}
      />
      <LinearGradient
        colors={[
          "rgba(0, 60, 80, 0.3)",
          "rgba(0, 80, 100, 0.1)",
          "rgba(0, 80, 100, 0.1)",
          "rgba(0, 60, 80, 0.3)",
        ]}
        locations={[0, 0.15, 0.85, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.vignetteVertical}
      />
      {/* Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    backgroundColor: "rgba(100, 180, 200, 0.25)",
    position: "relative",
  },
  vignetteHorizontal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  vignetteVertical: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    zIndex: 10,
  },
});
