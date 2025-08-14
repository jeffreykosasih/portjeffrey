import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DeviceInfo } from '../lib/types';

interface AppLoadingScreenProps {
  onLoadingComplete: () => void;
  onExploreClick: () => void;
  isDarkMode: boolean;
  deviceInfo?: DeviceInfo;
  onPlayClickSound?: () => void;
}

const DOTS_DURATION = 800; // 0.8 seconds (faster loading)
const TITLE_DELAY = 1500; // 1.5 seconds after dots fade out
const BUTTON_DELAY = 2000; // 2 seconds after title appears
const TRANSITION_DURATION = 1200; // 1.2 seconds for fade out/in

export default function AppLoadingScreen({
  onLoadingComplete,
  onExploreClick,
  isDarkMode,
  deviceInfo,
  onPlayClickSound,
}: AppLoadingScreenProps): React.JSX.Element {
  const [showTitle, setShowTitle] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Theme colors
  const colors = {
    background: isDarkMode ? '#162542' : '#005E80',
    text: isDarkMode ? '#e8e682' : '#ffffff',
    dots: isDarkMode ? '#e8e682' : '#ffffff',
    transition: isDarkMode ? '#000000' : '#ffffff',
  };

  // Animation sequence
  useEffect(() => {
    // Show title after dots finish
    const titleTimer = setTimeout(() => {
      setShowTitle(true);
    }, DOTS_DURATION + TITLE_DELAY);

    // Show button after title
    const buttonTimer = setTimeout(() => {
      setShowButton(true);
    }, DOTS_DURATION + TITLE_DELAY + BUTTON_DELAY);

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  // Background color effect
  useEffect(() => {
    document.body.style.backgroundColor = colors.background;
    document.documentElement.style.backgroundColor = colors.background;

    return () => {
      setTimeout(() => {
        document.body.style.backgroundColor = '';
        document.documentElement.style.backgroundColor = '';
      }, 1000);
    };
  }, [colors.background]);

  const handleExploreClick = () => {
    onPlayClickSound?.(); // Play click sound
    setIsTransitioning(true);

    // Start the transition sequence
    setTimeout(() => {
      onExploreClick();
      // onLoadingComplete(); // Removed duplicate call since both functions do the same thing
    }, TRANSITION_DURATION);
  };

  // Container styles
  const containerStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: colors.background,
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const contentStyles: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%',
    height: '100%',
  };

  // Responsive title styles based on device type
  const titleStyles: React.CSSProperties = React.useMemo(() => {
    const baseStyles: React.CSSProperties = {
      fontFamily: "'Lato', sans-serif",
      fontWeight: 800,
      letterSpacing: '-0.05em',
      lineHeight: 1.1,
      color: colors.text,
      textAlign: 'center',
    };

    // Device-specific font sizes
    if (deviceInfo?.isMobile) {
      return {
        ...baseStyles,
        fontSize: '2.5rem', // Mobile portrait
      };
    } else if (deviceInfo?.isLandscapeMobile) {
      return {
        ...baseStyles,
        fontSize: '2rem', // Mobile landscape - smaller due to limited height
      };
    } else if (deviceInfo?.isTablet) {
      return {
        ...baseStyles,
        fontSize: deviceInfo.orientation === 'landscape' ? '3.5rem' : '4rem', // Tablet responsive
      };
    } else {
      // Desktop and larger screens
      return {
        ...baseStyles,
        fontSize: '7rem', // Original desktop size
      };
    }
  }, [colors.text, deviceInfo]);

  // Responsive button styles based on device type
  const buttonStyles: React.CSSProperties = React.useMemo(() => {
    const baseStyles: React.CSSProperties = {
      fontFamily: "'Lato', sans-serif",
      lineHeight: 1.2,
      fontWeight: 600,
      borderRadius: 'var(--radius-full)',
      backgroundColor: isDarkMode ? colors.text : '#ffffff',
      color: isDarkMode ? '#162542' : '#005E80',
      border: 'none',
      boxShadow: isDarkMode
        ? '0 0.5rem 1.25rem rgba(232, 230, 130, 0.3)'
        : '0 0.5rem 1.25rem rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    };

    // Device-specific button sizing
    if (deviceInfo?.isMobile) {
      return {
        ...baseStyles,
        fontSize: 'var(--mobile-text-lg)',
        padding: 'var(--space-md) var(--space-xl)',
        minHeight: 'var(--touch-target-sm)',
      };
    } else if (deviceInfo?.isLandscapeMobile) {
      return {
        ...baseStyles,
        fontSize: 'var(--mobile-text-base)',
        padding: 'var(--space-sm) var(--space-lg)',
        minHeight: 'var(--touch-target-sm)',
      };
    } else if (deviceInfo?.isTablet) {
      return {
        ...baseStyles,
        fontSize: 'var(--text-lg)',
        padding: 'var(--space-lg) var(--space-2xl)',
        minHeight: 'var(--touch-target-md)',
      };
    } else {
      // Desktop and larger screens
      return {
        ...baseStyles,
        fontSize: 'var(--text-2xl)',
        padding: 'calc(var(--space-md) + 0.125rem) var(--space-2xl)',
        minHeight: 'var(--touch-target-lg)',
      };
    }
  }, [isDarkMode, colors.text, deviceInfo]);

  const handleButtonMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'translateY(-0.125rem)'; // Converted to rem
    e.currentTarget.style.backgroundColor = isDarkMode ? '#f0f0a0' : '#f0f0f0'; // Lighter yellow/gray on hover
  };

  const handleButtonMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.backgroundColor = isDarkMode
      ? colors.text
      : '#ffffff'; // Back to original colors
  };

  const handleButtonMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'translateY(0.0625rem)'; // Converted to rem
  };

  const handleButtonMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'translateY(-0.125rem)'; // Converted to rem
  };

  // Jumping dots animation variants
  const dotsContainer = {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit: {
      opacity: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  // Transition overlay variants
  const transitionOverlay = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeInOut' },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.6, ease: 'easeInOut' },
    },
  };

  return (
    <div style={containerStyles}>
      <div style={contentStyles}>
        {/* Main Content Area */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: deviceInfo?.isMobile
              ? 'var(--space-2xl)'
              : deviceInfo?.isLandscapeMobile
              ? 'var(--space-lg)'
              : deviceInfo?.isTablet
              ? 'var(--space-3xl)'
              : 'var(--space-4xl)', // Responsive gap based on device
            width: '100%',
            maxWidth: deviceInfo?.isMobile
              ? '90%'
              : deviceInfo?.isTablet
              ? '80%'
              : '100%', // Prevent overflow on small screens
          }}
        >
          {/* Dots or Title Area */}
          <div
            style={{
              height: deviceInfo?.isMobile
                ? '12rem'
                : deviceInfo?.isLandscapeMobile
                ? '8rem'
                : deviceInfo?.isTablet
                ? '15rem'
                : '17.5rem', // Responsive height based on device
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Jumping Dots Loading */}
            <AnimatePresence mode='wait'>
              {!showTitle && (
                <motion.div
                  key='dots'
                  variants={dotsContainer}
                  initial='initial'
                  animate='animate'
                  exit='exit'
                  style={{
                    display: 'flex',
                    gap:
                      deviceInfo?.isMobile || deviceInfo?.isLandscapeMobile
                        ? 'var(--space-sm)'
                        : 'var(--space-md)', // Responsive gap for dots
                  }}
                >
                  {[0, 1, 2].map((index) => (
                    <motion.div
                      key={index}
                      initial={{ y: 0 }}
                      animate={{
                        y: [0, -30, 0],
                      }}
                      style={{
                        width:
                          deviceInfo?.isMobile || deviceInfo?.isLandscapeMobile
                            ? 'var(--space-base)'
                            : 'var(--space-lg)', // Responsive dot size
                        height:
                          deviceInfo?.isMobile || deviceInfo?.isLandscapeMobile
                            ? 'var(--space-base)'
                            : 'var(--space-lg)', // Responsive dot size
                        borderRadius: '50%',
                        backgroundColor: colors.dots,
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut',
                        delay: index * 0.2,
                      }}
                    />
                  ))}
                </motion.div>
              )}

              {/* Title */}
              {showTitle && (
                <motion.div
                  key='title'
                  style={titleStyles}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 1.2,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    type: 'spring',
                    damping: 25,
                    stiffness: 80,
                  }}
                >
                  <div
                    style={{
                      marginBottom:
                        deviceInfo?.isMobile || deviceInfo?.isLandscapeMobile
                          ? 'var(--space-xs)'
                          : 'var(--space-sm)',
                    }}
                  >
                    Welcome to
                  </div>
                  <div>Port Jeffrey</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Button Area */}
          <div
            style={{
              height: deviceInfo?.isMobile
                ? 'var(--space-4xl)'
                : deviceInfo?.isLandscapeMobile
                ? 'var(--space-3xl)'
                : deviceInfo?.isTablet
                ? 'var(--space-5xl)'
                : 'var(--space-6xl)', // Responsive height based on device
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AnimatePresence>
              {showButton && !isTransitioning && (
                <motion.div
                  key='button'
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    y: -20,
                    transition: { duration: 0.4, ease: 'easeInOut' },
                  }}
                  transition={{
                    duration: 1.0,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    type: 'spring',
                    damping: 30,
                    stiffness: 90,
                  }}
                >
                  <button
                    onClick={handleExploreClick}
                    style={buttonStyles}
                    onMouseEnter={handleButtonMouseEnter}
                    onMouseLeave={handleButtonMouseLeave}
                    onMouseDown={handleButtonMouseDown}
                    onMouseUp={handleButtonMouseUp}
                  >
                    Let's explore
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key='transition'
            variants={transitionOverlay}
            initial='initial'
            animate='animate'
            exit='exit'
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: colors.transition,
              zIndex: 10000,
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
