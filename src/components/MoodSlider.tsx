import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  PanResponder,
} from "react-native";
import { BlurView } from "@react-native-community/blur";

type Mood = "notGood" | "ok" | "great";

interface MoodSliderProps {
  onChange?: (mood: Mood) => void;
  containerWidth?: number;
}

const MOODS: { value: Mood; label: string; emoji: any }[] = [
  {
    value: "notGood",
    label: "Not Good",
    emoji: require("../../assets/dashboard/emojis/notGood.png"),
  },
  {
    value: "ok",
    label: "Ok",
    emoji: require("../../assets/dashboard/emojis/ok.png"),
  },
  {
    value: "great",
    label: "Great",
    emoji: require("../../assets/dashboard/emojis/great.png"),
  },
];

const EMOJI_SIZE = 30;
const THUMB_SIZE = 40;
const TRACK_HEIGHT = 40;
const PADDING = 5;

export const MoodSlider: React.FC<MoodSliderProps> = ({
  onChange,
  containerWidth = 500,
}) => {
  const trackWidth = containerWidth - 20 * 2;
  const snapPositions = [0, trackWidth / 2, trackWidth];

  // Start at middle position (Ok)
  const translateX = useRef(new Animated.Value(snapPositions[1])).current;
  const currentMoodIndex = useRef(1);

  // Set initial mood on mount
  useEffect(() => {
    onChange?.("ok");
  }, []);

  const findNearestSnapPoint = (x: number): number => {
    let nearestIndex = 0;
    let minDistance = Math.abs(x - snapPositions[0]);

    snapPositions.forEach((pos, index) => {
      const distance = Math.abs(x - pos);
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = index;
      }
    });

    return nearestIndex;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        translateX.setOffset(snapPositions[currentMoodIndex.current]);
        translateX.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        const newX = gestureState.dx;
        const clampedX = Math.max(
          -snapPositions[currentMoodIndex.current],
          Math.min(trackWidth - snapPositions[currentMoodIndex.current], newX),
        );
        translateX.setValue(clampedX);
      },
      onPanResponderRelease: (_, gestureState) => {
        translateX.flattenOffset();

        const currentX =
          snapPositions[currentMoodIndex.current] + gestureState.dx;
        const nearestIndex = findNearestSnapPoint(currentX);
        currentMoodIndex.current = nearestIndex;

        Animated.spring(translateX, {
          toValue: snapPositions[nearestIndex],
          useNativeDriver: true,
          damping: 15,
          stiffness: 150,
        }).start();

        onChange?.(MOODS[nearestIndex].value);
      },
    }),
  ).current;

  return (
    <View style={[styles.container, { width: containerWidth }]}>
      <Text style={styles.title}>How are you feeling today?</Text>
      <Text style={styles.subtitle}>Mood Check in</Text>

      {/* Track with emojis and thumb */}
      <BlurView style={styles.trackBlur} blurType="regular" blurAmount={10}>
        <View style={[styles.track, { width: trackWidth }]}>
          {/* Emojis positioned along track */}
          {MOODS.map((mood, index) => (
            <View
              key={mood.value}
              style={[
                styles.emojiContainer,
                { left: snapPositions[index] - EMOJI_SIZE / 2 },
              ]}
            >
              <Image source={mood.emoji} style={styles.emoji} />
            </View>
          ))}

          {/* Draggable Thumb with Arrow */}
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.thumb,
              {
                transform: [{ translateX }],
              },
            ]}
          >
            <View style={styles.thumbCircle}>
              <Text style={styles.arrow}>›</Text>
            </View>
          </Animated.View>
        </View>
      </BlurView>

      {/* Labels below track */}
      <View style={[styles.labelsContainer, { width: trackWidth }]}>
        {MOODS.map((mood, index) => (
          <View
            key={mood.value}
            style={[styles.labelItem, { left: snapPositions[index] - 40 }]}
          >
            <Text style={styles.label}>{mood.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    color: "#FFFFFF",
    fontFamily: "Outfit_600SemiBold",
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.8)",
    fontFamily: "Outfit_400Regular",
    marginBottom: 24,
    textAlign: "center",
  },
  trackBlur: {
    borderRadius: 50,
    overflow: "hidden",
    backgroundColor: "rgba(91, 191, 207, 0.25)",
    paddingHorizontal: PADDING,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  track: {
    height: TRACK_HEIGHT,
    position: "relative",
    justifyContent: "center",
  },
  emojiContainer: {
    position: "absolute",
    width: EMOJI_SIZE,
    height: EMOJI_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: {
    width: EMOJI_SIZE,
    height: EMOJI_SIZE,
  },
  thumb: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    marginLeft: -THUMB_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  thumbCircle: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  arrow: {
    fontSize: 36,
    color: "#2C5F6F",
    fontWeight: "bold",
    marginLeft: 3,
  },
  labelsContainer: {
    flexDirection: "row",
    marginTop: 16,
    position: "relative",
    height: 30,
  },
  labelItem: {
    position: "absolute",
    width: 80,
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "Outfit_500Medium",
    textAlign: "center",
  },
});
