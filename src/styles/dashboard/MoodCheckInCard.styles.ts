import { StyleSheet } from "react-native";
import { wp, hp, fontScale } from "../../utils/responsive";

export const styles = StyleSheet.create({
  moodCard: {
    marginHorizontal: wp(20),
    marginBottom: hp(20),
    padding: wp(20),
    borderRadius: wp(20),
  },
  moodTitle: {
    fontSize: fontScale(18),
    fontFamily: "Outfit_600SemiBold",
    color: "#1A1A1A",
    marginBottom: hp(4),
  },
  moodSubtitle: {
    fontSize: fontScale(14),
    fontFamily: "Outfit_400Regular",
    color: "#666666",
    marginBottom: hp(20),
  },
  sliderContainer: {
    height: hp(80),
    marginBottom: hp(12),
    position: "relative",
  },
  emojisRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(8),
  },
  emojiButton: {
    width: wp(60),
    height: wp(60),
    justifyContent: "center",
    alignItems: "center",
  },
  moodEmoji: {
    width: wp(48),
    height: wp(48),
  },
  sliderThumb: {
    position: "absolute",
    width: wp(80),
    height: wp(80),
    backgroundColor: "#5BBFCF",
    borderRadius: wp(40),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: hp(4),
    },
    shadowOpacity: 0.2,
    shadowRadius: wp(8),
    elevation: 8,
  },
  arrowButton: {
    position: "absolute",
    right: wp(4),
    bottom: hp(4),
    width: wp(28),
    height: wp(28),
    backgroundColor: "#2BA5B8",
    borderRadius: wp(14),
    justifyContent: "center",
    alignItems: "center",
  },
  moodLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp(8),
  },
  moodLabel: {
    fontSize: fontScale(12),
    fontFamily: "Outfit_400Regular",
    color: "#999999",
    width: wp(60),
    textAlign: "center",
  },
  moodLabelActive: {
    color: "#1A1A1A",
    fontFamily: "Outfit_600SemiBold",
  },
});
