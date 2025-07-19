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
  <div
    style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}
  >
    {' '}
    {/* Using CSS custom property */}
    <div
      style={{
        width: '1.125rem', // Converted from 18px to rem
        height: '2px', // Keep 2px for precision
        backgroundColor: color,
        borderRadius: 'var(--space-xs)', // Using CSS custom property for small border radius
      }}
    ></div>
    <div
      style={{
        width: '1.125rem', // Converted from 18px to rem
        height: '2px', // Keep 2px for precision
        backgroundColor: color,
        borderRadius: 'var(--space-xs)', // Using CSS custom property for small border radius
      }}
    ></div>
    <div
      style={{
        width: '1.125rem', // Converted from 18px to rem
        height: '2px', // Keep 2px for precision
        backgroundColor: color,
        borderRadius: 'var(--space-xs)', // Using CSS custom property for small border radius
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
    style={{
      position: 'relative',
      width: `${size / 16}rem`,
      height: `${size / 16}rem`,
    }} // Convert px to rem
  >
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: `${size / 16}rem`, // Convert px to rem
        height: '2px', // Keep 2px for precision
        backgroundColor: color,
        borderRadius: 'var(--space-xs)', // Using CSS custom property for small border radius
        transform: 'translate(-50%, -50%) rotate(45deg)',
      }}
    ></div>
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: `${size / 16}rem`, // Convert px to rem
        height: '2px', // Keep 2px for precision
        backgroundColor: color,
        borderRadius: 'var(--space-xs)', // Using CSS custom property for small border radius
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
        // First ensure menu is closed, then reopen with proper animation
        setMenuIsOpen(false);
        // Use a small delay to ensure the menu state resets before reopening
        setTimeout(() => {
          setMenuIsOpen(true);
          if (onHideThemeToggle) {
            onHideThemeToggle(true);
          }
        }, 50); // Small delay to trigger proper animation
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
    color: isDarkMode ? '#162542' : '#005E80',
  };

  // Icon configuration using utilities
  const iconColor = getIconColor(isDarkMode, isHovered);
  const iconSizes = {
    burger: {
      width: getResponsiveValue(deviceInfo, {
        mobile: 'var(--text-base)', // Using CSS custom property
        tablet: 'calc(var(--text-base) + 0.0625rem)', // Using CSS custom property with calc
        desktop: 'var(--text-lg)', // Using CSS custom property
      }),
      height: '2px', // Keep 2px for precision
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
      baseWidth = '13.75rem'; // Converted from 220px to rem
    } else if (deviceInfo?.isMobile) {
      baseWidth = '17.5rem'; // Converted from 280px to rem
    } else if (deviceInfo?.isTablet) {
      baseWidth = '18.75rem'; // Converted from 300px to rem
    } else {
      baseWidth = '25vw';
    }

    return {
      position: 'fixed' as const,
      top: 0,
      right: 0,
      width: baseWidth,
      height: '100dvh', // Use dynamic viewport height for better mobile support
      backgroundColor: isDarkMode ? '#162542' : '#005E80',
      backdropFilter: 'blur(0.625rem)', // Converted from 10px to rem
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      gap: deviceInfo?.isLandscapeMobile
        ? 'var(--space-xs)' // Using CSS custom property for tighter spacing
        : deviceInfo?.isMobile
        ? 'calc(var(--space-base) - 0.0625rem)' // Using CSS custom property with calc
        : 'var(--space-lg)', // Using CSS custom property
      paddingTop: deviceInfo?.isLandscapeMobile
        ? 'var(--space-5xl)' // Using CSS custom property (smaller top padding)
        : deviceInfo?.isMobile
        ? 'var(--space-6xl)' // Using CSS custom property
        : '7.5rem', // Converted from 120px to rem
      paddingBottom: deviceInfo?.isLandscapeMobile
        ? 'calc(var(--space-xl) + 0.375rem)' // Using CSS custom property with calc
        : deviceInfo?.isMobile
        ? deviceInfo?.orientation === 'portrait'
          ? '7.5rem' // Converted from 120px to rem (more bottom padding on portrait)
          : 'var(--space-6xl)' // Using CSS custom property
        : 'var(--space-3xl)', // Using CSS custom property
      paddingLeft: deviceInfo?.isLandscapeMobile
        ? 'var(--space-lg)' // Using CSS custom property (tighter left padding)
        : deviceInfo?.isMobile
        ? 'calc(var(--space-xl) + 0.375rem)' // Using CSS custom property with calc
        : 'var(--space-3xl)', // Using CSS custom property
      paddingRight: deviceInfo?.isLandscapeMobile
        ? 'var(--space-base)' // Using CSS custom property (tighter right padding)
        : deviceInfo?.isMobile
        ? 'var(--space-lg)' // Using CSS custom property
        : 'calc(var(--space-xl) + 0.375rem)', // Using CSS custom property with calc
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
      maxWidth: '56.25rem', // Converted from 900px to rem
      letterSpacing: '-0.02em',
      transform: shouldHighlight ? 'scale(1.05)' : 'scale(1)',
      padding: deviceInfo?.isLandscapeMobile
        ? '0.125rem 0'
        : 'var(--space-sm) 0', // Using CSS custom properties
    };

    // Enhanced responsive font sizes with landscape mobile support
    if (deviceInfo?.isLandscapeMobile) {
      return {
        ...baseStyles,
        fontSize: 'var(--text-sm)', // Using CSS custom property (much smaller)
      };
    } else if (deviceInfo?.isMobile) {
      return {
        ...baseStyles,
        fontSize: 'var(--text-2xl)', // Using CSS custom property (smaller for mobile)
      };
    } else if (deviceInfo?.isTablet) {
      return {
        ...baseStyles,
        fontSize: 'calc(var(--text-2xl) + 0.2rem)', // Using CSS custom property with calc
      };
    } else {
      return {
        ...baseStyles,
        fontSize: 'var(--text-3xl)', // Using CSS custom property (original size)
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-xs)',
      }}
    >
      {' '}
      {/* Using CSS custom property */}
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          style={{
            width: iconSizes.burger.width,
            height: iconSizes.burger.height,
            backgroundColor: color,
            borderRadius: 'var(--space-xs)', // Using CSS custom property
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
              opacity: 0,
            }}
            animate={{
              x: '30%', // Back to original positioning
              opacity: 1,
              transition: !shouldAnimate
                ? { duration: 0 }
                : {
                    type: 'tween',
                    ease: 'easeOut',
                    duration: 0.5, // Slower animation (was 0.3)
                  },
            }}
            exit={{
              x: '100%',
              opacity: 0,
              transition: { duration: 0.5, ease: 'easeInOut' }, // Slower exit too
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
                  ? 'max(env(safe-area-inset-bottom), var(--space-lg))' // Using CSS custom property
                  : deviceInfo?.isMobile
                  ? deviceInfo?.orientation === 'portrait'
                    ? 'max(env(safe-area-inset-bottom), var(--space-3xl))' // Using CSS custom property
                    : deviceInfo?.orientation === 'landscape'
                    ? 'max(env(safe-area-inset-bottom), var(--space-md))' // Using CSS custom property
                    : 'max(env(safe-area-inset-bottom), calc(var(--space-xl) + 0.375rem))' // Using CSS custom property with calc
                  : 'var(--space-4xl)', // Using CSS custom property (converted from 50px)
                left: deviceInfo?.isLandscapeMobile
                  ? 'var(--space-lg)' // Using CSS custom property (align with tighter menu padding)
                  : deviceInfo?.isMobile
                  ? 'calc(var(--space-xl) + 0.375rem)' // Using CSS custom property with calc
                  : 'var(--space-3xl)', // Using CSS custom property (align with menu padding)
                right: deviceInfo?.isLandscapeMobile
                  ? 'var(--space-base)' // Using CSS custom property (align with tighter menu padding)
                  : deviceInfo?.isMobile
                  ? 'var(--space-lg)' // Using CSS custom property
                  : 'auto',
                width: deviceInfo?.isLandscapeMobile
                  ? 'calc(100% - var(--space-2xl) - var(--space-xs))' // Using CSS custom properties (account for tighter padding)
                  : deviceInfo?.isMobile
                  ? 'calc(100% - var(--space-4xl) + 0.125rem)' // Using CSS custom properties
                  : 'auto', // Account for new left padding
                zIndex: 100,
                maxWidth: deviceInfo?.isLandscapeMobile
                  ? '8.75rem' // Converted from 140px to rem (compact for landscape mobile)
                  : deviceInfo?.isMobile
                  ? deviceInfo?.orientation === 'landscape'
                    ? '7.5rem' // Converted from 120px to rem
                    : '13.75rem' // Converted from 220px to rem
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
                    ? 'var(--space-xs) var(--space-sm)' // Using CSS custom properties (compact padding)
                    : deviceInfo?.isMobile
                    ? deviceInfo?.orientation === 'landscape'
                      ? 'calc(var(--space-xs) - 0.0625rem) calc(var(--space-sm) - 0.125rem)' // Using CSS custom properties with calc
                      : 'calc(var(--space-sm) + 0.125rem) calc(var(--space-lg) - 0.125rem)' // Using CSS custom properties with calc
                    : 'var(--space-md) var(--space-lg)', // Using CSS custom properties
                  cursor: 'pointer',
                  fontSize: deviceInfo?.isLandscapeMobile
                    ? 'calc(var(--text-xs) + 0.05rem)' // Using CSS custom property with calc (compact)
                    : deviceInfo?.isMobile
                    ? deviceInfo?.orientation === 'landscape'
                      ? 'calc(var(--text-xs) - 0.125rem)' // Using CSS custom property with calc
                      : 'var(--text-sm)' // Using CSS custom property
                    : 'var(--text-base)', // Using CSS custom property
                  fontWeight: '900',
                  fontFamily: 'Lato, sans-serif',
                  letterSpacing: '0.02em',
                  color: isDarkMode ? '#162542' : '#005E80',
                  textAlign: 'center' as const,
                  borderRadius: 'calc(var(--radius-sm) + 0.0625rem)', // Using CSS custom property with calc (reduced for compact look)
                  border: 'none',
                  background: '#FAF1E6',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0.125rem 0.5rem rgba(250, 241, 230, 0.25)', // Converted to rem (reduced shadow)
                  minHeight: deviceInfo?.isLandscapeMobile
                    ? 'var(--space-2xl)' // Using CSS custom property (good size for landscape mobile touch targets)
                    : deviceInfo?.isMobile
                    ? deviceInfo?.orientation === 'landscape'
                      ? 'var(--space-xl)' // Using CSS custom property
                      : 'var(--touch-target-sm)' // Using CSS custom property
                    : 'var(--touch-target-sm)', // Using CSS custom property
                  minWidth: deviceInfo?.isLandscapeMobile
                    ? 'var(--space-2xl)' // Using CSS custom property (good size for landscape mobile touch targets)
                    : deviceInfo?.isMobile
                    ? deviceInfo?.orientation === 'landscape'
                      ? 'var(--space-xl)' // Using CSS custom property
                      : 'var(--touch-target-sm)' // Using CSS custom property
                    : 'var(--touch-target-sm)', // Using CSS custom property
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
