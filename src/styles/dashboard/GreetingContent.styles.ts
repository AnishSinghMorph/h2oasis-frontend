import { StyleSheet } from "react-native";
import { wp, hp, fontScale } from "../../utils/responsive";

export const styles = StyleSheet.create({
  greetingContent: {
    paddingHorizontal: wp(20),
    marginBottom: hp(20),
  },
  greetingText: {
    fontSize: fontScale(16),
    fontFamily: "Outfit_400Regular",
    color: "#1A1A1A",
    marginBottom: hp(4),
  },
  greetingName: {
    fontSize: fontScale(32),
    fontFamily: "Outfit_700Bold",
    color: "#1A1A1A",
  },
});
