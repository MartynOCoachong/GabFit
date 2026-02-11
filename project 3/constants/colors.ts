export const colors = {
  primary: '#E8A4A4',
  primaryDark: '#D4847F',
  primaryLight: '#F5D5D5',
  secondary: '#B8C4A8',
  secondaryLight: '#D4DFC8',
  accent: '#C9A876',
  accentLight: '#E5D9C3',
  
  background: '#FBF9F7',
  surface: '#FFFFFF',
  surfaceAlt: '#F5F2EF',
  
  text: '#2D2A26',
  textSecondary: '#6B6560',
  textMuted: '#9D958E',
  textLight: '#FFFFFF',
  
  border: '#E8E4DF',
  borderLight: '#F0EDE9',
  
  success: '#7FB069',
  warning: '#E5A84B',
  error: '#D4645C',
  
  overlay: 'rgba(45, 42, 38, 0.6)',
  cardShadow: 'rgba(45, 42, 38, 0.08)',
};

export const shadows = {
  small: {
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
};

export default colors;
