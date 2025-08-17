import React from 'react';
import { DeviceInfo } from './types';
import {
  getButtonSize,
  getPositioning,
  getBottomPositioning,
  getIconSize,
  getButtonColors,
  ResponsiveValues,
  Transitions,
  getResponsiveValue,
} from './responsiveUtils';

export type ButtonPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export interface ButtonConfig {
  position: ButtonPosition;
  isDarkMode: boolean;
  isHovered: boolean;
  deviceInfo?: DeviceInfo;
  zIndex?: number;
  size?: 'small' | 'medium' | 'large';
}

// Enhanced button styles with responsive sizing options
export const getButtonStyles = ({
  position,
  isDarkMode,
  isHovered,
  deviceInfo,
  zIndex = ResponsiveValues.zIndex.button,
  size = 'medium',
}: ButtonConfig): React.CSSProperties => {
  const buttonSize = getResponsiveButtonSize(deviceInfo, size);
  const offset = getPositioning(deviceInfo);
  const bottomOffset = getBottomPositioning(deviceInfo);
  const colors = getButtonColors(isDarkMode, isHovered);
  const positionStyles = getPositionStyles(position, offset, bottomOffset);

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
    width: `${buttonSize}px`,
    height: `${buttonSize}px`,
    ...colors,
    ...positionStyles,
  };
};

// Position-specific styles
const getPositionStyles = (
  position: ButtonPosition,
  offset: number,
  bottomOffset: number
): React.CSSProperties => {
  const offsetPx = `${offset}px`;
  const bottomOffsetPx = `${bottomOffset}px`;

  switch (position) {
    case 'top-left':
      return { top: offsetPx, left: offsetPx };
    case 'top-right':
      return { top: offsetPx, right: offsetPx };
    case 'bottom-left':
      return { bottom: bottomOffsetPx, left: offsetPx };
    case 'bottom-right':
      return { bottom: bottomOffsetPx, right: offsetPx };
    default:
      return {};
  }
};

// Enhanced button sizing with small/medium/large options
const getResponsiveButtonSize = (
  deviceInfo?: DeviceInfo,
  size: 'small' | 'medium' | 'large' = 'medium'
) => {
  const baseSize = getButtonSize(deviceInfo);
  const multipliers = { small: 0.8, medium: 1, large: 1.2 };
  return Math.round(baseSize * multipliers[size]);
};

// Touch-friendly button sizing for mobile
export const getTouchTargetSize = (deviceInfo?: DeviceInfo) =>
  getResponsiveValue(deviceInfo, {
    mobile: 44,
    landscapeMobile: 40,
    tablet: 48,
    desktop: 44,
  });

export const getResponsiveIconSize = (deviceInfo?: DeviceInfo) =>
  getIconSize(deviceInfo);

// Hover event handlers with sound support
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

export const getIconColor = (isDarkMode: boolean, isHovered: boolean) => {
  const colors = getButtonColors(isDarkMode, isHovered);
  return colors.color;
};
