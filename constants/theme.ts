// ForUs - Design System Deep Orange
// Application Immobilière Congo-Brazzaville

export const theme = {
  // Deep Orange Palette
  primary: '#FF5722',
  primaryLight: '#FF8A65',
  primaryDark: '#E64A19',
  primarySoft: '#FFCCBC',
  primaryBg: '#FBE9E7',
  
  // Secondary - Teal accent
  secondary: '#009688',
  secondaryLight: '#4DB6AC',
  secondaryDark: '#00796B',
  
  // Backgrounds
  background: '#FAFAFA',
  backgroundSecondary: '#F5F5F5',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  
  // Text
  textPrimary: '#212121',
  textSecondary: '#757575',
  textMuted: '#9E9E9E',
  textOnPrimary: '#FFFFFF',
  textOnDark: '#FFFFFF',
  
  // Borders
  border: '#E0E0E0',
  borderLight: '#EEEEEE',
  divider: '#F0F0F0',
  
  // Status colors
  success: '#4CAF50',
  successLight: '#E8F5E9',
  error: '#F44336',
  errorLight: '#FFEBEE',
  warning: '#FF9800',
  warningLight: '#FFF3E0',
  info: '#2196F3',
  infoLight: '#E3F2FD',
  
  // Social
  whatsapp: '#25D366',
  facebook: '#1877F2',
  
  // Property status
  forSale: '#FF5722',
  forRent: '#009688',
  sold: '#9E9E9E',
  new: '#4CAF50',
  premium: '#FFD700',
  
  // Gradients
  gradients: {
    primary: ['#FF5722', '#E64A19'],
    warm: ['#FF8A65', '#FF5722'],
    sunset: ['#FF5722', '#FF9800'],
    cool: ['#009688', '#00796B'],
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const typography = {
  // Headers
  h1: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
  h2: { fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.3 },
  h3: { fontSize: 20, fontWeight: '600' as const },
  h4: { fontSize: 18, fontWeight: '600' as const },
  
  // Body
  bodyLarge: { fontSize: 16, fontWeight: '400' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  bodySmall: { fontSize: 14, fontWeight: '400' as const },
  
  // Labels
  label: { fontSize: 12, fontWeight: '600' as const, textTransform: 'uppercase' as const, letterSpacing: 0.5 },
  caption: { fontSize: 12, fontWeight: '400' as const },
  tiny: { fontSize: 10, fontWeight: '500' as const },
  
  // Price
  price: { fontSize: 20, fontWeight: '700' as const },
  priceSmall: { fontSize: 16, fontWeight: '700' as const },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
};
