import { DeviceInfo } from './types';

// Common responsive values used across components
export const ResponsiveValues = {
  buttonSize: {
    mobile: 48,
    tablet: 50,
    desktop: 50,
  },
  positioning: {
    mobile: 16,
    tablet: 18,
    desktop: 20,
  },
  iconSize: {
    mobile: 18,
    tablet: 19,
    desktop: 20,
  },
  borderRadius: {
    button: '9999px',
    card: '20px',
    small: '12px',
  },
  zIndex: {
    button: 1001,
    burgerMenu: 10000,
    menu: 9999,
    popup: 2000,
  },
} as const;

// Responsive helper functions
export const getResponsiveValue = <T>(
  deviceInfo: DeviceInfo | undefined,
  values: { mobile: T; tablet: T; desktop: T }
): T => {
  if (deviceInfo?.isMobile) return values.mobile;
  if (deviceInfo?.isTablet) return values.tablet;
  return values.desktop;
};

// Get button size based on device
export const getButtonSize = (deviceInfo?: DeviceInfo) =>
  getResponsiveValue(deviceInfo, ResponsiveValues.buttonSize);

// Get positioning offset based on device
export const getPositioning = (deviceInfo?: DeviceInfo) =>
  getResponsiveValue(deviceInfo, ResponsiveValues.positioning);

// Get icon size based on device
export const getIconSize = (deviceInfo?: DeviceInfo) =>
  `${getResponsiveValue(deviceInfo, ResponsiveValues.iconSize)}px`;

// Common color schemes
export const ColorSchemes = {
  primary: {
    dark: '#131D4F',
    light: '#00bbdc',
  },
  accent: {
    yellow: '#FFEEA9',
    cream: '#FAF1E6',
  },
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.8)',
    dark: '#0f172a',
  },
} as const;

// Button state colors helper
export const getButtonColors = (isDarkMode: boolean, isHovered: boolean) => ({
  backgroundColor: isHovered
    ? ColorSchemes.text.primary
    : isDarkMode
    ? ColorSchemes.primary.dark
    : ColorSchemes.primary.light,
  color: isHovered
    ? isDarkMode
      ? ColorSchemes.primary.dark
      : ColorSchemes.primary.light
    : ColorSchemes.text.primary,
});

// Common transitions
export const Transitions = {
  fast: 'all 0.15s ease',
  normal: 'all 0.2s ease-in-out',
  slow: 'all 0.3s ease',
} as const;
