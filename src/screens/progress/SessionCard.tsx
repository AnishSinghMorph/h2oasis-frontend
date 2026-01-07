import React from "react";
import { View, Text, Image } from "react-native";
import { styles } from "../../styles/progress/LatestSessions.styles";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  session: {
    type: string;
    date: string;
    duration: string;
    temperature: string;
  };
};

const SESSION_ICONS: Record<string, any> = {
  "Cold Plunge": require("../../../assets/icons/cold_plunge.png"),
  "Hot Tub": require("../../../assets/icons/hot_tub.png"),
  Sauna: require("../../../assets/icons/sauna.png"),
};

function SessionCard({ session }: Props) {
  return (
    <LinearGradient
      colors={[
        "rgba(131,188,200,1)", // #83BCC8
        "rgba(174,222,229,0.5)", // #AEDEE5 @ 50%
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.card}
    >
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.sessionLeft}>
          <Image
            source={SESSION_ICONS[session.type]}
            style={styles.sessionIcon}
          />

          <View>
            <Text style={styles.sessionType}>{session.type}</Text>
            <Text style={styles.sessionDate}>{session.date}</Text>
          </View>
        </View>

        <Image
          source={require("../../../assets/icons/arrow.png")}
          style={styles.arrowIcon}
        />
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <View style={styles.statHeader}>
            <Text style={styles.statLabel}>Total Time</Text>
            <Image
              source={require("../../../assets/icons/timer.png")}
              style={styles.statIcon}
            />
          </View>

          <View style={styles.statValueRow}>
            <Text style={styles.statValue}>{session.duration}</Text>
            <Text style={styles.statUnit}>min</Text>
          </View>
        </View>

        <View style={styles.statBox}>
          <View style={styles.statHeader}>
            <Text style={styles.statLabel}>Temperature</Text>
            <Image
              source={require("../../../assets/icons/temp.png")}
              style={styles.statIcon}
            />
          </View>

          <View style={styles.statValueRow}>
            <Text style={styles.statValue}>{session.temperature}</Text>
            <Text style={styles.statUnit}>°c</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

export default SessionCard;
