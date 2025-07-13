import React from 'react';
import { DeviceInfo } from './types';
import {
  getButtonSize,
  getPositioning,
  getIconSize,
  getButtonColors,
  ResponsiveValues,
  Transitions,
} from './responsiveUtils';

// Button position types
export type ButtonPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

// Button style configuration
export interface ButtonConfig {
  position: ButtonPosition;
  isDarkMode: boolean;
  isHovered: boolean;
  deviceInfo?: DeviceInfo;
  zIndex?: number;
}

// Generate button styles based on configuration
export const getButtonStyles = ({
  position,
  isDarkMode,
  isHovered,
  deviceInfo,
  zIndex = ResponsiveValues.zIndex.button,
}: ButtonConfig): React.CSSProperties => {
  const size = getButtonSize(deviceInfo);
  const offset = getPositioning(deviceInfo);
  const colors = getButtonColors(isDarkMode, isHovered);

  // Position-specific styles
  const positionStyles = getPositionStyles(position, offset);

  return {
    borderRadius: ResponsiveValues.borderRadius.button,
    position: 'fixed',
    zIndex,
    transition: Transitions.normal,
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    width: `${size}px`,
    height: `${size}px`,
    ...colors,
    ...positionStyles,
  };
};

// Get position-specific CSS properties
const getPositionStyles = (
  position: ButtonPosition,
  offset: number
): React.CSSProperties => {
  const offsetPx = `${offset}px`;

  switch (position) {
    case 'top-left':
      return { top: offsetPx, left: offsetPx };
    case 'top-right':
      return { top: offsetPx, right: offsetPx };
    case 'bottom-left':
      return { bottom: offsetPx, left: offsetPx };
    case 'bottom-right':
      return { bottom: offsetPx, right: offsetPx };
    default:
      return {};
  }
};

// Get responsive icon size
export const getResponsiveIconSize = (deviceInfo?: DeviceInfo) =>
  getIconSize(deviceInfo);

// Common button hover handlers
export const createHoverHandlers = (
  setIsHovered: (hovered: boolean) => void,
  onHoverSound?: () => void
) => ({
  onMouseEnter: () => {
    setIsHovered(true);
    onHoverSound?.();
  },
  onMouseLeave: () => {
    setIsHovered(false);
  },
});

// Get icon color based on hover state
export const getIconColor = (isDarkMode: boolean, isHovered: boolean) => {
  const colors = getButtonColors(isDarkMode, isHovered);
  return colors.color;
};
