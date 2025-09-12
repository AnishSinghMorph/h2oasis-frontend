import { StyleSheet } from "react-native";
import { colors, spacing, fontSize, fontWeight, borderRadius } from "./theme";

export const ChatScreenStyles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.screenTop,
    paddingBottom: spacing.screenBottom + spacing.xl,
  },
  logoSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 300,
    height: 300,
  },

  container: {
    marginBottom: spacing.xl,
    backgroundColor: "#c7effdff",
  },
  message: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 15,
    marginVertical: 4,
  },

  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
  },

  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#00AEEF",
    marginBottom: spacing.md,
  },

  botText: {
    color: "#000",
  },

  userText: {
    color: "#fff",
  },
  optionsBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },
  optionButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginVertical: 5,
    alignSelf: "flex-start",
  },
  optionSelected: {
    backgroundColor: "#4a90e2",
  },
  optionText: {
    color: "#333",
    fontSize: 16,
  },
  optionSelectedText: {
    color: "#fff",
    fontWeight: "bold",
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "#00AEEF",
    padding: 10,
    borderRadius: 20,
  },
  sendText: { color: "#fff", fontWeight: "bold" },
});
