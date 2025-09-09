import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import emailjs from '@emailjs/browser';
import { DeviceInfo } from '../lib/types';
import {
  getResponsiveValue,
  getSpacing,
  ResponsiveValues,
} from '../lib/responsiveUtils';

// Gmail Icon Component
const GmailIcon = ({ style }: { style?: React.CSSProperties }) => (
  <svg
    viewBox='0 0 24 24'
    style={{ width: '1em', height: '1em', ...style }}
    fill='currentColor'
  >
    <path d='M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.910 1.528-1.145C21.69 2.28 24 3.434 24 5.457z' />
  </svg>
);

interface ConnectPageProps {
  isVisible: boolean;
  onClose: () => void;
  onOpenBurgerMenu: (slideDirection?: 'left' | 'right') => void;
  isDarkMode: boolean;
  shouldAnimateText?: boolean;
  deviceInfo?: DeviceInfo;
  onPlayClickSound?: () => void;
}

export default function ConnectPage({
  isVisible,
  onClose,
  onOpenBurgerMenu,
  isDarkMode,
  shouldAnimateText = true,
  deviceInfo,
  onPlayClickSound,
}: ConnectPageProps) {
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
  // Initialize EmailJS
  React.useEffect(() => {
    emailjs.init('xikWb0cmK5mzktYbT');
  }, []);

  const [isButtonHovered, setIsButtonHovered] = React.useState(false);
  const [hoveredCardIndex, setHoveredCardIndex] = React.useState<number | null>(
    null
  );
  const [showSuccessPopup, setShowSuccessPopup] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: '',
  });
  const [formErrors, setFormErrors] = React.useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  // Responsive styles based on device type (following ProfilePage pattern)
  const getContainerStyles = () => {
    const configs = {
      'mobile-landscape': {
        padding: 'var(--space-lg) var(--space-xl)',
        paddingTop: 'max(var(--space-lg), env(safe-area-inset-top))',
        paddingBottom: 'max(var(--space-lg), env(safe-area-inset-bottom))',
        height: '100dvh',
      },
      'mobile-portrait': {
        padding: 'var(--space-sm) var(--space-base)',
        paddingTop: 'max(var(--space-sm), env(safe-area-inset-top))',
        paddingBottom: 'max(var(--space-base), env(safe-area-inset-bottom))', // Reduced bottom padding for mobile
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

  const validateForm = () => {
    const errors: {
      name?: string;
      email?: string;
      message?: string;
    } = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Message validation
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      setSubmitStatus('idle');

      try {
        // EmailJS configuration
        const serviceID = 'service_gc4w4xq';
        const templateID = 'template_3gghxnp';
        const publicKey = 'xikWb0cmK5mzktYbT';

        // Template parameters
        const now = new Date();
        const templateParams = {
          name: formData.name, // For subject: {{name}}
          from_name: formData.name, // For content: {{from_name}}
          from_email: formData.email, // For content: {{from_email}}
          to_email: 'workwithjefri@gmail.com', // For recipient
          message: formData.message, // For content: {{message}}
          sent_date: now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          sent_time: now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short',
          }),
        };

        // Send email
        await emailjs.send(serviceID, templateID, templateParams);

        // Success
        setSubmitStatus('success');
        setShowSuccessPopup(true);
        setFormData({ name: '', email: '', message: '' });

        // Hide success popup after 3 seconds
        setTimeout(() => {
          setShowSuccessPopup(false);
          setSubmitStatus('idle');
        }, 3000);
      } catch (error: any) {
        console.error('EmailJS error:', error);
        setSubmitStatus('error');
        setShowSuccessPopup(true);

        // Hide error popup after 3 seconds
        setTimeout(() => {
          setShowSuccessPopup(false);
          setSubmitStatus('idle');
        }, 3000);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const contactMethods = [
    {
      title: 'Gmail',
      icon: (
        <GmailIcon style={{ color: '#ffffff', fontSize: 'var(--text-2xl)' }} />
      ), // Using CSS custom property
      description: 'workwithjefri@gmail.com',
      hoverColor: '#EA4335', // Gmail red
      link: 'mailto:workwithjefri@gmail.com',
    },
    {
      title: 'LinkedIn',
      icon: <FontAwesomeIcon icon={faLinkedin} style={{ color: '#ffffff' }} />,
      description: 'Professionally I have to do this',
      hoverColor: '#0077B5', // LinkedIn blue
      link: 'https://linkedin.com/in/jeffreykosasih',
    },
    {
      title: 'GitHub',
      icon: <FontAwesomeIcon icon={faGithub} style={{ color: '#ffffff' }} />,
      description: 'List of projects',
      hoverColor: '#333333', // GitHub dark
      link: 'https://github.com/jeffreykosasih',
    },
  ];

  return (
    <>
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
                onPlayClickSound?.();
                onClose();
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
                  deviceType === 'mobile-landscape' ||
                  deviceType === 'mobile-portrait'
                    ? 'var(--space-lg)'
                    : 'var(--space-xl)',
                right:
                  deviceType === 'mobile-landscape' ||
                  deviceType === 'mobile-portrait'
                    ? 'var(--space-lg)'
                    : 'var(--space-xl)',
                zIndex: 1001,
                width:
                  deviceType === 'mobile-landscape' ||
                  deviceType === 'mobile-portrait'
                    ? 'var(--touch-target-md)'
                    : 'var(--touch-target-lg)',
                height:
                  deviceType === 'mobile-landscape' ||
                  deviceType === 'mobile-portrait'
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
                maxWidth: '1000px',
                width: '100%',
                textAlign: 'center',
              }}
            >
              <h1
                style={{
                  fontSize:
                    deviceType === 'mobile-landscape'
                      ? 'var(--text-5xl)'
                      : deviceType === 'mobile-portrait'
                      ? 'var(--mobile-text-display)'
                      : deviceType === 'tablet'
                      ? 'var(--tablet-text-display)'
                      : 'var(--text-6xl)',
                  fontWeight: '900',
                  fontFamily: 'Lato, sans-serif',
                  marginBottom:
                    deviceType === 'mobile-landscape'
                      ? 'var(--space-base)'
                      : deviceType === 'mobile-portrait'
                      ? 'var(--space-sm)'
                      : deviceType === 'tablet'
                      ? 'var(--space-lg)'
                      : 'calc(var(--space-xl) + 0.3125rem)',
                  marginTop:
                    deviceType === 'mobile-landscape'
                      ? 'var(--space-sm)'
                      : deviceType === 'mobile-portrait'
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
                Let's Connect!
              </h1>

              <p
                style={{
                  fontSize:
                    deviceType === 'mobile-landscape'
                      ? 'var(--text-xl)'
                      : deviceType === 'mobile-portrait'
                      ? 'var(--text-base)'
                      : deviceType === 'tablet'
                      ? 'calc(var(--text-xl) + 0.1875rem)'
                      : 'var(--text-2xl)',
                  lineHeight:
                    deviceType === 'mobile-landscape'
                      ? '1.6'
                      : deviceType === 'mobile-portrait'
                      ? '1.8'
                      : deviceType === 'tablet'
                      ? '1.8'
                      : '1.8',
                  fontFamily: 'Lato, sans-serif',
                  marginBottom:
                    deviceType === 'mobile-landscape'
                      ? 'var(--space-xl)'
                      : deviceType === 'mobile-portrait'
                      ? 'var(--space-base)'
                      : deviceType === 'tablet'
                      ? 'var(--space-3xl)'
                      : 'calc(var(--space-3xl) + 0.125rem)',
                  fontWeight: '300',
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                I'm very excited to collaborate or connect with fellow
                developers and creators.
              </p>

              {/* Two Column Layout */}
              <div
                style={{
                  display: 'flex',
                  flexDirection:
                    deviceType === 'mobile-landscape' ||
                    deviceType === 'mobile-portrait' ||
                    deviceType === 'tablet'
                      ? 'column'
                      : 'row',
                  gap:
                    deviceType === 'mobile-landscape'
                      ? 'var(--space-lg)'
                      : deviceType === 'mobile-portrait'
                      ? 'var(--space-base)'
                      : deviceType === 'tablet'
                      ? 'var(--space-3xl)'
                      : 'calc(var(--space-4xl) - 0.25rem)',
                  alignItems: 'stretch',
                  justifyContent: 'center',
                  maxWidth: '100%',
                }}
              >
                {/* Contact Methods */}
                <motion.div
                  initial={
                    shouldAnimateText
                      ? { opacity: 0, x: -50 }
                      : { opacity: 1, x: 0 }
                  }
                  animate={{ opacity: 1, x: 0 }}
                  transition={
                    shouldAnimateText
                      ? { duration: 0.6, delay: 0.4 }
                      : { duration: 0 }
                  }
                  style={{
                    flex:
                      deviceType === 'mobile-landscape' ||
                      deviceType === 'mobile-portrait' ||
                      deviceType === 'tablet'
                        ? '1'
                        : '1',
                    minWidth: '0', // Prevent flex item overflow
                    width: '100%',
                  }}
                >
                  <h2
                    style={{
                      fontSize:
                        deviceType === 'mobile-landscape'
                          ? 'calc(var(--text-2xl) - 0.25rem)'
                          : deviceType === 'mobile-portrait'
                          ? 'var(--text-2xl)'
                          : deviceType === 'tablet'
                          ? 'calc(var(--text-2xl) - 0.125rem)'
                          : 'var(--text-3xl)',
                      fontWeight: '700',
                      fontFamily: 'Lato, sans-serif',
                      marginBottom:
                        deviceType === 'mobile-landscape'
                          ? 'var(--space-base)'
                          : deviceType === 'mobile-portrait'
                          ? 'var(--space-sm)'
                          : deviceType === 'tablet'
                          ? 'calc(var(--space-xl) + 0.625rem)'
                          : 'calc(var(--space-xl) + 0.625rem)',
                      color: '#ffffff',
                      textAlign:
                        deviceType === 'mobile-landscape'
                          ? 'left'
                          : deviceType === 'mobile-portrait'
                          ? 'center'
                          : deviceType === 'tablet'
                          ? 'center'
                          : 'left',
                    }}
                  >
                    Links
                  </h2>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap:
                        deviceType === 'mobile-portrait'
                          ? 'var(--space-sm)'
                          : deviceType === 'mobile-landscape'
                          ? 'var(--space-base)'
                          : 'calc(var(--space-md) + 0.1875rem)',
                    }}
                  >
                    {contactMethods.map((method, index) => (
                      <motion.button
                        key={method.title}
                        onClick={() => {
                          if (method.link.startsWith('mailto:')) {
                            window.location.href = method.link;
                          } else {
                            window.open(method.link, '_blank');
                          }
                        }}
                        style={{
                          background:
                            hoveredCardIndex === index
                              ? method.hoverColor
                              : isDarkMode
                              ? 'rgba(255, 255, 255, 0.1)'
                              : 'rgba(255, 255, 255, 0.1)',
                          borderRadius:
                            deviceType === 'mobile-landscape' ||
                            deviceType === 'mobile-portrait'
                              ? 'var(--radius-md)'
                              : 'calc(var(--radius-md) + 0.1875rem)',
                          padding:
                            deviceType === 'mobile-landscape'
                              ? 'var(--space-sm) var(--space-base)'
                              : deviceType === 'mobile-portrait'
                              ? 'var(--space-sm) var(--space-base)'
                              : deviceType === 'tablet'
                              ? 'var(--space-md) var(--space-lg) calc(var(--space-md) + 0.1875rem) var(--space-lg)'
                              : 'var(--space-md) var(--space-lg) calc(var(--space-md) + 0.1875rem) var(--space-lg)',
                          border: 'none',
                          cursor: 'pointer',
                          transform:
                            hoveredCardIndex === index
                              ? 'translateY(-3px) scale(1.02)'
                              : 'translateY(0) scale(1)',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          display: 'flex',
                          alignItems: 'center',
                          textAlign: 'left',
                          width: '100%',
                          gap:
                            deviceType === 'mobile-landscape'
                              ? 'calc(var(--space-base) + 0.125rem)'
                              : deviceType === 'mobile-portrait'
                              ? 'var(--space-base)'
                              : deviceType === 'tablet'
                              ? 'var(--space-lg)'
                              : 'var(--space-lg)',
                          willChange: 'transform, background-color, opacity',
                        }}
                        onMouseEnter={() => setHoveredCardIndex(index)}
                        onMouseLeave={() => setHoveredCardIndex(null)}
                      >
                        <div
                          style={{
                            fontSize:
                              deviceType === 'mobile-landscape'
                                ? 'var(--text-2xl)'
                                : deviceType === 'mobile-portrait'
                                ? 'var(--text-xl)'
                                : deviceType === 'tablet'
                                ? 'var(--text-2xl)'
                                : 'var(--text-2xl)',
                            flexShrink: 0,
                          }}
                        >
                          {method.icon}
                        </div>
                        <div>
                          <h3
                            style={{
                              fontSize:
                                deviceType === 'mobile-landscape'
                                  ? 'calc(var(--text-base) + 0.0625rem)'
                                  : deviceType === 'mobile-portrait'
                                  ? 'var(--text-base)'
                                  : deviceType === 'tablet'
                                  ? 'calc(var(--text-base) + 0.0625rem)'
                                  : 'var(--text-xl)',
                              fontWeight: '600',
                              fontFamily: 'Lato, sans-serif',
                              marginBottom: 'var(--space-xs)',
                              color: '#ffffff',
                            }}
                          >
                            {method.title}
                          </h3>
                          <p
                            style={{
                              fontSize:
                                deviceType === 'mobile-landscape'
                                  ? 'calc(var(--text-sm) + 0.05rem)'
                                  : deviceType === 'mobile-portrait'
                                  ? 'var(--text-sm)'
                                  : deviceType === 'tablet'
                                  ? 'calc(var(--text-sm) + 0.05rem)'
                                  : 'calc(var(--text-sm) + 0.05rem)',
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontFamily: 'Lato, sans-serif',
                              margin: 0,
                            }}
                          >
                            {method.description}
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                  initial={
                    shouldAnimateText
                      ? { opacity: 0, x: 50 }
                      : { opacity: 1, x: 0 }
                  }
                  animate={{ opacity: 1, x: 0 }}
                  transition={
                    shouldAnimateText
                      ? { duration: 0.6, delay: 0.6 }
                      : { duration: 0 }
                  }
                  style={{
                    flex:
                      deviceType === 'mobile-landscape' ||
                      deviceType === 'mobile-portrait' ||
                      deviceType === 'tablet'
                        ? '1'
                        : '1',
                    minWidth: '0', // Prevent flex item overflow
                    width: '100%',
                  }}
                >
                  <h2
                    style={{
                      fontSize:
                        deviceType === 'mobile-landscape'
                          ? 'calc(var(--text-2xl) - 0.25rem)'
                          : deviceType === 'mobile-portrait'
                          ? 'var(--text-2xl)'
                          : deviceType === 'tablet'
                          ? 'calc(var(--text-2xl) - 0.125rem)'
                          : 'var(--text-3xl)',
                      fontWeight: '700',
                      fontFamily: 'Lato, sans-serif',
                      marginBottom:
                        deviceType === 'mobile-portrait'
                          ? 'var(--space-sm)'
                          : deviceType === 'mobile-landscape'
                          ? 'var(--space-base)'
                          : 'var(--space-lg)',
                      color: '#ffffff',
                      textAlign:
                        deviceType === 'mobile-landscape' ||
                        deviceType === 'mobile-portrait'
                          ? 'center'
                          : 'left',
                    }}
                  >
                    Straight from site
                  </h2>

                  <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                    {/* Name Field */}
                    <div
                      style={{
                        marginBottom:
                          deviceType === 'mobile-portrait'
                            ? 'var(--space-base)'
                            : deviceType === 'mobile-landscape'
                            ? 'var(--space-base)'
                            : 'var(--space-lg)',
                      }}
                    >
                      <input
                        type='text'
                        name='name'
                        placeholder='Your Name'
                        value={formData.name}
                        onChange={handleInputChange}
                        className='bright-placeholder'
                        style={{
                          width: '100%',
                          padding:
                            deviceType === 'mobile-landscape' ||
                            deviceType === 'mobile-portrait'
                              ? 'calc(var(--space-md) + 0.125rem) var(--space-base)' // Slightly larger padding for better touch
                              : 'calc(var(--space-md) + 0.1875rem) var(--space-lg)',
                          borderRadius: 'var(--radius-md)',
                          border: formErrors.name
                            ? '2px solid #ef4444'
                            : '2px solid rgba(255, 255, 255, 0.2)',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          color: '#ffffff',
                          fontSize:
                            deviceType === 'mobile-landscape' ||
                            deviceType === 'mobile-portrait'
                              ? '1rem'
                              : 'var(--text-base)', // 16px prevents zoom on iOS
                          fontFamily: 'Lato, sans-serif',
                          outline: 'none',
                          transition: 'border-color 0.3s ease',
                          boxSizing: 'border-box',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor =
                            'rgba(255, 255, 255, 0.4)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = formErrors.name
                            ? '#ef4444'
                            : 'rgba(255, 255, 255, 0.2)';
                        }}
                      />
                      {formErrors.name && (
                        <p
                          style={{
                            color: '#ef4444',
                            fontSize: '0.875rem',
                            marginTop: '5px',
                            marginLeft: '5px',
                          }}
                        >
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div
                      style={{
                        marginBottom:
                          deviceType === 'mobile-portrait'
                            ? 'var(--space-base)'
                            : deviceType === 'mobile-landscape'
                            ? 'var(--space-base)'
                            : 'var(--space-lg)',
                      }}
                    >
                      <input
                        type='email'
                        name='email'
                        placeholder='Your Email'
                        value={formData.email}
                        onChange={handleInputChange}
                        className='bright-placeholder'
                        style={{
                          width: '100%',
                          padding:
                            deviceType === 'mobile-landscape' ||
                            deviceType === 'mobile-portrait'
                              ? 'calc(var(--space-md) + 0.125rem) var(--space-base)' // Slightly larger padding for better touch
                              : 'calc(var(--space-md) + 0.1875rem) var(--space-lg)',
                          borderRadius: 'var(--radius-md)',
                          border: formErrors.email
                            ? '2px solid #ef4444'
                            : '2px solid rgba(255, 255, 255, 0.2)',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          color: '#ffffff',
                          fontSize:
                            deviceType === 'mobile-landscape' ||
                            deviceType === 'mobile-portrait'
                              ? '1rem'
                              : 'var(--text-base)', // 16px prevents zoom on iOS
                          fontFamily: 'Lato, sans-serif',
                          outline: 'none',
                          transition: 'border-color 0.3s ease',
                          boxSizing: 'border-box',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor =
                            'rgba(255, 255, 255, 0.4)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = formErrors.email
                            ? '#ef4444'
                            : 'rgba(255, 255, 255, 0.2)';
                        }}
                      />
                      {formErrors.email && (
                        <p
                          style={{
                            color: '#ef4444',
                            fontSize: '0.875rem',
                            marginTop: '5px',
                            marginLeft: '5px',
                          }}
                        >
                          {formErrors.email}
                        </p>
                      )}
                    </div>

                    {/* Message Field */}
                    <div
                      style={{
                        marginBottom:
                          deviceType === 'mobile-portrait'
                            ? 'var(--space-base)'
                            : deviceType === 'mobile-landscape'
                            ? 'var(--space-base)'
                            : 'var(--space-lg)',
                      }}
                    >
                      <textarea
                        name='message'
                        placeholder='Your Message'
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={
                          deviceType === 'mobile-portrait'
                            ? 3
                            : deviceType === 'mobile-landscape'
                            ? 3
                            : 5
                        }
                        className='bright-placeholder'
                        style={{
                          width: '100%',
                          padding:
                            deviceType === 'mobile-landscape' ||
                            deviceType === 'mobile-portrait'
                              ? 'calc(var(--space-md) + 0.125rem) var(--space-base)' // Slightly larger padding for better touch
                              : 'calc(var(--space-md) + 0.1875rem) var(--space-lg)',
                          borderRadius: 'var(--radius-md)',
                          border: formErrors.message
                            ? '2px solid #ef4444'
                            : '2px solid rgba(255, 255, 255, 0.2)',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          color: '#ffffff',
                          fontSize:
                            deviceType === 'mobile-landscape' ||
                            deviceType === 'mobile-portrait'
                              ? '1rem'
                              : 'var(--text-base)', // 16px prevents zoom on iOS
                          fontFamily: 'Lato, sans-serif',
                          outline: 'none',
                          transition: 'border-color 0.3s ease',
                          resize: 'vertical',
                          minHeight:
                            deviceType === 'mobile-landscape'
                              ? '5rem'
                              : deviceType === 'mobile-portrait'
                              ? '4rem'
                              : '7.5rem', // Reduced mobile min height to fit content
                          maxHeight:
                            deviceType === 'mobile-landscape' ||
                            deviceType === 'mobile-portrait'
                              ? '18.75rem'
                              : '25rem',
                          overflowY: 'auto',
                          boxSizing: 'border-box',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor =
                            'rgba(255, 255, 255, 0.4)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = formErrors.message
                            ? '#ef4444'
                            : 'rgba(255, 255, 255, 0.2)';
                        }}
                      />
                      {formErrors.message && (
                        <p
                          style={{
                            color: '#ef4444',
                            fontSize: '0.875rem',
                            marginTop: '5px',
                            marginLeft: '5px',
                          }}
                        >
                          {formErrors.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type='submit'
                      disabled={isSubmitting}
                      style={{
                        width: '100%',
                        padding:
                          deviceType === 'mobile-landscape' ||
                          deviceType === 'mobile-portrait'
                            ? 'var(--space-base) var(--space-xl)' // Larger padding for better touch
                            : 'calc(var(--space-md) + 0.1875rem) calc(var(--space-xl) + 0.625rem)',
                        borderRadius: '12px',
                        border: isSubmitting ? '2px solid #ffffff' : 'none',
                        backgroundColor: isSubmitting
                          ? 'rgba(255, 255, 255, 0.9)'
                          : isDarkMode
                          ? '#162542'
                          : '#005E80',
                        color: isSubmitting
                          ? isDarkMode
                            ? '#162542'
                            : '#005E80'
                          : '#ffffff',
                        fontSize:
                          deviceType === 'mobile-landscape' ||
                          deviceType === 'mobile-portrait'
                            ? '1rem'
                            : 'calc(var(--text-base) + 0.0625rem)',
                        fontWeight: '600',
                        fontFamily: 'Lato, sans-serif',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap:
                          deviceType === 'mobile-landscape' ||
                          deviceType === 'mobile-portrait'
                            ? 'var(--space-sm)'
                            : 'var(--space-sm)',
                        opacity: 1,
                        boxShadow: isSubmitting
                          ? '0 4px 12px rgba(255, 255, 255, 0.3)'
                          : 'none',
                        minHeight:
                          deviceType === 'mobile-landscape' ||
                          deviceType === 'mobile-portrait'
                            ? 'var(--touch-target-md)'
                            : 'auto', // Minimum touch target
                        boxSizing: 'border-box',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSubmitting) {
                          (
                            e.target as HTMLButtonElement
                          ).style.backgroundColor = '#FFFFFF';
                          (e.target as HTMLButtonElement).style.color =
                            isDarkMode ? '#162542' : '#005E80';
                          (e.target as HTMLButtonElement).style.transform =
                            'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSubmitting) {
                          (
                            e.target as HTMLButtonElement
                          ).style.backgroundColor = isDarkMode
                            ? '#162542'
                            : '#005E80';
                          (e.target as HTMLButtonElement).style.color =
                            '#ffffff';
                          (e.target as HTMLButtonElement).style.transform =
                            'translateY(0)';
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faEnvelope} />
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </motion.div>
              </div>
            </motion.div>

            {/* Success/Error Popup */}
            <AnimatePresence>
              {showSuccessPopup && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 50 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: 'fixed',
                    bottom:
                      deviceType === 'mobile-landscape' ||
                      deviceType === 'mobile-portrait'
                        ? 'var(--space-lg)'
                        : 'calc(var(--space-xl) + 0.625rem)',
                    right:
                      deviceType === 'mobile-landscape' ||
                      deviceType === 'mobile-portrait'
                        ? 'var(--space-lg)'
                        : 'calc(var(--space-xl) + 0.625rem)',
                    left:
                      deviceType === 'mobile-landscape' ||
                      deviceType === 'mobile-portrait'
                        ? 'var(--space-lg)'
                        : 'auto',
                    background:
                      submitStatus === 'error' ? '#ef4444' : '#32d74b',
                    color: '#ffffff',
                    padding:
                      deviceType === 'mobile-landscape' ||
                      deviceType === 'mobile-portrait'
                        ? 'var(--space-base) var(--space-lg)'
                        : 'var(--space-lg) calc(var(--space-xl) + 0.625rem)',
                    borderRadius:
                      deviceType === 'mobile-landscape' ||
                      deviceType === 'mobile-portrait'
                        ? 'var(--space-sm)'
                        : 'var(--radius-md)',
                    fontSize:
                      deviceType === 'mobile-landscape' ||
                      deviceType === 'mobile-portrait'
                        ? 'calc(var(--text-sm) + 0.05rem)'
                        : 'var(--text-base)',
                    fontWeight: '600',
                    fontFamily: 'Lato, sans-serif',
                    boxShadow:
                      submitStatus === 'error'
                        ? '0 10px 30px rgba(239, 68, 68, 0.3)'
                        : '0 10px 30px rgba(50, 215, 75, 0.3)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    gap:
                      deviceType === 'mobile-landscape' ||
                      deviceType === 'mobile-portrait'
                        ? 'var(--space-sm)'
                        : 'var(--space-sm)',
                  }}
                >
                  <FontAwesomeIcon icon={faEnvelope} />
                  {submitStatus === 'error'
                    ? 'Failed to send message. Please try again.'
                    : 'Message sent successfully!'}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
