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
  getResponsiveValue,
  getSpacing,
  ResponsiveValues,
} from '../lib/responsiveUtils';
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
  onPlayClickSound?: () => void;
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
  onPlayClickSound,
}: SkillsetPageProps) {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>('tools');
  const [isButtonHovered, setIsButtonHovered] = React.useState(false);
  const [showAdobePopup, setShowAdobePopup] = useState(false);

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

  // Responsive styling based on device (following ProfilePage pattern)
  const getContainerStyles = () => {
    const configs = {
      'mobile-landscape': {
        padding: `max(env(safe-area-inset-top), var(--space-lg)) var(--space-xl) max(env(safe-area-inset-bottom), var(--space-lg)) var(--space-xl)`,
        height: '100dvh',
      },
      'mobile-portrait': {
        padding: `max(env(safe-area-inset-top), var(--space-lg)) var(--space-base) max(env(safe-area-inset-bottom), var(--space-3xl)) var(--space-base)`,
        height: '100dvh',
      },
      tablet: {
        padding: 'var(--space-3xl) var(--space-xl)',
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

  const getTitleStyles = () => {
    const configs = {
      'mobile-landscape': {
        fontSize: 'var(--text-5xl)',
        marginBottom: 'var(--space-lg)',
        marginTop: 'var(--space-sm)',
      },
      'mobile-portrait': {
        fontSize: 'var(--mobile-text-display)',
        marginBottom: 'var(--space-lg)',
        marginTop: 'var(--space-lg)',
      },
      tablet: {
        fontSize: 'var(--tablet-text-display)',
        marginBottom: 'calc(var(--space-xl) + 0.3125rem)',
      },
      desktop: {
        fontSize: 'var(--text-6xl)',
        marginTop: 'var(--space-2xl)',
      },
    };

    return {
      fontWeight: '900',
      fontFamily: 'Lato, sans-serif',
      background: 'linear-gradient(45deg, #ffffff, #e2e8f0)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
      letterSpacing: '-0.02em',
      textAlign: 'center' as const,
      ...configs[deviceType],
    };
  };

  const getCategoryButtonStyles = (category: SkillCategory) => {
    const isActive = activeCategory === category;
    const configs = {
      'mobile-landscape': {
        padding: 'var(--space-md) var(--space-xl)',
        margin: '0 var(--space-sm)',
        fontSize: 'var(--text-base)',
      },
      'mobile-portrait': {
        padding: 'var(--space-md) var(--space-xl)',
        margin: '0 var(--space-xs)',
        fontSize: 'var(--text-sm)',
      },
      tablet: {
        padding:
          'calc(var(--space-md) + 0.1875rem) calc(var(--space-xl) + 0.375rem)',
        margin: '0 var(--space-sm)',
        fontSize: 'var(--text-base)',
      },
      desktop: {
        padding:
          'calc(var(--space-md) + 0.1875rem) calc(var(--space-xl) + 0.375rem)',
        margin: '0 var(--space-sm)',
        fontSize: 'var(--text-base)',
      },
    };

    return {
      borderRadius: 'var(--radius-lg)',
      border: 'none',
      backgroundColor: isActive
        ? 'rgba(255, 255, 255, 0.2)'
        : 'rgba(255, 255, 255, 0.2)',
      color: '#ffffff',
      fontWeight: '600',
      fontFamily: 'Lato, sans-serif',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      boxShadow: isActive
        ? '0 0.25rem 0.9375rem rgba(255, 255, 255, 0.2)'
        : 'none',
      ...configs[deviceType],
    };
  };

  const getFooterStyles = () => {
    const configs = {
      'mobile-landscape': {
        fontSize: 'var(--text-sm)',
        padding: 'var(--space-lg) var(--space-base)',
      },
      'mobile-portrait': {
        fontSize: 'var(--text-sm)',
        padding: 'var(--space-lg) var(--space-base)',
      },
      tablet: {
        fontSize: 'var(--text-base)',
        padding: 'var(--space-lg) var(--space-3xl)',
      },
      desktop: {
        fontSize: 'var(--text-base)',
        padding: 'var(--space-lg) var(--space-3xl)',
      },
    };

    return {
      lineHeight: '1.6',
      fontFamily: 'Lato, sans-serif',
      fontWeight: '400',
      color: 'rgba(255, 255, 255, 0.7)',
      textAlign: 'center' as const,
      marginTop: 'auto',
      ...configs[deviceType],
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
          gap:
            deviceType === 'mobile-landscape'
              ? 'var(--space-3xl)'
              : deviceType === 'mobile-portrait'
              ? 'calc(var(--space-xl) + 0.5625rem)'
              : deviceType === 'tablet'
              ? 'var(--space-4xl)'
              : 'var(--space-4xl)',
          padding:
            deviceType === 'mobile-landscape'
              ? 'calc(var(--space-xl) + 0.375rem)'
              : deviceType === 'mobile-portrait'
              ? 'var(--space-lg)'
              : deviceType === 'tablet'
              ? 'var(--space-3xl)'
              : 'var(--space-3xl)',
        }}
      >
        {skillsData.languages.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 10, scale: 1 }}
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
              padding:
                deviceType === 'mobile-landscape'
                  ? 'calc(var(--space-2xl) + 0.1875rem) calc(var(--space-xl) + 0.0625rem)'
                  : deviceType === 'mobile-portrait'
                  ? 'calc(var(--space-xl) + 0.625rem) var(--space-lg)'
                  : deviceType === 'tablet'
                  ? 'var(--space-3xl) calc(var(--space-xl) + 0.625rem)'
                  : 'var(--space-3xl) calc(var(--space-xl) + 0.625rem)',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: isDarkMode
                ? 'rgba(255, 255, 255, 0.15)'
                : 'rgba(255, 255, 255, 0.15)',
              cursor: 'pointer',
              minWidth:
                deviceType === 'mobile-landscape'
                  ? '10rem'
                  : deviceType === 'mobile-portrait'
                  ? '8.75rem'
                  : deviceType === 'tablet'
                  ? '11.25rem'
                  : '11.25rem',
            }}
          >
            <div
              style={{
                fontSize:
                  deviceType === 'mobile-landscape'
                    ? 'calc(var(--text-6xl) + 0.625rem)'
                    : deviceType === 'mobile-portrait'
                    ? 'calc(var(--text-5xl) + 0.75rem)'
                    : deviceType === 'tablet'
                    ? 'calc(var(--text-6xl) + 1.25rem)'
                    : 'calc(var(--text-6xl) + 1.25rem)',
                marginBottom: 'var(--space-lg)',
              }}
            >
              {skill.icon}
            </div>
            <h4
              style={{
                fontSize:
                  deviceType === 'mobile-landscape'
                    ? 'var(--text-xl)'
                    : deviceType === 'mobile-portrait'
                    ? 'var(--text-base)'
                    : deviceType === 'tablet'
                    ? 'var(--text-2xl)'
                    : 'var(--text-2xl)',
                fontWeight: '700',
                fontFamily: 'Lato, sans-serif',
                marginBottom:
                  deviceType === 'mobile-landscape'
                    ? 'var(--space-sm)'
                    : deviceType === 'mobile-portrait'
                    ? 'var(--space-xs)'
                    : deviceType === 'tablet'
                    ? 'var(--space-sm)'
                    : 'var(--space-sm)',
                color: '#ffffff',
                textAlign: 'center',
              }}
            >
              {skill.name}
            </h4>
            <p
              style={{
                fontSize:
                  deviceType === 'mobile-landscape'
                    ? 'var(--text-sm)'
                    : deviceType === 'mobile-portrait'
                    ? 'calc(var(--text-sm) - 0.05rem)'
                    : deviceType === 'tablet'
                    ? 'var(--text-base)'
                    : 'var(--text-base)',
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
          gridTemplateColumns:
            deviceType === 'mobile-landscape'
              ? 'repeat(3, 1fr)'
              : deviceType === 'mobile-portrait'
              ? 'repeat(2, 1fr)'
              : deviceType === 'tablet'
              ? 'repeat(3, 1fr)'
              : 'repeat(3, 1fr)',
          gridTemplateRows:
            deviceType === 'mobile-landscape'
              ? 'repeat(2, 1fr)'
              : deviceType === 'mobile-portrait'
              ? 'auto'
              : deviceType === 'tablet'
              ? 'auto'
              : 'auto',
          gap:
            deviceType === 'mobile-landscape'
              ? 'var(--space-lg)'
              : deviceType === 'mobile-portrait'
              ? 'var(--space-base)'
              : deviceType === 'tablet'
              ? 'calc(var(--space-xl) + 0.625rem)'
              : 'calc(var(--space-xl) + 0.625rem)',
          width: '100%',
          maxWidth:
            deviceType === 'mobile-landscape'
              ? '31.25rem'
              : deviceType === 'mobile-portrait'
              ? '23.75rem'
              : deviceType === 'tablet'
              ? '37.5rem'
              : '37.5rem',
          justifyItems: 'center',
          alignContent: 'center',
        }}
      >
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 10, scale: 1 }}
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
              padding:
                deviceType === 'mobile-landscape'
                  ? 'var(--space-lg) calc(var(--space-md) + 0.1875rem)'
                  : deviceType === 'mobile-portrait'
                  ? 'var(--space-base) var(--space-sm)'
                  : deviceType === 'tablet'
                  ? 'calc(var(--space-xl) + 0.75rem) var(--space-lg)'
                  : 'calc(var(--space-xl) + 0.75rem) var(--space-lg)',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: isDarkMode
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              width: '100%',
              maxWidth:
                deviceType === 'mobile-landscape'
                  ? '8.75rem'
                  : deviceType === 'mobile-portrait'
                  ? '8.75rem'
                  : deviceType === 'tablet'
                  ? '11.25rem'
                  : '11.25rem',
              minHeight:
                deviceType === 'mobile-landscape'
                  ? '7.5rem'
                  : deviceType === 'mobile-portrait'
                  ? '7.5rem'
                  : deviceType === 'tablet'
                  ? '10rem'
                  : '10rem',
            }}
          >
            <div
              style={{
                width:
                  deviceType === 'mobile-landscape'
                    ? 'var(--space-4xl)'
                    : deviceType === 'mobile-portrait'
                    ? 'calc(var(--space-2xl) + 0.625rem)'
                    : deviceType === 'tablet'
                    ? 'calc(var(--space-4xl) - 0.25rem)'
                    : 'calc(var(--space-4xl) - 0.25rem)',
                height:
                  deviceType === 'mobile-landscape'
                    ? 'var(--space-4xl)'
                    : deviceType === 'mobile-portrait'
                    ? 'calc(var(--space-2xl) + 0.625rem)'
                    : deviceType === 'tablet'
                    ? 'calc(var(--space-4xl) - 0.25rem)'
                    : 'calc(var(--space-4xl) - 0.25rem)',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: skill.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom:
                  deviceType === 'mobile-landscape'
                    ? 'var(--space-sm)'
                    : deviceType === 'mobile-portrait'
                    ? 'var(--space-sm)'
                    : deviceType === 'tablet'
                    ? 'calc(var(--space-md) + 0.125rem)'
                    : 'calc(var(--space-md) + 0.125rem)',
              }}
            >
              {typeof skill.icon === 'object' ? (
                <FontAwesomeIcon
                  icon={skill.icon}
                  style={{
                    fontSize:
                      deviceType === 'mobile-landscape'
                        ? 'var(--text-2xl)'
                        : deviceType === 'mobile-portrait'
                        ? 'calc(var(--text-xl) + 0.125rem)'
                        : deviceType === 'tablet'
                        ? 'calc(var(--text-2xl) + 0.125rem)'
                        : 'calc(var(--text-2xl) + 0.125rem)',
                    color: skill.textColor || '#ffffff',
                  }}
                />
              ) : (
                <skill.icon
                  style={{
                    fontSize:
                      deviceType === 'mobile-landscape'
                        ? 'var(--text-2xl)'
                        : deviceType === 'mobile-portrait'
                        ? 'calc(var(--text-xl) + 0.125rem)'
                        : deviceType === 'tablet'
                        ? 'calc(var(--text-2xl) + 0.125rem)'
                        : 'calc(var(--text-2xl) + 0.125rem)',
                    color: skill.textColor || '#ffffff',
                  }}
                />
              )}
            </div>
            <h4
              style={{
                fontSize:
                  deviceType === 'mobile-landscape'
                    ? 'calc(var(--text-base) - 0.05rem)'
                    : deviceType === 'mobile-portrait'
                    ? 'calc(var(--text-sm) + 0.05rem)'
                    : deviceType === 'tablet'
                    ? 'var(--text-base)'
                    : 'var(--text-base)',
                fontWeight: '700',
                fontFamily: 'Lato, sans-serif',
                marginBottom:
                  deviceType === 'mobile-landscape'
                    ? 'var(--space-xs)'
                    : deviceType === 'mobile-portrait'
                    ? 'var(--space-xs)'
                    : deviceType === 'tablet'
                    ? 'var(--space-xs)'
                    : 'var(--space-xs)',
                color: '#ffffff',
                textAlign: 'center',
              }}
            >
              {skill.name}
            </h4>
            <p
              style={{
                fontSize:
                  deviceType === 'mobile-landscape'
                    ? 'calc(var(--text-sm) - 0.125rem)'
                    : deviceType === 'mobile-portrait'
                    ? 'calc(var(--text-sm) - 0.125rem)'
                    : deviceType === 'tablet'
                    ? 'calc(var(--text-sm) - 0.05rem)'
                    : 'calc(var(--text-sm) - 0.05rem)',
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
            initial={{ opacity: 0, y: 10, scale: 1 }}
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
              borderRadius: 'var(--radius-lg)',
              backgroundColor: isDarkMode
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(255, 255, 255, 0.05)',
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
            transition={{ duration: 0.5 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
                backgroundColor: isDarkMode ? '#162542' : '#005E80',
                borderRadius: 'var(--radius-lg)',
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
                  borderRadius: 'var(--radius-lg)',
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
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: isDarkMode
                        ? 'rgba(255, 255, 255, 0.04)'
                        : 'rgba(255, 255, 255, 0.04)',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: 'var(--radius-lg)',
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
          transition={{ duration: 0.5 }}
          style={getContainerStyles()}
        >
          {/* Back button with slide left to right effect */}
          <motion.button
            onClick={() => {
              onPlayClickSound?.(); // Play click sound
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
            initial={{ opacity: 0, y: 10 }}
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
