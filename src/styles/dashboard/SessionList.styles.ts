import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: "Outfit_600SemiBold",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: "Outfit_400Regular",
    color: "#666666",
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
    fontFamily: "Outfit_400Regular",
    color: "#666666",
  },
});
