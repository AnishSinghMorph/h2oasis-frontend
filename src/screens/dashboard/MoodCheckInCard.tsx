import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard } from "../../components/GlassCard";
import { styles } from "../../styles/dashboard/MoodCheckInCard.styles";

type MoodType = "notGood" | "ok" | "great";

const MoodCheckInCard = React.memo(() => {
  const [selectedMood, setSelectedMood] = useState<MoodType>("notGood");

  return (
    <GlassCard style={styles.moodCard}>
      <Text style={styles.moodTitle}>How are you feeling today?</Text>
      <Text style={styles.moodSubtitle}>Mood Check in</Text>

      <View style={styles.sliderContainer}>
        <View style={styles.emojisRow}>
          <TouchableOpacity
            onPress={() => setSelectedMood("notGood")}
            style={styles.emojiButton}
          >
            <Image
              source={require("../../../assets/dashboard/emojis/notGood.png")}
              style={styles.moodEmoji}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedMood("ok")}
            style={styles.emojiButton}
          >
            <Image
              source={require("../../../assets/dashboard/emojis/ok.png")}
              style={styles.moodEmoji}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedMood("great")}
            style={styles.emojiButton}
          >
            <Image
              source={require("../../../assets/dashboard/emojis/great.png")}
              style={styles.moodEmoji}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.sliderThumb,
            selectedMood === "notGood" && { left: 8 },
            selectedMood === "ok" && { left: "50%", marginLeft: -40 },
            selectedMood === "great" && { right: 8 },
          ]}
        >
          <Image
            source={
              selectedMood === "notGood"
                ? require("../../../assets/dashboard/emojis/notGood.png")
                : selectedMood === "ok"
                  ? require("../../../assets/dashboard/emojis/ok.png")
                  : require("../../../assets/dashboard/emojis/great.png")
            }
            style={styles.moodEmoji}
            resizeMode="contain"
          />
          <View style={styles.arrowButton}>
            <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
          </View>
        </View>
      </View>

      <View style={styles.moodLabelsRow}>
        <Text
          style={[
            styles.moodLabel,
            selectedMood === "notGood" && styles.moodLabelActive,
          ]}
        >
          Not Good
        </Text>
        <Text
          style={[
            styles.moodLabel,
            selectedMood === "ok" && styles.moodLabelActive,
          ]}
        >
          Ok
        </Text>
        <Text
          style={[
            styles.moodLabel,
            selectedMood === "great" && styles.moodLabelActive,
          ]}
        >
          Great
        </Text>
      </View>
    </GlassCard>
  );
});

MoodCheckInCard.displayName = "MoodCheckInCard";

export default MoodCheckInCard;
