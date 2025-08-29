import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { DeviceInfo } from '../lib/types';
import {
  getResponsiveValue,
  getSpacing,
  ResponsiveValues,
} from '../lib/responsiveUtils';

interface LongStoryPageProps {
  isVisible: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  shouldAnimateText?: boolean;
  deviceInfo?: DeviceInfo;
  onPlayClickSound?: () => void;
}

export default function LongStoryPage({
  isVisible,
  onClose,
  isDarkMode,
  shouldAnimateText = true,
  deviceInfo,
  onPlayClickSound,
}: LongStoryPageProps) {
  const [isButtonHovered, setIsButtonHovered] = React.useState(false);

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

  // Responsive styles based on device type (following ProfilePage pattern)
  const getContainerStyles = () => {
    const configs = {
      'mobile-landscape': {
        padding: 'var(--space-lg) var(--space-base)',
      },
      'mobile-portrait': {
        padding: 'var(--space-lg) var(--space-base)',
      },
      tablet: {
        padding: 'calc(var(--space-xl) + 0.375rem) var(--space-xl)',
      },
      desktop: {
        padding: 'var(--space-3xl)',
      },
    };

    return {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: isDarkMode
        ? 'rgba(22, 37, 66, 0.7)'
        : 'rgba(0, 94, 128, 0.7)',
      backdropFilter: 'blur(2rem)',
      opacity: 1,
      zIndex: ResponsiveValues.zIndex.overlay,
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      color: '#ffffff',
      ...configs[deviceType],
    };
  };

  const getContentStyles = () => {
    const baseStyles = {
      maxWidth: '50rem', // Converted from 800px to rem
      width: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
    };

    return baseStyles;
  };

  const getTextContainerStyles = () => {
    const configs = {
      'mobile-landscape': {
        fontSize: 'var(--text-md)',
        lineHeight: '1.5',
        maxWidth: '80%',
        margin: '0 auto',
        paddingLeft: 'var(--space-md)',
        paddingRight: 'var(--space-md)',
      },
      'mobile-portrait': {
        fontSize: 'var(--text-lg)',
        lineHeight: '1.8',
      },
      tablet: {
        fontSize: 'calc(var(--text-xl) + 0.05rem)',
        lineHeight: '1.7',
      },
      desktop: {
        fontSize: 'var(--text-2xl)',
        lineHeight: '1.8',
      },
    };

    return {
      fontFamily: 'Lato, sans-serif',
      fontWeight: '300',
      color: 'rgba(255, 255, 255, 0.9)',
      textAlign: 'center' as const,
      ...configs[deviceType],
    };
  };

  const getTitleStyles = () => {
    const configs = {
      'mobile-landscape': {
        fontSize: 'var(--text-3xl)',
        marginBottom: 'var(--space-lg)',
      },
      'mobile-portrait': {
        fontSize: 'calc(var(--text-4xl) - 0.25rem)',
        marginBottom: 'var(--space-lg)',
      },
      tablet: {
        fontSize: 'var(--text-5xl)',
        marginBottom: 'calc(var(--space-xl) + 0.0625rem)',
      },
      desktop: {
        fontSize: 'var(--text-6xl)',
        marginBottom: 'calc(var(--space-xl) + 0.375rem)',
      },
    };

    return {
      fontWeight: '700',
      fontFamily: 'Lato, sans-serif',
      background: 'linear-gradient(45deg, #ffffff, #e2e8f0)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
      letterSpacing: '-0.02em',
      ...configs[deviceType],
    };
  };

  const getBackButtonStyles = () => {
    const configs = {
      'mobile-landscape': {
        top: 'var(--space-base)',
        right: 'var(--space-base)',
        width: 'var(--touch-target-md)',
        height: 'var(--touch-target-md)',
      },
      'mobile-portrait': {
        top: 'var(--space-base)',
        right: 'var(--space-base)',
        width: 'var(--touch-target-md)',
        height: 'var(--touch-target-md)',
      },
      tablet: {
        top: 'var(--space-lg)',
        right: 'var(--space-lg)',
        width: 'var(--space-4xl)',
        height: 'var(--space-4xl)',
      },
      desktop: {
        top: 'var(--space-lg)',
        right: 'var(--space-lg)',
        width: 'var(--space-4xl)',
        height: 'var(--space-4xl)',
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
            onClick={() => {
              onPlayClickSound?.();
              onClose();
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
                fontSize:
                  deviceType === 'mobile-landscape' ||
                  deviceType === 'mobile-portrait'
                    ? 'var(--text-lg)'
                    : 'var(--text-xl)',
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
              <p style={{ marginBottom: 'var(--space-lg)' }}>
                {' '}
                {/* Using CSS custom property */}I was born in Indonesia, got a
                bachelor of computer science and now pursuing MIT degree in
                Melbourne. Had experience from lots of related field like being
                part of Apple Developer academy where I learn business, UI/UX
                design and coding in general. Then work as product owner at
                bank, becoming free lance making sites, also joining a bootcamp
                program. Now, I'm looking for developer jobs or design if
                possible so if you're interested, let's reach out!
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
