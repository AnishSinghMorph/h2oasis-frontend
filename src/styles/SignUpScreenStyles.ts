import { StyleSheet, Dimensions } from "react-native";
import { wp, hp, fontScale, moderateScale } from "../utils/responsive";

const { width, height } = Dimensions.get("window");

export const signUpStyles = StyleSheet.create({
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
    paddingTop: hp(40),
    paddingBottom: hp(40),
  },

  // Typography
  title: {
    fontSize: fontScale(32),
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: hp(12),
  },
  subtitle: {
    fontSize: fontScale(15),
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: fontScale(22),
    marginBottom: hp(32),
  },

  // Primary Button
  primaryButton: {
    marginTop: hp(8),
  },

  // Divider
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(24),
    marginBottom: hp(24),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  dividerText: {
    fontSize: fontScale(14),
    color: "rgba(255, 255, 255, 0.6)",
    marginHorizontal: wp(16),
  },

  // Social Buttons
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: hp(56),
    paddingVertical: hp(14),
    borderRadius: wp(28),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    backgroundColor: "transparent",
    marginBottom: hp(12),
  },
  socialIcon: {
    marginRight: wp(12),
  },
  googleIcon: {
    width: wp(20),
    height: wp(20),
    marginRight: wp(12),
  },
  socialButtonText: {
    fontSize: fontScale(16),
    color: "#FFFFFF",
    fontWeight: "500",
  },

  // Login Link
  loginLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(24),
  },
  loginText: {
    fontSize: fontScale(14),
    color: "rgba(255, 255, 255, 0.7)",
  },
  loginLinkText: {
    fontSize: fontScale(14),
    color: "#FFFFFF",
    fontWeight: "600",
  },

  // Country Picker Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1A1A2E",
    borderTopLeftRadius: wp(24),
    borderTopRightRadius: wp(24),
    maxHeight: "70%",
    paddingBottom: hp(40),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(24),
    paddingVertical: hp(20),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  modalTitle: {
    fontSize: fontScale(18),
    fontWeight: "600",
    color: "#FFFFFF",
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(24),
    paddingVertical: hp(16),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  countryFlag: {
    fontSize: fontScale(28),
    marginRight: wp(16),
  },
  countryName: {
    flex: 1,
    fontSize: fontScale(16),
    color: "#FFFFFF",
  },
  countryCode: {
    fontSize: fontScale(16),
    color: "rgba(255, 255, 255, 0.6)",
  },
});
