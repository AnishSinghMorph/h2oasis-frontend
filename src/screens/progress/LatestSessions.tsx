import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../../styles/progress/LatestSessions.styles";
import SessionCard from "./SessionCard";

const SESSIONS = [
  {
    id: "1",
    type: "Cold Plunge",
    date: "07:12 AM, Apr 30, 2024",
    duration: "02:00",
    temperature: "5",
  },
  {
    id: "2",
    type: "Hot Tub",
    date: "07:12 AM, Apr 30, 2024",
    duration: "10:00",
    temperature: "39",
  },
  {
    id: "3",
    type: "Sauna",
    date: "06:40 PM, Apr 29, 2024",
    duration: "15:00",
    temperature: "70",
  },
];

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
