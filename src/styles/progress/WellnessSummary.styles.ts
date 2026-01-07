import { StyleSheet } from "react-native";
import { wp, hp, fontScale } from "../../utils/responsive";

export const styles = StyleSheet.create({
  /* =====================
     WRAPPER & HEADER
  ====================== */

  wrapper: {
    marginHorizontal: wp(16),
    marginBottom: hp(32),
  },

  title: {
    fontSize: 25,
    fontFamily: "Outfit_500Medium",
    color: "#1A1A1A",
  },

  subtitle: {
    marginTop: hp(4),
    fontSize: fontScale(13),
    fontFamily: "Outfit_400Regular",
    color: "#414042",
  },

  /* =====================
     CARD
  ====================== */

  card: {
    marginTop: hp(16),
    borderRadius: wp(24),
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    padding: wp(24),
  },

  /* =====================
     METRIC ROW
  ====================== */

  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp(12),
  },

  metricLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(10),
  },

  metricIcon: {
    width: wp(20),
    height: wp(20),
    resizeMode: "contain",
  },

  metricLabel: {
    fontSize: fontScale(16),
    fontFamily: "Outfit_500Medium",
    color: "#1A1A1A",
  },

  metricRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(8),
  },

  metricValue: {
    fontSize: fontScale(16),
    fontFamily: "Outfit_500Medium",
    color: "#1A1A1A",
  },

  metricValueHighlight: {
    color: "#015D63",
  },

  metricValueActive: {
    color: "#015D63",
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(15,23,42,0.08)",
  },

  /* =====================
     ARROW (DROPDOWN)
  ====================== */

  arrow: {
    width: wp(5),
    height: wp(5),
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000000",
    transform: [{ rotate: "45deg" }], // down
  },

  arrowActive: {
    borderColor: "#015D63",
    transform: [{ rotate: "-135deg" }], // up
  },

  /* =====================
     EXPANDED BLUE CARD
  ====================== */

  expandCard: {
    marginTop: hp(8),
    marginBottom: hp(12),
    borderRadius: wp(25),
    padding: wp(16),
  },

  /* =====================
     Track + Thumb
  ====================== */

  sliderBlock: {
    marginTop: hp(12),
  },

  sliderContainer: {
    position: "relative",
    height: wp(22), // thumb height
  },
  segmentedTrack: {
    height: hp(6),
    borderRadius: hp(3),
    flexDirection: "row",
    overflow: "hidden",
  },

  segment: {
    flex: 1,
  },

  segmentLow: {
    backgroundColor: "#F2D7B6",
  },

  segmentStandard: {
    backgroundColor: "#89E0E0",
  },

  segmentExcellent: {
    backgroundColor: "#DDF1F1",
  },

  thumbWrapper: {
    position: "absolute",
    // ✅ vertical centering math
    top: hp(3) - wp(11), // (trackHeight / 2) - (thumbHeight / 2)
    left: "50%",
    transform: [{ translateX: -wp(11) }],
    width: wp(22),
    height: wp(22),
    borderRadius: wp(11),
    backgroundColor: "#868686",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  thumbInner: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: "#FFFFFF",
  },

  scoreLabels: {
    flexDirection: "row",
  },

  scoreLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: fontScale(13),
    fontFamily: "Outfit_500Medium",
    color: "rgba(255,255,255,0.6)",
  },

  scoreLabelActive: {
    flex: 1,
    textAlign: "center",
    color: "#FFFFFF",
  },

  scoreDescription: {
    marginTop: hp(24),
    fontSize: fontScale(13),
    fontFamily: "Outfit_400Regular",
    color: "#ffffff",
  },
});
