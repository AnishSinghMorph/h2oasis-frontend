import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../../styles/progress/WellnessSummary.styles";
import { METRICS } from "../../utils/ProgressScreen";


function WellnessSummary() {
  const [expandedKey, setExpandedKey] = useState<string | null>("heartRate");

  const toggleExpand = (key: string) => {
    setExpandedKey((prev) => (prev === key ? null : key));
  };

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <Text style={styles.title}>Wellness Summary</Text>
      <Text style={styles.subtitle}>
        Last week you have spent 2 hours in your Hot Tub.
      </Text>

      {/* Card */}
      <View style={styles.card}>
        {METRICS.map((item, index) => {
          const isExpanded = expandedKey === item.key;

          return (
            <View key={item.key}>
              {/* METRIC ROW */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => toggleExpand(item.key)}
                style={styles.metricRow}
              >
                {/* Left */}
                <View style={styles.metricLeft}>
                  <Image source={item.icon} style={styles.metricIcon} />
                  <Text style={styles.metricLabel}>{item.label}</Text>
                </View>

                {/* Right */}
                <View style={styles.metricRight}>
                  <Text
                    style={[
                      styles.metricValue,
                      item.highlight && styles.metricValueHighlight,
                      isExpanded && styles.metricValueActive,
                    ]}
                  >
                    {item.value}
                  </Text>

                  <View
                    style={[
                      styles.arrow,
                      isExpanded && styles.arrowActive,
                    ]}
                  />
                </View>
              </TouchableOpacity>

              {/* DIVIDER */}
              {!isExpanded && index < METRICS.length - 1 && (
                <View style={styles.divider} />
              )}

              {/* EXPANDED CARD */}
              {isExpanded && (
              <LinearGradient
                colors={[
                  "rgba(0, 81, 99, 0.45)",  // #005163 @ ~85%
                  "rgba(0, 53, 67, 1)",  // #003543 @ ~85%
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.expandCard}
              >

                  <View style={styles.sliderBlock}>
                {/* Track + Thumb */}
                <View style={styles.sliderContainer}>
                    <View style={styles.segmentedTrack}>
                    <View style={[styles.segment, styles.segmentLow]} />
                    <View style={[styles.segment, styles.segmentStandard]} />
                    <View style={[styles.segment, styles.segmentExcellent]} />
                    </View>

                    <View style={styles.thumbWrapper}>
                    <View style={styles.thumbInner} />
                    </View>
                </View>

                {/* Labels */}
                <View style={styles.scoreLabels}>
                    <Text style={styles.scoreLabel}>Low</Text>
                    <Text style={styles.scoreLabelActive}>Standard</Text>
                    <Text style={styles.scoreLabel}>Excellent</Text>
                </View>
                </View>

                  <Text style={styles.scoreDescription}>
                    Session description is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum
                  </Text>
                </LinearGradient>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default WellnessSummary;
