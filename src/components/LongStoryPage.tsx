import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

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

interface LongStoryPageProps {
  isVisible: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  shouldAnimateText?: boolean;
  deviceInfo?: DeviceInfo;
}

export default function LongStoryPage({
  isVisible,
  onClose,
  isDarkMode,
  shouldAnimateText = true,
  deviceInfo,
}: LongStoryPageProps) {
  const [isButtonHovered, setIsButtonHovered] = React.useState(false);

  // Responsive styles based on device type (same as ProfilePage)
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
    };

    if (deviceInfo?.isMobile) {
      return {
        ...baseStyles,
        padding: '20px 16px',
      };
    } else if (deviceInfo?.isTablet) {
      return {
        ...baseStyles,
        padding: '30px 24px',
      };
    } else {
      return {
        ...baseStyles,
        padding: '40px',
      };
    }
  };

  const getContentStyles = () => {
    const baseStyles = {
      maxWidth: '800px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
    };

    return baseStyles;
  };

  const getTextContainerStyles = () => {
    const baseStyles = {
      fontSize: '1.5rem',
      lineHeight: '1.8',
      fontFamily: 'Lato, sans-serif',
      fontWeight: '300',
      color: 'rgba(255, 255, 255, 0.9)',
      textAlign: 'center' as const,
    };

    if (deviceInfo?.isMobile) {
      return {
        ...baseStyles,
        fontSize: '1.1rem',
        lineHeight: '1.6',
      };
    } else if (deviceInfo?.isTablet) {
      return {
        ...baseStyles,
        fontSize: '1.3rem',
        lineHeight: '1.7',
      };
    } else {
      return baseStyles;
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
      return {
        ...baseStyles,
        fontSize: '2.5rem',
        marginBottom: '20px',
      };
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

  const getBackButtonStyles = () => {
    const baseStyles = {
      borderRadius: '50%',
      position: 'absolute' as const,
      zIndex: 1001,
      width: '50px',
      height: '50px',
      border: 'none',
      backgroundColor: isDarkMode ? '#131D4F' : '#00bbdc',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
    };

    if (deviceInfo?.isMobile) {
      return {
        ...baseStyles,
        top: '16px',
        right: '16px',
        width: '48px',
        height: '48px',
      };
    } else {
      return {
        ...baseStyles,
        top: '20px',
        right: '20px',
      };
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={getContainerStyles()}
        >
          {/* Back button */}
          <motion.button
            onClick={onClose}
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
                fontSize: deviceInfo?.isMobile ? '18px' : '20px',
              }}
            />
          </motion.button>

          {/* Long Story Content */}
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
            <motion.div
              initial={
                shouldAnimateText ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={
                shouldAnimateText
                  ? { duration: 0.6, delay: 0.4 }
                  : { duration: 0 }
              }
              style={getTextContainerStyles()}
            >
              <h1 style={getTitleStyles()}>Long Story 📖</h1>
              <p style={{ marginBottom: '20px' }}>
                I was born in Indonesia, got a bachelor of computer science and
                now pursuing MIT degree in Melbourne. Had experience from lots
                of related field like being part of Apple Developer academy
                where I learn business, UI/UX design and coding in general. Then
                work as product owner at bank, becoming free lance making sites,
                also joining a bootcamp program. Now, I'm looking for developer
                jobs or design if possible so if you're interested, let's reach
                out!
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
