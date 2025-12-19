import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";

interface SessionCreationLoaderProps {
  visible: boolean;
}

const SessionCreationLoader: React.FC<SessionCreationLoaderProps> = ({
  visible,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Pulsing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();

      // Rotating animation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    } else {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <View style={styles.loaderContainer}>
        <Animated.View
          style={[
            styles.outerCircle,
            {
              transform: [{ rotate }],
            },
          ]}
        >
          <View style={styles.arcTop} />
          <View style={styles.arcBottom} />
        </Animated.View>

        <Animated.View
          style={[
            styles.innerCircle,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Text style={styles.emoji}>🧘</Text>
        </Animated.View>

        <Text style={styles.loadingText}>Creating your session...</Text>
        <Text style={styles.subText}>
          Personalizing your wellness experience
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 53, 67, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  outerCircle: {
    width: 120,
    height: 120,
    position: "relative",
    marginBottom: 30,
  },
  arcTop: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#80BAC6",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    position: "absolute",
  },
  arcBottom: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#AEDEE5",
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    position: "absolute",
  },
  innerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(128, 186, 198, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 20,
  },
  emoji: {
    fontSize: 40,
  },
  loadingText: {
    fontSize: 20,
    fontFamily: "Outfit_600SemiBold",
    color: "#FFFFFF",
    marginTop: 20,
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    fontFamily: "Outfit_400Regular",
    color: "rgba(255, 255, 255, 0.7)",
  },
});

export default SessionCreationLoader;
