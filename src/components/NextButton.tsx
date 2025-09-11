import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { colors, spacing, fontSize, fontWeight } from "../styles/theme";

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
    paddingBottom: spacing.xl,
    // paddingHorizontal: spacing.screenHorizontal,
    backgroundColor: colors.white,
    paddingTop: spacing.md,
  },
  nextButton: {
    backgroundColor: "#000000",
    borderRadius: 100,
    paddingVertical: spacing.ms,
    marginBottom: spacing.md,
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
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
});
