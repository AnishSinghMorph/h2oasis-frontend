import { StyleSheet } from "react-native";
import { wp, hp, fontScale } from "../utils/responsive";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: hp(120),
  },

  // Greeting card - contains everything, full width
  greetingCard: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: wp(32),
    borderBottomRightRadius: wp(32),
    overflow: "hidden",
    minHeight: hp(340),
  },
  greetingCardImage: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: wp(32),
    borderBottomRightRadius: wp(32),
  },

  // Utility styles
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#003543",
  },
  loadingText: {
    fontSize: fontScale(16),
    fontWeight: "500",
    fontFamily: "Outfit_500Medium",
    color: "#FFFFFF",
    marginTop: hp(16),
  },
  errorText: {
    fontSize: fontScale(16),
    fontWeight: "500",
    fontFamily: "Outfit_500Medium",
    color: "#FF6B6B",
    marginBottom: hp(16),
    textAlign: "center",
    paddingHorizontal: wp(32),
  },
  retryButton: {
    backgroundColor: "#80BAC6",
    paddingHorizontal: wp(32),
    paddingVertical: hp(12),
    borderRadius: wp(24),
  },
  retryButtonText: {
    fontSize: fontScale(16),
    fontWeight: "600",
    fontFamily: "Outfit_600SemiBold",
    color: "#003543",
  },
});
