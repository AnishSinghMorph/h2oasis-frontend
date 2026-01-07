import React from "react";
import { View, Text, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../../styles/progress/StreakCard.styles";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function StreakCard() {
  const streakCount = 4; // later from API
  const userName = "Rachel";

  return (
    <View style={styles.outerCard}>
      {/* Badge placeholder */}
      <Image
        source={require("../../../assets/progress/streak_badge.png")}
        style={styles.badgePlaceholder}
        resizeMode="contain"
      />

      <LinearGradient
        colors={[
          "rgba(131,188,200,1)", // #83BCC8
          "rgba(174,222,229,0.5)", // #AEDEE5 @ 50%
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.innerCard}
      >
        <Text style={styles.title}>{streakCount} Days streak</Text>

        <Text style={styles.subtitle}>
          You are doing really great, {userName}!
        </Text>

        {/* Days */}
        <View style={styles.daysRow}>
          {DAYS.map((day, index) => {
            const isActive = index < streakCount;

            return (
              <View key={day} style={styles.dayItem}>
                <Text style={styles.dayLabel}>{day}</Text>
                <View
                  style={[styles.dayCircle, isActive && styles.dayCircleActive]}
                >
                  {isActive && (
                    <Image
                      source={require("../../../assets/progress/check.png")}
                      style={styles.check}
                      resizeMode="cover"
                    />
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </LinearGradient>
    </View>
  );
}

export default StreakCard;
