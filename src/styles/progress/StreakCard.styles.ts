import { StyleSheet } from "react-native";
import { wp, hp, fontScale } from "../../utils/responsive";

export const styles = StyleSheet.create({
  outerCard: {
    marginHorizontal: wp(16),
    marginBottom: hp(24),
    // padding: wp(12),
    borderRadius: wp(24),
    // Glass fill (BLACK @ 20%)
    backgroundColor: "rgba(255,255,255,0.25)",
    // subtle white glass edge
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    height: hp(310),
    position: "relative",
    overflow: "hidden",
  },

  innerCard: {
    position: "absolute",
    bottom: wp(13),
    left: wp(13),
    right: wp(13),
    height: "65%",
    borderRadius: wp(24),
    paddingVertical: hp(13),
    paddingHorizontal: wp(13),
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDF1F1",
  },
  badgePlaceholder: {
    width: wp(162), 
    height: wp(155), 
    position: "absolute",
    top: wp(16), 
    alignSelf: "center",
    zIndex: 999,
  },

  title: {
    fontSize: fontScale(25),
    fontFamily: "Outfit_500Medium",
    fontWeight: "600",
    marginTop: wp(26),
    color: "#111827",
  },

  subtitle: {
    fontSize: fontScale(13),
    fontFamily: "Outfit_400Regular",
    fontWeight: "400",
    marginBottom: hp(16),
    color: "#1A1A1A",
    textAlign: "center",
  },

  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: hp(4),
  },

  dayLabel: {
    marginTop: hp(6),
    fontSize: fontScale(13),
    fontFamily: "Outfit_400Regular",
    fontWeight: "400",
    color: "#000000",
    marginBottom: hp(4),
  },

  dayItem: {
    alignItems: "center",
    flex: 1,
  },

  dayCircle: {
    width: wp(32),
    height: wp(32),
    borderRadius: wp(16),
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },

  dayCircleActive: {
    backgroundColor: "#015D63",
  },

  check: {
    width: wp(12),
    height: wp(12),
  },
});
