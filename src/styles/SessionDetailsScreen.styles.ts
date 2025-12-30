import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
  },
  backButtonBlur: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "500",
    fontFamily: "Outfit_500Medium",
    color: "#000000",
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // Title Section
  titleSection: {
    marginBottom: 20,
  },
  sessionTitle: {
    fontSize: 32,
    fontWeight: "500",
    fontFamily: "Outfit_500Bold",
    color: "#000000",
    lineHeight: 40,
    marginBottom: 8,
  },
  sessionSubtitle: {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Outfit_400Regular",
    color: "#666666",
  },

  // Image Container
  imageContainer: {
    width: "100%",
    height: 200,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 20,
    position: "relative",
  },
  activityImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    gap: 12,
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  durationText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Outfit_600SemiBold",
    color: "#FFFFFF",
  },
  temperatureBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  temperatureText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Outfit_600SemiBold",
    color: "#FFFFFF",
  },

  // AI Recommendation
  aiRecommendation: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Outfit_400Regular",
    color: "#666666",
    marginBottom: 16,
  },

  // Description
  description: {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Outfit_400Regular",
    color: "#000000",
    lineHeight: 26,
    marginBottom: 24,
  },

  // Button Container
  buttonContainer: {
    position: "absolute",
    bottom: 140,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    gap: 12,
  },
  startButton: {
    width: "100%",
  },
  editButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 50,
    alignItems: "center",
  },
  editButtonText: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Outfit_600SemiBold",
    color: "#000000",
  },

  // Edit Modal
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#D6E9ED",
    borderRadius: 24,
    padding: 24,
    width: width - 80,
    maxWidth: 400,
  },
  modalLabel: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Outfit_600SemiBold",
    color: "#000000",
    marginBottom: 16,
  },
  durationOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  durationOption: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
    minWidth: 80,
  },
  durationOptionSelected: {
    backgroundColor: "#2BA5B8",
    borderColor: "#2BA5B8",
  },
  durationOptionText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Outfit_600SemiBold",
    color: "#000000",
  },
  durationOptionTextSelected: {
    color: "#FFFFFF",
  },
  modalStartButton: {
    width: "100%",
    marginBottom: 16,
  },
  closeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 8,
  },
});
