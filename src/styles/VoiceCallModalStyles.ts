import { StyleSheet } from "react-native";

export const VoiceCallModalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  statusContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  statusTitle: {
    color: "#333333",
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  statusSubtitle: {
    color: "rgba(0, 0, 0, 0.6)",
    fontSize: 16,
    textAlign: "center",
    maxWidth: 300, // Fixed width instead of percentage
    lineHeight: 22,
  },
  orbContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 40,
  },
  aiContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    color: "rgba(0, 0, 0, 0.6)",
    fontSize: 16,
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  closeButtonBottom: {
    backgroundColor: "#FF4444",
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
    minWidth: 200,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  closeButtonBottomText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
