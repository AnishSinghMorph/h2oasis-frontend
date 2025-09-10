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
    // paddingTop: spacing.xxxl,
    // paddingBottom: spacing.xl,
    // paddingHorizontal: spacing.md,
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

  chossePersonaCarousel: {
    gap: spacing.lg,
  },

  buttonContainer: {
    width: "100%",
    paddingHorizontal: spacing.md,
  },
  aiButtons: {
    backgroundColor: "#000000",
    borderRadius: 100,
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
  }

});