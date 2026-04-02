export const APP_COLORS = {
  primary: '#003465',
  primaryLight: '#0666CE',
  accent: '#FF6B35',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  border: '#E5E7EB',
  error: '#DC2626',
  success: '#16A34A',
  warning: '#F59E0B',
  tabBarActive: '#003465',
  tabBarInactive: '#9CA3AF',
  cardShadow: 'rgba(0, 0, 0, 0.08)',
} as const;

export const FONTS = {
  regular: 'Comfortaa_Regular',
  semiBold: 'Comfortaa_SemiBold',
  bold: 'Comfortaa_Bold',
  light: 'Comfortaa_Light',
  medium: 'Comfortaa_Medium',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const HEADER_HEIGHT = 56;

export const IS_BA_VERSION = true;

export const APP_NAME = IS_BA_VERSION ? 'Built Athletics' : 'GYMILES Health';
