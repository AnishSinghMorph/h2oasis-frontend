import React from "react";
import { View, Text, ImageBackground } from "react-native";
import { GlassmorphicButton } from "../../components/GlassmorphicButton";
import { styles } from "../../styles/dashboard/SessionCardItem.styles";
import { Session } from "../../types/session.types";

interface SessionCardItemProps {
  session: Session;
  onPress: () => void;
}

const SessionCardItem = React.memo<SessionCardItemProps>(
  ({ session, onPress }) => {
    return (
      <View style={styles.sessionCard}>
        <ImageBackground
          source={require("../../../assets/sessionCard.png")}
          style={styles.sessionCardBackground}
          imageStyle={styles.sessionCardImage}
          resizeMode="cover"
        >
          <View style={styles.sessionCardWrapper}>
            <View style={styles.sessionCardContent}>
              <Text style={styles.sessionCardTitle} numberOfLines={2}>
                {session.SessionName}
              </Text>

              <Text style={styles.sessionCardDescription} numberOfLines={2}>
                {session.StartMessage}
              </Text>

              <GlassmorphicButton
                title="Start"
                onPress={onPress}
                style={styles.startButtonContainer}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  },
);

SessionCardItem.displayName = "SessionCardItem";

export default SessionCardItem;
