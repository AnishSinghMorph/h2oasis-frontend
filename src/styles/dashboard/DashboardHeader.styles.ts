import { StyleSheet } from "react-native";
import { wp, hp, fontScale } from "../../utils/responsive";

export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(20),
    paddingTop: hp(60),
    marginBottom: hp(20),
  },
  avatar: {
    width: wp(48),
    height: wp(48),
    borderRadius: wp(24),
    backgroundColor: "#4ECDC4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(12),
  },
  avatarImage: {
    width: wp(48),
    height: wp(48),
    borderRadius: wp(24),
  },
  avatarText: {
    fontSize: fontScale(18),
    fontFamily: "Outfit_600SemiBold",
    color: "#FFFFFF",
  },
  dateText: {
    fontSize: fontScale(14),
    fontFamily: "Outfit_400Regular",
    color: "#1A1A1A",
  },
  spacer: {
    flex: 1,
  },
  notificationButton: {
    width: wp(44),
    height: wp(44),
    borderRadius: wp(22),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  notificationBlur: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationIcon: {
    width: wp(24),
    height: wp(24),
  },
});
