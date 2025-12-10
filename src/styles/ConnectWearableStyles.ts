import { StyleSheet } from "react-native";

export const ConnectWearableStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    marginBottom: 20,
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "600",
    color: "#FFFFFF",
    lineHeight: 44,
    marginBottom: 30,
  },
  // Grid for wearables - 2 column layout
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  // Wearable card button - 2 column with horizontal content
  wearableBtn: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    marginBottom: 0,
  },
  wearableDefault: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  wearableSelected: {
    backgroundColor: "rgba(78, 205, 196, 0.5)",
    borderColor: "rgba(78, 205, 196, 0.7)",
  },
  wearableConnected: {
    backgroundColor: "rgba(78, 205, 196, 0.5)",
    borderColor: "rgba(78, 205, 196, 0.7)",
  },
  iconWrapper: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  wearableTextContainer: {
    flex: 1,
  },
  wearableText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  wearableSubtext: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 2,
  },
  connectedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  connectedTick: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  spacer: {
    flex: 1,
  },
  nextButtonContainer: {
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: "center",
    // Glass effect
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
