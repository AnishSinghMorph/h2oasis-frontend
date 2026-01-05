import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { wp, hp, fontScale } from "../utils/responsive";

interface WhiteButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * WhiteButton Component
 * A reusable button with white background, black text, and subtle shadow
 *
 * @param title - Button text
 * @param onPress - Function to call when button is pressed
 * @param disabled - Whether the button is disabled
 * @param style - Custom container style
 * @param textStyle - Custom text style
 */
const WhiteButton: React.FC<WhiteButtonProps> = ({
  title,
  onPress,
  disabled = false,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FFFFFF",
    paddingVertical: hp(16),
    paddingHorizontal: wp(32),
    borderRadius: wp(30),
    alignItems: "center",
    justifyContent: "center",
    // iOS shadow
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: hp(4),
    },
    shadowOpacity: 0.15,
    shadowRadius: wp(8),
    // Android shadow
    elevation: 6,
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: fontScale(18),
    fontWeight: "600",
    fontFamily: "Outfit_600SemiBold",
    color: "#000000",
  },
});

export default WhiteButton;
