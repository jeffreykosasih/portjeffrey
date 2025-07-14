import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ProfileCard from './ProfileCard';
import LongStoryPage from './LongStoryPage';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  isLowPerformance: boolean;
  screenWidth: number;
  screenHeight: number;
  devicePixelRatio: number;
  orientation: 'portrait' | 'landscape';
  isRetinaDisplay: boolean;
  supportsWebGL: boolean;
}

interface ProfilePageProps {
  isVisible: boolean;
  onClose: () => void;
  onOpenBurgerMenu: () => void;
  onNavigate?: (page: 'connect') => void;
  isDarkMode: boolean;
  shouldAnimateText?: boolean;
  deviceInfo?: DeviceInfo;
  onPlayClickSound?: () => void;
}

export default function ProfilePage({
  isVisible,
  onClose,
  onOpenBurgerMenu,
  onNavigate,
  isDarkMode,
  shouldAnimateText = true,
  deviceInfo,
  onPlayClickSound,
}: ProfilePageProps) {
  const [isButtonHovered, setIsButtonHovered] = React.useState(false);
  const [showLongStory, setShowLongStory] = React.useState(false);

  // Responsive styles based on device type
  const getContainerStyles = () => {
    const baseStyles = {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: isDarkMode ? '#0f172a' : '#00bbdc',
      zIndex: 1500,
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      color: '#ffffff',
      padding: '40px 20px',
      overflowY: 'auto' as const,
    };

    // Enhanced mobile-specific styling with orientation awareness
    if (deviceInfo?.isMobile) {
      if (deviceInfo.orientation === 'landscape') {
        return {
          ...baseStyles,
          padding:
            'max(env(safe-area-inset-top), 10px) 20px max(env(safe-area-inset-bottom), 10px) 20px',
          justifyContent: 'flex-start', // Better layout for landscape
          height: '100dvh', // Use dynamic viewport height
        };
      } else {
        // Portrait mobile
        return {
          ...baseStyles,
          padding:
            'max(env(safe-area-inset-top), 30px) 16px max(env(safe-area-inset-bottom), 20px) 16px', // Increased top padding
          height: '100dvh', // Use dynamic viewport height
        };
      }
    }

    return baseStyles;
  };

  const getContentStyles = () => {
    const baseStyles = {
      maxWidth: '1200px',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
    };

    if (deviceInfo?.isMobile) {
      if (deviceInfo.orientation === 'landscape') {
        // Landscape mobile - horizontal layout with smaller components
        return {
          ...baseStyles,
          flexDirection: 'row' as const,
          gap: '20px',
          alignItems: 'center',
          height: 'fit-content',
          maxHeight: '90vh',
        };
      } else {
        // Portrait mobile - vertical layout
        return {
          ...baseStyles,
          flexDirection: 'column' as const,
          gap: '24px',
          alignItems: 'center',
        };
      }
    } else if (deviceInfo?.isTablet) {
      return {
        ...baseStyles,
        flexDirection: 'column' as const,
        gap: '48px',
        alignItems: 'center',
      };
    } else {
      return {
        ...baseStyles,
        flexDirection: 'row' as const,
        gap: '64px',
      };
    }
  };

  const getTextContainerStyles = () => {
    const baseStyles = {
      fontSize: '1.5rem',
      lineHeight: '1.8',
      fontFamily: 'Lato, sans-serif',
      fontWeight: '300',
      color: 'rgba(255, 255, 255, 0.9)',
      textAlign: 'left' as const,
    };

    if (deviceInfo?.isMobile) {
      if (deviceInfo.orientation === 'landscape') {
        // Landscape mobile - ultra compact text for minimal height
        return {
          ...baseStyles,
          flex: 1,
          fontSize: '0.75rem', // Reduced from 0.85rem
          lineHeight: '1.3', // Reduced from 1.4
          paddingRight: '12px', // Reduced from 16px
          textAlign: 'left' as const,
          maxWidth: '50%',
        };
      } else {
        // Portrait mobile - larger text, centered (reduced size)
        return {
          ...baseStyles,
          flex: 'none',
          minWidth: 'auto',
          fontSize: '1.0rem', // Reduced from 1.1rem
          lineHeight: '1.6',
          paddingRight: '0px',
          textAlign: 'center' as const,
          maxWidth: '100%',
        };
      }
    } else if (deviceInfo?.isTablet) {
      return {
        ...baseStyles,
        flex: 'none',
        minWidth: 'auto',
        fontSize: '1.3rem',
        lineHeight: '1.7',
        paddingRight: '0px',
        textAlign: 'center' as const,
      };
    } else {
      return {
        ...baseStyles,
        flex: 1,
        minWidth: '320px',
        paddingRight: '32px',
      };
    }
  };

  const getTitleStyles = () => {
    const baseStyles = {
      fontWeight: '700',
      fontFamily: 'Lato, sans-serif',
      marginBottom: '30px',
      background: 'linear-gradient(45deg, #ffffff, #e2e8f0)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
      letterSpacing: '-0.02em',
    };

    if (deviceInfo?.isMobile) {
      if (deviceInfo.orientation === 'landscape') {
        // Landscape mobile - much smaller title and spacing
        return {
          ...baseStyles,
          fontSize: '1.4rem', // Reduced from 1.8rem
          marginBottom: '6px', // Reduced from 12px
          lineHeight: '1.1', // Tighter line height
        };
      } else {
        // Portrait mobile
        return {
          ...baseStyles,
          fontSize: '1.8rem', // Reduced from 2.2rem
          marginBottom: '20px', // Increased from 16px
          marginTop: '20px', // Added top margin to push down
          lineHeight: '1.2',
        };
      }
    } else if (deviceInfo?.isTablet) {
      return {
        ...baseStyles,
        fontSize: '3rem',
        marginBottom: '25px',
      };
    } else {
      return {
        ...baseStyles,
        fontSize: '4rem',
      };
    }
  };

  const getProfileCardStyles = () => {
    if (deviceInfo?.isMobile) {
      if (deviceInfo.orientation === 'landscape') {
        // Landscape mobile - much smaller card for minimal height usage
        return {
          flex: 'none',
          minWidth: '160px', // Reduced from 200px
          maxWidth: '180px', // Reduced from 240px
          display: 'flex',
          justifyContent: 'center',
          width: '180px', // Reduced from 240px
        };
      } else {
        // Portrait mobile - responsive width (reduced size)
        return {
          flex: 'none',
          minWidth: '240px', // Reduced from 280px
          maxWidth: 'min(300px, 80vw)', // Reduced from 350px and 85vw
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
        };
      }
    } else if (deviceInfo?.isTablet) {
      return {
        flex: 'none',
        minWidth: '350px',
        maxWidth: '400px',
        display: 'flex',
        justifyContent: 'center',
      };
    } else {
      return {
        flex: '0 0 400px',
        minWidth: '380px',
        maxWidth: '420px',
        display: 'flex',
        justifyContent: 'center',
      };
    }
  };

  // Using inline styles to match Portfolio and Connect pages exactly
  const getBackButtonStyles = () => ({
    borderRadius: '50%',
    position: 'absolute' as const,
    top: deviceInfo?.isMobile
      ? deviceInfo?.orientation === 'landscape'
        ? 'max(env(safe-area-inset-top), 8px)'
        : 'max(env(safe-area-inset-top), 16px)'
      : '20px',
    right: deviceInfo?.isMobile
      ? deviceInfo?.orientation === 'landscape'
        ? '12px'
        : '16px'
      : '20px',
    zIndex: 1001,
    width: deviceInfo?.isMobile
      ? deviceInfo?.orientation === 'landscape'
        ? '40px'
        : '48px'
      : '50px',
    height: deviceInfo?.isMobile
      ? deviceInfo?.orientation === 'landscape'
        ? '40px'
        : '48px'
      : '50px',
    border: 'none',
    backgroundColor: isDarkMode ? '#131D4F' : '#00bbdc',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  });

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={getContainerStyles()}
          >
            {/* Back button with slide left to right effect */}
            <motion.button
              onClick={() => {
                onPlayClickSound?.(); // Play click sound
                onClose(); // Close current page
                onOpenBurgerMenu(); // Open burger menu
              }}
              initial={{ x: 20 }}
              animate={{ x: 0 }}
              whileHover={{ x: -5 }}
              transition={{ duration: 0.3 }}
              style={getBackButtonStyles()}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                style={{
                  color: '#ffffff',
                  fontSize: '20px',
                }}
              />
            </motion.button>

            {/* Profile Content with fade in */}
            <motion.div
              initial={
                shouldAnimateText ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={
                shouldAnimateText
                  ? { duration: 0.8, delay: 0.2 }
                  : { duration: 0 }
              }
              style={getContentStyles()}
            >
              {/* About Me Description */}
              <motion.div
                initial={
                  shouldAnimateText
                    ? { opacity: 0, x: deviceInfo?.isMobile ? 0 : -50 }
                    : { opacity: 1, x: 0 }
                }
                animate={{ opacity: 1, x: 0 }}
                transition={
                  shouldAnimateText
                    ? { duration: 0.6, delay: 0.4 }
                    : { duration: 0 }
                }
                style={getTextContainerStyles()}
              >
                <h1 style={getTitleStyles()}>About Me 👋</h1>
                <p style={{ marginBottom: '20px' }}>
                  Hello everyone, my name is Jeffrey. I'm a developer on its
                  way!
                </p>
                <p style={{ marginBottom: '20px' }}>
                  I specialize in modern web technologies particulary in
                  front-end related while also learning back-end as well.
                </p>
                <p style={{ marginBottom: '15px' }}>
                  Most of projects I've worked on is learning via internet so
                  that's a heads up.
                </p>
                <motion.button
                  onClick={() => setShowLongStory(true)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: 'inherit',
                    fontFamily: 'inherit',
                    fontWeight: '900',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    padding: '0',
                    margin: '0',
                  }}
                >
                  for more...
                </motion.button>
              </motion.div>

              {/* Profile Card */}
              <motion.div
                initial={
                  shouldAnimateText
                    ? { opacity: 0, x: deviceInfo?.isMobile ? 0 : 50 }
                    : { opacity: 1, x: 0 }
                }
                animate={{ opacity: 1, x: 0 }}
                transition={
                  shouldAnimateText
                    ? { duration: 0.6, delay: 0.6 }
                    : { duration: 0 }
                }
                style={getProfileCardStyles()}
              >
                <ProfileCard
                  isDarkMode={isDarkMode}
                  contactText='Contact Me'
                  onNavigate={onNavigate}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Long Story Page */}
      <LongStoryPage
        isVisible={showLongStory}
        onClose={() => setShowLongStory(false)}
        isDarkMode={isDarkMode}
        shouldAnimateText={shouldAnimateText}
        deviceInfo={deviceInfo}
      />
    </>
  );
}
