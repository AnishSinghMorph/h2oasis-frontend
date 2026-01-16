import { StyleSheet } from "react-native";
import { wp, hp, fontScale, moderateScale } from "../utils/responsive";

export const MoodPageStyles = StyleSheet.create({
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
    paddingHorizontal: wp(24),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: hp(10),
    marginBottom: hp(20),
  },
  headerButton: {
    width: wp(48),
    height: wp(48),
    borderRadius: wp(24),
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: fontScale(50),
    fontFamily: "Outfit_400Regular",
    fontWeight: "400",
    color: "#FFFFFF",
    lineHeight: hp(54),
    marginBottom: hp(30),
  },
  optionsList: {
    gap: wp(12),
  },
  optionButton: {
    paddingVertical: hp(14),
    paddingHorizontal: wp(20),
    borderRadius: wp(30),
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    alignSelf: "flex-start",
  },
  optionButtonSelected: {
    backgroundColor: "rgba(34, 225, 255, 0.6)",
    borderColor: "rgba(34, 225, 255, 0.6)",
  },
  optionText: {
    fontSize: fontScale(16),
    fontFamily: "Outfit_500Medium",
    fontWeight: "500",
    color: "#FFFFFF",
  },
  optionTextSelected: {
    color: "#FFFFFF",
  },
  spacer: {
    flex: 1,
  },
  getStartedButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: wp(30),
    paddingVertical: moderateScale(16, 0.3),
    alignItems: "center",
    marginTop: hp(20),
    marginBottom: hp(20),
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  getStartedButtonText: {
    fontSize: fontScale(18),
    fontFamily: "Outfit_600SemiBold",
    fontWeight: "600",
    color: "#FFFFFF",
  },
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(40),
    marginBottom: hp(20),
  },
  lottieAnimation: {
    width: wp(150),
    height: wp(150),
  },
});
