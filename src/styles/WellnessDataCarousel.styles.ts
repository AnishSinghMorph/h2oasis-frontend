import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 24,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: "Outfit_600SemiBold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Outfit_400Regular",
    color: "#666666",
  },
  carouselContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    width: 167,
    height: 210,
    borderRadius: 30,
    padding: 16,
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "Outfit_500Medium",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  progressContainer: {
    position: "relative",
    width: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 12,
  },
  iconContainer: {
    position: "absolute",
    bottom: -5,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 40,
    height: 40,
  },
  cardValue: {
    fontSize: 32,
    fontFamily: "Outfit_500Medium",
    color: "#1A1A1A",
    marginTop: 4,
  },
  cardUnit: {
    fontSize: 12,
    fontFamily: "Outfit_500Medium",
    color: "#666666",
    letterSpacing: 0.5,
  },
});
