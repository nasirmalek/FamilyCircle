// Reusable Style Patterns
import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from './theme';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  containerDark: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  padding: {
    padding: spacing.md,
  },
  
  paddingHorizontal: {
    paddingHorizontal: spacing.md,
  },
  
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.md,
  },
  
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  // Text Styles
  headingLarge: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    lineHeight: typography.sizes.xxxl * typography.lineHeights.tight,
  },
  
  headingMedium: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    lineHeight: typography.sizes.xxl * typography.lineHeights.tight,
  },
  
  headingSmall: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  
  bodyLarge: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.regular,
    color: colors.text,
    lineHeight: typography.sizes.lg * typography.lineHeights.normal,
  },
  
  bodyRegular: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.regular,
    color: colors.text,
    lineHeight: typography.sizes.base * typography.lineHeights.normal,
  },
  
  bodySmall: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.regular,
    color: colors.textSecondary,
    lineHeight: typography.sizes.sm * typography.lineHeights.normal,
  },
  
  caption: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.regular,
    color: colors.textTertiary,
  },
  
  // Button Styles
  button: {
    height: 52,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  
  buttonSecondary: {
    backgroundColor: colors.secondary,
  },
  
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  
  buttonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.surface,
  },
  
  // Input Styles
  input: {
    height: 52,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    fontSize: typography.sizes.base,
    backgroundColor: colors.surface,
  },
  
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  
  // Avatar Styles
  avatar: {
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Badge Styles
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary,
  },
  
  badgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.surface,
  },
});
