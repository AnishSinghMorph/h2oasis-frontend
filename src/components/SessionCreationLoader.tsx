import React, { useEffect, useRef } from "react";
import { StyleSheet, Animated } from "react-native";
import H2OLoader from "./H2OLoader";

interface SessionCreationLoaderProps {
  visible: boolean;
}

const SessionCreationLoader: React.FC<SessionCreationLoaderProps> = ({
  visible,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <H2OLoader
        size={200}
        text="Creating your session..."
        subText="Personalizing your wellness experience"
      />
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
});

export default SessionCreationLoader;
