import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  moodCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
  },
  moodTitle: {
    fontSize: 18,
    fontFamily: "Outfit_600SemiBold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  moodSubtitle: {
    fontSize: 14,
    fontFamily: "Outfit_400Regular",
    color: "#666666",
    marginBottom: 20,
  },
  sliderContainer: {
    height: 80,
    marginBottom: 12,
    position: "relative",
  },
  emojisRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  emojiButton: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  moodEmoji: {
    width: 48,
    height: 48,
  },
  sliderThumb: {
    position: "absolute",
    width: 80,
    height: 80,
    backgroundColor: "#5BBFCF",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  arrowButton: {
    position: "absolute",
    right: 4,
    bottom: 4,
    width: 28,
    height: 28,
    backgroundColor: "#2BA5B8",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  moodLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  moodLabel: {
    fontSize: 12,
    fontFamily: "Outfit_400Regular",
    color: "#999999",
    width: 60,
    textAlign: "center",
  },
  moodLabelActive: {
    color: "#1A1A1A",
    fontFamily: "Outfit_600SemiBold",
  },
});
