import { StyleSheet } from "react-native";
import { colors, spacing, borderRadius } from "./theme";

export const progressBarStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: spacing.md,
  },
  base: {
    width: "100%",
    height: 4,
    backgroundColor: colors.gray[400],
    borderRadius: borderRadius.sm,
    overflow: "hidden", // Ensure the fill stays within bounds
  },
  fill: {
    height: "100%",
    backgroundColor: colors.gray[900],
    borderRadius: borderRadius.sm,
  },
});
