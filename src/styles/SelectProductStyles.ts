import { StyleSheet } from "react-native";
import { wp, hp, fontScale, moderateScale } from "../utils/responsive";

export const SelectProductStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: wp(24),
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: hp(10),
    marginBottom: hp(20),
  },
  title: {
    fontSize: fontScale(50),
    fontFamily: "Outfit_500Medium",
    fontWeight: "500",
    color: "#FFFFFF",
    lineHeight: hp(54),
    marginBottom: hp(30),
  },
  productList: {
    gap: wp(12),
  },
  glassCardWrapper: {
    position: "relative",
    borderRadius: wp(16),
    overflow: "hidden",
    marginBottom: 0,
  },
  topLeftShine: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "50%",
    height: "50%",
    borderTopLeftRadius: wp(16),
    zIndex: 1,
  },
  bottomRightShine: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "50%",
    height: "50%",
    borderBottomRightRadius: wp(16),
    zIndex: 1,
  },
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(14),
    paddingHorizontal: wp(16),
    borderRadius: wp(16),
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  productCardSelected: {
    backgroundColor: "rgba(34, 225, 255, 0.6)",
    borderColor: "rgba(34, 225, 255, 0.6)",
  },
  productIconContainer: {
    width: wp(40),
    height: wp(40),
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(14),
  },
  productIcon: {
    width: wp(36),
    height: wp(36),
  },
  productName: {
    fontSize: fontScale(17),
    fontFamily: "Outfit_500Medium",
    fontWeight: "500",
    color: "#FFFFFF",
  },
  productNameSelected: {
    color: "#FFFFFF",
  },
  spacer: {
    flex: 1,
  },
  nextButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: wp(30),
    paddingVertical: moderateScale(16, 0.3),
    alignItems: "center",
    marginBottom: hp(20),
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonText: {
    fontSize: fontScale(18),
    fontFamily: "Outfit_600SemiBold",
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
