import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DeviceInfo } from '../lib/types';

interface ExploreNotificationProps {
  isVisible: boolean;
  onHide: () => void;
  isDarkMode: boolean;
  deviceInfo?: DeviceInfo;
}

export default function ExploreNotification({
  isVisible,
  onHide,
  isDarkMode,
  deviceInfo,
}: ExploreNotificationProps): React.JSX.Element | null {
  // Get backdrop styles - covers entire screen and blocks interactions
  const getBackdropStyles = () => {
    return {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 14999, // Just below the notification
      backgroundColor: 'transparent', // Invisible but blocks interactions
      pointerEvents: 'all' as const, // Captures all pointer events
      cursor: 'default',
    };
  };

  // Get responsive styles based on device
  const getNotificationStyles = () => {
    const baseStyles = {
      position: 'fixed' as const,
      top: '80%',
      left: '37.5%',
      transform: 'translate(-50%, -50%)',
      zIndex: 15000,
      borderRadius: 'var(--radius-xl)', // Using CSS custom property
      border: 'none',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Lato, sans-serif',
      fontWeight: '600' as const,
      textAlign: 'center' as const,
      cursor: 'default',
      // Match website's main theme colors
      backgroundColor: isDarkMode ? '#162542' : '#005E80',
      color: isDarkMode ? '#F8F6E3' : 'rgba(255, 255, 255, 0.9)',
      boxShadow: isDarkMode
        ? '0 0.75rem 3rem rgba(0, 0, 0, 0.5), 0 0.375rem 1.5rem rgba(0, 0, 0, 0.4)' // Converted to rem
        : '0 0.75rem 3rem rgba(0, 0, 0, 0.2), 0 0.375rem 1.5rem rgba(0, 0, 0, 0.15)', // Converted to rem
      backdropFilter: 'blur(0.75rem)', // Using CSS custom property equivalent
      WebkitBackdropFilter: 'blur(0.75rem)', // Using CSS custom property equivalent
    };

    if (deviceInfo?.isLandscapeMobile) {
      return {
        ...baseStyles,
        padding: 'var(--space-lg) var(--space-xl)', // Using CSS custom properties
        fontSize: 'var(--text-base)', // Using CSS custom property
        maxWidth: '22.5rem', // Converted from 360px to rem
        gap: 'var(--space-base)', // Using CSS custom property
      };
    } else if (deviceInfo?.isMobile) {
      return {
        ...baseStyles,
        padding: 'var(--space-xl) calc(var(--space-xl) + 0.25rem)', // Using CSS custom properties with calc
        fontSize: 'calc(var(--text-base) + 0.05rem)', // Using CSS custom property with calc
        maxWidth: '23.75rem', // Converted from 380px to rem
        gap: 'calc(var(--space-base) + 0.125rem)', // Using CSS custom property with calc
      };
    } else if (deviceInfo?.isTablet) {
      return {
        ...baseStyles,
        padding: 'calc(var(--space-xl) + 0.25rem) var(--space-2xl)', // Using CSS custom properties with calc
        fontSize: 'calc(var(--text-base) + 0.15rem)', // Using CSS custom property with calc
        maxWidth: '26.25rem', // Converted from 420px to rem
        gap: 'var(--space-lg)', // Using CSS custom property
      };
    } else {
      return {
        ...baseStyles,
        padding: 'var(--space-2xl) var(--space-3xl)', // Using CSS custom properties
        fontSize: 'var(--text-xl)', // Using CSS custom property
        maxWidth: '30rem', // Converted from 480px to rem
        gap: 'var(--space-xl)', // Using CSS custom property
      };
    }
  };

  const getButtonStyles = () => {
    return {
      backgroundColor: isDarkMode ? '#F8F6E3' : 'rgba(255, 255, 255, 0.95)',
      color: isDarkMode ? '#162542' : '#005E80',
      border: 'none',
      borderRadius: 'var(--radius-md)', // Using CSS custom property
      padding: 'var(--space-md) var(--space-xl)', // Using CSS custom properties
      fontSize: deviceInfo?.isMobile ? 'var(--text-sm)' : 'var(--text-base)', // Using CSS custom properties
      fontWeight: '600' as const,
      fontFamily: 'Lato, sans-serif',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 0.125rem 0.5rem rgba(0, 0, 0, 0.1)', // Converted to rem
      pointerEvents: 'all' as const, // Ensure button is clickable
    };
  };

  return (
    <AnimatePresence mode='wait'>
      {isVisible && (
        <>
          {/* Backdrop overlay that blocks all interactions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={getBackdropStyles()}
          />

          {/* Notification modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
            }}
            style={getNotificationStyles()}
          >
            {/* Notification content */}
            <div>Click on objects around the island to explore</div>

            {/* Got it button */}
            <button
              onClick={onHide}
              style={getButtonStyles()}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-0.0625rem)'; // Converted to rem
                e.currentTarget.style.boxShadow =
                  '0 0.25rem 0.75rem rgba(0, 0, 0, 0.15)'; // Converted to rem
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 0.125rem 0.5rem rgba(0, 0, 0, 0.1)'; // Converted to rem
              }}
            >
              Got it!
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
