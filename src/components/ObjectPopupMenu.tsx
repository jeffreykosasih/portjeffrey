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

const getObjectConfig = (objectType: string, isDarkMode: boolean) => {
  // Sky and sea color palette from the 3D scene
  const skyColor = isDarkMode ? '#0a1322' : '#02bbdc';
  const seaColor = isDarkMode ? '#010f19' : '#56ffff';

  const configs = {
    twochairs: {
      title: 'Connect',
      icon: faEnvelope,
      gradient: isDarkMode
        ? `linear-gradient(135deg, ${skyColor}f0, ${seaColor}e0)` // Sky to sea gradient for dark mode
        : `linear-gradient(135deg, ${skyColor}e0, ${seaColor}c0)`, // Sky to sea gradient for light mode
      shadowColor: isDarkMode ? skyColor : seaColor,
    },
    house: {
      title: 'Portfolio',
      icon: faBriefcase,
      gradient: isDarkMode
        ? `linear-gradient(135deg, ${seaColor}f0, ${skyColor}e0)` // Sea to sky gradient for dark mode
        : `linear-gradient(135deg, ${seaColor}e0, ${skyColor}c0)`, // Sea to sky gradient for light mode
      shadowColor: isDarkMode ? seaColor : skyColor,
    },
    stonehead: {
      title: 'Profile',
      icon: faUser,
      gradient: isDarkMode
        ? `linear-gradient(135deg, ${skyColor}f0, ${seaColor}e0)` // Sky to sea gradient for dark mode
        : `linear-gradient(135deg, ${skyColor}e0, ${seaColor}c0)`, // Sky to sea gradient for light mode
      shadowColor: isDarkMode ? skyColor : seaColor,
    },
    surfboard: {
      title: 'Skillset',
      icon: faCogs,
      gradient: isDarkMode
        ? `linear-gradient(135deg, ${seaColor}f0, ${skyColor}e0)` // Sea to sky gradient for dark mode
        : `linear-gradient(135deg, ${seaColor}e0, ${skyColor}c0)`, // Sea to sky gradient for light mode
      shadowColor: isDarkMode ? seaColor : skyColor,
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

  const config = getObjectConfig(objectType, isDarkMode);
  if (!config) return null;

  const isMobile = deviceInfo?.isMobile || deviceInfo?.isLandscapeMobile;

  const popupStyle = {
    position: 'fixed' as const,
    left: objectPosition[0],
    top: objectPosition[1] - (isMobile ? 120 : 150),
    transform: 'translateX(-50%)',
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
            background: config.gradient,
            borderRadius: '16px',
            padding: isMobile ? '12px 16px' : '14px 20px',
            boxShadow: isDarkMode
              ? `0 8px 32px ${config.shadowColor}40, 0 4px 16px ${config.shadowColor}30`
              : `0 8px 32px ${config.shadowColor}25, 0 4px 16px ${config.shadowColor}20, 0 2px 8px rgba(0, 0, 0, 0.1)`,
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '10px' : '12px',
            minWidth: 'fit-content',
            border: isDarkMode
              ? `2px solid ${config.shadowColor}60`
              : `2px solid ${config.shadowColor}50`,
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: isMobile ? '32px' : '36px',
              height: isMobile ? '32px' : '36px',
              background: isDarkMode
                ? 'rgba(255, 255, 255, 0.2)'
                : 'rgba(255, 255, 255, 0.4)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              border: isDarkMode
                ? '1px solid rgba(255, 255, 255, 0.3)'
                : '1px solid rgba(255, 255, 255, 0.5)',
            }}
          >
            <FontAwesomeIcon
              icon={config.icon}
              style={{
                color: 'white',
                fontSize: isMobile ? '16px' : '18px',
                filter: isDarkMode
                  ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
                  : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
              }}
            />
          </div>

          {/* Title */}
          <h3
            style={{
              margin: 0,
              fontFamily: 'Lato, sans-serif',
              fontWeight: '700',
              fontSize: isMobile ? '16px' : '18px',
              color: 'white',
              lineHeight: '1.2',
              textShadow: isDarkMode
                ? '0 2px 8px rgba(0, 0, 0, 0.4)'
                : '0 2px 8px rgba(0, 0, 0, 0.3)',
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
