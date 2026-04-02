import { DefaultTheme, type Theme } from '@react-navigation/native';
import { APP_COLORS } from './constants';

export const AppTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: APP_COLORS.primary,
    background: APP_COLORS.background,
    card: APP_COLORS.surface,
    text: APP_COLORS.text,
    border: APP_COLORS.border,
    notification: APP_COLORS.accent,
  },
};
