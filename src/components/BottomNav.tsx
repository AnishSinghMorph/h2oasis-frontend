import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { styles } from "../styles/BottomNav.styles";

interface BottomNavProps {
  onAIButtonPress?: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ onAIButtonPress }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();

  const handleAIPress = () => {
    if (onAIButtonPress) {
      onAIButtonPress();
    } else {
      navigation.navigate("chatScreen" as never);
    }
  };

  const isActive = (routeName: string) => {
    return route.name === routeName;
  };

  return (
    <>
      <TouchableOpacity style={styles.aiButton} onPress={handleAIPress}>
        <Image
          source={require("../../assets/dashboard/ai.png")}
          style={{ width: 80, height: 80 }}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <View style={styles.bottomNavContainer}>
        <Image
          source={require("../../assets/dashboard/bottomNavbar.png")}
          style={styles.bottomNavBackground}
          resizeMode="contain"
        />
        <View style={styles.bottomNavContent}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("Dashboard" as never)}
          >
            <Image
              source={require("../../assets/dashboard/home.png")}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
            {isActive("Dashboard") && (
              <View style={styles.navItemIndicator} />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Image
              source={require("../../assets/dashboard/hotTub.png")}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View style={{ width: 96 }} />

          <TouchableOpacity style={styles.navItem}>
            <Image
              source={require("../../assets/dashboard/stats.png")}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Image
              source={require("../../assets/dashboard/profile.png")}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default BottomNav;
