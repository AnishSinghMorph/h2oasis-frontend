import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../../styles/progress/LatestSessions.styles";
import SessionCard from "./SessionCard";
import { SESSIONS } from "../../utils/ProgressScreen";

function LatestSessions() {
  const [viewAll, setViewAll] = useState(false);

  const visibleSessions = viewAll ? SESSIONS : SESSIONS.slice(0, 2);

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Latest Session</Text>
        <TouchableOpacity onPress={() => setViewAll(!viewAll)}>
          <Text style={styles.viewAllText}>
            {viewAll ? "View less" : "View all"}
          </Text>
        </TouchableOpacity>
      </View>

      {visibleSessions.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </View>
  );
}

export default LatestSessions;
