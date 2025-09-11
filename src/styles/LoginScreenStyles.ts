import { StyleSheet } from "react-native";
import { spacing, fontSize, fontWeight } from "./theme";

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xxxl + 20,
  },
  content: {
    flex: 1,
    paddingVertical: spacing.xl,
  },
  title: {
    color: "#000000",
    fontSize: 28,
    fontWeight: fontWeight.bold,
    textAlign: "left",
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: "#666666",
    fontSize: fontSize.md,
    textAlign: "left",
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  input: {
    backgroundColor: "transparent",
    borderRadius: 15,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.ms,
    color: "#000000",
    fontSize: fontSize.md,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: spacing.xl,
  },
  forgotPasswordText: {
    color: "#00A3C7",
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  loginButton: {
    backgroundColor: "#00A3C7",
    borderRadius: "7%",
    paddingVertical: spacing.ms,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    textAlign: "center",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.md,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  orText: {
    color: "#666666",
    fontSize: fontSize.sm,
    marginHorizontal: spacing.md,
  },
  createAccountButton: {
    backgroundColor: "#000000",
    borderRadius: "7%",
    paddingVertical: spacing.ms,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  createAccountButtonText: {
    color: "#FFFFFF",
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    textAlign: "center",
  },
});
