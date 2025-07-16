import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DeviceInfo } from '../lib/types';
import {
  getButtonStyles,
  getResponsiveIconSize,
  getIconColor,
  createHoverHandlers,
  type ButtonPosition,
} from '../lib/buttonUtils';
import { getResponsiveValue, ResponsiveValues } from '../lib/responsiveUtils';

// Type definitions
type PageName = 'home' | 'profile' | 'skillset' | 'portfolio' | 'connect';

interface BurgerIconProps {
  color?: string;
}

interface CloseIconProps {
  color?: string;
  size?: number;
}

interface BurgerMenuProps {
  isDarkMode: boolean;
  onNavigate: (page: PageName) => void;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean, shouldAnimate?: boolean) => void;
  activePage?: PageName | null;
  onHideThemeToggle?: (hide: boolean) => void;
  shouldAnimate?: boolean;
  deviceInfo?: DeviceInfo;
  onPlayClickSound?: () => void;
  onPlayHoverSound?: () => void;
  slideDirection?: 'left' | 'right';
}

// Custom Burger Menu Icon Component (3 stripes)
const BurgerIcon = ({
  color = 'white',
}: BurgerIconProps): React.JSX.Element => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
    <div
      style={{
        width: '18px',
        height: '2px',
        backgroundColor: color,
        borderRadius: '1px',
      }}
    ></div>
    <div
      style={{
        width: '18px',
        height: '2px',
        backgroundColor: color,
        borderRadius: '1px',
      }}
    ></div>
    <div
      style={{
        width: '18px',
        height: '2px',
        backgroundColor: color,
        borderRadius: '1px',
      }}
    ></div>
  </div>
);

// Custom X (Close) Icon Component
const CloseIcon = ({
  color = 'white',
  size = 14,
}: CloseIconProps): React.JSX.Element => (
  <div
    style={{ position: 'relative', width: `${size}px`, height: `${size}px` }}
  >
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: `${size}px`,
        height: '2px',
        backgroundColor: color,
        borderRadius: '1px',
        transform: 'translate(-50%, -50%) rotate(45deg)',
      }}
    ></div>
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: `${size}px`,
        height: '2px',
        backgroundColor: color,
        borderRadius: '1px',
        transform: 'translate(-50%, -50%) rotate(-45deg)',
      }}
    ></div>
  </div>
);

export default function BurgerMenu({
  isDarkMode,
  onNavigate,
  isOpen,
  onOpenChange,
  activePage,
  onHideThemeToggle,
  shouldAnimate = true,
  deviceInfo,
  onPlayClickSound,
  onPlayHoverSound,
  slideDirection = 'right',
}: BurgerMenuProps): React.JSX.Element {
  // Use external state if provided, otherwise use internal state
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const menuIsOpen = isOpen !== undefined ? isOpen : internalIsOpen;
  const setMenuIsOpen = onOpenChange || setInternalIsOpen;
  const [isHovered, setIsHovered] = useState(false);
  const [connectHovered, setConnectHovered] = useState(false);
  const [hoveredMenuItem, setHoveredMenuItem] = useState<PageName | null>(null);
  const [wasOpenBehindPage, setWasOpenBehindPage] = useState(false);

  // Handle when menu should be restored after page navigation
  useEffect(() => {
    if (!activePage && menuIsOpen && wasOpenBehindPage) {
      // Menu is being shown after page closed, reset the flag
      setWasOpenBehindPage(false);
    }
  }, [activePage, menuIsOpen, wasOpenBehindPage]);

  const toggleMenu = () => {
    onPlayHoverSound?.(); // Use hover sound for burger menu toggle
    const newState = !menuIsOpen;
    setMenuIsOpen(newState);
    // Hide/show theme toggle based on menu state
    if (onHideThemeToggle) {
      onHideThemeToggle(newState);
    }
  };

  const handleNavigation = (page: PageName): void => {
    onPlayClickSound?.();
    // Store that menu was open when navigating to a page (except home)
    if (page !== 'home' && menuIsOpen) {
      setWasOpenBehindPage(true);
      // Actually close the menu when navigating to a page
      setMenuIsOpen(false);
      if (onHideThemeToggle) {
        onHideThemeToggle(true);
      }
    } else {
      // When returning to home, reopen menu if it was open before
      if (page === 'home' && wasOpenBehindPage) {
        setMenuIsOpen(true);
        if (onHideThemeToggle) {
          onHideThemeToggle(true);
        }
      } else {
        // Close menu when navigating to home normally
        setMenuIsOpen(false);
        if (onHideThemeToggle) {
          onHideThemeToggle(false);
        }
      }
      // Reset the flag when navigating back to home
      setWasOpenBehindPage(false);
    }
    // Update hovered state - turn off auto-hover when clicking other menus
    if (page !== 'home') {
      setHoveredMenuItem(null);
    }
    // Reset connect hover state when navigating away
    setConnectHovered(false);
    // Then navigate
    onNavigate(page);
  };

  // Button configuration using utilities
  const buttonPosition: ButtonPosition = 'top-right';
  const buttonStyles = getButtonStyles({
    position: buttonPosition,
    isDarkMode,
    isHovered,
    deviceInfo,
    zIndex: ResponsiveValues.zIndex.burgerMenu,
  });

  const hoverStyles = {
    backgroundColor: '#ffffff',
    color: isDarkMode ? '#162542' : '#006161',
  };

  // Icon configuration using utilities
  const iconColor = getIconColor(isDarkMode, isHovered);
  const iconSizes = {
    burger: {
      width: getResponsiveValue(deviceInfo, {
        mobile: '16px',
        tablet: '17px',
        desktop: '18px',
      }),
      height: '2px',
    },
    close: getResponsiveValue(deviceInfo, {
      mobile: 14,
      tablet: 15,
      desktop: 16,
    }),
  };

  // Updated menu styling with landscape mobile support
  const getMenuStyles = () => {
    let baseWidth;

    if (deviceInfo?.isLandscapeMobile) {
      baseWidth = '220px'; // Much narrower for landscape mobile to preserve horizontal space
    } else if (deviceInfo?.isMobile) {
      baseWidth = '280px';
    } else if (deviceInfo?.isTablet) {
      baseWidth = '300px';
    } else {
      baseWidth = '25vw';
    }

    return {
      position: 'fixed' as const,
      top: 0,
      right: 0,
      width: baseWidth,
      height: '100dvh', // Use dynamic viewport height for better mobile support
      backgroundColor: isDarkMode ? '#162542' : '#006161',
      backdropFilter: 'blur(10px)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      gap: deviceInfo?.isLandscapeMobile
        ? '8px' // Tighter spacing for landscape mobile
        : deviceInfo?.isMobile
        ? '15px'
        : '20px',
      paddingTop: deviceInfo?.isLandscapeMobile
        ? '60px' // Much smaller top padding for landscape mobile
        : deviceInfo?.isMobile
        ? '100px'
        : '120px',
      paddingBottom: deviceInfo?.isLandscapeMobile
        ? '40px' // Smaller bottom padding for landscape mobile
        : deviceInfo?.isMobile
        ? deviceInfo?.orientation === 'portrait'
          ? '120px' // More bottom padding on portrait to ensure button visibility
          : '80px'
        : '40px',
      paddingLeft: deviceInfo?.isLandscapeMobile
        ? '20px' // Tighter left padding for landscape mobile
        : deviceInfo?.isMobile
        ? '30px'
        : '40px',
      paddingRight: deviceInfo?.isLandscapeMobile
        ? '16px' // Tighter right padding for landscape mobile
        : deviceInfo?.isMobile
        ? '20px'
        : '30px',
      minHeight:
        deviceInfo?.isMobile || deviceInfo?.isLandscapeMobile
          ? '100dvh'
          : '100vh', // Ensure minimum height
    };
  };

  // Updated menu item styling with landscape mobile support
  const getMenuItemStyles = (isHovered: boolean, itemKey: PageName) => {
    const isSpecificItemHovered = hoveredMenuItem === itemKey;
    const shouldHighlight = isHovered || isSpecificItemHovered;

    const baseStyles = {
      background: 'transparent',
      border: 'none',
      color: shouldHighlight ? '#FFEEA9' : '#ffffff',
      fontWeight: '900',
      fontFamily: 'Lato, sans-serif',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textAlign: 'left' as const,
      width: '100%',
      maxWidth: '900px',
      letterSpacing: '-0.02em',
      transform: shouldHighlight ? 'scale(1.05)' : 'scale(1)',
      padding: deviceInfo?.isLandscapeMobile ? '4px 0px' : '8px 0px', // Tighter padding for landscape mobile
    };

    // Enhanced responsive font sizes with landscape mobile support
    if (deviceInfo?.isLandscapeMobile) {
      return {
        ...baseStyles,
        fontSize: '1.1rem', // Much smaller for landscape mobile height constraints
      };
    } else if (deviceInfo?.isMobile) {
      return {
        ...baseStyles,
        fontSize: '1.5rem', // Smaller for mobile but still substantial
      };
    } else if (deviceInfo?.isTablet) {
      return {
        ...baseStyles,
        fontSize: '1.7rem',
      };
    } else {
      return {
        ...baseStyles,
        fontSize: '1.875rem', // Original size
      };
    }
  };

  const menuItems = [
    { name: 'Port Jeffrey', key: 'home' as PageName },
    { name: 'Profile', key: 'profile' as PageName },
    { name: 'Skillset', key: 'skillset' as PageName },
    { name: 'Portfolio', key: 'portfolio' as PageName },
  ];

  // Updated Burger Icon with responsive sizing
  const ResponsiveBurgerIcon = ({ color = 'white' }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          style={{
            width: iconSizes.burger.width,
            height: iconSizes.burger.height,
            backgroundColor: color,
            borderRadius: '1px',
          }}
        />
      ))}
    </div>
  );

  return (
    <>
      {/* Burger Menu Button - Hide when pages other than home are active */}
      {(!activePage || activePage === 'home') && (
        <button
          style={isHovered ? { ...buttonStyles, ...hoverStyles } : buttonStyles}
          onClick={toggleMenu}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label={menuIsOpen ? 'Close menu' : 'Open menu'}
          className='touch-target'
        >
          {menuIsOpen ? (
            <CloseIcon color={iconColor} size={iconSizes.close} />
          ) : (
            <ResponsiveBurgerIcon color={iconColor} />
          )}
        </button>
      )}

      {/* Slide-out menu from right - Show when no page is active OR when home page is active */}
      <AnimatePresence>
        {(!activePage || activePage === 'home') && menuIsOpen && (
          <motion.div
            initial={{
              x: !shouldAnimate
                ? '30%'
                : slideDirection === 'left'
                ? '-100%'
                : '100%',
            }}
            animate={{
              x: '30%', // Back to original positioning
              transition: !shouldAnimate
                ? { duration: 0 }
                : {
                    type: 'tween',
                    ease: 'easeOut',
                    duration: 0.6, // Slower animation (was 0.3)
                  },
            }}
            exit={{
              x: '100%',
              transition: { duration: 0.6, ease: 'easeInOut' }, // Slower exit too
            }}
            onAnimationComplete={() => {
              // Reset the flag once animation is complete
              if (wasOpenBehindPage) {
                setWasOpenBehindPage(false);
              }
            }}
            style={getMenuStyles()}
          >
            {/* Menu items - back to original layout */}
            {menuItems.map((item, index) => (
              <motion.button
                key={item.key}
                initial={
                  shouldAnimate ? { opacity: 1, x: 20 } : { opacity: 1, x: 0 } // Original animation
                }
                animate={{ opacity: 1, x: 0 }}
                transition={
                  shouldAnimate
                    ? {
                        delay: index * 0.1,
                        duration: 0.3,
                        ease: 'easeOut',
                      }
                    : { duration: 0 }
                }
                onMouseEnter={() => setHoveredMenuItem(item.key)}
                onMouseLeave={() => setHoveredMenuItem(null)}
                onClick={() => handleNavigation(item.key)}
                style={getMenuItemStyles(
                  hoveredMenuItem === item.key,
                  item.key
                )}
                className='touch-target'
              >
                {item.name}
              </motion.button>
            ))}

            {/* Connect section - improved positioning for iPhone portrait */}
            <motion.div
              initial={
                shouldAnimate ? { opacity: 1, y: 20 } : { opacity: 1, y: 0 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={
                shouldAnimate
                  ? {
                      delay: menuItems.length * 0.1 + 0.2,
                      duration: 0.3,
                      ease: 'easeOut',
                    }
                  : { duration: 0 }
              }
              style={{
                position: 'absolute',
                bottom: deviceInfo?.isLandscapeMobile
                  ? 'max(env(safe-area-inset-bottom), 20px)' // Higher for landscape mobile
                  : deviceInfo?.isMobile
                  ? deviceInfo?.orientation === 'portrait'
                    ? 'max(env(safe-area-inset-bottom), 40px)' // Increased for iPhone portrait
                    : deviceInfo?.orientation === 'landscape'
                    ? 'max(env(safe-area-inset-bottom), 12px)' // Reduced from 15px
                    : 'max(env(safe-area-inset-bottom), 30px)'
                  : '50px',
                left: deviceInfo?.isLandscapeMobile
                  ? '20px' // Align with tighter menu padding
                  : deviceInfo?.isMobile
                  ? '30px'
                  : '40px', // Align with menu padding
                right: deviceInfo?.isLandscapeMobile
                  ? '16px' // Align with tighter menu padding
                  : deviceInfo?.isMobile
                  ? '20px'
                  : 'auto',
                width: deviceInfo?.isLandscapeMobile
                  ? 'calc(100% - 36px)' // Account for tighter padding
                  : deviceInfo?.isMobile
                  ? 'calc(100% - 50px)'
                  : 'auto', // Account for new left padding
                zIndex: 100,
                maxWidth: deviceInfo?.isLandscapeMobile
                  ? '140px' // Compact for landscape mobile
                  : deviceInfo?.isMobile
                  ? deviceInfo?.orientation === 'landscape'
                    ? '120px' // Further reduced from 160px for landscape
                    : '220px'
                  : 'auto', // Prevent button from being too wide
              }}
            >
              <button
                onClick={() => handleNavigation('connect')}
                onMouseEnter={() => setConnectHovered(true)}
                onMouseLeave={() => setConnectHovered(false)}
                style={{
                  position: 'relative',
                  padding: deviceInfo?.isLandscapeMobile
                    ? '4px 8px' // Compact padding for landscape mobile
                    : deviceInfo?.isMobile
                    ? deviceInfo?.orientation === 'landscape'
                      ? '3px 6px' // Further reduced from 4px 8px
                      : '10px 18px'
                    : '12px 20px',
                  cursor: 'pointer',
                  fontSize: deviceInfo?.isLandscapeMobile
                    ? '0.7rem' // Compact for landscape mobile
                    : deviceInfo?.isMobile
                    ? deviceInfo?.orientation === 'landscape'
                      ? '0.55rem' // Further reduced from 0.65rem
                      : '0.9rem'
                    : '1rem',
                  fontWeight: '900',
                  fontFamily: 'Lato, sans-serif',
                  letterSpacing: '0.02em',
                  color: isDarkMode ? '#162542' : '#084CA6',
                  textAlign: 'center' as const,
                  borderRadius: '6px', // Reduced from 8px for more compact look
                  border: 'none',
                  background: '#FAF1E6',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(250, 241, 230, 0.25)', // Reduced shadow
                  minHeight: deviceInfo?.isLandscapeMobile
                    ? '32px' // Good size for landscape mobile touch targets
                    : deviceInfo?.isMobile
                    ? deviceInfo?.orientation === 'landscape'
                      ? '24px' // Further reduced from 28px
                      : '44px'
                    : '44px',
                  minWidth: deviceInfo?.isLandscapeMobile
                    ? '32px' // Good size for landscape mobile touch targets
                    : deviceInfo?.isMobile
                    ? deviceInfo?.orientation === 'landscape'
                      ? '24px' // Further reduced from 28px
                      : '44px'
                    : '44px',
                }}
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
                  {deviceInfo?.isLandscapeMobile
                    ? 'Connect!'
                    : deviceInfo?.isMobile &&
                      deviceInfo?.orientation === 'landscape'
                    ? 'Connect!'
                    : "Let's Connect!"}
                </span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
