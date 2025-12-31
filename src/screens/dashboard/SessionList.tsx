import React from "react";
import { View, Text, FlatList } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import SessionCardItem from "./SessionCardItem";
import { styles } from "../../styles/dashboard/SessionList.styles";
import { Session } from "../../types/session.types";
import H2OLoader from "../../components/H2OLoader";

interface SessionListProps {
  sessions: Session[];
  aiName: string;
  navigation: StackNavigationProp<RootStackParamList>;
}

const SessionList = React.memo<SessionListProps>(
  ({ sessions, aiName, navigation }) => {
    const renderSessionCard = React.useCallback(
      ({ item, index }: { item: Session; index: number }) => {
        const handlePress = () => {
          navigation.navigate("SessionDetails", { session: item });
        };

        return <SessionCardItem session={item} onPress={handlePress} />;
      },
      [navigation],
    );

    const keyExtractor = React.useCallback(
      (item: Session, index: number) =>
        item.sessionId || item.SessionId || `session-${index}`,
      [],
    );

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Step into the evening session</Text>
        <Text style={styles.sectionSubtitle}>
          {aiName} picked this one just for you
        </Text>

        {sessions.length === 0 ? (
          <View style={styles.loadingSessionsContainer}>
            <H2OLoader size={80} />
            <Text style={styles.loadingSessionsText}>
              Creating personalized sessions...
            </Text>
          </View>
        ) : (
          <FlatList
            data={sessions}
            renderItem={renderSessionCard}
            keyExtractor={keyExtractor}
            scrollEnabled={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={3}
            updateCellsBatchingPeriod={50}
            initialNumToRender={2}
            windowSize={3}
          />
        )}
      </View>
    );
  },
);

SessionList.displayName = "SessionList";

export default SessionList;
