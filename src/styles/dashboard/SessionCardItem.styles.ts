import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  sessionCard: {
    marginBottom: 16,
    borderRadius: 24,
    overflow: "hidden",
  },
  sessionCardBackground: {
    width: "100%",
    aspectRatio: 1.5,
  },
  sessionCardImage: {
    borderRadius: 24,
  },
  sessionCardWrapper: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-end",
  },
  sessionCardContent: {
    gap: 12,
  },
  sessionCardTitle: {
    fontSize: 24,
    fontFamily: "Outfit_500Medium",
    color: "#FFFFFF",
    lineHeight: 30,
  },
  sessionCardDescription: {
    fontSize: 14,
    fontFamily: "Outfit_400Regular",
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 20,
  },
  startButtonContainer: {
    marginTop: 8,
  },
});
