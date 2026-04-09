import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faBriefcase,
  faUser,
  faCogs,
} from '@fortawesome/free-solid-svg-icons';

type ObjectType = 'twochairs' | 'house' | 'stonehead' | 'surfboard';
type PageName = 'profile' | 'skillset' | 'portfolio' | 'connect';

interface ObjectPopupMenuProps {
  isDarkMode: boolean;
  deviceInfo?: any;
  objectPositions: Partial<Record<ObjectType, [number, number]>>;
  onNavigate?: (page: PageName) => void;
  onHoverObject?: (objectType: ObjectType | null) => void;
  isVisible?: boolean;
  introDelayMs?: number;
}

// Unified positioning system for consistent popup placement
const getPopupPosition = (objectType: ObjectType, isMobile: boolean) => {
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
  objectType: ObjectType,
  isDarkMode: boolean,
  isMobile: boolean
) => {
  // Get unified position for this object
  const position = getPopupPosition(objectType, isMobile);

  const configs = {
    twochairs: {
      title: 'Connect',
      page: 'connect' as PageName,
      icon: faEnvelope,
      position: { left: -50, top: -200 },
    },
    house: {
      title: 'Portfolio',
      page: 'portfolio' as PageName,
      icon: faBriefcase,
      position: { left: position.x, top: -250 },
    },
    stonehead: {
      title: 'Profile',
      page: 'profile' as PageName,
      icon: faUser,
      position: { left: -75, top: -225 },
    },
    surfboard: {
      title: 'Skillset',
      page: 'skillset' as PageName,
      icon: faCogs,
      position: { left: -80, top: -150 },
    },
  };

  const theme = isDarkMode
    ? {
        baseBackground: 'rgba(28, 45, 78, 0.9)',
        hoverBackground: '#ffffff',
        textColor: '#f8fbff',
        hoverTextColor: '#162542',
        shadowColor: 'rgba(3, 10, 22, 0.45)',
      }
    : {
        baseBackground: 'rgba(0, 94, 128, 0.9)',
        hoverBackground: '#ffffff',
        textColor: '#ffffff',
        hoverTextColor: '#005E80',
        shadowColor: 'rgba(0, 94, 128, 0.18)',
      };

  return {
    ...configs[objectType],
    ...theme,
  };
};

const ObjectPopupMenu: React.FC<ObjectPopupMenuProps> = ({
  isDarkMode,
  deviceInfo,
  objectPositions,
  onNavigate,
  onHoverObject,
  isVisible = true,
  introDelayMs = 0,
}) => {
  const isMobile = deviceInfo?.isMobile || deviceInfo?.isLandscapeMobile;
  const [hoveredButton, setHoveredButton] = useState<ObjectType | null>(null);
  const [shouldRenderButtons, setShouldRenderButtons] = useState(false);
  const buttonOrder: ObjectType[] = ['stonehead', 'house', 'surfboard', 'twochairs'];

  useEffect(() => {
    if (!isVisible) {
      setHoveredButton(null);
      onHoverObject?.(null);
      setShouldRenderButtons(false);
      return;
    }

    if (introDelayMs <= 0) {
      setShouldRenderButtons(true);
      return;
    }

    const timer = window.setTimeout(() => {
      setShouldRenderButtons(true);
    }, introDelayMs);

    return () => window.clearTimeout(timer);
  }, [introDelayMs, isVisible, onHoverObject]);

  return (
    <AnimatePresence>
      {shouldRenderButtons &&
        buttonOrder.map((objectType, index) => {
          const objectPosition = objectPositions[objectType];
          if (!objectPosition) return null;

          const config = getObjectConfig(objectType, isDarkMode, isMobile);
          const isHovered = hoveredButton === objectType;

          return (
            <motion.button
              key={objectType}
              type='button'
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{
                duration: shouldRenderButtons ? 0.22 : 0.16,
                delay: index * 0.03,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -4, scale: 1.07 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => {
                setHoveredButton(objectType);
                onHoverObject?.(objectType);
              }}
              onMouseLeave={() => {
                setHoveredButton(null);
                onHoverObject?.(null);
              }}
              onClick={() => onNavigate?.(config.page)}
              style={{
                position: 'fixed',
                left: objectPosition[0] + config.position.left,
                top:
                  objectPosition[1] +
                  config.position.top +
                  (isMobile ? 24 : 0),
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                gap: isMobile ? '10px' : '12px',
                minWidth: 'fit-content',
                padding: isMobile ? '14px 18px' : '16px 22px',
                borderRadius: '16px',
                border: 'none',
                background: isHovered
                  ? config.hoverBackground
                  : config.baseBackground,
                color: isHovered ? config.hoverTextColor : config.textColor,
                boxShadow: isHovered
                  ? `0 14px 32px ${config.shadowColor}`
                  : `0 10px 28px ${config.shadowColor}`,
                backdropFilter: 'blur(12px)',
                cursor: 'pointer',
                pointerEvents: 'auto',
                transition:
                  'background-color 0.12s ease, color 0.12s ease, box-shadow 0.12s ease, transform 0.12s ease',
              }}
            >
              <FontAwesomeIcon
                icon={config.icon}
                style={{
                  color: isHovered ? config.hoverTextColor : config.textColor,
                  fontSize: isMobile ? '18px' : '20px',
                  filter: isDarkMode
                    ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.28))'
                    : 'none',
                }}
              />

              <span
                style={{
                  margin: 0,
                  fontFamily: 'Lato, sans-serif',
                  fontWeight: 700,
                  fontSize: isMobile ? '16px' : '18px',
                  lineHeight: '1.2',
                  whiteSpace: 'nowrap',
                }}
              >
                {config.title}
              </span>
            </motion.button>
          );
        })}
    </AnimatePresence>
  );
};

export default ObjectPopupMenu;
