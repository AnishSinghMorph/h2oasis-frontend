import { StyleSheet } from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius } from './theme';

export const signUpStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xxxl + 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  title: {
    color: '#000000',
    fontSize: 28,
    fontWeight: fontWeight.bold,
    textAlign: 'left',
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: '#666666',
    fontSize: fontSize.md,
    textAlign: 'left',
    marginBottom: spacing.xxxl,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  input: {
    backgroundColor: 'transparent',
    borderRadius: 15,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    color: '#000000',
    fontSize: fontSize.md,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  signUpButton: {
    backgroundColor: '#00A3C7',
    borderRadius: 8,
    paddingVertical: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  orText: {
    color: '#666666',
    fontSize: fontSize.sm,
    marginHorizontal: spacing.md,
  },
  socialButton: {
    backgroundColor: '#000000',
    borderRadius: "10%",
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButton: {
    backgroundColor: '#000000',
  },
  socialButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  loginText: {
    color: '#666666',
    fontSize: fontSize.sm,
  },
  loginLinkText: {
    color: '#00A3C7',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
});