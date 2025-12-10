import { StyleSheet } from "react-native";

export const OTPVerificationStyles = StyleSheet.create({
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "600",
    textAlign: "left",
    marginBottom: 12,
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
    textAlign: "left",
    marginBottom: 40,
    lineHeight: 24,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 20,
  },
  otpInput: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 56,
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
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  resendText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },
  resendLink: {
    color: "#4ECDC4",
    fontSize: 14,
    fontWeight: "600",
  },
  spacer: {
    flex: 1,
  },
  verifyButton: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 30,
    paddingVertical: 18,
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  verifyButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 30,
    paddingVertical: 18,
    marginBottom: 20,
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});
