import React, { memo, ReactNode } from "react";
import { View, StyleSheet, ViewStyle, StyleProp, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface LiquidGlassCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  selected?: boolean;
  borderRadius?: number;
  intensity?: "low" | "medium" | "high";
  width?: number;
  height?: number;
}

const GLOW_SIZE = 220;

const LiquidGlassCard = memo<LiquidGlassCardProps>(
  ({
    children,
    style,
    selected = false,
    borderRadius = 20,
    intensity = "low",
    width,
    height,
  }) => {
    const glowOpacity = {
      low: 0.25,
      medium: 0.4,
      high: 0.6,
    }[intensity];

    return (
      <View
        style={[
          styles.container,
          {
            borderRadius,
            width,
            height,
          },
          style,
        ]}
      >
        {/* Top-left radial glow */}
        <View
          style={[
            styles.radialGlow,
            {
              top: -GLOW_SIZE / 2,
              left: -GLOW_SIZE / 2,
              opacity: glowOpacity,
            },
          ]}
        >
          <LinearGradient
            colors={[
              "rgba(255,255,255,0.55)",
              "rgba(255,255,255,0.2)",
              "rgba(255,255,255,0)",
            ]}
            start={{ x: 0.2, y: 0.2 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>

        {/* Bottom-right radial glow */}
        <View
          style={[
            styles.radialGlow,
            {
              bottom: -GLOW_SIZE / 2,
              right: -GLOW_SIZE / 2,
              opacity: glowOpacity * 0.8,
            },
          ]}
        >
          <LinearGradient
            colors={[
              "rgba(255,255,255,0)",
              "rgba(255,255,255,0.18)",
              "rgba(255,255,255,0.45)",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>

        {/* Border */}
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius,
              borderWidth: 1,
              borderColor: selected
                ? "rgba(78,205,196,0.6)"
                : "rgba(255,255,255,0.3)",
            },
          ]}
        />

        {/* Inner edge light */}
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius,
              borderWidth: 0.5,
              borderColor: "rgba(255,255,255,0.12)",
              margin: 0.5,
            },
          ]}
        />

        {/* Content */}
        <View style={styles.content}>{children}</View>
      </View>
    );
  },
);

LiquidGlassCard.displayName = "LiquidGlassCard";

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.04)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 14,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  radialGlow: {
    position: "absolute",
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    borderRadius: GLOW_SIZE / 2,
  },
  content: {
    position: "relative",
    zIndex: 10,
  },
});

export default LiquidGlassCard;
