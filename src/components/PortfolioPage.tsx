import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faExternalLinkAlt,
  faRocket,
} from '@fortawesome/free-solid-svg-icons';
import { DeviceInfo } from '../lib/types';
import {
  getResponsiveValue,
  getSpacing,
  ResponsiveValues,
} from '../lib/responsiveUtils';

interface PortfolioPageProps {
  isVisible: boolean;
  onClose: () => void;
  onOpenBurgerMenu: (slideDirection?: 'left' | 'right') => void;
  isDarkMode: boolean;
  shouldAnimateText?: boolean;
  deviceInfo?: DeviceInfo;
  onPlayClickSound?: () => void;
}

export default function PortfolioPage({
  isVisible,
  onClose,
  onOpenBurgerMenu,
  isDarkMode,
  shouldAnimateText = true,
  deviceInfo,
  onPlayClickSound,
}: PortfolioPageProps) {
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
        padding: `max(env(safe-area-inset-top), var(--space-sm)) var(--space-base) max(env(safe-area-inset-bottom), var(--space-lg)) var(--space-base)`,
        height: '100dvh',
      },
      'mobile-portrait': {
        padding: `max(env(safe-area-inset-top), var(--space-lg)) var(--space-base) max(env(safe-area-inset-bottom), var(--space-3xl)) var(--space-base)`,
        height: '100dvh',
      },
      tablet: {
        padding: 'calc(var(--space-xl) + 0.625rem) var(--space-xl)',
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
        ? 'rgba(22, 37, 66, 0.4)'
        : 'rgba(0, 94, 128, 0.5)',
      backdropFilter: 'blur(0.5rem)',
      opacity: 1,
      zIndex: ResponsiveValues.zIndex.overlay,
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      color: '#ffffff',
      overflowY: 'auto' as const,
      ...configs[deviceType],
    };
  };

  const projects = [
    {
      title: 'Katsu Retsu',
      description:
        'Front end site for Japanese restaurant with modern theme and animation',
      link: 'http://katsuseiba.vercel.app',
      status: 'Completed',
      image: '/assets/images/project_katsu.jpg',
      tech: ['JavaScript', 'Motion', 'Node.js', 'React', 'Tailwind'],
    },
    {
      title: 'Port Jeffrey',
      description:
        'Main site with island theme where I learn some three.js and movement!',
      link: 'https://jefri.dev',
      status: 'Completed',
      image: '/assets/images/profile.jpg',
      tech: ['Motion', 'Node.js', 'React', 'Tailwind', 'TypeScript'],
    },
    {
      title: 'Muscle Memory',
      description: 'Simplify list of exercises for easier approach',
      link: 'https://musclememo.vercel.app',
      status: 'Completed',
      image: '/assets/images/project_muscle.jpg',
      tech: ['Motion', 'Node.js', 'React', 'Tailwind', 'TypeScript'],
    },
    {
      title: 'Coming Soon!',
      description: 'This slot is available for future projects.',
      link: null,
      status: 'Upcoming',
      icon: faRocket,
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            ...getContainerStyles(),
            transition: '0.5',
            visibility: isVisible ? 'visible' : 'hidden',
            pointerEvents: isVisible ? 'auto' : 'none',
          }}
        >
          {/* Back button with slide left to right effect */}
          <motion.button
            onClick={() => {
              onPlayClickSound?.();
              onClose(); // Close current page
              onOpenBurgerMenu('right'); // Open burger menu sliding from right corner
            }}
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            whileHover={{ x: -5 }}
            transition={{ duration: 0.3 }}
            style={{
              borderRadius: '50%',
              position: 'absolute',
              top:
                deviceType === 'mobile-landscape'
                  ? 'max(env(safe-area-inset-top), var(--space-sm))'
                  : deviceType === 'mobile-portrait'
                  ? 'max(env(safe-area-inset-top), var(--space-base))'
                  : 'var(--space-lg)',
              right:
                deviceType === 'mobile-landscape'
                  ? 'var(--space-md)'
                  : deviceType === 'mobile-portrait'
                  ? 'var(--space-base)'
                  : 'var(--space-lg)',
              zIndex: 1001,
              width:
                deviceType === 'mobile-landscape'
                  ? 'var(--touch-target-sm)'
                  : deviceType === 'mobile-portrait'
                  ? 'var(--touch-target-md)'
                  : 'var(--touch-target-lg)',
              height:
                deviceType === 'mobile-landscape'
                  ? 'var(--touch-target-sm)'
                  : deviceType === 'mobile-portrait'
                  ? 'var(--touch-target-md)'
                  : 'var(--touch-target-lg)',
              border: 'none',
              backgroundColor: isDarkMode ? '#162542' : '#005E80',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              style={{
                color: '#ffffff',
                fontSize: 'var(--text-lg)',
              }}
            />
          </motion.button>

          {/* Content with fade in */}
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
            style={{
              width: '100%',
              maxWidth: '1200px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: deviceInfo?.isMobile ? 'flex-start' : 'center',
              minHeight: deviceInfo?.isMobile ? 'calc(100vh - 120px)' : 'auto',
              paddingTop:
                deviceType === 'mobile-landscape' ||
                deviceType === 'mobile-portrait'
                  ? 'var(--space-5xl)'
                  : 'var(--space-lg)', // Space for back button
            }}
          >
            {/* Header */}
            <h1
              style={{
                fontSize:
                  deviceType === 'mobile-landscape'
                    ? 'var(--text-2xl)'
                    : deviceType === 'mobile-portrait'
                    ? 'var(--mobile-text-display)'
                    : deviceType === 'tablet'
                    ? 'var(--tablet-text-display)'
                    : 'var(--text-6xl)',
                fontWeight: '900',
                fontFamily: 'Lato, sans-serif',
                marginBottom:
                  deviceType === 'mobile-landscape'
                    ? 'var(--space-xs)'
                    : deviceType === 'mobile-portrait'
                    ? 'var(--space-base)'
                    : deviceType === 'tablet'
                    ? 'var(--space-lg)'
                    : 'calc(var(--space-xl) + 0.3125rem)',
                marginTop:
                  deviceType === 'mobile-landscape' ||
                  deviceType === 'mobile-portrait'
                    ? '0'
                    : 'var(--space-lg)',
                background: 'linear-gradient(45deg, #ffffff, #e2e8f0)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '-0.02em',
                textAlign: 'center',
              }}
            >
              Portfolio
            </h1>

            {/* Projects List */}
            <motion.div
              initial={
                shouldAnimateText ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={
                shouldAnimateText
                  ? { duration: 0.6, delay: 0.4 }
                  : { duration: 0 }
              }
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'stretch',
                gap:
                  deviceType === 'mobile-landscape'
                    ? 'var(--space-sm)'
                    : deviceType === 'mobile-portrait'
                    ? 'var(--space-base)'
                    : deviceType === 'tablet'
                    ? 'calc(var(--space-xl) + 0.625rem)'
                    : 'calc(var(--space-xl) + 0.625rem)',
                padding:
                  deviceType === 'mobile-landscape' ||
                  deviceType === 'mobile-portrait'
                    ? '0 var(--space-sm)'
                    : '0 var(--space-lg)',
                flexWrap: 'wrap',
                marginTop:
                  deviceType === 'mobile-landscape'
                    ? 'var(--space-sm)'
                    : deviceType === 'mobile-portrait'
                    ? 'var(--space-lg)'
                    : deviceType === 'tablet'
                    ? 'calc(var(--space-xl) + 0.625rem)'
                    : 'calc(var(--space-xl) + 0.625rem)',
                marginBottom:
                  deviceType === 'mobile-landscape' ||
                  deviceType === 'mobile-portrait'
                    ? 'var(--space-3xl)'
                    : 'var(--space-lg)', // Extra bottom margin for mobile scrolling
              }}
            >
              {projects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={
                    shouldAnimateText
                      ? { opacity: 0, y: 10, scale: 1 }
                      : { opacity: 1, y: 0, scale: 1 }
                  }
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={
                    shouldAnimateText
                      ? {
                          duration: 0.3,
                          delay: 0.1 + index * 0.05,
                          ease: 'easeOut',
                        }
                      : { duration: 0 }
                  }
                  whileHover={{
                    y: -12,
                    transition: { duration: 0.08, ease: 'easeOut' },
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 0,
                    borderRadius: '16px',
                    backgroundColor: isDarkMode
                      ? 'rgba(255, 255, 255, 0.15)'
                      : 'rgba(255, 255, 255, 0.08)',

                    cursor: project.link ? 'pointer' : 'default',
                    flex: '1',
                    minWidth:
                      deviceType === 'mobile-landscape'
                        ? '6.875rem'
                        : deviceType === 'mobile-portrait'
                        ? '10rem'
                        : deviceType === 'tablet'
                        ? '14.0625rem'
                        : '14.0625rem',
                    maxWidth:
                      deviceType === 'mobile-landscape'
                        ? '8.75rem'
                        : deviceType === 'mobile-portrait'
                        ? '11.875rem'
                        : deviceType === 'tablet'
                        ? '15.625rem'
                        : '15.625rem',
                    height:
                      deviceType === 'mobile-landscape'
                        ? '13.75rem'
                        : deviceType === 'mobile-portrait'
                        ? '22.5rem'
                        : deviceType === 'tablet'
                        ? '32.5rem'
                        : '32.5rem',
                    opacity: project.link ? 1 : 0.7,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onClick={() => {
                    if (project.link) {
                      window.open(project.link, '_blank');
                    }
                  }}
                >
                  {/* Project Image or Icon */}
                  <div
                    style={{
                      width: '100%',
                      height: '60%',
                      borderRadius: project.image
                        ? 'var(--radius-lg) var(--radius-lg) 0 0'
                        : 'var(--radius-lg)',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: project.image
                        ? 'transparent'
                        : 'rgba(255, 255, 255, 0.1)',
                      position: 'relative',
                    }}
                  >
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '20px',
                        }}
                      />
                    ) : (
                      (project as any).icon && (
                        <FontAwesomeIcon
                          icon={(project as any).icon}
                          style={{
                            fontSize:
                              deviceType === 'mobile-landscape' ||
                              deviceType === 'mobile-portrait'
                                ? 'var(--text-2xl)'
                                : 'calc(var(--text-2xl) + 0.375rem)',
                            color: 'rgba(255, 255, 255, 0.6)',
                          }}
                        />
                      )
                    )}

                    {/* External Link Icon - Top Right Corner */}
                    {project.link && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 10,
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faExternalLinkAlt}
                          style={{
                            fontSize: '10px',
                            color: '#ffffff',
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Title & Description Section - 20% */}
                  <div
                    style={{
                      height: '20%',
                      width: '100%',
                      padding:
                        deviceType === 'mobile-landscape' ||
                        deviceType === 'mobile-portrait'
                          ? 'var(--space-sm) var(--space-md)'
                          : 'var(--space-sm) var(--space-base)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <h4
                      style={{
                        fontSize:
                          deviceType === 'mobile-landscape' ||
                          deviceType === 'mobile-portrait'
                            ? 'var(--text-base)'
                            : 'calc(var(--text-base) + 0.1rem)',
                        fontWeight: '700',
                        fontFamily: 'Lato, sans-serif',
                        marginBottom: '6px',
                        color: '#ffffff',
                        textAlign: 'center',
                        margin: 0,
                      }}
                    >
                      {project.title}
                    </h4>
                    <p
                      style={{
                        fontSize:
                          deviceType === 'mobile-landscape' ||
                          deviceType === 'mobile-portrait'
                            ? 'calc(var(--text-sm) - 0.125rem)'
                            : 'calc(var(--text-sm) + 0.05rem)',
                        fontFamily: 'Lato, sans-serif',
                        fontWeight: '400',
                        color: 'rgba(255, 255, 255, 0.8)',
                        textAlign: 'center',
                        margin: 0,
                        lineHeight: '1.2',
                      }}
                    >
                      {project.description}
                    </p>
                  </div>

                  {/* Technology Tags Section - 20% */}
                  {project.tech && (
                    <div
                      style={{
                        height: '20%',
                        width: '100%',
                        padding:
                          deviceType === 'mobile-landscape' ||
                          deviceType === 'mobile-portrait'
                            ? 'var(--space-xs) var(--space-md) var(--space-md) var(--space-md)'
                            : 'var(--space-sm) var(--space-base) var(--space-base) var(--space-base)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '4px',
                          justifyContent: 'center',
                        }}
                      >
                        {project.tech.slice(0, 7).map((tech) => (
                          <span
                            key={tech}
                            style={{
                              padding:
                                deviceType === 'mobile-landscape' ||
                                deviceType === 'mobile-portrait'
                                  ? 'var(--space-xs) var(--space-sm)'
                                  : 'var(--space-sm) var(--space-md)',
                              background: 'rgba(255, 255, 255, 0.1)',
                              borderRadius: 'var(--radius-xs)',
                              fontSize:
                                deviceType === 'mobile-landscape' ||
                                deviceType === 'mobile-portrait'
                                  ? 'calc(var(--text-xs) + 0.025rem)'
                                  : 'calc(var(--text-xs) + 0.075rem)',
                              fontWeight: '500',
                              fontFamily: 'Lato, sans-serif',
                              color: 'rgba(255, 255, 255, 0.9)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              textAlign: 'center',
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={
                shouldAnimateText ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={
                shouldAnimateText
                  ? { duration: 0.6, delay: 0.8 }
                  : { duration: 0 }
              }
              style={{
                marginTop:
                  deviceType === 'mobile-landscape' ||
                  deviceType === 'mobile-portrait'
                    ? 'calc(var(--space-md) + 0.1875rem)'
                    : 'var(--space-lg)',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontSize:
                    deviceType === 'mobile-landscape' ||
                    deviceType === 'mobile-portrait'
                      ? 'var(--text-sm)'
                      : 'calc(var(--text-sm) + 0.05rem)',
                  fontFamily: 'Lato, sans-serif',
                  fontWeight: '400',
                  color: 'rgba(255, 255, 255, 0.7)',
                  margin: 0,
                  lineHeight: '1.3',
                }}
              >
                Currently research and develop projects that can be meaningful
                as well
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
