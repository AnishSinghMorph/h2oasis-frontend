import { StyleSheet } from "react-native";
import { wp, hp, fontScale, moderateScale } from "../utils/responsive";

export const ConnectWearableStyles = StyleSheet.create({
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
    fontFamily: "Outfit_500Medium",
    fontWeight: "500",
    color: "#FFFFFF",
    lineHeight: hp(54),
    marginBottom: hp(30),
  },
  // Grid for wearables - 2 column layout
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: wp(12),
  },
  // Wearable card button - 2 column with horizontal content
  wearableBtn: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(14),
    paddingHorizontal: wp(12),
    borderRadius: wp(16),
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    marginBottom: 0,
  },
  wearableDefault: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  wearableSelected: {
    backgroundColor: "rgba(34, 225, 255, 0.6)",
    borderColor: "rgba(34, 225, 255, 0.6)",
  },
  wearableConnected: {
    backgroundColor: "rgba(34, 225, 255, 0.6)",
    borderColor: "rgba(34, 225, 255, 0.6)",
  },
  iconWrapper: {
    width: wp(36),
    height: wp(36),
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(10),
  },
  icon: {
    width: wp(28),
    height: wp(28),
    resizeMode: "contain",
  },
  wearableTextContainer: {
    flex: 1,
  },
  wearableText: {
    fontSize: fontScale(14),
    fontFamily: "Outfit_500Medium",
    fontWeight: "500",
    color: "#FFFFFF",
  },
  wearableSubtext: {
    fontSize: fontScale(11),
    fontFamily: "Outfit_400Regular",
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: hp(2),
  },
  connectedBadge: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  connectedTick: {
    color: "#FFFFFF",
    fontSize: fontScale(12),
    fontWeight: "700",
  },
  spacer: {
    flex: 1,
  },
  nextButtonContainer: {
    marginBottom: hp(20),
  },
  nextButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: wp(30),
    paddingVertical: moderateScale(16, 0.3),
    alignItems: "center",
    // Glass effect
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: wp(10),
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
