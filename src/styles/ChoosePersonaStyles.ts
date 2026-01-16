import { StyleSheet } from "react-native";
import { wp, hp, fontScale, moderateScale } from "../utils/responsive";

export const ChoosePersonaStyles = StyleSheet.create({
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
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: hp(10),
    marginBottom: hp(10),
  },
  soundButton: {
    width: wp(44),
    height: wp(44),
    borderRadius: wp(22),
    overflow: "hidden",
  },
  soundButtonBlur: {
    flex: 1,
    borderRadius: wp(22),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  soundButtonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleSection: {
    marginBottom: hp(24),
  },
  greeting: {
    fontSize: fontScale(20),
    fontFamily: "Outfit_400Regular",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: hp(8),
  },
  title: {
    fontSize: fontScale(50),
    fontFamily: "Outfit_500Medium",
    fontWeight: "500",
    color: "#FFFFFF",
    lineHeight: hp(54),
  },
  cardsContainer: {
    gap: wp(16),
  },
  personaCard: {
    flexDirection: "row",
    padding: wp(16),
    borderRadius: wp(20),
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    minHeight: hp(140),
  },
  personaCardSelected: {
    backgroundColor: "rgba(169, 0, 121, 0.4)",
    borderColor: "rgba(169, 0, 121, 0.6)",
  },
  avatarContainer: {
    marginRight: wp(16),
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: wp(90),
    height: wp(90),
  },
  personaInfo: {
    flex: 1,
    justifyContent: "center",
  },
  personaName: {
    fontSize: fontScale(22),
    fontFamily: "Outfit_600SemiBold",
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: hp(4),
  },
  personaSubtitle: {
    fontSize: fontScale(14),
    fontFamily: "Outfit_400Regular",
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: hp(8),
  },
  personaDescription: {
    fontSize: fontScale(13),
    fontFamily: "Outfit_400Regular",
    color: "rgba(255, 255, 255, 0.6)",
    lineHeight: hp(18),
  },
  spacer: {
    flex: 1,
  },
  nextButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: wp(30),
    paddingVertical: moderateScale(16, 0.3),
    alignItems: "center",
    marginBottom: hp(20),
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonText: {
    fontSize: fontScale(18),
    fontFamily: "Outfit_600SemiBold",
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
