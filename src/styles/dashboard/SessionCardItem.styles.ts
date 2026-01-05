import { StyleSheet } from "react-native";
import { wp, hp, fontScale } from "../../utils/responsive";

export const styles = StyleSheet.create({
  sessionCard: {
    marginBottom: hp(16),
    borderRadius: wp(24),
    overflow: "hidden",
  },
  sessionCardBackground: {
    width: "100%",
    aspectRatio: 1.5,
  },
  sessionCardImage: {
    borderRadius: wp(24),
  },
  sessionCardWrapper: {
    flex: 1,
    padding: wp(20),
    justifyContent: "flex-end",
  },
  sessionCardContent: {
    gap: wp(12),
  },
  sessionCardTitle: {
    fontSize: fontScale(24),
    fontFamily: "Outfit_500Medium",
    color: "#FFFFFF",
    lineHeight: hp(30),
  },
  sessionCardDescription: {
    fontSize: fontScale(14),
    fontFamily: "Outfit_400Regular",
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: hp(20),
  },
  startButtonContainer: {
    marginTop: hp(8),
  },
});
