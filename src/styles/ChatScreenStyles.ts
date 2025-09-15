import { StyleSheet, Dimensions } from "react-native";
import { colors, spacing, fontSize, borderRadius } from "./theme";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const ChatScreenStyles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  logoSection: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.screenHorizontal,
    height: SCREEN_HEIGHT * 0.4,
  },
  logo: {
    width: 250,
    height: 250,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: spacing.screenTop + spacing.md,
    paddingBottom: spacing.screenBottom,
  },
  messagesContainer: {
    paddingHorizontal: spacing.md,
  },
  message: {
    maxWidth: "80%",
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.xs,
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: colors.white,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary,
  },
  botText: {
    color: colors.text.primary,
    fontSize: fontSize.md,
  },
  userText: {
    color: colors.text.inverse,
    fontSize: fontSize.md,
  },
  optionsBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  optionButton: {
    padding: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: "#DDF1F1",
  },
  optionSelected: {
    backgroundColor: colors.primary,
  },
  optionText: {
    color: colors.text.primary,
    fontSize: fontSize.md,
  },
  optionSelectedText: {
    color: colors.text.inverse,
  },

  messageWrapper: {
    marginBottom: spacing.sm,
  },

  timeText: {
    fontSize: fontSize.xs,
    color: colors.gray[400],
    textTransform: "uppercase",
  },

  userTime: {
    alignSelf: "flex-end",
    marginRight: spacing.sm,
  },

  botTime: {
    alignSelf: "flex-start",
    marginLeft: spacing.sm,
  },
  inputBox: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.sm,
    position: "relative",
  },
  textInput: {
    width: "100%",
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    paddingRight: spacing.xxxl,
    borderRadius: borderRadius.full,
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  voiceButton: {
    position: "absolute",
    right: spacing.lg,
    top: "50%",
    transform: [{ translateY: -14 }],
    width: 43,
    height: 43,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButton: {
    position: "absolute",
    right: spacing.lg,
    top: "50%",
    transform: [{ translateY: -14 }],
    width: 43,
    height: 43,
    justifyContent: "center",
    alignItems: "center",
  },
  sendText: {
    color: colors.text.inverse,
  },
});
