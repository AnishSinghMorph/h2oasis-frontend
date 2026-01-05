import { StyleSheet } from "react-native";
import { wp, hp, fontScale } from "../utils/responsive";

export const styles = StyleSheet.create({
  container: {
    marginTop: hp(24),
    marginBottom: hp(24),
  },
  header: {
    paddingHorizontal: wp(20),
    marginBottom: hp(16),
  },
  title: {
    fontSize: fontScale(20),
    fontFamily: "Outfit_600SemiBold",
    color: "#1A1A1A",
    marginBottom: hp(4),
  },
  subtitle: {
    fontSize: fontScale(14),
    fontFamily: "Outfit_400Regular",
    color: "#666666",
  },
  carouselContainer: {
    paddingHorizontal: wp(20),
    gap: wp(16),
  },
  card: {
    width: wp(167),
    height: hp(210),
    borderRadius: wp(30),
    padding: wp(16),
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: fontScale(16),
    fontFamily: "Outfit_500Medium",
    color: "#1A1A1A",
    marginBottom: hp(4),
  },
  progressContainer: {
    position: "relative",
    width: wp(100),
    height: hp(50),
    justifyContent: "center",
    alignItems: "center",
    marginVertical: hp(12),
  },
  iconContainer: {
    position: "absolute",
    bottom: hp(-5),
    width: wp(40),
    height: wp(40),
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: wp(40),
    height: wp(40),
  },
  cardValue: {
    fontSize: fontScale(32),
    fontFamily: "Outfit_500Medium",
    color: "#1A1A1A",
    marginTop: hp(4),
  },
  cardUnit: {
    fontSize: fontScale(12),
    fontFamily: "Outfit_500Medium",
    color: "#666666",
    letterSpacing: wp(0.5),
  },
});
