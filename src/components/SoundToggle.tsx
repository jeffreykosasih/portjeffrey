import React from 'react';
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2';
import { DeviceInfo } from '../lib/types';
import {
  getButtonStyles,
  getResponsiveIconSize,
  getIconColor,
  createHoverHandlers,
} from '../lib/buttonUtils';
import { getButtonSize, getPositioning } from '../lib/responsiveUtils';

interface SoundToggleProps {
  isDarkMode: boolean;
  isSoundOn: boolean;
  onToggle: () => void;
  isHidden?: boolean;
  deviceInfo?: DeviceInfo;
}

// Gap between this button and the credits button to its left.
const GAP_PX = 12;

// Turns the ocean waves on or off. Sits just right of the credits button.
export default function SoundToggle({
  isDarkMode,
  isSoundOn,
  onToggle,
  isHidden = false,
  deviceInfo,
}: SoundToggleProps): React.JSX.Element | null {
  const [isHovered, setIsHovered] = React.useState(false);

  if (isHidden) return null;

  const buttonStyles = getButtonStyles({
    position: 'bottom-left',
    isDarkMode,
    isHovered,
    deviceInfo,
  });
  const left = getPositioning(deviceInfo) + getButtonSize(deviceInfo) + GAP_PX;

  const iconSize = getResponsiveIconSize(deviceInfo);
  const iconColor = getIconColor(isDarkMode, isHovered);
  const hoverHandlers = createHoverHandlers(setIsHovered);
  const Icon = isSoundOn ? HiSpeakerWave : HiSpeakerXMark;

  return (
    <button
      style={{ ...buttonStyles, left: `${left}px` }}
      onClick={onToggle}
      {...hoverHandlers}
      aria-label={isSoundOn ? 'Turn wave sound off' : 'Turn wave sound on'}
      className='touch-target'
    >
      <Icon style={{ fontSize: iconSize, color: iconColor }} />
    </button>
  );
}
