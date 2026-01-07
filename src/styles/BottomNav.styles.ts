import { StyleSheet } from "react-native";
import { wp, hp } from "../utils/responsive";

export const styles = StyleSheet.create({
  bottomNavContainer: {
    position: "absolute",
    bottom: hp(8),
    left: wp(20),
    right: wp(20),
    height: hp(88),
    zIndex: 1000,
    elevation: 1000,
  },
  bottomNavBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  bottomNavContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(24),
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    width: wp(48),
    height: wp(48),
    position: "relative",
    zIndex: 1001,
  },
  navItemIndicator: {
    width: wp(6),
    height: wp(6),
    borderRadius: wp(3),
    backgroundColor: "#3AAFA9",
    position: "absolute",
    bottom: 0,
  },
  aiButton: {
    width: wp(116),
    height: wp(116),
    borderRadius: wp(58),
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: hp(26),
    left: "50%",
    marginLeft: wp(-58),
    backgroundColor: "transparent",
    elevation: 1001,
    zIndex: 1001,
  },
});
