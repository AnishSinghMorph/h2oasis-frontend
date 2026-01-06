import { StyleSheet } from "react-native";
import { wp, hp, fontScale } from "../../utils/responsive";

export const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: wp(16),
    marginBottom: hp(32),
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(12),
  },

  title: {
    fontSize: fontScale(25),
    fontFamily: "Outfit_500Medium",
    fontWeight: "600",
    color: "#1A1A1A",
  },

  viewAllText: {
    fontSize: fontScale(10),
    fontFamily: "Outfit_400Regular",
    color: "#1A1A1A",
  },

  card: {
    borderRadius: wp(24),
    padding: wp(16),
    borderWidth: 1,
    borderColor: "#DDF1F1",
    marginBottom: hp(12),
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(12),
  },

  sessionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(10),
  },

  sessionIcon: {
    width: wp(42),
    height: wp(42),
    resizeMode: "contain",
  },

  sessionType: {
    fontSize: fontScale(16),
    fontFamily: "Outfit_500Medium",
    color: "#1A1A1A",
  },

  sessionDate: {
    fontSize: fontScale(13),
    fontFamily: "Outfit_400Regular",
    color: "#757575",
    marginTop: hp(2),
  },

  arrowIcon: {
    width: wp(27),
    height: wp(27),
    resizeMode: "contain",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  statBox: {
  width: "48%",
  borderRadius: wp(20),
  padding: wp(14),
  backgroundColor: "rgba(255,255,255,0.4)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.8)",
},

  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statLabel: {
    fontSize: fontScale(13),
    fontFamily: "Outfit_400Regular",
    color: "#1A1A1A",
  },

  statIcon: {
    width: wp(22),
    height: wp(22),
    resizeMode: "contain",
  },

  statValueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: hp(6),
  },

  statValue: {
    fontSize: fontScale(30),
    fontFamily: "Outfit_500Medium",
    color: "#1A1A1A",
  },

  statUnit: {
    fontSize: fontScale(13),
    fontFamily: "Outfit_400Regular",
    color: "#757575",
    marginLeft: wp(4),
    marginBottom: hp(8),
  },
});
