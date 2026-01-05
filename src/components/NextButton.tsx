import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { colors } from "../styles/theme";
import { wp, moderateScale, fontScale } from "../utils/responsive";

interface NextButtonProps {
  onPress: () => void;
  disabled?: boolean;
  label?: string;
  containerStyle?: object;
}

export const NextButton: React.FC<NextButtonProps> = ({
  onPress,
  disabled = false,
  label = "Next",
  containerStyle,
}) => {
  return (
    <View style={[styles.nextButtonContainer, containerStyle]}>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.nextButton, disabled && styles.nextButtonDisabled]}
        disabled={disabled}
      >
        <Text style={styles.nextButtonText}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  nextButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: moderateScale(24, 0.3),
    backgroundColor: colors.white,
    paddingTop: moderateScale(12, 0.3),
  },
  nextButton: {
    backgroundColor: "#000000",
    borderRadius: wp(100),
    paddingVertical: moderateScale(14, 0.3), // Use moderate scaling to prevent oversizing
    marginBottom: moderateScale(12, 0.3),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: fontScale(16),
    fontWeight: "600",
  },
});
