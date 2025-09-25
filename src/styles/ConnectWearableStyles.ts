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
  wearableConnected: {
    backgroundColor: "#10B981", // Blue-green color for connected wearables
  },
  iconWrapper: {
    width: 51,
    height: 51,
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
    position: "relative", // Allow absolute positioning for badge
  },
  icon: {
    width: 35,
    height: 35,
    resizeMode: "contain",
  },
  connectedBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#059669", // Darker green for badge
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },
  connectedTick: {
    color: colors.white,
    fontSize: 10,
    fontWeight: fontWeight.bold,
  },
  wearableText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.gray[900],
  },
  healthDataContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  wearableName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.gray[900],
    marginBottom: 4,
  },
  healthDataRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 8,
  },
  healthDataText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.gray[900],
  },
});
