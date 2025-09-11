// src/styles/globalStyles.ts
import { StyleSheet } from "react-native";
import { colors, spacing, fontSize, fontWeight, borderRadius } from "./theme";

export const globalStyles = StyleSheet.create({
  // Layout styles
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  spaceBetween: {
    justifyContent: "space-between",
  },

  // Text styles
  headingLarge: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  headingMedium: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
  },
  headingSmall: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
  },
  bodyLarge: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.regular,
    color: colors.text.primary,
  },
  bodyMedium: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    color: colors.text.primary,
  },
  bodySmall: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    color: colors.text.secondary,
  },

  // Button styles
  buttonPrimary: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: "center",
  },
  buttonSecondary: {
    backgroundColor: colors.black,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: "center",
  },
  buttonText: {
    color: colors.text.inverse,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },

  // Input styles
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: fontSize.md,
    backgroundColor: colors.background.primary,
  },

  // Spacing utilities
  mt16: { marginTop: spacing.md },
  mb16: { marginBottom: spacing.md },
  mx16: { marginHorizontal: spacing.md },
  my16: { marginVertical: spacing.md },
  p16: { padding: spacing.md },
  px16: { paddingHorizontal: spacing.md },
  py16: { paddingVertical: spacing.md },
});
