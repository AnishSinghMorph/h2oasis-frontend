import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const forgotPasswordStyles = StyleSheet.create({
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

  // Spacer to push button down
  spacer: {
    flex: 1,
    minHeight: 200,
  },

  // Primary Button
  primaryButton: {
    marginTop: 24,
  },
});
