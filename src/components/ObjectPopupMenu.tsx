import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faBriefcase,
  faUser,
  faCogs,
} from '@fortawesome/free-solid-svg-icons';

interface ObjectPopupMenuProps {
  objectType: 'twochairs' | 'house' | 'stonehead' | 'surfboard' | null;
  isDarkMode: boolean;
  deviceInfo?: any;
  objectPosition?: [number, number]; // 2D screen position
}

// Unified positioning system for consistent popup placement
const getPopupPosition = (objectType: string, isMobile: boolean) => {
  // Base offset distances - consistent across all objects
  const baseOffset = {
    mobile: { x: 60, y: 70 },
    desktop: { x: 80, y: 90 },
  };

  const offset = isMobile ? baseOffset.mobile : baseOffset.desktop;

  // Position strategy: each object gets a consistent relative position
  // This creates a predictable, maintainable positioning system
  const positionMap = {
    twochairs: { direction: 'top-right', x: offset.x, y: -offset.y },
    house: { direction: 'top-left', x: -offset.x, y: -offset.y },
    stonehead: { direction: 'top-center', x: 0, y: -offset.y },
    surfboard: { direction: 'bottom-left', x: -offset.x, y: offset.y / 2 },
  };

  return (
    positionMap[objectType as keyof typeof positionMap] || {
      x: 0,
      y: -offset.y,
    }
  );
};

const getObjectConfig = (
  objectType: string,
  isDarkMode: boolean,
  isMobile: boolean
) => {
  // Use darker brown colors like the tree - adjusts for light/dark mode
  const brownColor = isDarkMode ? '#2d1b0e' : '#5d3a1f'; // Dark brown tones
  const shadowColor = isDarkMode ? '#1a0e07' : '#3d2416'; // Even darker for shadows

  // Get unified position for this object
  const position = getPopupPosition(objectType, isMobile);

  const configs = {
    twochairs: {
      title: 'Connect',
      icon: faEnvelope,
      backgroundColor: brownColor,
      shadowColor: shadowColor,
      position: { left: -50, top: -200 },
    },
    house: {
      title: 'Portfolio',
      icon: faBriefcase,
      backgroundColor: brownColor,
      shadowColor: shadowColor,
      position: { left: position.x, top: -250 },
    },
    stonehead: {
      title: 'Profile',
      icon: faUser,
      backgroundColor: brownColor,
      shadowColor: shadowColor,
      position: { left: -75, top: -225 },
    },
    surfboard: {
      title: 'Skillset',
      icon: faCogs,
      backgroundColor: brownColor,
      shadowColor: shadowColor,
      position: { left: -80, top: -150 },
    },
  };

  return configs[objectType as keyof typeof configs];
};

const ObjectPopupMenu: React.FC<ObjectPopupMenuProps> = ({
  objectType,
  isDarkMode,
  deviceInfo,
  objectPosition,
}) => {
  if (!objectType || !objectPosition) return null;

  const isMobile = deviceInfo?.isMobile || deviceInfo?.isLandscapeMobile;
  const config = getObjectConfig(objectType, isDarkMode, isMobile);
  if (!config) return null;

  const popupStyle = {
    position: 'fixed' as const,
    left: objectPosition[0] + config.position.left,
    top: objectPosition[1] + config.position.top,
    transform: 'none',
    zIndex: 9999,
    pointerEvents: 'none' as const,
  };

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={`popup-${objectType}`}
        style={popupStyle}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{
          duration: 0.3,
          ease: 'easeOut',
          exit: { duration: 0.2, ease: 'easeIn' },
        }}
      >
        <div
          style={{
            background: config.backgroundColor,
            borderRadius: '16px',
            padding: isMobile ? '12px 16px' : '14px 20px',
            boxShadow: `0 8px 32px ${config.shadowColor}40, 0 4px 16px ${config.shadowColor}30`,
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '10px' : '12px',
            minWidth: 'fit-content',
            border: `2px solid ${config.shadowColor}60`,
            backdropFilter: 'blur(12px)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FontAwesomeIcon
              icon={config.icon}
              style={{
                color: 'white',
                fontSize: isMobile ? '18px' : '20px',
                filter: `drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4))`,
              }}
            />
          </div>

          <h3
            style={{
              margin: 0,
              fontFamily: 'Lato, sans-serif',
              fontWeight: '700',
              fontSize: isMobile ? '16px' : '18px',
              color: 'white',
              lineHeight: '1.2',
              textShadow: `0 2px 6px rgba(0, 0, 0, 0.5)`,
              whiteSpace: 'nowrap',
            }}
          >
            {config.title}
          </h3>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ObjectPopupMenu;
