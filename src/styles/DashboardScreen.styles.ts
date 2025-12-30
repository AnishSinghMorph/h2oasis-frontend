import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 120,
  },

  // Greeting card - contains everything, full width
  greetingCard: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
    minHeight: 520,
    paddingBottom: 20,
  },
  greetingCardImage: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },

  // Mood Slider Container
  moodSliderContainer: {
    marginTop: 24,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  moodQuestion: {
    fontSize: 16,
    fontFamily: "Outfit_500Medium",
    color: "#FFFFFF",
    marginBottom: 16,
    textAlign: "center",
  },

  // Utility styles
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#003543",
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Outfit_500Medium",
    color: "#FFFFFF",
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Outfit_500Medium",
    color: "#FF6B6B",
    marginBottom: 16,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  retryButton: {
    backgroundColor: "#80BAC6",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Outfit_600SemiBold",
    color: "#003543",
  },
});
