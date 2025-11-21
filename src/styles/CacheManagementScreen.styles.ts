import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#DEF2F2",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E3A3A",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B8E8E",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    backgroundColor: "#DEF2F2",
    padding: 50,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  cacheInfoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  cacheInfoText: {
    flex: 1,
    justifyContent: "space-between",
  },
  summaryTitle: {
    fontSize: 14,
    color: "#6B8E8E",
    marginBottom: 8,
  },
  summarySize: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E3A3A",
    marginBottom: 8,
  },
  summarySubtext: {
    fontSize: 14,
    color: "#6B8E8E",
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00A3C7",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    gap: 10,
    width: "60%",
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  clearingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  clearingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
