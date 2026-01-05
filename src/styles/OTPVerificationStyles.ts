import { StyleSheet } from "react-native";
import { wp, hp, fontScale, moderateScale } from "../utils/responsive";

export const OTPVerificationStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: wp(24),
    paddingTop: hp(60),
  },
  title: {
    color: "#FFFFFF",
    fontSize: fontScale(32),
    fontWeight: "600",
    textAlign: "left",
    marginBottom: hp(12),
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: fontScale(16),
    textAlign: "left",
    marginBottom: hp(40),
    lineHeight: fontScale(24),
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: wp(10),
    marginBottom: hp(20),
  },
  otpInput: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: wp(56),
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
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(16),
  },
  resendText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: fontScale(14),
  },
  resendLink: {
    color: "#4ECDC4",
    fontSize: fontScale(14),
    fontWeight: "600",
  },
  spacer: {
    flex: 1,
  },
  verifyButton: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: wp(30),
    paddingVertical: moderateScale(16, 0.3),
    marginBottom: hp(12),
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  verifyButtonText: {
    color: "#FFFFFF",
    fontSize: fontScale(18),
    fontWeight: "600",
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: wp(30),
    paddingVertical: moderateScale(16, 0.3),
    marginBottom: hp(20),
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: fontScale(18),
    fontWeight: "600",
    textAlign: "center",
  },
});
