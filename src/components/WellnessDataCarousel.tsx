import React from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { styles } from "../styles/WellnessDataCarousel.styles";

interface WellnessData {
  physical?: {
    steps?: number;
    calories_kcal?: number;
    heart_rate?: {
      avg_bpm?: number;
      resting_bpm?: number;
      max_bpm?: number;
    };
    active_minutes?: number;
  };
  sleep?: {
    duration_minutes?: number;
    efficiency_percentage?: number;
    deep_sleep_minutes?: number;
    light_sleep_minutes?: number;
  };
  body?: {
    height_cm?: number;
  };
}

interface Wearable {
  id: string;
  name: string;
  connected: boolean;
  lastSync?: string;
  data?: WellnessData | null;
}

interface WellnessDataCarouselProps {
  wearables: Record<string, Wearable>;
}

const SemiCircleProgress: React.FC<{
  percentage: number;
  color: string;
  size: number;
  strokeWidth: number;
}> = ({ percentage, color, size, strokeWidth }) => {
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;

  // Create semi-circle path (arc from left to right)
  const startAngle = Math.PI; // Start at left (180 degrees)
  const endAngle = 2 * Math.PI; // End at right (360 degrees)

  // Background semi-circle path
  const backgroundPath = `
    M ${cx - radius} ${cy}
    A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}
  `;

  // Progress arc angle
  const progressAngle =
    startAngle + (endAngle - startAngle) * (percentage / 100);
  const progressX = cx + radius * Math.cos(progressAngle);
  const progressY = cy + radius * Math.sin(progressAngle);
  const largeArcFlag = percentage > 50 ? 1 : 0;

  const progressPath =
    percentage > 0
      ? `
    M ${cx - radius} ${cy}
    A ${radius} ${radius} 0 ${largeArcFlag} 1 ${progressX} ${progressY}
  `
      : "";

  return (
    <Svg
      width={size}
      height={size / 2 + strokeWidth}
      style={{ overflow: "visible" }}
    >
      <Path
        d={backgroundPath}
        stroke="#E0E0E0"
        strokeWidth={strokeWidth}
        fill="none"
      />
      {percentage > 0 && (
        <Path
          d={progressPath}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
      )}
    </Svg>
  );
};

const WellnessDataCarousel: React.FC<WellnessDataCarouselProps> = ({
  wearables,
}) => {
  // Get the most recent connected wearable with data
  const getLatestWearableData = (): {
    wearable: Wearable | null;
    name: string;
  } => {
    const connectedWearables = Object.values(wearables).filter(
      (w) => w.connected && w.data,
    );

    if (connectedWearables.length === 0) {
      return { wearable: null, name: "" };
    }

    // Sort by lastSync date (most recent first)
    connectedWearables.sort((a, b) => {
      const dateA = a.lastSync ? new Date(a.lastSync).getTime() : 0;
      const dateB = b.lastSync ? new Date(b.lastSync).getTime() : 0;
      return dateB - dateA;
    });

    return {
      wearable: connectedWearables[0],
      name: connectedWearables[0].name,
    };
  };

  const { wearable, name: wearableName } = getLatestWearableData();

  if (!wearable || !wearable.data) {
    return null; // Don't show if no data available
  }

  const data = wearable.data;

  // Calculate sleep hours from minutes
  const sleepHours = data.sleep?.duration_minutes
    ? (data.sleep.duration_minutes / 60).toFixed(1)
    : "0";

  // Calculate heart rate percentage (assuming max is 200)
  const heartRatePercentage = data.physical?.heart_rate?.avg_bpm
    ? (data.physical.heart_rate.avg_bpm / 200) * 100
    : 0;

  // Sleep efficiency percentage
  const sleepPercentage = data.sleep?.efficiency_percentage || 0;

  // Calculate calories percentage (assuming max is 3000 kcal)
  const caloriesPercentage = data.physical?.calories_kcal
    ? (data.physical.calories_kcal / 3000) * 100
    : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Wellness Data</Text>
        <Text style={styles.subtitle}>Based on recent activity</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContainer}
        snapToInterval={200}
        decelerationRate="fast"
      >
        {/* Heart Data Card */}
        {data.physical?.heart_rate?.avg_bpm && (
          <LinearGradient
            colors={["#AEDEE5", "#DDF1F1"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.card}
          >
            <Text style={styles.cardTitle}>Heart Data</Text>

            <View style={styles.progressContainer}>
              <SemiCircleProgress
                percentage={heartRatePercentage}
                color="#E07B7A"
                size={100}
                strokeWidth={10}
              />
              <View style={styles.iconContainer}>
                <Image
                  source={require("../../assets/dashboard/heartRateIcon.png")}
                  style={styles.icon}
                  resizeMode="contain"
                />
              </View>
            </View>

            <Text style={styles.cardValue}>
              {data.physical.heart_rate.avg_bpm}
            </Text>
            <Text style={styles.cardUnit}>BPM</Text>
          </LinearGradient>
        )}

        {/* Sleep Data Card */}
        {data.sleep?.duration_minutes && (
          <LinearGradient
            colors={["#AEDEE5", "#DDF1F1"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.card}
          >
            <Text style={styles.cardTitle}>Sleep Data</Text>

            <View style={styles.progressContainer}>
              <SemiCircleProgress
                percentage={sleepPercentage}
                color="#5BA8C4"
                size={100}
                strokeWidth={10}
              />
              <View style={styles.iconContainer}>
                <Image
                  source={require("../../assets/dashboard/sleepIcon.png")}
                  style={styles.icon}
                  resizeMode="contain"
                />
              </View>
            </View>

            <Text style={styles.cardValue}>{sleepHours}</Text>
            <Text style={styles.cardUnit}>HOURS</Text>
          </LinearGradient>
        )}

        {/* Calories Card */}
        {data.physical?.calories_kcal !== undefined &&
          data.physical.calories_kcal > 0 && (
            <LinearGradient
              colors={["#AEDEE5", "#DDF1F1"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.card}
            >
              <Text style={styles.cardTitle}>Calories</Text>

              <View style={styles.progressContainer}>
                <SemiCircleProgress
                  percentage={caloriesPercentage}
                  color="#F5A623"
                  size={100}
                  strokeWidth={10}
                />
                <View style={styles.iconContainer}>
                  <Image
                    source={require("../../assets/dashboard/caloriesIcon.png")}
                    style={styles.icon}
                    resizeMode="contain"
                  />
                </View>
              </View>

              <Text style={styles.cardValue}>
                {data.physical.calories_kcal}
              </Text>
              <Text style={styles.cardUnit}>KCAL</Text>
            </LinearGradient>
          )}
      </ScrollView>
    </View>
  );
};

export default WellnessDataCarousel;
