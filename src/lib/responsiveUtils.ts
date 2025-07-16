import { DeviceInfo } from './types';

// Common responsive values used across components
export const ResponsiveValues = {
  buttonSize: {
    mobile: 48,
    landscapeMobile: 42, // Smaller than mobile but larger than desktop for touch
    tablet: 50,
    desktop: 50,
  },
  positioning: {
    mobile: 16,
    landscapeMobile: 14, // Tighter positioning for limited height
    tablet: 18,
    desktop: 20,
  },
  // Special positioning for bottom elements to create visual balance
  positioningBottom: {
    mobile: 20,
    landscapeMobile: 16, // Slightly more space for balance
    tablet: 24,
    desktop: 26,
  },
  iconSize: {
    mobile: 18,
    landscapeMobile: 16, // Proportionally smaller
    tablet: 19,
    desktop: 20,
  },
  textSizing: {
    small: {
      mobile: '1.1rem',
      landscapeMobile: '0.85rem', // Much smaller for landscape mobile
      tablet: '1.2rem',
      desktop: '1.3rem',
    },
    medium: {
      mobile: '1.5rem',
      landscapeMobile: '1.1rem', // Scaled down for landscape mobile
      tablet: '1.7rem',
      desktop: '1.875rem',
    },
    large: {
      mobile: '2.0rem',
      landscapeMobile: '1.4rem', // Significantly smaller for landscape mobile
      tablet: '3.0rem',
      desktop: '4.0rem',
    },
    xlarge: {
      mobile: '2.5rem',
      landscapeMobile: '1.8rem', // Much smaller for landscape mobile
      tablet: '3.5rem',
      desktop: '5.0rem',
    },
  },
  spacing: {
    small: {
      mobile: '16px',
      landscapeMobile: '8px', // Tighter spacing for limited height
      tablet: '20px',
      desktop: '24px',
    },
    medium: {
      mobile: '24px',
      landscapeMobile: '12px', // Much tighter for landscape mobile
      tablet: '32px',
      desktop: '40px',
    },
    large: {
      mobile: '40px',
      landscapeMobile: '20px', // Half the space for landscape mobile
      tablet: '48px',
      desktop: '64px',
    },
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
  values: { mobile: T; landscapeMobile?: T; tablet: T; desktop: T }
): T => {
  if (deviceInfo?.isLandscapeMobile && values.landscapeMobile)
    return values.landscapeMobile;
  if (deviceInfo?.isMobile) return values.mobile;
  if (deviceInfo?.isTablet) return values.tablet;
  return values.desktop;
};

// Enhanced responsive helper that requires all device types
export const getResponsiveValueComplete = <T>(
  deviceInfo: DeviceInfo | undefined,
  values: { mobile: T; landscapeMobile: T; tablet: T; desktop: T }
): T => {
  if (deviceInfo?.isLandscapeMobile) return values.landscapeMobile;
  if (deviceInfo?.isMobile) return values.mobile;
  if (deviceInfo?.isTablet) return values.tablet;
  return values.desktop;
};

// Get button size based on device
export const getButtonSize = (deviceInfo?: DeviceInfo) =>
  getResponsiveValueComplete(deviceInfo, ResponsiveValues.buttonSize);

// Get positioning offset based on device
export const getPositioning = (deviceInfo?: DeviceInfo) =>
  getResponsiveValueComplete(deviceInfo, ResponsiveValues.positioning);

// Get bottom positioning offset for better visual balance
export const getBottomPositioning = (deviceInfo?: DeviceInfo) =>
  getResponsiveValueComplete(deviceInfo, ResponsiveValues.positioningBottom);

// Get icon size based on device
export const getIconSize = (deviceInfo?: DeviceInfo) =>
  `${getResponsiveValueComplete(deviceInfo, ResponsiveValues.iconSize)}px`;

// Get text sizing based on device and size category
export const getTextSize = (
  deviceInfo?: DeviceInfo,
  size: 'small' | 'medium' | 'large' | 'xlarge' = 'medium'
) => getResponsiveValueComplete(deviceInfo, ResponsiveValues.textSizing[size]);

// Get spacing based on device and size category
export const getSpacing = (
  deviceInfo?: DeviceInfo,
  size: 'small' | 'medium' | 'large' = 'medium'
) => getResponsiveValueComplete(deviceInfo, ResponsiveValues.spacing[size]);

// Common color schemes
export const ColorSchemes = {
  primary: {
    dark: '#162542',
    light: '#006161',
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
