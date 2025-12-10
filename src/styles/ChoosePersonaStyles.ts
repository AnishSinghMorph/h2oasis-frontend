import { StyleSheet } from "react-native";

export const ChoosePersonaStyles = StyleSheet.create({
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
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: 10,
    marginBottom: 10,
  },
  soundButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  titleSection: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: "600",
    color: "#FFFFFF",
    lineHeight: 44,
  },
  cardsContainer: {
    gap: 16,
  },
  personaCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  emilyCardSelected: {
    backgroundColor: "rgba(169, 0, 121, 0.4)",
    borderColor: "rgba(169, 0, 121, 0.6)",
  },
  kaiCardSelected: {
    backgroundColor: "rgba(78, 205, 196, 0.4)",
    borderColor: "rgba(78, 205, 196, 0.6)",
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  personaInfo: {
    flex: 1,
    justifyContent: "center",
  },
  personaName: {
    fontSize: 22,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  personaSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 8,
  },
  personaDescription: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.6)",
    lineHeight: 18,
  },
  spacer: {
    flex: 1,
  },
  nextButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 20,
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
