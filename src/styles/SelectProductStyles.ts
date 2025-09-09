import { StyleSheet } from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius } from './theme';

export const SelectProductStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xxxl + 20,
  },
//   content: {
//     flex: 1,
//     zIndex: 1,
//     paddingHorizontal: spacing.md,
//     paddingTop: spacing.xxxl,
//   },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
//   backButton: {
//     marginRight: spacing.md,
//   },
  progressBarContainer: {
    flex: 1,
    marginHorizontal: spacing.md,
  },
  progressBarBase: {
    width: '100%',
    height: 4,
    backgroundColor: colors.gray[400],
    borderRadius: borderRadius.sm,
  },
  progressBarFill: {
    width: '25%',
    height: 4,
    backgroundColor: colors.gray[900],
    borderRadius: borderRadius.sm,
  },
  title: {
    fontSize: fontSize.xxxl,
    color: colors.gray[900],
    marginBottom: spacing.xxl,
    fontWeight: fontWeight.bold,
  },
  productOptions: {
    gap: spacing.md,
    marginBottom: spacing.xxxl,
  },
  productButton: {
    width: '100%',
    height: 70,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  productButtonSelected: {
    backgroundColor: '#00A3C7',
  },
  productButtonUnselected: {
    backgroundColor: '#DDF1F1', 
  },
  productIconContainer: {
    width: 51,
    height: 51,
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  productName: {
    fontSize: fontSize.md,
  },
  productNameSelected: {
    color: colors.white,
  },
  productNameUnselected: {
    color: colors.gray[900],
  },
  nextButtonContainer: {
    position: 'absolute',
    bottom: spacing.xxxl,
    left: spacing.md,
    right: spacing.md,
  },
  nextButton: {
    backgroundColor: '#000000',
    borderRadius: 150,
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  nextButtonText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
});