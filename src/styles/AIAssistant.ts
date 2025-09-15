import { StyleSheet } from "react-native";
import { colors, spacing, fontSize, fontWeight, borderRadius } from "./theme";

export const AIAssistant = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.screenTop,
    paddingBottom: spacing.screenBottom + spacing.xl,
  },
  titleContainer: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxxl,
    color: colors.gray[900],
    fontWeight: fontWeight.bold,
    textAlign: "center",
  },
  logoSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 300,
    height: 300,
  },
  logoText: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.medium,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  logoSubText: {
    fontSize: fontSize.md,
    opacity: 0.9,
    marginTop: spacing.sm,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: spacing.md,
  },
  aiButtons: {
    backgroundColor: "#000000",
    borderRadius: borderRadius.full,
    paddingVertical: spacing.ms,
    marginVertical: spacing.sm,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  aiButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  selectPersona: {
    backgroundColor: "#DDF1F1",
    marginBottom: spacing.md,
  },
  selectPersonaText: {
    color: "#1A1A1A",
  },
  letsGo: {
    backgroundColor: "#000000",
  },
  letsGoText: {
    color: "#FFFFFF",
  },
  chossePersonaCarousel: {
    gap: spacing.lg,
  },
  carouselContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  carouselItemContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  carouselImage: {
    width: 163,
    height: 163,
    marginBottom: spacing.md,
  },
  carouselTextContainer: {
    alignItems: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
