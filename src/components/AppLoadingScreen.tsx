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
  onPlayClickSound,
}: AppLoadingScreenProps): React.JSX.Element {
  const [showTitle, setShowTitle] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Theme colors
  const colors = {
    background: isDarkMode ? '#0a182e' : '#00bbdc',
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
      onLoadingComplete();
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

  const titleStyles: React.CSSProperties = {
    fontFamily: "'Lato', sans-serif",
    fontSize: 'clamp(3rem, 8vw, 8rem)',
    fontWeight: 800,
    letterSpacing: '-0.05em',
    lineHeight: 1,
    color: colors.text,
    marginBottom: '3rem',
  };

  const buttonStyles: React.CSSProperties = {
    fontFamily: "'Lato', sans-serif",
    fontSize: '1.5rem',
    lineHeight: 1.2,
    fontWeight: 600,
    padding: '0.875rem 2rem',
    borderRadius: '9999px',
    backgroundColor: isDarkMode ? colors.text : '#ffffff', // Use yellow in dark mode, white in light mode
    color: isDarkMode ? '#0a182e' : '#00bbdc', // Dark text in dark mode, blue in light mode
    border: 'none',
    boxShadow: isDarkMode
      ? '0 8px 20px rgba(232, 230, 130, 0.3)'
      : '0 8px 20px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  };

  const handleButtonMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.backgroundColor = isDarkMode ? '#f0f0a0' : '#f0f0f0'; // Lighter yellow/gray on hover
  };

  const handleButtonMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.backgroundColor = isDarkMode
      ? colors.text
      : '#ffffff'; // Back to original colors
  };

  const handleButtonMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'translateY(1px)';
  };

  const handleButtonMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
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
            gap: '3rem',
          }}
        >
          {/* Dots or Title Area */}
          <div
            style={{
              height: '280px', // Fixed height to ensure consistent positioning
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
                    gap: '0.75rem',
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
                        width: '20px',
                        height: '20px',
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
                  <div style={{ marginBottom: '0.5rem' }}>Welcome to</div>
                  <div>Port Jeffrey</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Button Area */}
          <div
            style={{
              height: '80px', // Fixed height instead of minHeight to prevent layout shifts
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
