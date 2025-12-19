import { StyleSheet } from "react-native";

export const resetPasswordStyles = StyleSheet.create({
  // Container & Background
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },

  // Typography
  title: {
    fontSize: 32,
    fontWeight: "500",
    color: "#FFFFFF",
    marginTop: 20,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 22,
    marginBottom: 32,
  },
  emailText: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 24,
    fontWeight: "500",
  },

  // OTP Input
  otpContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 12,
  },
  otpInputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  otpInput: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 52,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    color: "#FFFFFF",
  },
  otpInputFilled: {
    borderColor: "rgba(78, 205, 196, 0.6)",
    backgroundColor: "rgba(78, 205, 196, 0.2)",
  },

  // Password Requirements
  requirementsText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 8,
    marginBottom: 16,
  },

  // Spacer to push button down
  spacer: {
    flex: 1,
    minHeight: 150,
  },

  // Primary Button
  primaryButton: {
    marginTop: 24,
  },
});
