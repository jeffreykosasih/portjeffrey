import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DeviceInfo } from '../lib/types';
import { getResponsiveValue, ResponsiveValues } from '../lib/responsiveUtils';

// Type definitions
type PageName = 'home' | 'profile' | 'skillset' | 'portfolio' | 'connect';

interface BurgerMenuProps {
  isDarkMode: boolean;
  onNavigate: (page: PageName) => void;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean, shouldAnimate?: boolean) => void;
  activePage?: PageName | null;
  onHideThemeToggle?: (hide: boolean) => void;
  onHideCreditsButton?: (hide: boolean) => void;
  shouldAnimate?: boolean;
  deviceInfo?: DeviceInfo;
  onPlayClickSound?: () => void;
  slideDirection?: 'left' | 'right';
}

// Icon Components
interface IconProps {
  color?: string;
  deviceInfo?: DeviceInfo;
}

const BurgerIcon = ({ color = 'white', deviceInfo }: IconProps) => {
  const iconWidth = getResponsiveValue(deviceInfo, {
    mobile: 'var(--text-base)',
    landscapeMobile: 'var(--text-base)',
    tablet: 'calc(var(--text-base) + 0.0625rem)',
    desktop: 'var(--text-lg)',
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-xs)',
      }}
    >
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          style={{
            width: iconWidth,
            height: '2px',
            backgroundColor: color,
            borderRadius: 'var(--space-xs)',
          }}
        />
      ))}
    </div>
  );
};

const CloseIcon = ({ color = 'white', deviceInfo }: IconProps) => {
  const iconSize = getResponsiveValue(deviceInfo, {
    mobile: 14,
    landscapeMobile: 14,
    tablet: 15,
    desktop: 16,
  });

  return (
    <div
      style={{
        position: 'relative',
        width: `${iconSize / 16}rem`,
        height: `${iconSize / 16}rem`,
      }}
    >
      {[45, -45].map((rotation, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: `${iconSize / 16}rem`,
            height: '2px',
            backgroundColor: color,
            borderRadius: 'var(--space-xs)',
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
};

export default function BurgerMenu({
  isDarkMode,
  onNavigate,
  isOpen,
  onOpenChange,
  activePage,
  onHideThemeToggle,
  onHideCreditsButton,
  shouldAnimate = true,
  deviceInfo,
  onPlayClickSound,
  slideDirection = 'right',
}: BurgerMenuProps): React.JSX.Element {
  // State management
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const menuIsOpen = isOpen !== undefined ? isOpen : internalIsOpen;
  const setMenuIsOpen = onOpenChange || setInternalIsOpen;
  const [isHovered, setIsHovered] = useState(false);
  const [connectHovered, setConnectHovered] = useState(false);
  const [hoveredMenuItem, setHoveredMenuItem] = useState<PageName | null>(null);
  const [wasOpenBehindPage, setWasOpenBehindPage] = useState(false);

  // Unified device type detection (following ProfilePage pattern)
  const getDeviceType = ():
    | 'mobile-landscape'
    | 'mobile-portrait'
    | 'tablet'
    | 'desktop' => {
    if (!deviceInfo) return 'desktop';

    if (
      deviceInfo.isLandscapeMobile ||
      (deviceInfo.isMobile && deviceInfo.orientation === 'landscape')
    ) {
      return 'mobile-landscape';
    }
    if (deviceInfo.isMobile) return 'mobile-portrait';
    if (deviceInfo.isTablet) return 'tablet';
    return 'desktop';
  };

  const deviceType = getDeviceType();

  // Effects and handlers
  useEffect(() => {
    if (!activePage && menuIsOpen && wasOpenBehindPage) {
      setWasOpenBehindPage(false);
    }
  }, [activePage, menuIsOpen, wasOpenBehindPage]);

  const toggleMenu = () => {
    const newState = !menuIsOpen;
    onPlayClickSound?.();
    onHideThemeToggle?.(newState);
    setMenuIsOpen(newState);
  };

  const handleNavigation = (page: PageName): void => {
    onPlayClickSound?.();

    if (page === 'home') {
      setMenuIsOpen(false);
      onHideThemeToggle?.(false);
      setWasOpenBehindPage(false);
    } else if (menuIsOpen) {
      setWasOpenBehindPage(true);
      setMenuIsOpen(false);
      onHideThemeToggle?.(true);
    } else {
      setMenuIsOpen(false);
      onHideThemeToggle?.(false);
      setWasOpenBehindPage(false);
    }

    if (page !== 'home') {
      setHoveredMenuItem(null);
    }
    setConnectHovered(false);
    onNavigate(page);
  };

  // Style functions (following ProfilePage pattern)
  const getButtonStyles = () => {
    const configs = {
      'mobile-landscape': {
        top: 'max(env(safe-area-inset-top), var(--space-sm))',
        right: 'var(--space-base)',
        width: 'var(--touch-target-sm)',
        height: 'var(--touch-target-sm)',
      },
      'mobile-portrait': {
        top: 'max(env(safe-area-inset-top), var(--space-base))',
        right: 'var(--space-base)',
        width: 'var(--touch-target-md)',
        height: 'var(--touch-target-md)',
      },
      tablet: {
        top: 'var(--space-lg)',
        right: 'var(--space-lg)',
        width: 'var(--touch-target-lg)',
        height: 'var(--touch-target-lg)',
      },
      desktop: {
        top: 'var(--space-lg)',
        right: 'var(--space-lg)',
        width: 'var(--touch-target-lg)',
        height: 'var(--touch-target-lg)',
      },
    };

    const hoverStyles = isHovered
      ? {
          backgroundColor: '#ffffff',
          color: isDarkMode ? '#162542' : '#005E80',
        }
      : {};

    return {
      position: 'fixed' as const,
      borderRadius: '50%',
      border: 'none',
      backgroundColor: isDarkMode ? '#162542' : '#005E80',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      zIndex: ResponsiveValues.zIndex.burgerMenu,
      transition: 'all 0.2s ease',
      ...configs[deviceType],
      ...hoverStyles,
    };
  };

  const getMenuStyles = () => {
    const configs = {
      'mobile-landscape': {
        width: '13.75rem',
        gap: '0.5rem',
        paddingTop: '4rem',
        paddingBottom: '2.375rem',
        paddingLeft: '1.5rem',
        paddingRight: '1rem',
      },
      'mobile-portrait': {
        width: '17.5rem',
        gap: '0.9375rem',
        paddingTop: '5rem',
        paddingBottom: '7.5rem',
        paddingLeft: '2.375rem',
        paddingRight: '1.5rem',
      },
      tablet: {
        width: '18.75rem',
        gap: '1.5rem',
        paddingTop: '7.5rem',
        paddingBottom: '3rem',
        paddingLeft: '3rem',
        paddingRight: '2.375rem',
      },
      desktop: {
        width: '25vw',
        gap: '1.5rem',
        paddingTop: '7.5rem',
        paddingBottom: '3rem',
        paddingLeft: '3rem',
        paddingRight: '2.375rem',
      },
    };

    return {
      position: 'fixed' as const,
      top: 0,
      right: 0,
      height: '100dvh',
      background: isDarkMode
        ? 'rgba(22, 37, 66, 0.94)'
        : 'rgba(0, 94, 128, 0.94)',
      zIndex: 9999,
      transform: 'translateZ(0)',
      backfaceVisibility: 'hidden' as const,
      willChange: 'transform',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      minHeight: deviceType.includes('mobile') ? '100dvh' : '100vh',
      ...configs[deviceType],
    };
  };

  const getMenuItemStyles = (itemKey: PageName) => {
    const isSpecificItemHovered = hoveredMenuItem === itemKey;
    const shouldHighlight = isSpecificItemHovered;

    const configs = {
      'mobile-landscape': {
        fontSize: 'var(--text-sm)',
        padding: '0.125rem 0',
      },
      'mobile-portrait': {
        fontSize: 'var(--text-2xl)',
        padding: 'var(--space-sm) 0',
      },
      tablet: {
        fontSize: 'calc(var(--text-2xl) + 0.2rem)',
        padding: 'var(--space-sm) 0',
      },
      desktop: {
        fontSize: 'var(--text-3xl)',
        padding: 'var(--space-sm) 0',
      },
    };

    return {
      background: 'transparent',
      border: 'none',
      color: shouldHighlight ? '#FFEEA9' : '#ffffff',
      fontWeight: '900',
      fontFamily: 'Lato, sans-serif',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textAlign: 'left' as const,
      width: '100%',
      maxWidth: '56.25rem',
      letterSpacing: '-0.02em',
      transform: shouldHighlight ? 'scale(1.05)' : 'scale(1)',
      ...configs[deviceType],
    };
  };

  const getConnectButtonContainerStyles = () => {
    const configs = {
      'mobile-landscape': {
        bottom: 'max(env(safe-area-inset-bottom), var(--space-lg))',
        left: 'var(--space-lg)',
        right: 'var(--space-base)',
        width: 'calc(100% - var(--space-2xl) - var(--space-xs))',
        maxWidth: '8.75rem',
      },
      'mobile-portrait': {
        bottom: 'max(env(safe-area-inset-bottom), var(--space-3xl))',
        left: 'calc(var(--space-xl) + 0.375rem)',
        right: 'var(--space-lg)',
        width: 'calc(100% - var(--space-4xl) + 0.125rem)',
        maxWidth: '13.75rem',
      },
      tablet: {
        bottom: 'var(--space-4xl)',
        left: 'var(--space-3xl)',
        maxWidth: 'auto',
      },
      desktop: {
        bottom: 'var(--space-4xl)',
        left: 'var(--space-3xl)',
        maxWidth: 'auto',
      },
    };

    return {
      position: 'absolute' as const,
      zIndex: 100,
      ...configs[deviceType],
    };
  };

  const getConnectButtonStyles = () => {
    const configs = {
      'mobile-landscape': {
        padding: 'var(--space-xs) var(--space-sm)',
        fontSize: 'calc(var(--text-xs) + 0.05rem)',
        minHeight: 'var(--space-2xl)',
        minWidth: 'var(--space-2xl)',
      },
      'mobile-portrait': {
        padding:
          'calc(var(--space-sm) + 0.125rem) calc(var(--space-lg) - 0.125rem)',
        fontSize: 'var(--text-sm)',
        minHeight: 'var(--touch-target-sm)',
        minWidth: 'var(--touch-target-sm)',
      },
      tablet: {
        padding: 'var(--space-md) var(--space-lg)',
        fontSize: 'var(--text-base)',
        minHeight: 'var(--touch-target-sm)',
        minWidth: 'var(--touch-target-sm)',
      },
      desktop: {
        padding: 'var(--space-md) var(--space-lg)',
        fontSize: 'var(--text-base)',
        minHeight: 'var(--touch-target-sm)',
        minWidth: 'var(--touch-target-sm)',
      },
    };

    return {
      position: 'relative' as const,
      cursor: 'pointer',
      fontWeight: '900',
      fontFamily: 'Lato, sans-serif',
      letterSpacing: '0.02em',
      color: isDarkMode ? '#162542' : '#005E80',
      textAlign: 'center' as const,
      borderRadius: 'calc(var(--radius-sm) + 0.0625rem)',
      border: 'none',
      background: '#FAF1E6',
      transition: 'all 0.3s ease',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 0.125rem 0.5rem rgba(250, 241, 230, 0.25)',
      ...configs[deviceType],
    };
  };

  // Menu configuration
  const menuItems = [
    { name: 'Port Jeffrey', key: 'home' as PageName },
    { name: 'Profile', key: 'profile' as PageName },
    { name: 'Skillset', key: 'skillset' as PageName },
    { name: 'Portfolio', key: 'portfolio' as PageName },
  ];

  const iconColor = isHovered
    ? isDarkMode
      ? '#162542'
      : '#005E80'
    : '#ffffff';

  return (
    <>
      {/* Burger Menu Button */}
      {(!activePage || activePage === 'home') && (
        <button
          style={getButtonStyles()}
          onClick={toggleMenu}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label={menuIsOpen ? 'Close menu' : 'Open menu'}
          className='touch-target'
        >
          {menuIsOpen ? (
            <CloseIcon color={iconColor} deviceInfo={deviceInfo} />
          ) : (
            <BurgerIcon color={iconColor} deviceInfo={deviceInfo} />
          )}
        </button>
      )}

      {/* Slide-out Menu */}
      <AnimatePresence mode='wait'>
        {(!activePage || activePage === 'home') && menuIsOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: '30%', opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 180,
              mass: 1.2,
            }}
            onAnimationComplete={() => {
              if (wasOpenBehindPage) {
                setWasOpenBehindPage(false);
              }
            }}
            style={getMenuStyles()}
          >
            {/* Menu Items */}
            {menuItems.map((item, index) => (
              <motion.button
                key={item.key}
                initial={
                  shouldAnimate ? { opacity: 1, x: 20 } : { opacity: 1, x: 0 }
                }
                animate={{ opacity: 1, x: 0 }}
                transition={
                  shouldAnimate
                    ? {
                        delay: index * 0.12,
                        duration: 0.4,
                        ease: 'easeOut',
                      }
                    : { duration: 0 }
                }
                onMouseEnter={() => setHoveredMenuItem(item.key)}
                onMouseLeave={() => setHoveredMenuItem(null)}
                onClick={() => handleNavigation(item.key)}
                style={getMenuItemStyles(item.key)}
                className='touch-target'
              >
                {item.name}
              </motion.button>
            ))}

            {/* Connect Button */}
            <motion.div
              initial={
                shouldAnimate ? { opacity: 1, y: 20 } : { opacity: 1, y: 0 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={
                shouldAnimate
                  ? {
                      delay: menuItems.length * 0.12 + 0.25,
                      duration: 0.6,
                      ease: 'easeOut',
                    }
                  : { duration: 0 }
              }
              style={getConnectButtonContainerStyles()}
            >
              <button
                onClick={() => handleNavigation('connect')}
                onMouseEnter={() => setConnectHovered(true)}
                onMouseLeave={() => setConnectHovered(false)}
                style={getConnectButtonStyles()}
                className='touch-target'
              >
                {/* Progress bar background */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: connectHovered ? '100%' : '0%',
                    backgroundColor: '#FFEEA9',
                    transition: 'width 0.3s ease',
                    zIndex: 0,
                  }}
                />

                {/* Button content */}
                <span style={{ position: 'relative', zIndex: 1 }}>
                  Let's Connect!
                </span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
