import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faMoon } from '@fortawesome/free-solid-svg-icons';
import { DeviceInfo } from '../lib/types';
import {
  getButtonStyles,
  getResponsiveIconSize,
  getIconColor,
  createHoverHandlers,
  type ButtonPosition,
} from '../lib/buttonUtils';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
  isHidden?: boolean;
  deviceInfo?: DeviceInfo;
  onPlayHoverSound?: () => void;
}

export default function ThemeToggle({
  isDarkMode,
  onToggle,
  isHidden = false,
  deviceInfo,
  onPlayHoverSound,
}: ThemeToggleProps): React.JSX.Element | null {
  const [isHovered, setIsHovered] = React.useState(false);

  if (isHidden) return null;

  const buttonPosition: ButtonPosition = 'bottom-right';
  const buttonStyles = getButtonStyles({
    position: buttonPosition,
    isDarkMode,
    isHovered,
    deviceInfo,
  });

  const iconSize = getResponsiveIconSize(deviceInfo);
  const iconColor = getIconColor(isDarkMode, isHovered);
  const hoverHandlers = createHoverHandlers(setIsHovered, onPlayHoverSound);

  return (
    <button
      style={buttonStyles}
      onClick={onToggle}
      {...hoverHandlers}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      className='touch-target'
    >
      <FontAwesomeIcon
        icon={isDarkMode ? faMoon : faLightbulb}
        style={{ fontSize: iconSize, color: iconColor }}
      />
    </button>
  );
}
