import React, { useEffect, useRef, useCallback } from "react";
import { View, Animated, StyleSheet } from "react-native";

interface AnimatedVoiceOrbProps {
  isConnected: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  size?: number;
}

export const AnimatedVoiceOrb: React.FC<AnimatedVoiceOrbProps> = ({
  isConnected,
  isSpeaking,
  isListening,
  size = 200,
}) => {
  // Animation values - separate for native and non-native driver
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;
  const backgroundOpacityAnim = useRef(new Animated.Value(0.2)).current;

  const startConnectingAnimation = useCallback(() => {
    // Connecting - dramatic orange pulse with background fade
    Animated.timing(backgroundOpacityAnim, {
      toValue: 0.3,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [backgroundOpacityAnim, pulseAnim]);

  const startListeningAnimation = useCallback(() => {
    // Listening - calm violet with subtle background
    Animated.timing(backgroundOpacityAnim, {
      toValue: 0.25,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [backgroundOpacityAnim, pulseAnim]);

  const startSpeakingAnimation = useCallback(() => {
    // Speaking - vibrant red with active background
    Animated.timing(backgroundOpacityAnim, {
      toValue: 0.4,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Fast ripple
    Animated.loop(
      Animated.sequence([
        Animated.timing(rippleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(rippleAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Fast pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [backgroundOpacityAnim, rippleAnim, pulseAnim]);

  const startIdleAnimation = useCallback(() => {
    // Idle - warm yellow with subtle background
    Animated.timing(backgroundOpacityAnim, {
      toValue: 0.15,
      duration: 500,
      useNativeDriver: false,
    }).start();

    // Slow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [backgroundOpacityAnim, pulseAnim]);

  // Get current color based on state
  const getCurrentColor = () => {
    if (!isConnected) return "#FF6B35"; // Vibrant orange (connecting)
    if (isListening) return "#8B5CF6"; // Rich violet (listening)
    if (isSpeaking) return "#EF4444"; // Bold red (speaking)
    return "#F59E0B"; // Golden yellow (idle)
  };

  const backgroundColor = getCurrentColor();

  const stopAnimation = useCallback(() => {
    try {
      // Stop all running animations
      pulseAnim.stopAnimation();
      rippleAnim.stopAnimation();
      backgroundOpacityAnim.stopAnimation();

      // Reset values
      pulseAnim.setValue(1);
      rippleAnim.setValue(0);
      backgroundOpacityAnim.setValue(0);
    } catch (error) {
      console.log("Error stopping animations:", error);
    }
  }, [pulseAnim, rippleAnim, backgroundOpacityAnim]);

  // Main effect for state changes
  useEffect(() => {
    if (!isConnected) {
      // Connecting - blue pulsing
      startConnectingAnimation();
    } else if (isSpeaking) {
      // Speaking - green fast pulse
      startSpeakingAnimation();
    } else if (isListening) {
      // Listening - blue gentle pulse
      startListeningAnimation();
    } else {
      // Idle - gray slow pulse
      startIdleAnimation();
    }
  }, [
    isConnected,
    isSpeaking,
    isListening,
    startConnectingAnimation,
    startSpeakingAnimation,
    startListeningAnimation,
    startIdleAnimation,
  ]);

  // Cleanup animations on unmount
  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, [stopAnimation]);

  return (
    <View style={styles.container}>
      {/* Subtle Background Glow */}
      <Animated.View
        style={[
          styles.glowRing,
          {
            width: size * 1.3,
            height: size * 1.3,
            borderRadius: size * 0.65,
            backgroundColor: backgroundColor,
            opacity: pulseAnim.interpolate({
              inputRange: [1, 1.3],
              outputRange: [0.1, 0.25],
            }),
            transform: [
              {
                scale: pulseAnim.interpolate({
                  inputRange: [1, 1.3],
                  outputRange: [0.95, 1.05],
                }),
              },
            ],
          },
        ]}
      />

      {/* Main Animation Container */}
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        {/* Beautiful Native Orb */}
        <Animated.View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: backgroundColor,
            opacity: 0.85,
            shadowColor: "#FF6B35",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.4,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          {/* Glass shine effect */}
          <View
            style={{
              position: "absolute",
              top: size * 0.15,
              left: size * 0.15,
              width: size * 0.35,
              height: size * 0.35,
              borderRadius: size * 0.175,
              backgroundColor: "rgba(255, 255, 255, 0.3)",
            }}
          />

          {/* Smaller shine */}
          <View
            style={{
              position: "absolute",
              top: size * 0.25,
              left: size * 0.25,
              width: size * 0.12,
              height: size * 0.12,
              borderRadius: size * 0.06,
              backgroundColor: "rgba(255, 255, 255, 0.5)",
            }}
          />

          {/* Inner glow */}
          <View
            style={{
              position: "absolute",
              top: size * 0.1,
              left: size * 0.1,
              width: size * 0.8,
              height: size * 0.8,
              borderRadius: size * 0.4,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
          />
        </Animated.View>
      </Animated.View>

      {/* Ripple Effect - Only visible when speaking */}
      {isSpeaking && (
        <Animated.View
          style={[
            styles.ripple,
            {
              width: size * 1.6,
              height: size * 1.6,
              borderRadius: size * 0.8,
              opacity: rippleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.4, 0],
              }),
              transform: [
                {
                  scale: rippleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.3],
                  }),
                },
              ],
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  glowRing: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  ripple: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "rgba(255, 107, 53, 0.4)",
    backgroundColor: "rgba(255, 107, 53, 0.1)",
  },
});

export default AnimatedVoiceOrb;
