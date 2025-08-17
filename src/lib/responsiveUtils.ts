import { DeviceInfo } from './types';

// Common breakpoints for consistent responsive design
export const Breakpoints = {
  mobile: 640, // Portrait mobile
  tablet: 1024, // Tablet and small laptops
  desktop: 1440, // Large screens
  landscapeRatio: 1.5, // Landscape mobile threshold
} as const;

// Responsive values for consistent UI across devices
export const ResponsiveValues = {
  buttonSize: {
    mobile: 48,
    landscapeMobile: 44,
    tablet: 50,
    desktop: 50,
  },
  positioning: {
    mobile: 16,
    landscapeMobile: 14,
    tablet: 18,
    desktop: 20,
  },
  positioningBottom: {
    mobile: 20,
    landscapeMobile: 16,
    tablet: 24,
    desktop: 26,
  },
  iconSize: {
    mobile: 18,
    landscapeMobile: 16,
    tablet: 19,
    desktop: 20,
  },
  textSizing: {
    xs: {
      mobile: '0.75rem',
      landscapeMobile: '0.7rem',
      tablet: '0.8rem',
      desktop: '0.875rem',
    },
    small: {
      mobile: '1rem',
      landscapeMobile: '0.875rem',
      tablet: '1.1rem',
      desktop: '1.2rem',
    },
    medium: {
      mobile: '1.25rem',
      landscapeMobile: '1.1rem',
      tablet: '1.4rem',
      desktop: '1.5rem',
    },
    large: {
      mobile: '1.75rem',
      landscapeMobile: '1.4rem',
      tablet: '2.25rem',
      desktop: '2.5rem',
    },
    xlarge: {
      mobile: '2.25rem',
      landscapeMobile: '1.8rem',
      tablet: '3rem',
      desktop: '3.5rem',
    },
  },
  spacing: {
    xs: {
      mobile: '8px',
      landscapeMobile: '6px',
      tablet: '10px',
      desktop: '12px',
    },
    small: {
      mobile: '16px',
      landscapeMobile: '12px',
      tablet: '20px',
      desktop: '24px',
    },
    medium: {
      mobile: '24px',
      landscapeMobile: '16px',
      tablet: '32px',
      desktop: '40px',
    },
    large: {
      mobile: '32px',
      landscapeMobile: '24px',
      tablet: '48px',
      desktop: '64px',
    },
    xlarge: {
      mobile: '48px',
      landscapeMobile: '32px',
      tablet: '64px',
      desktop: '80px',
    },
  },
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '20px',
    button: '9999px',
  },
  zIndex: {
    button: 1001,
    burgerMenu: 10000,
    menu: 9999,
    popup: 2000,
    overlay: 1500,
  },
} as const;

// Device detection helpers
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

export const getResponsiveValueComplete = <T>(
  deviceInfo: DeviceInfo | undefined,
  values: { mobile: T; landscapeMobile: T; tablet: T; desktop: T }
): T => {
  if (deviceInfo?.isLandscapeMobile) return values.landscapeMobile;
  if (deviceInfo?.isMobile) return values.mobile;
  if (deviceInfo?.isTablet) return values.tablet;
  return values.desktop;
};

// Component-specific responsive helpers
export const getButtonSize = (deviceInfo?: DeviceInfo) =>
  getResponsiveValueComplete(deviceInfo, ResponsiveValues.buttonSize);

export const getPositioning = (deviceInfo?: DeviceInfo) =>
  getResponsiveValueComplete(deviceInfo, ResponsiveValues.positioning);

export const getBottomPositioning = (deviceInfo?: DeviceInfo) =>
  getResponsiveValueComplete(deviceInfo, ResponsiveValues.positioningBottom);

export const getIconSize = (deviceInfo?: DeviceInfo) =>
  `${getResponsiveValueComplete(deviceInfo, ResponsiveValues.iconSize)}px`;

export const getTextSize = (
  deviceInfo?: DeviceInfo,
  size: 'xs' | 'small' | 'medium' | 'large' | 'xlarge' = 'medium'
) => getResponsiveValueComplete(deviceInfo, ResponsiveValues.textSizing[size]);

export const getSpacing = (
  deviceInfo?: DeviceInfo,
  size: 'xs' | 'small' | 'medium' | 'large' | 'xlarge' = 'medium'
) => getResponsiveValueComplete(deviceInfo, ResponsiveValues.spacing[size]);

// CSS media query helpers for consistent breakpoints
export const mediaQueries = {
  mobile: `@media (max-width: ${Breakpoints.mobile - 1}px)`,
  tabletUp: `@media (min-width: ${Breakpoints.mobile}px)`,
  desktopUp: `@media (min-width: ${Breakpoints.desktop}px)`,
  landscape: '@media (orientation: landscape)',
  portrait: '@media (orientation: portrait)',
  retina:
    '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
} as const;

// Theme color schemes
export const ColorSchemes = {
  primary: {
    dark: '#162542',
    light: '#005E80',
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

// Button styling helper
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

// Animation transitions
export const Transitions = {
  fast: 'all 0.15s ease',
  normal: 'all 0.2s ease-in-out',
  slow: 'all 0.3s ease',
} as const;
