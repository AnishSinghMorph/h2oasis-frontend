import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  bottomNavContainer: {
    position: "absolute",
    bottom: 32,
    left: 20,
    right: 20,
    height: 88,
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
    paddingHorizontal: 24,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 48,
    position: "relative",
  },
  navItemIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3AAFA9",
    position: "absolute",
    bottom: 0,
  },
  aiButton: {
    width: 116,
    height: 116,
    borderRadius: 58,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 50,
    left: "50%",
    marginLeft: -58,
    backgroundColor: "transparent",
    elevation: 12,
    zIndex: 10,
  },
});
