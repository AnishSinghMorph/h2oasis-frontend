import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const signUpStyles = StyleSheet.create({
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
    paddingTop: 40,
    paddingBottom: 40,
  },

  // Typography
  title: {
    fontSize: 32,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 22,
    marginBottom: 32,
  },

  // Primary Button
  primaryButton: {
    marginTop: 8,
  },

  // Divider
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  dividerText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    marginHorizontal: 16,
  },

  // Social Buttons
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    backgroundColor: "transparent",
    marginBottom: 12,
  },
  socialIcon: {
    marginRight: 12,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  socialButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },

  // Login Link
  loginLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  loginLinkText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },

  // Country Picker Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1A1A2E",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "70%",
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  countryFlag: {
    fontSize: 28,
    marginRight: 16,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
  },
  countryCode: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
  },
});
