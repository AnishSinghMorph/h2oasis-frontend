import { StyleSheet } from "react-native";

export const MoodPageStyles = StyleSheet.create({
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
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    marginBottom: 20,
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 50,
    fontFamily: "Outfit_400Regular",
    fontWeight: "400",
    color: "#FFFFFF",
    lineHeight: 54,
    marginBottom: 30,
  },
  optionsList: {
    gap: 12,
  },
  optionButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    alignSelf: "flex-start",
  },
  optionButtonSelected: {
    backgroundColor: "rgba(78, 205, 196, 0.25)",
    borderColor: "rgba(78, 205, 196, 0.5)",
  },
  optionText: {
    fontSize: 16,
    fontFamily: "Outfit_500Medium",
    fontWeight: "500",
    color: "#FFFFFF",
  },
  optionTextSelected: {
    color: "#FFFFFF",
  },
  spacer: {
    flex: 1,
  },
  getStartedButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  getStartedButtonText: {
    fontSize: 18,
    fontFamily: "Outfit_600SemiBold",
    fontWeight: "600",
    color: "#FFFFFF",
  },
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    marginBottom: 20,
  },
  lottieAnimation: {
    width: 150,
    height: 150,
  },
});
