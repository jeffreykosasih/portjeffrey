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
  isLandscapeMobile: boolean;
}

interface ProfilePageProps {
  isVisible: boolean;
  onClose: () => void;
  onOpenBurgerMenu: (slideDirection?: 'left' | 'right') => void;
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

  // Responsive styles based on device type with landscape mobile support
  const getContainerStyles = () => {
    const baseStyles = {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: isDarkMode
        ? 'rgba(22, 37, 66, 0.4)'
        : 'rgba(0, 97, 97, 0.4)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      opacity: 1,
      zIndex: 1500,
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      color: '#ffffff',
      padding: '40px 20px',
      overflowY: 'auto' as const,
    };

    // Enhanced with landscape mobile support
    if (deviceInfo?.isLandscapeMobile) {
      // Landscape mobile - desktop-like layout with scaled components
      return {
        ...baseStyles,
        padding:
          'max(env(safe-area-inset-top), 8px) 16px max(env(safe-area-inset-bottom), 8px) 16px',
        justifyContent: 'center', // Center content for desktop-like experience
        height: '100dvh',
      };
    } else if (deviceInfo?.isMobile) {
      if (deviceInfo.orientation === 'landscape') {
        // Regular mobile landscape - legacy support
        return {
          ...baseStyles,
          padding:
            'max(env(safe-area-inset-top), 10px) 20px max(env(safe-area-inset-bottom), 10px) 20px',
          justifyContent: 'flex-start',
          height: '100dvh',
        };
      } else {
        // Portrait mobile
        return {
          ...baseStyles,
          padding:
            'max(env(safe-area-inset-top), 30px) 16px max(env(safe-area-inset-bottom), 20px) 16px',
          height: '100dvh',
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

    if (deviceInfo?.isLandscapeMobile) {
      // Landscape mobile - desktop-like horizontal layout with better spacing
      return {
        ...baseStyles,
        flexDirection: 'row' as const,
        gap: '40px', // More generous spacing like desktop
        alignItems: 'center',
        height: 'fit-content',
        maxHeight: '90vh', // More room for content
      };
    } else if (deviceInfo?.isMobile) {
      if (deviceInfo.orientation === 'landscape') {
        // Regular mobile landscape - legacy support
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

    if (deviceInfo?.isLandscapeMobile) {
      // Landscape mobile - desktop-like layout with larger, more readable text
      return {
        ...baseStyles,
        flex: 1,
        fontSize: '1.2rem', // Larger, more desktop-like text
        lineHeight: '1.6',
        paddingRight: '30px',
        textAlign: 'left' as const,
        maxWidth: '65%', // Better text-to-card ratio
      };
    } else if (deviceInfo?.isMobile) {
      if (deviceInfo.orientation === 'landscape') {
        // Regular mobile landscape - legacy support with ultra compact text
        return {
          ...baseStyles,
          flex: 1,
          fontSize: '0.75rem',
          lineHeight: '1.3',
          paddingRight: '12px',
          textAlign: 'left' as const,
          maxWidth: '50%',
        };
      } else {
        // Portrait mobile - larger text, centered
        return {
          ...baseStyles,
          flex: 'none',
          minWidth: 'auto',
          fontSize: '1.0rem',
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
      fontWeight: '900',
      fontFamily: 'Lato, sans-serif',
      marginBottom: '30px',
      background: 'linear-gradient(45deg, #ffffff, #e2e8f0)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
      letterSpacing: '-0.02em',
    };

    if (deviceInfo?.isLandscapeMobile) {
      // Landscape mobile - desktop-like title size but appropriately scaled
      return {
        ...baseStyles,
        fontSize: '2.2rem', // Much larger, more desktop-like
        marginBottom: '20px', // Better spacing
        lineHeight: '1.2',
      };
    } else if (deviceInfo?.isMobile) {
      if (deviceInfo.orientation === 'landscape') {
        // Regular mobile landscape - much smaller title and spacing
        return {
          ...baseStyles,
          fontSize: '1.4rem',
          marginBottom: '6px',
          lineHeight: '1.1',
        };
      } else {
        // Portrait mobile
        return {
          ...baseStyles,
          fontSize: '1.8rem',
          marginBottom: '20px',
          marginTop: '20px',
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
    if (deviceInfo?.isLandscapeMobile) {
      // Landscape mobile - larger, more desktop-like card sizing
      return {
        flex: 'none',
        minWidth: '240px', // Larger size for better desktop-like experience
        maxWidth: '280px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      };
    } else if (deviceInfo?.isMobile) {
      if (deviceInfo.orientation === 'landscape') {
        // Regular mobile landscape - much smaller card for minimal height usage
        return {
          flex: 'none',
          minWidth: '160px',
          maxWidth: '180px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        };
      } else {
        // Portrait mobile - centered card
        return {
          flex: 'none',
          minWidth: 'auto',
          maxWidth: '300px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        };
      }
    } else if (deviceInfo?.isTablet) {
      return {
        flex: 'none',
        minWidth: 'auto',
        maxWidth: '400px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      };
    } else {
      return {
        flex: 'none',
        minWidth: '300px',
        maxWidth: '400px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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
    backgroundColor: isDarkMode ? '#162542' : '#005E80',
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
          <div style={getContainerStyles()}>
            {/* Back button with slide left to right effect */}
            <motion.button
              onClick={() => {
                onPlayClickSound?.(); // Play click sound
                onClose(); // Close current page
                onOpenBurgerMenu('right'); // Open burger menu sliding from right corner
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
              exit={{ opacity: 0 }}
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
                  Hi, I’m Jeffrey. I build websites that look fascinating with a
                  mixture of creativity and impact.
                </p>
                <p style={{ marginBottom: '20px' }}>
                  I focus on front-end development but am steadily growing into
                  full-stack work. I'm self-taught, driven by curiosity, and
                  always up for a challenge.
                </p>
                <p style={{ marginBottom: '15px' }}>
                  Let’s build something cool.
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
                    cursor: 'pointer',
                    padding: '0',
                    margin: '0',
                  }}
                >
                  read more...
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
          </div>
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
