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
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  notificationBlur: {
    width: "100%",
    height: "100%",
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

  // Slider with emojis and draggable thumb
  sliderContainer: {
    position: "relative",
    height: 60,
    marginBottom: 16,
  },
  emojisRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  emojiButton: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  moodEmoji: {
    width: 44,
    height: 44,
  },
  sliderThumb: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2196C8",
    height: 52,
    paddingLeft: 4,
    paddingRight: 8,
    borderRadius: 26,
    top: 4,
  },
  arrowButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
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

  // Session Section
  sectionContainer: {
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "600",
    fontFamily: "Outfit_600SemiBold",
    color: "black",
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Outfit_400Regular",
    color: "#757575",
    marginBottom: 20,
  },
  loadingSessionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 12,
  },
  loadingSessionsText: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Outfit_400Regular",
    color: "rgba(255, 255, 255, 0.7)",
  },

  // Session Card
  sessionCard: {
    height: 240,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 16,
  },
  sessionCardBackground: {
    width: "100%",
    height: "100%",
  },
  sessionCardImage: {
    borderRadius: 24,
    resizeMode: "cover",
  },
  sessionCardGradient: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
  },
  sessionCardWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 24,
  },
  sessionCardContent: {
    gap: 16,
  },
  sessionCardTitle: {
    fontSize: 30,
    fontFamily: "Outfit_500SemiBold",
    color: "#FFFFFF",
    lineHeight: 36,
    marginBottom: 4,
  },
  sessionCardDescription: {
    fontSize: 15,
    fontWeight: "400",
    fontFamily: "Outfit_400Regular",
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 22,
    marginBottom: 8,
  },
  startButtonContainer: {
    marginTop: 4,
  },
  startButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignSelf: "stretch",
    alignItems: "center",
    marginTop: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Outfit_600SemiBold",
    color: "#FFFFFF",
  },
});
