import { StyleSheet } from "react-native";

export const VoiceCallModalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: "#333333",
    fontSize: 24,
    fontWeight: "300",
  },
  headerTitle: {
    color: "#333333",
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 40,
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
  footerText: {
    color: "rgba(0, 0, 0, 0.5)",
    fontSize: 12,
    textAlign: "center",
  },
});
