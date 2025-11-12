import { StyleSheet } from "react-native";
import { colors } from "../constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  backIcon: {
    fontSize: 28,
    color: "#1A1A1A",
    fontFamily: "Outfit_400Regular",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 120,
    paddingBottom: 140,
  },
  title: {
    fontSize: 36,
    fontFamily: "Outfit_700Bold",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Outfit_500Medium",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 40,
  },
  gradientContainer: {
    width: "100%",
    height: 400,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    position: "relative",
    backgroundColor: "transparent",
  },
  svgGradient: {
    position: "absolute",
    backgroundColor: "transparent",
  },
  celebrationImage: {
    width: 200,
    height: 200,
    zIndex: 1,
  },
  scheduleButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 0,
  },
  scheduleButtonText: {
    fontSize: 18,
    fontFamily: "Outfit_600SemiBold",
    color: "#FFFFFF",
  },
});
