import { StyleSheet } from "react-native";
import { colors, spacing, fontSize, fontWeight, borderRadius } from "./theme";

export const ConnectWearableStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    // Remove fixed padding to allow ScrollView to handle spacing
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxxl,
    color: colors.gray[900],
    marginBottom: spacing.lg,
    fontWeight: fontWeight.bold,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: spacing.xxl,
  },
  wearableBtn: {
    width: "48%",
    height: 137,
    borderRadius: borderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  wearableDefault: {
    backgroundColor: "#DDF1F1",
  },
  wearableSelected: {
    backgroundColor: "#00A3C7",
  },
  iconWrapper: {
    width: 51,
    height: 51,
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  icon: {
    width: 35,
    height: 35,
    resizeMode: "contain",
  },
  wearableText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.gray[900],
  },
});
