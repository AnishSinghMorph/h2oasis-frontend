import { StyleSheet } from "react-native";
import { wp, hp, fontScale } from "../utils/responsive";

export const resetPasswordStyles = StyleSheet.create({
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
  emailText: {
    fontSize: fontScale(15),
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: hp(24),
    fontWeight: "500",
  },

  // OTP Input
  otpContainer: {
    marginBottom: hp(24),
  },
  label: {
    fontSize: fontScale(14),
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: hp(12),
  },
  otpInputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: wp(10),
  },
  otpInput: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: wp(52),
    borderRadius: wp(16),
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    fontSize: fontScale(24),
    fontWeight: "600",
    textAlign: "center",
    color: "#FFFFFF",
  },
  otpInputFilled: {
    borderColor: "rgba(78, 205, 196, 0.6)",
    backgroundColor: "rgba(78, 205, 196, 0.2)",
  },

  // Password Requirements
  requirementsText: {
    fontSize: fontScale(13),
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: hp(8),
    marginBottom: hp(16),
  },

  // Spacer to push button down
  spacer: {
    flex: 1,
    minHeight: hp(150),
  },

  // Primary Button
  primaryButton: {
    marginTop: hp(24),
  },
});
