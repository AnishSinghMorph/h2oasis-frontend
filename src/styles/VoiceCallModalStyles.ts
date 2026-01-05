import { StyleSheet } from "react-native";
import { wp, hp, fontScale, moderateScale } from "../utils/responsive";

export const VoiceCallModalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(20),
  },
  statusContainer: {
    alignItems: "center",
    marginTop: hp(40),
    marginBottom: hp(40),
  },
  statusTitle: {
    color: "#333333",
    fontSize: fontScale(24),
    fontWeight: "600",
    textAlign: "center",
    marginBottom: hp(8),
  },
  statusSubtitle: {
    color: "rgba(0, 0, 0, 0.6)",
    fontSize: fontScale(16),
    textAlign: "center",
    maxWidth: wp(300),
    lineHeight: hp(22),
  },
  orbContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: hp(40),
  },
  aiContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: wp(20),
  },
  loadingText: {
    color: "rgba(0, 0, 0, 0.6)",
    fontSize: fontScale(16),
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    paddingVertical: hp(20),
    paddingHorizontal: wp(20),
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  closeButtonBottom: {
    backgroundColor: "#FF4444",
    paddingVertical: moderateScale(14, 0.3),
    paddingHorizontal: wp(60),
    borderRadius: wp(30),
    minWidth: wp(200),
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(2) },
    shadowOpacity: 0.25,
    shadowRadius: wp(3.84),
  },
  closeButtonBottomText: {
    color: "#FFFFFF",
    fontSize: fontScale(18),
    fontWeight: "600",
  },
});
