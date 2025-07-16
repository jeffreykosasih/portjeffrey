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
      borderRadius: '16px',
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
      backgroundColor: isDarkMode ? '#162542' : '#084CA6',
      color: isDarkMode ? '#F8F6E3' : 'rgba(255, 255, 255, 0.9)',
      boxShadow: isDarkMode
        ? '0 12px 48px rgba(0, 0, 0, 0.5), 0 6px 24px rgba(0, 0, 0, 0.4)'
        : '0 12px 48px rgba(0, 0, 0, 0.2), 0 6px 24px rgba(0, 0, 0, 0.15)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    };

    if (deviceInfo?.isLandscapeMobile) {
      return {
        ...baseStyles,
        padding: '20px 24px',
        fontSize: '1.0rem',
        maxWidth: '360px',
        gap: '16px',
      };
    } else if (deviceInfo?.isMobile) {
      return {
        ...baseStyles,
        padding: '24px 28px',
        fontSize: '1.05rem',
        maxWidth: '380px',
        gap: '18px',
      };
    } else if (deviceInfo?.isTablet) {
      return {
        ...baseStyles,
        padding: '28px 32px',
        fontSize: '1.15rem',
        maxWidth: '420px',
        gap: '20px',
      };
    } else {
      return {
        ...baseStyles,
        padding: '32px 40px',
        fontSize: '1.25rem',
        maxWidth: '480px',
        gap: '24px',
      };
    }
  };

  const getButtonStyles = () => {
    return {
      backgroundColor: isDarkMode ? '#F8F6E3' : 'rgba(255, 255, 255, 0.95)',
      color: isDarkMode ? '#162542' : '#084CA6',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 24px',
      fontSize: deviceInfo?.isMobile ? '0.9rem' : '1rem',
      fontWeight: '600' as const,
      fontFamily: 'Lato, sans-serif',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
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
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow =
                  '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 2px 8px rgba(0, 0, 0, 0.1)';
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
