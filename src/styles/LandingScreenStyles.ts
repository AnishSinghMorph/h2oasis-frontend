// src/styles/LandingScreenStyles.ts
import { StyleSheet } from 'react-native';
import { colors, spacing, fontSize, fontWeight } from './theme';

export const landingStyles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.background.overlay,
    justifyContent: 'space-between',
    paddingVertical: spacing.xxxl,
    paddingTop: spacing.xxxl + 40, // Extra padding for status bar area
  },
  logoSection: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: spacing.sm,
  },
  logoText: {
    color: colors.text.inverse,
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.light,
    letterSpacing: 4,
  },
  contentSection: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xxxl,
  },
  welcomeText: {
    color: colors.text.inverse,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  taglineText: {
    color: colors.text.muted,
    fontSize: fontSize.md,
    textAlign: 'center',
    lineHeight: 22,
  },
});
