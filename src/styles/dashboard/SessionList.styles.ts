import { StyleSheet } from "react-native";
import { wp, hp, fontScale } from "../../utils/responsive";

export const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: wp(20),
    marginTop: hp(30),
  },
  sectionTitle: {
    fontSize: fontScale(24),
    fontFamily: "Outfit_600SemiBold",
    color: "#1A1A1A",
    marginBottom: hp(8),
  },
  sectionSubtitle: {
    fontSize: fontScale(14),
    fontFamily: "Outfit_400Regular",
    color: "#666666",
    marginBottom: hp(20),
  },
  loadingSessionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(40),
    gap: wp(12),
  },
  loadingSessionsText: {
    fontSize: fontScale(14),
    fontFamily: "Outfit_400Regular",
    color: "#666666",
  },
});
