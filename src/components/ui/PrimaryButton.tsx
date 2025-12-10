import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";

interface PrimaryButtonProps {
  onPress: () => void;
  label: string;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: "filled" | "outline";
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  onPress,
  label,
  disabled = false,
  loading = false,
  style,
  textStyle,
  variant = "filled",
}) => {
  const isOutline = variant === "outline";

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isOutline ? styles.outlineButton : styles.filledButton,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isOutline ? "#FFFFFF" : "#1A5F7A"}
        />
      ) : (
        <Text
          style={[
            styles.text,
            isOutline ? styles.outlineText : styles.filledText,
            textStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  filledButton: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 17,
    fontWeight: "600",
  },
  filledText: {
    color: "#FFFFFF",
  },
  outlineText: {
    color: "#FFFFFF",
  },
});

export default PrimaryButton;
