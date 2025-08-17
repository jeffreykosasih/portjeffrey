// Device detection interface for responsive design
export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLandscapeMobile: boolean;
  isTouchDevice: boolean;
  isLowPerformance: boolean;
  screenWidth: number;
  screenHeight: number;
  devicePixelRatio: number;
  orientation: 'portrait' | 'landscape';
  isRetinaDisplay: boolean;
  supportsWebGL: boolean;
}

// Responsive breakpoint types
export type DeviceType = 'mobile' | 'landscapeMobile' | 'tablet' | 'desktop';

// Common responsive value structure
export interface ResponsiveValues<T> {
  mobile: T;
  landscapeMobile?: T;
  tablet: T;
  desktop: T;
}

// Page navigation types
export type PageName =
  | 'home'
  | 'profile'
  | 'skillset'
  | 'portfolio'
  | 'connect';

// Component size variants
export type SizeVariant = 'xs' | 'small' | 'medium' | 'large' | 'xlarge';
