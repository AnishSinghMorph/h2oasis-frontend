import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import LottieView from "lottie-react-native";

interface H2OLoaderProps {
  size?: number;
  text?: string;
  subText?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  subTextStyle?: TextStyle;
}

/**
 * H2O Loader Component
 * A reusable Lottie animation loader that can be used anywhere in the app
 *
 * @param size - Width and height of the animation (default: 150)
 * @param text - Main loading text (optional)
 * @param subText - Secondary loading text (optional)
 * @param style - Custom container style
 * @param textStyle - Custom text style
 * @param subTextStyle - Custom subtext style
 */
const H2OLoader: React.FC<H2OLoaderProps> = ({
  size = 150,
  text,
  subText,
  style,
  textStyle,
  subTextStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      <LottieView
        source={require("../../assets/H2OLoader.json")}
        autoPlay
        loop
        style={{ width: size, height: size }}
      />
      {text && <Text style={[styles.text, textStyle]}>{text}</Text>}
      {subText && <Text style={[styles.subText, subTextStyle]}>{subText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontFamily: "Outfit_600SemiBold",
    color: "#FFFFFF",
    marginTop: 16,
    textAlign: "center",
  },
  subText: {
    fontSize: 14,
    fontFamily: "Outfit_400Regular",
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 8,
    textAlign: "center",
  },
});

export default H2OLoader;
