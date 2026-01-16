import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Centered content wrapper
  centeredContent: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 80,
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
  // Activity title
  headerSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  activityTitle: {
    fontSize: 24,
    fontFamily: "Outfit_400Regular",
    color: "#1A1A1A",
    textAlign: "center",
  },
  // Timer section
  timerSection: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
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
    fontSize: 18,
    fontFamily: "Outfit_400Regular",
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 8,
  },
  timerDisplay: {
    fontSize: 56,
    fontFamily: "Outfit_700Bold",
    color: "#FFFFFF",
    textAlign: "center",
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
    borderColor: "#AFD1DD",
  },
  buttonIcon: {
    width: 20,
    height: 20,
    tintColor: "#AFD1DD",
  },
  buttonLabel: {
    fontSize: 13,
    fontFamily: "Outfit_400Regular",
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 6,
  },
  // Center X button (glassmorphic)
  actionButtonCenter: {
    width: 86,
    height: 86,
    borderRadius: 73,
    overflow: "hidden",
  },
  actionButtonBlur: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  centerButtonLabel: {
    fontSize: 13,
    fontFamily: "Outfit_400Regular",
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 6,
  },
  // Guidance text at bottom
  guidanceWrapper: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  guidanceSection: {
    paddingHorizontal: 40,
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
    paddingTop: 10,
    alignItems: "center",
  },
});
