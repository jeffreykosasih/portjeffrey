import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DeviceInfo } from '../lib/types';

interface CreditsPopupProps {
  isVisible: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  deviceInfo?: DeviceInfo;
}

const creditsData = [
  {
    name: 'Aku Aku',
    url: 'https://skfb.ly/opwWF',
    author: 'danielsive',
  },
  {
    name: 'Boat',
    url: 'https://skfb.ly/oqIXw',
    author: 'Arsen.Krityan',
  },
  {
    name: 'Beach cafe',
    url: 'https://skfb.ly/6WFwL',
    author: 'Lubov_Gladkova',
  },
  {
    name: 'Car House',
    url: 'https://skfb.ly/o9Voq',
    author: 'Baydinman',
  },
  {
    name: 'Low-poly Fantasy Island (Medieval)',
    url: 'https://skfb.ly/oWzwp',
    author: 'Sohaib Ahmad',
  },
  {
    name: 'Printable Fire Pit',
    url: 'https://skfb.ly/6C8on',
    author: 'TheCaitasaurus',
  },
];

export default function CreditsPopup({
  isVisible,
  onClose,
  isDarkMode,
  deviceInfo,
}: CreditsPopupProps): React.JSX.Element | null {
  const popupRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside the popup to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  // Handle ESC key to close popup
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isVisible, onClose]);

  // Responsive popup styles
  const getPopupStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      backgroundColor: isDarkMode ? '#131D4F' : '#00bbdc',
      borderRadius: '20px',
      boxShadow: isDarkMode
        ? '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 255, 255, 0.1)'
        : '0 25px 50px rgba(0, 0, 0, 0.3), 0 0 30px rgba(255, 255, 255, 0.1)',
      maxHeight: '80vh',
      overflowY: 'auto',
      fontFamily: 'Lato, sans-serif',
    };

    if (deviceInfo?.isMobile) {
      return {
        ...baseStyles,
        width: '90vw',
        maxWidth: '400px',
        padding: '30px 25px',
      };
    } else if (deviceInfo?.isTablet) {
      return {
        ...baseStyles,
        width: '80vw',
        maxWidth: '500px',
        padding: '40px 35px',
      };
    } else {
      return {
        ...baseStyles,
        width: '70vw',
        maxWidth: '600px',
        padding: '50px 45px',
      };
    }
  };

  const getTitleStyles = (): React.CSSProperties => {
    const fontSize = deviceInfo?.isMobile
      ? '1.75rem'
      : deviceInfo?.isTablet
      ? '2rem'
      : '2.25rem';

    return {
      fontSize,
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: '10px',
      textAlign: 'center' as const,
      letterSpacing: '-0.02em',
    };
  };

  const getSubtitleStyles = (): React.CSSProperties => {
    const fontSize = deviceInfo?.isMobile
      ? '0.9rem'
      : deviceInfo?.isTablet
      ? '1rem'
      : '1.1rem';

    return {
      fontSize,
      fontWeight: '400',
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: '30px',
      textAlign: 'center' as const,
      lineHeight: '1.5',
    };
  };

  const getCreditItemStyles = (): React.CSSProperties => {
    const fontSize = deviceInfo?.isMobile ? '0.85rem' : '0.9rem';

    return {
      fontSize,
      marginBottom: '15px',
      lineHeight: '1.6',
      color: '#ffffff',
    };
  };

  const getLinkStyles = (): React.CSSProperties => {
    return {
      color: '#FFEEA9',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'color 0.2s ease',
    };
  };

  const getLicenseStyles = (): React.CSSProperties => {
    const fontSize = deviceInfo?.isMobile ? '0.8rem' : '0.85rem';

    return {
      fontSize,
      marginTop: '25px',
      padding: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      color: 'rgba(255, 255, 255, 0.9)',
      lineHeight: '1.5',
    };
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{
              duration: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
              exit: { duration: 0.15, ease: 'easeIn' },
            }}
            style={getPopupStyles()}
          >
            <h2 style={getTitleStyles()}>Credits</h2>
            <p style={getSubtitleStyles()}>
              Credits to all these people who made such amazing models.
            </p>

            <div>
              {creditsData.map((credit, index) => (
                <div key={index} style={getCreditItemStyles()}>
                  <a
                    href={credit.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    style={getLinkStyles()}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#FFEEA9';
                    }}
                  >
                    "{credit.name}"
                  </a>{' '}
                  by {credit.author}
                </div>
              ))}
            </div>

            <div style={getLicenseStyles()}>
              <p style={{ margin: 0 }}>
                All models are licensed under{' '}
                <a
                  href='http://creativecommons.org/licenses/by/4.0/'
                  target='_blank'
                  rel='noopener noreferrer'
                  style={getLinkStyles()}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#FFEEA9';
                  }}
                >
                  Creative Commons Attribution
                </a>
                .
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
