import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faMousePointer,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { DeviceInfo } from '../lib/types';
import {
  faJs,
  faReact,
  faFigma,
  faGithub as faGithubBrand,
} from '@fortawesome/free-brands-svg-icons';
import {
  SiFramer,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiNotion,
  SiGooglekeep,
  SiAdobephotoshop,
  SiAdobeillustrator,
  SiAdobepremierepro,
  SiAdobeaftereffects,
} from 'react-icons/si';
import { SlCursor } from 'react-icons/sl';

interface SkillsetPageProps {
  isVisible: boolean;
  onClose: () => void;
  onOpenBurgerMenu: (slideDirection?: 'left' | 'right') => void;
  isDarkMode: boolean;
  shouldAnimateText?: boolean;
  deviceInfo?: DeviceInfo;
}

type SkillCategory = 'tools' | 'programming' | 'languages';

interface SkillItem {
  name: string;
  description: string;
  icon: any;
  color: string;
  textColor?: string;
}

const skillsData: Record<SkillCategory, SkillItem[]> = {
  tools: [
    {
      name: 'Cursor',
      description: 'Primary code editor',
      icon: SlCursor,
      color: '#007ACC',
    },
    {
      name: 'Figma',
      description: 'UI/UX design and prototyping',
      icon: faFigma,
      color: '#ff7262',
    },
    {
      name: 'GitHub',
      description: 'Details on all projects',
      icon: faGithubBrand,
      color: '#333333',
    },
    {
      name: 'Google Keep',
      description: 'Minimalist to-do list',
      icon: SiGooglekeep,
      color: '#FBBC05',
      textColor: '#333333',
    },
    {
      name: 'Notion',
      description: 'Project management and documentation',
      icon: SiNotion,
      color: '#000000',
    },
  ],
  programming: [
    {
      name: 'Motion',
      description: 'Very cool animation library',
      icon: SiFramer,
      color: '#F7DF1E',
      textColor: '#000000',
    },
    {
      name: 'JavaScript',
      description: 'Primary language for web development',
      icon: faJs,
      color: '#F7DF1E',
      textColor: '#000000',
    },
    {
      name: 'React',
      description: 'Frontend library for building user interfaces',
      icon: faReact,
      color: '#61DAFB',
      textColor: '#000000',
    },
    {
      name: 'Tailwind CSS',
      description: 'CSS framework',
      icon: SiTailwindcss,
      color: '#06B6D4',
    },
    {
      name: 'Three.js',
      description: '3D graphics library',
      icon: SiThreedotjs,
      color: '#000000',
    },
    {
      name: 'TypeScript',
      description: 'Type-safe JavaScript development',
      icon: SiTypescript,
      color: '#3178C6',
    },
  ],
  languages: [
    {
      name: 'English',
      description: 'Fluent',
      icon: '🇺🇸',
      color: '#B22234',
    },
    {
      name: 'Indonesian',
      description: 'I was born here',
      icon: '🇮🇩',
      color: '#FF0000',
    },
  ],
};

const adobeApps: SkillItem[] = [
  {
    name: 'Photoshop',
    description: 'Little bit of patching and filters',
    icon: SiAdobephotoshop,
    color: '#33a8ff',
  },
  {
    name: 'Illustrator',
    description: 'For logo and banner',
    icon: SiAdobeillustrator,
    color: '#fd9b00',
  },
  {
    name: 'Premiere Pro',
    description: 'Back when I was trying to be a "Youtuber"',
    icon: SiAdobepremierepro,
    color: '#9999FF',
  },
  {
    name: 'After Effects',
    description: 'Easy animation',
    icon: SiAdobeaftereffects,
    color: '#4545a3',
  },
];

export default function SkillsetPage({
  isVisible,
  onClose,
  onOpenBurgerMenu,
  isDarkMode,
  shouldAnimateText = true,
  deviceInfo,
}: SkillsetPageProps) {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>('tools');
  const [isButtonHovered, setIsButtonHovered] = React.useState(false);
  const [showAdobePopup, setShowAdobePopup] = useState(false);

  // Responsive styling based on device
  const getContainerStyles = () => {
    const baseStyles = {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: isDarkMode
        ? 'rgba(22, 37, 66, 0.4)'
        : 'rgba(0, 97, 97, 0.4)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      opacity: 0.95,
      zIndex: 1500,
      display: 'flex',
      flexDirection: 'column' as const,
      color: '#ffffff',
      fontFamily: 'Lato, sans-serif',
      overflowY: 'auto' as const,
    };

    if (deviceInfo?.isMobile) {
      if (deviceInfo.orientation === 'landscape') {
        return {
          ...baseStyles,
          padding:
            'max(env(safe-area-inset-top), 10px) 16px max(env(safe-area-inset-bottom), 20px) 16px',
          justifyContent: 'flex-start',
          alignItems: 'center',
          height: '100dvh',
        };
      } else {
        // Portrait mobile
        return {
          ...baseStyles,
          padding:
            'max(env(safe-area-inset-top), 20px) 16px max(env(safe-area-inset-bottom), 40px) 16px',
          justifyContent: 'flex-start',
          alignItems: 'center',
          height: '100dvh',
        };
      }
    } else {
      return {
        ...baseStyles,
        padding: '40px',
        justifyContent: 'center',
        alignItems: 'center',
      };
    }
  };

  const getTitleStyles = () => {
    const baseStyles = {
      fontWeight: '900',
      fontFamily: 'Lato, sans-serif',
      marginBottom: '30px',
      background: 'linear-gradient(45deg, #ffffff, #e2e8f0)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
      letterSpacing: '-0.02em',
      textAlign: 'center' as const,
    };

    if (deviceInfo?.isMobile) {
      if (deviceInfo.orientation === 'landscape') {
        return {
          ...baseStyles,
          fontSize: '1.2rem', // Reduced from 1.6rem
          marginBottom: '4px', // Reduced from 10px
          marginTop: '2px', // Reduced from 5px
        };
      } else {
        return {
          ...baseStyles,
          fontSize: '2.2rem',
          marginBottom: '20px',
          marginTop: '20px',
        };
      }
    } else if (deviceInfo?.isTablet) {
      return {
        ...baseStyles,
        fontSize: '3rem',
        marginBottom: '25px',
      };
    } else {
      return {
        ...baseStyles,
        fontSize: '4rem',
      };
    }
  };

  const getCategoryButtonStyles = (category: SkillCategory) => {
    const isActive = activeCategory === category;
    const baseStyles = {
      padding: deviceInfo?.isMobile
        ? deviceInfo?.orientation === 'landscape'
          ? '6px 12px' // Reduced landscape padding
          : '12px 24px'
        : '15px 30px',
      margin: deviceInfo?.isMobile
        ? deviceInfo?.orientation === 'landscape'
          ? '0 3px' // Reduced landscape margin
          : '0 6px'
        : '0 10px',
      borderRadius: '12px',
      border: 'none',
      backgroundColor: isActive
        ? 'rgba(255, 255, 255, 0.2)'
        : 'rgba(255, 255, 255, 0.1)',
      color: '#ffffff',
      fontWeight: '600',
      fontSize: deviceInfo?.isMobile ? '0.9rem' : '1rem',
      fontFamily: 'Lato, sans-serif',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      backdropFilter: 'blur(10px)',
      boxShadow: isActive ? '0 4px 15px rgba(255, 255, 255, 0.2)' : 'none',
    };

    return baseStyles;
  };

  const getFooterStyles = () => {
    return {
      fontSize: deviceInfo?.isMobile ? '0.8rem' : '0.9rem',
      lineHeight: '1.6',
      fontFamily: 'Lato, sans-serif',
      fontWeight: '400',
      color: 'rgba(255, 255, 255, 0.7)',
      textAlign: 'center' as const,
      padding: deviceInfo?.isMobile ? '20px 16px' : '20px 40px',
      marginTop: 'auto',
    };
  };

  const renderLanguages = () => {
    return (
      <motion.div
        key='languages'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: deviceInfo?.isMobile
            ? deviceInfo.orientation === 'landscape'
              ? '20px'
              : '25px'
            : '50px',
          padding: deviceInfo?.isMobile
            ? deviceInfo.orientation === 'landscape'
              ? '15px'
              : '20px'
            : '40px',
        }}
      >
        {skillsData.languages.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 1, y: 10, scale: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.3,
              delay: 0.1 + index * 0.05,
              ease: 'easeOut',
            }}
            whileHover={{
              y: -12,
              transition: { duration: 0.08, ease: 'easeOut' },
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: deviceInfo?.isMobile ? '30px 20px' : '40px 30px',
              borderRadius: '24px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              cursor: 'pointer',
              minWidth: deviceInfo?.isMobile ? '140px' : '180px',
            }}
          >
            <div
              style={{
                fontSize: deviceInfo?.isMobile ? '60px' : '80px',
                marginBottom: '20px',
              }}
            >
              {skill.icon}
            </div>
            <h4
              style={{
                fontSize: deviceInfo?.isMobile
                  ? deviceInfo.orientation === 'landscape'
                    ? '0.9rem'
                    : '1rem'
                  : '1.4rem',
                fontWeight: '700',
                fontFamily: 'Lato, sans-serif',
                marginBottom: deviceInfo?.isMobile
                  ? deviceInfo.orientation === 'landscape'
                    ? '4px'
                    : '6px'
                  : '10px',
                color: '#ffffff',
                textAlign: 'center',
              }}
            >
              {skill.name}
            </h4>
            <p
              style={{
                fontSize: deviceInfo?.isMobile
                  ? deviceInfo.orientation === 'landscape'
                    ? '0.7rem'
                    : '0.8rem'
                  : '1rem',
                fontFamily: 'Lato, sans-serif',
                fontWeight: '400',
                color: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'center',
                margin: 0,
                lineHeight: '1.3',
              }}
            >
              {skill.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  const renderSkillsGrid = () => {
    const skills = skillsData[activeCategory];
    const showMoreButton = activeCategory === 'tools';

    return (
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
        style={{
          display: 'grid',
          gridTemplateColumns: deviceInfo?.isMobile
            ? deviceInfo.orientation === 'landscape'
              ? 'repeat(3, 1fr)'
              : 'repeat(2, 1fr)'
            : 'repeat(3, 1fr)',
          gridTemplateRows:
            deviceInfo?.isMobile && deviceInfo.orientation === 'landscape'
              ? 'repeat(2, 1fr)'
              : 'auto',
          gap: deviceInfo?.isMobile
            ? deviceInfo.orientation === 'landscape'
              ? '8px' // Reduced from 15px
              : '16px'
            : '30px',
          width: '100%',
          maxWidth: deviceInfo?.isMobile ? '380px' : '600px',
          justifyItems: 'center',
          alignContent: 'center',
        }}
      >
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 1, y: 10, scale: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.3,
              delay: 0.1 + index * 0.03,
              ease: 'easeOut',
            }}
            whileHover={{
              y: -10,
              transition: { duration: 0.08, ease: 'easeOut' },
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: deviceInfo?.isMobile
                ? deviceInfo.orientation === 'landscape'
                  ? '8px 6px' // Reduced from 12px 8px
                  : '16px 10px'
                : '28px 20px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(15px)',
              cursor: 'pointer',
              width: '100%',
              maxWidth: deviceInfo?.isMobile
                ? deviceInfo.orientation === 'landscape'
                  ? '100px' // Reduced from 120px
                  : '140px'
                : '180px',
              minHeight: deviceInfo?.isMobile
                ? deviceInfo.orientation === 'landscape'
                  ? '80px' // Reduced from 100px
                  : '120px'
                : '160px',
            }}
          >
            <div
              style={{
                width: deviceInfo?.isMobile
                  ? deviceInfo.orientation === 'landscape'
                    ? '28px' // Reduced from 35px
                    : '42px'
                  : '60px',
                height: deviceInfo?.isMobile
                  ? deviceInfo.orientation === 'landscape'
                    ? '28px' // Reduced from 35px
                    : '42px'
                  : '60px',
                borderRadius: '12px',
                backgroundColor: skill.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: deviceInfo?.isMobile
                  ? deviceInfo.orientation === 'landscape'
                    ? '4px' // Reduced from 8px
                    : '10px'
                  : '14px',
              }}
            >
              {typeof skill.icon === 'object' ? (
                <FontAwesomeIcon
                  icon={skill.icon}
                  style={{
                    fontSize: deviceInfo?.isMobile ? '22px' : '26px',
                    color: skill.textColor || '#ffffff',
                  }}
                />
              ) : (
                <skill.icon
                  style={{
                    fontSize: deviceInfo?.isMobile ? '22px' : '26px',
                    color: skill.textColor || '#ffffff',
                  }}
                />
              )}
            </div>
            <h4
              style={{
                fontSize: deviceInfo?.isMobile
                  ? deviceInfo.orientation === 'landscape'
                    ? '0.7rem' // Reduced for landscape
                    : '0.85rem'
                  : '1rem',
                fontWeight: '700',
                fontFamily: 'Lato, sans-serif',
                marginBottom:
                  deviceInfo?.isMobile && deviceInfo.orientation === 'landscape'
                    ? '3px'
                    : '6px',
                color: '#ffffff',
                textAlign: 'center',
              }}
            >
              {skill.name}
            </h4>
            <p
              style={{
                fontSize: deviceInfo?.isMobile
                  ? deviceInfo.orientation === 'landscape'
                    ? '0.6rem' // Reduced for landscape
                    : '0.7rem'
                  : '0.8rem',
                fontFamily: 'Lato, sans-serif',
                fontWeight: '400',
                color: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'center',
                margin: 0,
                lineHeight: '1.3',
              }}
            >
              {skill.description}
            </p>
          </motion.div>
        ))}

        {showMoreButton && (
          <motion.div
            initial={{ opacity: 1, y: 10, scale: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.3,
              delay: 0.1 + skills.length * 0.03,
              ease: 'easeOut',
            }}
            whileHover={{
              y: -10,
              transition: { duration: 0.08, ease: 'easeOut' },
            }}
            onClick={() => setShowAdobePopup(true)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: deviceInfo?.isMobile ? '20px 12px' : '28px 20px',
              borderRadius: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(15px)',
              cursor: 'pointer',
              width: '100%',
              maxWidth: deviceInfo?.isMobile ? '160px' : '180px',
              minHeight: deviceInfo?.isMobile ? '140px' : '160px',
              border: '2px dashed rgba(255, 255, 255, 0.3)',
            }}
          >
            <div
              style={{
                fontSize: deviceInfo?.isMobile ? '2rem' : '2.5rem',
                color: 'rgba(255, 255, 255, 0.6)',
                fontWeight: 'bold',
                letterSpacing: '0.2em',
              }}
            >
              ...
            </div>
            <p
              style={{
                fontSize: deviceInfo?.isMobile ? '0.7rem' : '0.8rem',
                fontFamily: 'Lato, sans-serif',
                fontWeight: '400',
                color: 'rgba(255, 255, 255, 0.6)',
                textAlign: 'center',
                margin: 0,
                marginTop: '10px',
                lineHeight: '1.3',
              }}
            >
              More tools
            </p>
          </motion.div>
        )}
      </motion.div>
    );
  };

  const renderAdobePopup = () => {
    return (
      <AnimatePresence>
        {showAdobePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowAdobePopup(false);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                backgroundColor: isDarkMode ? '#162542' : '#084CA6',
                borderRadius: '24px',
                padding: deviceInfo?.isMobile ? '30px 20px' : '40px 30px',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto',
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
            >
              {/* Close button */}
              <motion.button
                onClick={() => setShowAdobePopup(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: isDarkMode
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}
              >
                <FontAwesomeIcon icon={faTimes} style={{ fontSize: '16px' }} />
              </motion.button>

              {/* Title */}
              <h2
                style={{
                  fontSize: deviceInfo?.isMobile ? '1.5rem' : '2rem',
                  fontWeight: '700',
                  fontFamily: 'Lato, sans-serif',
                  color: '#ffffff',
                  marginBottom: '30px',
                  textAlign: 'center',
                  marginTop: '10px',
                }}
              >
                Other Tools
              </h2>

              {/* Adobe apps grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: deviceInfo?.isMobile
                    ? 'repeat(2, 1fr)'
                    : 'repeat(2, 1fr)',
                  gap: '20px',
                }}
              >
                {adobeApps.map((app, index) => (
                  <motion.div
                    key={app.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{
                      y: -5,
                      transition: { duration: 0.08, ease: 'easeOut' },
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: deviceInfo?.isMobile ? '20px 15px' : '25px 20px',
                      borderRadius: '16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(15px)',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '12px',
                        backgroundColor: app.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '12px',
                      }}
                    >
                      <app.icon
                        style={{
                          fontSize: '24px',
                          color: app.textColor || '#ffffff',
                        }}
                      />
                    </div>
                    <h4
                      style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        fontFamily: 'Lato, sans-serif',
                        marginBottom: '6px',
                        color: '#ffffff',
                        textAlign: 'center',
                      }}
                    >
                      {app.name}
                    </h4>
                    <p
                      style={{
                        fontSize: '0.8rem',
                        fontFamily: 'Lato, sans-serif',
                        fontWeight: '400',
                        color: 'rgba(255, 255, 255, 0.8)',
                        textAlign: 'center',
                        margin: 0,
                        lineHeight: '1.3',
                      }}
                    >
                      {app.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <p
                style={{
                  fontSize: deviceInfo?.isMobile ? '0.8rem' : '0.9rem',
                  fontFamily: 'Lato, sans-serif',
                  fontWeight: '400',
                  color: 'rgba(255, 255, 255, 0.6)',
                  textAlign: 'center',
                  margin: 0,
                  marginTop: '25px',
                  lineHeight: '1.4',
                }}
              >
                Not related but there's that
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
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
              backgroundColor: isDarkMode ? '#162542' : '#084CA6',
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
              shouldAnimateText ? { opacity: 1, y: 20 } : { opacity: 1, y: 0 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={
              shouldAnimateText
                ? { duration: 0.3, delay: 0.05 }
                : { duration: 0 }
            }
            style={{
              width: '100%',
              maxWidth: '1200px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
            }}
          >
            {/* Title */}
            <h1
              style={{
                fontSize: deviceInfo?.isMobile
                  ? deviceInfo?.orientation === 'landscape'
                    ? '1.3rem'
                    : '2.2rem'
                  : deviceInfo?.isTablet
                  ? '2.5rem'
                  : '3rem',
                fontWeight: '900',
                fontFamily: 'Lato, sans-serif',
                marginBottom: deviceInfo?.isMobile
                  ? deviceInfo?.orientation === 'landscape'
                    ? '6px'
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
              Skills
            </h1>

            {/* Category buttons */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: deviceInfo?.isMobile ? '30px' : '40px',
              }}
            >
              {(Object.keys(skillsData) as SkillCategory[]).map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  style={getCategoryButtonStyles(category)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className='touch-target'
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </motion.button>
              ))}
            </div>

            {/* Skills content */}
            {activeCategory === 'languages'
              ? renderLanguages()
              : renderSkillsGrid()}
          </motion.div>

          {/* Footer description */}
          <motion.div
            initial={{ opacity: 1, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            style={getFooterStyles()}
          >
            {activeCategory === 'tools'
              ? 'Tools that I use for task management, design, and development.'
              : activeCategory === 'programming'
              ? 'Specific things that I learn, not to be limited what I listed here. '
              : 'Shout out to Mr. Vance my private tutor. He is the reason I enjoy learning English so much.'}
          </motion.div>

          {/* Adobe Popup */}
          {renderAdobePopup()}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
