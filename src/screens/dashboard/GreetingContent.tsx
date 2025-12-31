import React from "react";
import { View, Text } from "react-native";
import { styles } from "../../styles/dashboard/GreetingContent.styles";

interface GreetingContentProps {
  greeting: string;
  userName: string;
}

const GreetingContent = React.memo<GreetingContentProps>(
  ({ greeting, userName }) => {
    return (
      <View style={styles.greetingContent}>
        <Text style={styles.greetingText}>{greeting}</Text>
        <Text style={styles.greetingName}>{userName}!</Text>
      </View>
    );
  },
);

GreetingContent.displayName = "GreetingContent";

export default GreetingContent;
