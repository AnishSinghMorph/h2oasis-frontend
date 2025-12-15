import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6B6B6B",
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
  },
  greetingCardImage: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },

  // Header styles - inside greeting card
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 8,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: "hidden",
    marginRight: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.6)",
    backgroundColor: "#80BAC6",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  avatarText: {
    color: "#003543",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Outfit_600SemiBold",
  },
  dateText: {
    fontSize: 16,
    color: "#003543",
    fontWeight: "500",
    fontFamily: "Outfit_500Medium",
  },
  spacer: {
    flex: 1,
  },
  notificationButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationIcon: {
    width: 24,
    height: 24,
  },

  // Greeting content
  greetingContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  greetingText: {
    fontSize: 32,
    fontWeight: "400",
    fontFamily: "Outfit_400Regular",
    color: "#003543",
    fontStyle: "italic",
  },
  greetingName: {
    fontSize: 32,
    fontWeight: "700",
    fontFamily: "Outfit_700Bold",
    color: "#003543",
  },

  // Mood check-in card - glass effect
  moodCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 24,
  },
  moodTitle: {
    fontSize: 22,
    fontWeight: "600",
    fontFamily: "Outfit_600SemiBold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  moodSubtitle: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Outfit_400Regular",
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 20,
  },

  // Simple emoji options
  moodOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  moodOption: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  moodEmoji: {
    width: 48,
    height: 48,
  },
  moodLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginTop: 12,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Outfit_500Medium",
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    width: 70,
  },
  moodLabelActive: {
    color: "#FFFFFF",
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
