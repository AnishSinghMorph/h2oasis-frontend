import { StyleSheet } from "react-native";

export const SelectProductStyles = StyleSheet.create({
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
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 50,
    fontFamily: "Outfit_500Medium",
    fontWeight: "500",
    color: "#FFFFFF",
    lineHeight: 54,
    marginBottom: 30,
  },
  productList: {
    gap: 12,
  },
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  productCardSelected: {
    backgroundColor: "rgba(78, 205, 196, 0.25)",
    borderColor: "rgba(78, 205, 196, 0.5)",
  },
  productIconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  productIcon: {
    width: 36,
    height: 36,
  },
  productName: {
    fontSize: 17,
    fontFamily: "Outfit_500Medium",
    fontWeight: "500",
    color: "#FFFFFF",
  },
  productNameSelected: {
    color: "#FFFFFF",
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
    fontFamily: "Outfit_600SemiBold",
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
