import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Tailwind CSS
import { motion, AnimatePresence } from 'framer-motion';

import LazyScene from './components/LazyScene';
import ThemeToggle from './components/ThemeToggle';
import BurgerMenu from './components/BurgerMenu';
import CreditsButton from './components/CreditsButton';
import CreditsPopup from './components/CreditsPopup';
import ProfilePage from './components/ProfilePage';
import SkillsetPage from './components/SkillsetPage';
import PortfolioPage from './components/PortfolioPage';
import ConnectPage from './components/ConnectPage';
import AppLoadingScreen from './components/AppLoadingScreen';
import ClickSpark from './components/ClickSpark';
import ExploreNotification from './components/ExploreNotification';

import OceanAudio from './components/OceanAudio';
import useDeviceDetection from './hooks/useDeviceDetection';
import { useClickSound } from './hooks/useClickSound';

// Type definitions
type PageName = 'home' | 'profile' | 'skillset' | 'portfolio' | 'connect';

// Memoized components for better performance
const MemoizedLazyScene = React.memo(LazyScene);
const MemoizedThemeToggle = React.memo(ThemeToggle);
const MemoizedBurgerMenu = React.memo(BurgerMenu);
const MemoizedCreditsButton = React.memo(CreditsButton);
const MemoizedCreditsPopup = React.memo(CreditsPopup);
const MemoizedExploreNotification = React.memo(ExploreNotification);

function App(): React.JSX.Element {
  const deviceInfo = useDeviceDetection();
  const { playClickSound, playHoverSound } = useClickSound(5.45);

  const getInitialTheme = (): boolean => {
    const currentHour = new Date().getHours();
    if (currentHour >= 18 || currentHour < 6) {
      return true; // Dark mode
    }
    return false; // Light mode (covers 6 AM to 5:59 PM)
  };

  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialTheme());
  const [activePage, setActivePage] = useState<PageName | null>(null);
  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState<boolean>(false);
  const [shouldAnimateBurgerMenu, setShouldAnimateBurgerMenu] =
    useState<boolean>(true);
  const [shouldAnimatePageText, setShouldAnimatePageText] =
    useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showMainApp, setShowMainApp] = useState<boolean>(false);
  const [isThemeToggleHidden, setIsThemeToggleHidden] =
    useState<boolean>(false);
  const [isCreditsPopupVisible, setIsCreditsPopupVisible] =
    useState<boolean>(false);
  const [showExploreNotification, setShowExploreNotification] =
    useState<boolean>(false);
  const [burgerMenuSlideDirection, setBurgerMenuSlideDirection] = useState<
    'left' | 'right'
  >('right');

  const toggleTheme = (): void => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const toggleCreditsPopup = (): void => {
    setIsCreditsPopupVisible((prev) => !prev);
  };

  const openPage = (pageName: PageName): void => {
    setShouldAnimatePageText(true);
    setActivePage(pageName);
  };

  const closePage = (): void => {
    setActivePage(null);
  };

  const openBurgerMenu = (slideDirection: 'left' | 'right' = 'right'): void => {
    // When opening burger menu from a page, don't animate burger menu or page text
    setShouldAnimateBurgerMenu(false);
    setShouldAnimatePageText(false);
    setBurgerMenuSlideDirection(slideDirection);
    setIsBurgerMenuOpen(true);
    // Reset animation flags after a brief delay
    setTimeout(() => {
      setShouldAnimateBurgerMenu(true);
      setShouldAnimatePageText(true);
    }, 100);
  };

  const handleLoadingComplete = (): void => {
    setShowMainApp(true);
    setTimeout(() => {
      setIsLoading(false);
      // Show notification after camera zoom completes (3 seconds + small buffer)
      setTimeout(() => {
        setShowExploreNotification(true);
      }, 3500); // Wait for camera zoom to complete (3s) + 0.5s buffer
    }, 100);
  };

  const handleExploreClick = (): void => {
    setShowMainApp(true);
    setTimeout(() => {
      setIsLoading(false);
      // Show notification after camera zoom completes (3 seconds + small buffer)
      setTimeout(() => {
        setShowExploreNotification(true);
      }, 3500); // Wait for camera zoom to complete (3s) + 0.5s buffer
    }, 100);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Responsive styles based on device detection - memoized for performance
  const responsiveStyles = React.useMemo(() => {
    const baseStyles = {
      width: '100vw',
      height: '100vh',
      position: 'relative' as const,
      backgroundColor: isDarkMode ? '#162542' : '#006161',
    };

    // Add safe area padding for mobile devices
    if (deviceInfo.isMobile) {
      return {
        ...baseStyles,
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      };
    }

    return baseStyles;
  }, [isDarkMode, deviceInfo.isMobile]);

  const jefriTextStyles = React.useMemo(() => {
    const baseStyles = {
      position: 'fixed' as const,
      fontFamily: 'Lato, sans-serif',
      fontWeight: '700' as const,
      color: isDarkMode ? '#F8F6E3' : 'rgba(255, 255, 255, 0.9)',
      pointerEvents: 'none' as const,
      userSelect: 'none' as const,
      zIndex: 1000,
      letterSpacing: '-0.01em',
      textShadow: isDarkMode
        ? '0 2px 8px rgba(0, 0, 0, 0.3)'
        : '0 2px 8px rgba(0, 0, 0, 0.2)',
    };

    // Enhanced mobile positioning with landscape mobile support
    if (deviceInfo.isLandscapeMobile) {
      // Landscape mobile - optimized for limited height, desktop-like proportions
      return {
        ...baseStyles,
        top: 'max(env(safe-area-inset-top), 8px)', // Minimal top margin
        left: 'max(env(safe-area-inset-left), 16px)',
        fontSize: '1.0rem', // Smaller than mobile for landscape
      };
    } else if (deviceInfo.isMobile) {
      if (deviceInfo.orientation === 'landscape') {
        // Regular mobile landscape - legacy support
        return {
          ...baseStyles,
          top: 'max(env(safe-area-inset-top), 12px)',
          left: 'max(env(safe-area-inset-left), 20px)',
          fontSize: '1.1rem',
        };
      } else {
        // Portrait mobile - more standard positioning
        return {
          ...baseStyles,
          top: 'max(env(safe-area-inset-top), 20px)',
          left: 'max(env(safe-area-inset-left), 20px)',
          fontSize: '1.3rem',
        };
      }
    } else if (deviceInfo.isTablet) {
      if (deviceInfo.orientation === 'landscape') {
        return {
          ...baseStyles,
          top: 'max(env(safe-area-inset-top), 16px)',
          left: 'max(env(safe-area-inset-left), 24px)',
          fontSize: '1.25rem',
        };
      } else {
        return {
          ...baseStyles,
          top: 'max(env(safe-area-inset-top), 24px)',
          left: 'max(env(safe-area-inset-left), 24px)',
          fontSize: '1.4rem',
        };
      }
    } else {
      return {
        ...baseStyles,
        top: '20px',
        left: '20px',
        fontSize: '1.5rem',
      };
    }
  }, [
    isDarkMode,
    deviceInfo.isMobile,
    deviceInfo.isTablet,
    deviceInfo.isLandscapeMobile,
    deviceInfo.orientation,
  ]);

  // ClickSpark configuration with landscape mobile support
  const clickSparkProps = React.useMemo(
    () => ({
      sparkColor: '#FFFFFF', // Consistently white for all themes
      sparkSize: deviceInfo.isLandscapeMobile
        ? 10 // Slightly larger than desktop for touch, smaller than mobile
        : deviceInfo.isMobile
        ? 8
        : 12,
      sparkRadius: deviceInfo.isLandscapeMobile
        ? 22 // Medium radius for landscape mobile
        : deviceInfo.isMobile
        ? 20
        : 25,
      sparkCount: deviceInfo.isLowPerformance
        ? 6
        : deviceInfo.isLandscapeMobile
        ? 8
        : 10,
      duration: 600,
      easing: 'ease-out' as const,
      extraScale: 1.2,
    }),
    [
      deviceInfo.isMobile,
      deviceInfo.isLandscapeMobile,
      deviceInfo.isLowPerformance,
    ]
  );

  return (
    <div style={responsiveStyles}>
      {/* Main App - Always present once triggered */}
      {showMainApp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          style={{
            width: '100vw',
            height: '100vh',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        >
          <ClickSpark {...clickSparkProps}>
            <div
              style={{
                width: '100vw',
                height: '100vh',
                position: 'relative',
                background: isDarkMode
                  ? 'linear-gradient(to bottom, #162542 0%, #020918 100%)'
                  : 'linear-gradient(to bottom, #006161 0%, #006161 100%)',
              }}
            >
              {/* Jefri text in top left corner */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                style={{
                  ...jefriTextStyles,
                  filter: showExploreNotification ? 'blur(2px)' : 'none',
                  transition: 'filter 0.3s ease-in-out',
                }}
              >
                Jefri
              </motion.div>

              <MemoizedLazyScene
                isDarkMode={isDarkMode}
                showIsland={true}
                showSea={true}
                deviceInfo={deviceInfo}
                onNavigateToConnect={() => openPage('connect')}
                onNavigateToPage={(page: string) => openPage(page as PageName)}
                onPlayClickSound={playClickSound}
                showExploreNotification={showExploreNotification}
              />

              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none', // Allow clicks to pass through to 3D scene
                  filter: showExploreNotification ? 'blur(2px)' : 'none',
                  transition: 'filter 0.3s ease-in-out',
                }}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  style={{ pointerEvents: 'auto' }}
                >
                  <MemoizedThemeToggle
                    isDarkMode={isDarkMode}
                    onToggle={() => {
                      playClickSound();
                      toggleTheme();
                    }}
                    isHidden={isThemeToggleHidden}
                    deviceInfo={deviceInfo}
                    onPlayHoverSound={playHoverSound}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  style={{ pointerEvents: 'auto' }}
                >
                  <MemoizedCreditsButton
                    isDarkMode={isDarkMode}
                    onToggle={() => {
                      playClickSound();
                      toggleCreditsPopup();
                    }}
                    isHidden={isThemeToggleHidden}
                    deviceInfo={deviceInfo}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  style={{ pointerEvents: 'auto' }}
                >
                  <MemoizedBurgerMenu
                    isDarkMode={isDarkMode}
                    onNavigate={openPage}
                    isOpen={isBurgerMenuOpen}
                    onOpenChange={setIsBurgerMenuOpen}
                    activePage={activePage}
                    onHideThemeToggle={setIsThemeToggleHidden}
                    shouldAnimate={shouldAnimateBurgerMenu}
                    deviceInfo={deviceInfo}
                    onPlayClickSound={playClickSound}
                    onPlayHoverSound={playHoverSound}
                    slideDirection={burgerMenuSlideDirection}
                  />
                </motion.div>
              </div>

              {/* Page Components */}
              <ProfilePage
                isVisible={activePage === 'profile'}
                onClose={closePage}
                onOpenBurgerMenu={openBurgerMenu}
                onNavigate={openPage}
                isDarkMode={isDarkMode}
                shouldAnimateText={shouldAnimatePageText}
                deviceInfo={deviceInfo}
                onPlayClickSound={playClickSound}
              />
              <SkillsetPage
                isVisible={activePage === 'skillset'}
                onClose={closePage}
                onOpenBurgerMenu={openBurgerMenu}
                isDarkMode={isDarkMode}
                shouldAnimateText={shouldAnimatePageText}
                deviceInfo={deviceInfo}
              />
              <PortfolioPage
                isVisible={activePage === 'portfolio'}
                onClose={closePage}
                onOpenBurgerMenu={openBurgerMenu}
                isDarkMode={isDarkMode}
                shouldAnimateText={shouldAnimatePageText}
                deviceInfo={deviceInfo}
              />
              <ConnectPage
                isVisible={activePage === 'connect'}
                onClose={closePage}
                onOpenBurgerMenu={openBurgerMenu}
                isDarkMode={isDarkMode}
                shouldAnimateText={shouldAnimatePageText}
                deviceInfo={deviceInfo}
              />

              {/* Credits Popup */}
              <MemoizedCreditsPopup
                isVisible={isCreditsPopupVisible}
                onClose={() => setIsCreditsPopupVisible(false)}
                isDarkMode={isDarkMode}
                deviceInfo={deviceInfo}
              />
            </div>
          </ClickSpark>
        </motion.div>
      )}

      {/* Explore Notification - Outside main app to avoid blur effects */}
      <MemoizedExploreNotification
        isVisible={showExploreNotification}
        onHide={() => setShowExploreNotification(false)}
        isDarkMode={isDarkMode}
        deviceInfo={deviceInfo}
      />

      {/* Loading Screen - Overlaid on top */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 10,
            }}
          >
            <AppLoadingScreen
              onLoadingComplete={handleLoadingComplete}
              onExploreClick={handleExploreClick}
              isDarkMode={isDarkMode}
              deviceInfo={deviceInfo}
              onPlayClickSound={playClickSound}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Performance monitoring */}

      {/* Ocean background audio - starts after loading screen */}
      <OceanAudio isActive={showMainApp && !isLoading} volume={5.225} />
    </div>
  );
}

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  // PERFORMANCE FIX: Disable StrictMode in development to prevent double renders
  root.render(<App />);
} else {
  console.error(
    'Failed to find the root element. Ensure #root exists in your HTML.'
  );
}
