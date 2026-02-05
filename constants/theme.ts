// FamilyCircle Design System
// Warm, family-friendly theme with accessibility focus

export const colors = {
  // Brand Colors - Warm & Welcoming
  primary: '#FF6B6B',      // Coral Red (family love)
  primaryDark: '#E85555',
  primaryLight: '#FF9999',
  
  // Secondary - Trust & Connection
  secondary: '#4ECDC4',    // Teal (connection)
  secondaryDark: '#3DB8AF',
  secondaryLight: '#7FE5DD',
  
  // Accent - Joy & Celebration
  accent: '#FFD93D',       // Golden Yellow
  accentDark: '#FFC107',
  
  // Backgrounds - Soft & Comfortable
  background: '#FFF9F5',   // Warm white
  backgroundDark: '#1C1C1E',
  surface: '#FFFFFF',
  surfaceDark: '#2C2C2E',
  surfaceElevated: '#FFFFFF',
  surfaceElevatedDark: '#3A3A3C',
  
  // Chat Bubbles
  chatSent: '#FF6B6B',
  chatReceived: '#F0F0F0',
  chatReceivedDark: '#3A3A3C',
  
  // Text - High Contrast for Accessibility
  text: '#1A1A1A',
  textDark: '#FFFFFF',
  textSecondary: '#666666',
  textSecondaryDark: '#A0A0A0',
  textTertiary: '#999999',
  
  // Status Colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Borders & Dividers
  border: '#E8E8E8',
  borderDark: '#3A3A3A',
  divider: '#F0F0F0',
  
  // Overlay & Shadows
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadowLight: 'rgba(0, 0, 0, 0.08)',
  shadowMedium: 'rgba(0, 0, 0, 0.12)',
};

export const typography = {
  // Font Families
  fontRegular: 'System',
  fontMedium: 'System',
  fontBold: 'System',
  
  // Font Sizes - Larger for Accessibility
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 40,
  },
  
  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Font Weights
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const layout = {
  maxWidth: 960,
  headerHeight: 60,
  tabBarHeight: 70,
  inputHeight: 52,
  buttonHeight: 52,
  avatarSm: 32,
  avatarMd: 48,
  avatarLg: 80,
  avatarXl: 120,
};
