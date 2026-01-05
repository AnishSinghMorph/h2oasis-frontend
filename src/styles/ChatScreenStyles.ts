import { StyleSheet, Dimensions } from "react-native";
import { colors, spacing, fontSize, borderRadius } from "./theme";
import { wp, hp, fontScale } from "../utils/responsive";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const ChatScreenStyles = StyleSheet.create({
  navigationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  navButtonText: {
    fontSize: fontSize.md,
    color: "#333333",
    fontWeight: "500",
    marginHorizontal: wp(4),
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: "#333333",
    textAlign: "center",
    flex: 1,
  },
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
    width: wp(250),
    height: wp(250),
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
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    position: "relative",
  },
  textInput: {
    width: "100%",
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingRight: spacing.xxxl,
    borderRadius: borderRadius.full,
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  voiceButton: {
    position: "relative",
    right: spacing.lg,
    width: wp(43),
    height: wp(43),
    justifyContent: "center",
    alignItems: "center",
  },
  buttonsContainer: {
    position: "absolute",
    top: "50%",
    right: 0,
    transform: [{ translateY: hp(-14) }],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    // paddingVertical: spacing.sm,
  },
  voiceCallButton: {
    right: spacing.lg,
    width: wp(43),
    height: wp(43),
    justifyContent: "center",
    alignItems: "center",
  },
  sendButton: {
    position: "relative",
    right: spacing.lg + wp(10),
    width: wp(43),
    height: wp(43),
    justifyContent: "center",
    alignItems: "center",
  },
  recordingButton: {
    position: "absolute",
    right: spacing.lg,
    top: "50%",
    transform: [{ translateY: hp(-14) }],
    width: wp(80),
    height: wp(43),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 68, 68, 0.1)",
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: "#FF4444",
  },
  recordingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  recordingText: {
    fontSize: fontSize.xs,
    color: "#FF4444",
    fontWeight: "600",
  },
  sendText: {
    color: colors.text.inverse,
  },
  // Add these to your existing ChatScreenStyles object:

  logoText: {
    fontSize: fontScale(16),
    fontWeight: "600",
    color: "#333",
    marginTop: hp(8),
    textAlign: "center",
  },
  productText: {
    fontSize: fontScale(14),
    color: "#666",
    marginTop: hp(4),
    textAlign: "center",
    fontStyle: "italic",
  },
  healthStatus: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: wp(8),
    padding: wp(12),
    marginHorizontal: wp(20),
    marginBottom: hp(10),
    borderLeftWidth: wp(4),
    borderLeftColor: "#10B981",
  },
  healthStatusText: {
    fontSize: fontScale(12),
    color: "#333",
    textAlign: "center",
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  errorContainer: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: wp(8),
    padding: wp(12),
    marginHorizontal: wp(20),
    marginBottom: hp(10),
    borderLeftWidth: wp(4),
    borderLeftColor: "#EF4444",
  },
  errorText: {
    fontSize: fontScale(12),
    color: "#EF4444",
    textAlign: "center",
  },

  // TTS Controls
  ttsButton: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    minWidth: wp(32),
    alignItems: "center",
    justifyContent: "center",
  },
  ttsButtonText: {
    fontSize: fontScale(16),
    color: "#007AFF",
  },
  ttsError: {
    fontSize: fontSize.xs,
    color: "#EF4444",
    marginTop: spacing.xs,
    fontStyle: "italic",
  },
  voiceIndicator: {
    fontSize: fontSize.xs,
    color: colors.gray[500],
    fontStyle: "italic",
  },

  // Voice Selection Indicator
  voiceSelectionIndicator: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: "#007AFF",
  },
  voiceSelectionText: {
    fontSize: fontSize.sm,
    color: "#007AFF",
    fontWeight: "600",
    textAlign: "center",
  },
  voiceSelectionSubtext: {
    fontSize: fontSize.xs,
    color: colors.gray[600],
    textAlign: "center",
    marginTop: hp(2),
    fontStyle: "italic",
  },
  voiceTestButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: wp(16),
    paddingVertical: hp(8),
    borderRadius: wp(20),
    marginTop: hp(10),
  },
  voiceTestButtonText: {
    color: "#FFFFFF",
    fontSize: fontScale(14),
    fontWeight: "600",
    textAlign: "center",
  },
});
