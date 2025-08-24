import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ProfileCard from './ProfileCard';
import LongStoryPage from './LongStoryPage';
import { DeviceInfo } from '../lib/types';
import {
  getResponsiveValue,
  getSpacing,
  ResponsiveValues,
} from '../lib/responsiveUtils';

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
  const [showLongStory, setShowLongStory] = React.useState(false);

  // Unified device type detection
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

  // Responsive container styles
  const getContainerStyles = () => {
    const padding = getResponsiveValue(deviceInfo, {
      mobile: getSpacing(deviceInfo, 'medium'),
      landscapeMobile: getSpacing(deviceInfo, 'small'),
      tablet: getSpacing(deviceInfo, 'large'),
      desktop: getSpacing(deviceInfo, 'large'),
    });

    return {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      width: '100vw',
      height: '100dvh',
      backgroundColor: isDarkMode
        ? 'rgba(22, 37, 66, 0.4)'
        : 'rgba(0, 94, 128, 0.5)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      zIndex: ResponsiveValues.zIndex.overlay,
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent:
        deviceType === 'mobile-landscape' ? 'center' : 'flex-start',
      alignItems: 'center',
      color: '#ffffff',
      padding: `max(env(safe-area-inset-top), ${padding}) ${padding} max(env(safe-area-inset-bottom), ${padding}) ${padding}`,
      overflowY: 'auto' as const,
    };
  };

  // Responsive content styles
  const getContentStyles = () => {
    const isHorizontal =
      deviceType === 'mobile-landscape' || deviceType === 'desktop';

    const styles = {
      'mobile-landscape': {
        flexDirection: 'row' as const,
        gap: 'var(--space-4xl)', // 48px using CSS var
        alignItems: 'flex-start',
        height: 'fit-content',
        maxHeight: '90vh',
      },
      'mobile-portrait': {
        flexDirection: 'column' as const,
        gap: 'var(--space-2xl)', // 32px using CSS var
        alignItems: 'center',
      },
      tablet: {
        flexDirection: 'column' as const,
        gap: 'var(--space-4xl)', // 48px using CSS var
        alignItems: 'center',
      },
      desktop: {
        flexDirection: 'row' as const,
        gap: 'var(--space-5xl)', // 64px using CSS var
        alignItems: 'flex-start',
      },
    };

    return {
      maxWidth: '1200px',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      ...styles[deviceType],
    };
  };

  const getTextContainerStyles = () => {
    const configs = {
      'mobile-landscape': {
        flex: 1,
        fontSize: 'var(--text-xl)', // 20px - proper mobile landscape size
        lineHeight: '1.7',
        paddingRight: 'var(--space-xl)', // 24px using CSS var
        textAlign: 'left' as const,
        minWidth: '17.5rem', // 280px in rem
      },
      'mobile-portrait': {
        fontSize: 'var(--text-lg)', // 18px using CSS var
        lineHeight: '1.6',
        textAlign: 'center' as const,
        maxWidth: '85%',
      },
      tablet: {
        flex: 'none',
        fontSize: 'var(--text-2xl)', // 24px using CSS var
        lineHeight: '1.7',
        textAlign: 'center' as const,
      },
      desktop: {
        flex: 1,
        fontSize: 'var(--text-2xl)', // 24px using CSS var
        lineHeight: '1.8',
        paddingRight: 'var(--space-2xl)', // 32px using CSS var
        textAlign: 'left' as const,
        minWidth: '20rem', // 320px in rem
      },
    };

    return {
      fontFamily: 'Lato, sans-serif',
      fontWeight: '300',
      color: 'rgba(255, 255, 255, 0.9)',
      ...configs[deviceType],
    };
  };

  const getTitleStyles = () => {
    const configs = {
      'mobile-landscape': {
        fontSize: 'var(--text-5xl)', // 48px - proper mobile landscape display
        marginBottom: 'var(--space-xl)', // 24px using CSS var
        lineHeight: '1.1',
      },
      'mobile-portrait': {
        fontSize: 'var(--mobile-text-display)', // 40px - dedicated mobile display size
        marginBottom: 'var(--space-base)', // 16px using CSS var
        marginTop: 'var(--space-base)', // 16px using CSS var
        lineHeight: '1.2',
      },
      tablet: {
        fontSize: 'var(--tablet-text-display)', // 56px using CSS var
        marginBottom: 'var(--space-xl)', // 24px using CSS var
      },
      desktop: {
        fontSize: 'var(--text-6xl)', // 60px using CSS var
        marginBottom: 'var(--space-2xl)', // 32px using CSS var
      },
    };

    return {
      fontWeight: '900',
      fontFamily: 'Lato, sans-serif',
      background: 'linear-gradient(45deg, #ffffff, #e2e8f0)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
      letterSpacing: '-0.02em',
      ...configs[deviceType],
    };
  };

  const getProfileCardStyles = () => {
    const configs = {
      'mobile-landscape': {
        minWidth: '16.25rem', // 260px in rem
        maxWidth: '20rem', // 320px in rem
      },
      'mobile-portrait': {
        minWidth: 'auto',
        maxWidth: '12.5rem', // 200px in rem
        width: '100%',
      },
      tablet: {
        minWidth: 'auto',
        maxWidth: '25rem', // 400px in rem
        width: '100%',
      },
      desktop: {
        minWidth: '18.75rem', // 300px in rem
        maxWidth: '25rem', // 400px in rem
      },
    };

    return {
      flex: 'none',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      ...configs[deviceType],
    };
  };

  const getBackButtonStyles = () => {
    const configs = {
      'mobile-landscape': {
        top: 'max(env(safe-area-inset-top), var(--space-sm))', // 8px using CSS var
        right: 'var(--space-md)', // 12px using CSS var
        width: 'var(--touch-target-sm)', // 44px - proper touch target
        height: 'var(--touch-target-sm)',
      },
      'mobile-portrait': {
        top: 'max(env(safe-area-inset-top), var(--space-base))', // 16px using CSS var
        right: 'var(--space-base)', // 16px using CSS var
        width: 'var(--touch-target-md)', // 48px - comfortable touch target
        height: 'var(--touch-target-md)',
      },
      tablet: {
        top: 'var(--space-lg)', // 20px using CSS var
        right: 'var(--space-lg)',
        width: 'var(--touch-target-lg)', // 56px - large touch target
        height: 'var(--touch-target-lg)',
      },
      desktop: {
        top: 'var(--space-lg)', // 20px using CSS var
        right: 'var(--space-lg)',
        width: 'var(--touch-target-lg)', // 56px - consistent with tablet
        height: 'var(--touch-target-lg)',
      },
    };

    return {
      borderRadius: '50%',
      position: 'absolute' as const,
      zIndex: 1001,
      border: 'none',
      backgroundColor: isDarkMode ? '#162542' : '#005E80',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      ...configs[deviceType],
    };
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={getContainerStyles()}
          >
            {/* Back button with slide left to right effect */}
            <motion.button
              onClick={() => {
                onPlayClickSound?.();
                onClose();
                onOpenBurgerMenu('right');
              }}
              initial={{ x: 20 }}
              animate={{ x: 0 }}
              whileHover={{ x: -5 }}
              style={getBackButtonStyles()}
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
                    ? { opacity: 0, x: deviceType.includes('mobile') ? 0 : -50 }
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
                    padding: 'var(--space-xs)', // Better touch target
                    margin: 'var(--space-xs) 0',
                    borderRadius: 'var(--radius-sm)', // Subtle rounding
                    minHeight: 'var(--touch-target-sm)', // Proper touch target
                    transition: 'all 0.2s ease',
                  }}
                >
                  read more...
                </motion.button>
              </motion.div>

              {/* Profile Card */}
              <motion.div
                initial={
                  shouldAnimateText
                    ? { opacity: 0, x: deviceType.includes('mobile') ? 0 : 50 }
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
