import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Svg, { Defs, RadialGradient as SvgRadialGradient, Stop, Circle } from "react-native-svg";
import { RootStackParamList } from "../navigation/AppNavigator";
import { styles } from "../styles/SessionCompleteScreen.styles";
import { colors } from "../constants/colors";
import BottomNav from "../components/BottomNav";

const SessionCompleteScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSchedule = () => {
    navigation.navigate("Dashboard");
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Nice Work!</Text>
        
        <Text style={styles.subtitle}>You've earned this calm</Text>

        {/* Radial gradient backgrounds */}
        <View style={styles.gradientContainer}>
          <Svg height="800" width="800" style={styles.svgGradient} viewBox="0 0 800 800">
            <Defs>
              <SvgRadialGradient id="grad1" cx="50%" cy="50%">
                <Stop offset="0%" stopColor={colors.primary} stopOpacity="0.2" />
                <Stop offset="50%" stopColor={colors.primary} stopOpacity="0.08" />
                <Stop offset="80%" stopColor={colors.primary} stopOpacity="0.02" />
                <Stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
              </SvgRadialGradient>
              <SvgRadialGradient id="grad2" cx="50%" cy="50%">
                <Stop offset="0%" stopColor={colors.primary} stopOpacity="0.2" />
                <Stop offset="50%" stopColor={colors.primary} stopOpacity="0.08" />
                <Stop offset="80%" stopColor={colors.primary} stopOpacity="0.02" />
                <Stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
              </SvgRadialGradient>
              <SvgRadialGradient id="grad3" cx="50%" cy="50%">
                <Stop offset="0%" stopColor={colors.primary} stopOpacity="0.2" />
                <Stop offset="50%" stopColor={colors.primary} stopOpacity="0.08" />
                <Stop offset="80%" stopColor={colors.primary} stopOpacity="0.02" />
                <Stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
              </SvgRadialGradient>
            </Defs>
            <Circle cx="400" cy="400" r="380" fill="url(#grad1)" />
            <Circle cx="400" cy="400" r="304" fill="url(#grad2)" />
            <Circle cx="400" cy="400" r="228" fill="url(#grad3)" />
          </Svg>
          
          <Image
            source={require("../../assets/NiceWork.png")}
            style={styles.celebrationImage}
            resizeMode="contain"
          />
        </View>
        
        <TouchableOpacity style={styles.scheduleButton} onPress={handleSchedule}>
          <Text style={styles.scheduleButtonText}>Schedule tomorrow's unwind</Text>
        </TouchableOpacity>
      </View>

      <BottomNav />
    </View>
  );
};

export default SessionCompleteScreen;
