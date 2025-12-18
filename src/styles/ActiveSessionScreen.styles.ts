import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  noSessionText: {
    fontSize: 18,
    fontFamily: "Outfit_500Medium",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  backButtonError: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: "Outfit_600SemiBold",
    color: "#FFFFFF",
  },
  // Activity title at top
  headerSection: {
    paddingTop: 50,
    alignItems: "center",
  },
  activityTitle: {
    fontSize: 24,
    fontFamily: "Outfit_400Regular",
    color: "#1A1A1A",
    textAlign: "center",
  },
  // Timer section - centered in screen
  timerSection: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  // Timer circle with inner content
  timerCircleContainer: {
    width: 240,
    height: 240,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  svgContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 240,
    height: 240,
  },
  progressDot: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  // Timer text positioned absolutely in center
  timerTextContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  // Inner timer content
  timerInnerContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  timeRemainingLabel: {
    fontSize: 12,
    fontFamily: "Outfit_400Regular",
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
  },
  timerDisplay: {
    fontSize: 48,
    fontFamily: "Outfit_700Bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  // Temperature below timer
  temperatureContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  temperatureIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  temperatureText: {
    fontSize: 14,
    fontFamily: "Outfit_400Regular",
    color: "rgba(255, 255, 255, 0.8)",
  },
  // Action buttons row
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    gap: 24,
  },
  // Small buttons with border (pause/sounds)
  actionButtonSmall: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(175, 209, 221, 0.6)",
  },
  buttonIcon: {
    width: 20,
    height: 20,
    tintColor: "rgba(175, 209, 221, 0.8)",
  },
  buttonLabel: {
    fontSize: 10,
    fontFamily: "Outfit_400Regular",
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 6,
  },
  // Center X button (glassmorphic)
  actionButtonCenter: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
  },
  actionButtonBlur: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  centerButtonLabel: {
    fontSize: 10,
    fontFamily: "Outfit_400Regular",
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 6,
  },
  // Guidance text at bottom
  guidanceSection: {
    paddingHorizontal: 40,
    paddingTop: 40,
    paddingBottom: 60,
    alignItems: "center",
  },
  guidanceText: {
    fontSize: 14,
    fontFamily: "Outfit_400Regular",
    color: "rgba(255, 255, 255, 0.85)",
    textAlign: "center",
    lineHeight: 20,
  },
  // Info icon at very bottom
  infoIcon: {
    alignItems: "center",
    paddingBottom: 30,
  },
});

