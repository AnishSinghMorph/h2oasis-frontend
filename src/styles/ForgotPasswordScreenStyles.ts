import { StyleSheet } from "react-native";
import { wp, hp, fontScale } from "../utils/responsive";

export const forgotPasswordStyles = StyleSheet.create({
  // Container & Background
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wp(24),
    paddingTop: hp(20),
    paddingBottom: hp(40),
  },

  // Typography
  title: {
    fontSize: fontScale(32),
    fontWeight: "500",
    color: "#FFFFFF",
    marginTop: hp(20),
    marginBottom: hp(12),
  },
  subtitle: {
    fontSize: fontScale(15),
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: hp(22),
    marginBottom: hp(32),
  },

  // Spacer to push button down
  spacer: {
    flex: 1,
    minHeight: hp(200),
  },

  // Primary Button
  primaryButton: {
    marginTop: hp(24),
  },
});
