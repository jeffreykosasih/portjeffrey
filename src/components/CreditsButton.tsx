import React, { useState } from 'react';
import { SiSketchfab } from 'react-icons/si';
import { DeviceInfo } from '../lib/types';
import {
  getButtonStyles,
  getResponsiveIconSize,
  getIconColor,
  createHoverHandlers,
  type ButtonPosition,
} from '../lib/buttonUtils';

interface CreditsButtonProps {
  isDarkMode: boolean;
  onToggle: () => void;
  isHidden?: boolean;
  deviceInfo?: DeviceInfo;
}

export default function CreditsButton({
  isDarkMode,
  onToggle,
  isHidden = false,
  deviceInfo,
}: CreditsButtonProps): React.JSX.Element | null {
  const [isHovered, setIsHovered] = React.useState(false);

  // Don't render if hidden
  if (isHidden) {
    return null;
  }

  // Button configuration
  const buttonPosition: ButtonPosition = 'bottom-left';
  const buttonStyles = getButtonStyles({
    position: buttonPosition,
    isDarkMode,
    isHovered,
    deviceInfo,
  });

  const iconSize = getResponsiveIconSize(deviceInfo);
  const iconColor = getIconColor(isDarkMode, isHovered);
  const hoverHandlers = createHoverHandlers(setIsHovered);

  return (
    <button
      style={buttonStyles}
      onClick={onToggle}
      {...hoverHandlers}
      aria-label='Show credits'
      className='touch-target'
    >
      <SiSketchfab style={{ fontSize: iconSize, color: iconColor }} />
    </button>
  );
}
