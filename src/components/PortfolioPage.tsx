import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faExternalLinkAlt,
  faRocket,
} from '@fortawesome/free-solid-svg-icons';

interface PortfolioPageProps {
  isVisible: boolean;
  onClose: () => void;
  onOpenBurgerMenu: (slideDirection?: 'left' | 'right') => void;
  isDarkMode: boolean;
  shouldAnimateText?: boolean;
  deviceInfo?: any;
}

export default function PortfolioPage({
  isVisible,
  onClose,
  onOpenBurgerMenu,
  isDarkMode,
  shouldAnimateText = true,
  deviceInfo,
}: PortfolioPageProps) {
  const [isButtonHovered, setIsButtonHovered] = React.useState(false);
  const projects = [
    {
      title: 'Katsu Retsu',
      description:
        'Front end site for restaurant with modern theme and animation',
      link: 'https://katsuretsu.vercel.app',
      status: 'Completed',
      image: '/assets/images/project_katsu.jpg',
      tech: ['Motion', 'Node.js', 'React', 'Tailwind', 'TypeScript'],
    },
    {
      title: 'Port Jeffrey',
      description:
        'Main site with island theme where I learn some three.js and movement!',
      link: 'https://jefri.dev',
      status: 'Completed',
      image: '/assets/images/profile.jpg',
      tech: ['Node.js', 'Three.js', 'Motion', 'React', 'Tailwind'],
    },
    {
      title: 'Muscle Memory',
      description: 'Simplify list of exercises for easier approach',
      link: 'https://musclememo.vercel.app',
      status: 'Completed',
      image: '/assets/images/project_muscle.jpg',
      tech: ['TypeScript', 'Node.js', 'Motion', 'React'],
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
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: deviceInfo?.isMobile ? '100dvh' : '100vh', // Use dynamic viewport height
            backgroundColor: isDarkMode
              ? 'rgba(22, 37, 66, 0.4)'
              : 'rgba(0, 97, 97, 0.4)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            opacity: 1,
            zIndex: 1500,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            visibility: isVisible ? 'visible' : 'hidden',
            color: '#ffffff',
            padding: deviceInfo?.isMobile
              ? deviceInfo?.orientation === 'landscape'
                ? 'max(env(safe-area-inset-top), 10px) 16px max(env(safe-area-inset-bottom), 20px) 16px'
                : 'max(env(safe-area-inset-top), 20px) 16px max(env(safe-area-inset-bottom), 40px) 16px'
              : deviceInfo?.isTablet
              ? '30px 24px'
              : '40px',
            overflowY: 'auto' as const, // Enable scrolling
            overflowX: 'hidden' as const, // Prevent horizontal scroll
            pointerEvents: isVisible ? 'auto' : 'none',
          }}
        >
          {/* Back button with slide left to right effect */}
          <motion.button
            onClick={() => {
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
              top: deviceInfo?.isMobile
                ? deviceInfo?.orientation === 'landscape'
                  ? 'max(env(safe-area-inset-top), 8px)'
                  : 'max(env(safe-area-inset-top), 16px)'
                : '20px',
              right: deviceInfo?.isMobile
                ? deviceInfo?.orientation === 'landscape'
                  ? '12px'
                  : '16px'
                : '20px',
              zIndex: 1001,
              width: deviceInfo?.isMobile
                ? deviceInfo?.orientation === 'landscape'
                  ? '40px'
                  : '48px'
                : '50px',
              height: deviceInfo?.isMobile
                ? deviceInfo?.orientation === 'landscape'
                  ? '40px'
                  : '48px'
                : '50px',
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
                fontSize: '20px',
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
              paddingTop: deviceInfo?.isMobile ? '80px' : '20px', // Space for back button
            }}
          >
            {/* Header */}
            <h1
              style={{
                fontSize: deviceInfo?.isMobile
                  ? deviceInfo?.orientation === 'landscape'
                    ? '1.3rem' // Reduced from 1.8rem
                    : '2.2rem'
                  : deviceInfo?.isTablet
                  ? '2.5rem'
                  : '3rem',
                fontWeight: '900',
                fontFamily: 'Lato, sans-serif',
                marginBottom: deviceInfo?.isMobile
                  ? deviceInfo?.orientation === 'landscape'
                    ? '6px' // Reduced from 12px
                    : '16px'
                  : deviceInfo?.isTablet
                  ? '20px'
                  : '25px',
                marginTop: deviceInfo?.isMobile ? '0' : '20px',
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
                gap: deviceInfo?.isMobile
                  ? deviceInfo?.orientation === 'landscape'
                    ? '8px' // Reduced from 15px
                    : '16px'
                  : '30px',
                padding: deviceInfo?.isMobile ? '0 10px' : '0 20px',
                flexWrap: 'wrap',
                marginTop: deviceInfo?.isMobile
                  ? deviceInfo?.orientation === 'landscape'
                    ? '8px' // Reduced from 15px
                    : '20px'
                  : '30px',
                marginBottom: deviceInfo?.isMobile ? '40px' : '20px', // Extra bottom margin for mobile scrolling
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
                    backdropFilter: 'blur(20px)',
                    cursor: project.link ? 'pointer' : 'default',
                    flex: '1',
                    minWidth: deviceInfo?.isMobile
                      ? deviceInfo?.orientation === 'landscape'
                        ? '110px'
                        : '160px'
                      : '225px',
                    maxWidth: deviceInfo?.isMobile
                      ? deviceInfo?.orientation === 'landscape'
                        ? '140px'
                        : '190px'
                      : '250px',
                    height: deviceInfo?.isMobile
                      ? deviceInfo?.orientation === 'landscape'
                        ? '220px'
                        : '360px'
                      : '520px',
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
                      height: '65%',
                      borderRadius: project.image
                        ? '20px 20px 0 0'
                        : '20px 20px 20px 20px',
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
                            fontSize: deviceInfo?.isMobile ? '24px' : '30px',
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
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          backdropFilter: 'blur(10px)',
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
                      padding: deviceInfo?.isMobile ? '10px 12px' : '12px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <h4
                      style={{
                        fontSize: deviceInfo?.isMobile ? '1rem' : '1.1rem',
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
                        fontSize: deviceInfo?.isMobile ? '0.75rem' : '0.85rem',
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

                  {/* Technology Tags Section - 15% */}
                  {project.tech && (
                    <div
                      style={{
                        height: '15%',
                        width: '100%',
                        padding: deviceInfo?.isMobile
                          ? '4px 12px 12px 12px'
                          : '6px 16px 16px 16px',
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
                        {project.tech.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            style={{
                              padding: deviceInfo?.isMobile
                                ? '6px 10px'
                                : '8px 12px',
                              background: 'rgba(255, 255, 255, 0.1)',
                              borderRadius: '6px',
                              fontSize: deviceInfo?.isMobile
                                ? '0.6rem'
                                : '0.7rem',
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
                marginTop: deviceInfo?.isMobile ? '15px' : '20px',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontSize: deviceInfo?.isMobile ? '0.8rem' : '0.9rem',
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
        </div>
      )}
    </AnimatePresence>
  );
}
