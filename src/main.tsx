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

  const openBurgerMenu = (): void => {
    // When opening burger menu from a page, don't animate burger menu or page text
    setShouldAnimateBurgerMenu(false);
    setShouldAnimatePageText(false);
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
    }, 100);
  };

  const handleExploreClick = (): void => {
    setShowMainApp(true);
    setTimeout(() => {
      setIsLoading(false);
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
      backgroundColor: isDarkMode ? '#05073b' : '#c0d8e0',
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

    // Responsive positioning and sizing with better mobile optimizations
    if (deviceInfo.isMobile) {
      return {
        ...baseStyles,
        top: 'env(safe-area-inset-top, 16px)',
        left: 'env(safe-area-inset-left, 16px)',
        fontSize: '1.25rem', // Smaller on mobile
      };
    } else if (deviceInfo.isTablet) {
      return {
        ...baseStyles,
        top: 'env(safe-area-inset-top, 20px)',
        left: 'env(safe-area-inset-left, 20px)',
        fontSize: '1.375rem',
      };
    } else {
      return {
        ...baseStyles,
        top: '20px',
        left: '20px',
        fontSize: '1.5rem',
      };
    }
  }, [isDarkMode, deviceInfo.isMobile, deviceInfo.isTablet]);

  // Memoized click spark props for performance
  const clickSparkProps = React.useMemo(
    () => ({
      sparkColor: '#FFFFFF', // Consistently white for all themes
      sparkSize: deviceInfo.isMobile ? 8 : 12,
      sparkRadius: deviceInfo.isMobile ? 20 : 25,
      sparkCount: deviceInfo.isLowPerformance ? 6 : 10,
      duration: 600,
      easing: 'ease-out' as const,
      extraScale: 1.2,
    }),
    [deviceInfo.isMobile, deviceInfo.isLowPerformance]
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
                  : 'linear-gradient(to bottom, #00bbdc 0%, #87ceeb 100%)',
              }}
            >
              {/* Jefri text in top left corner */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                style={jefriTextStyles}
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
              />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
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
                />
              </motion.div>

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
