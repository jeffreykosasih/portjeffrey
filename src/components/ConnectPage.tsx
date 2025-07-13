import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import emailjs from '@emailjs/browser';

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
  onOpenBurgerMenu: () => void;
  isDarkMode: boolean;
  shouldAnimateText?: boolean;
  deviceInfo?: any;
}

export default function ConnectPage({
  isVisible,
  onClose,
  onOpenBurgerMenu,
  isDarkMode,
  shouldAnimateText = true,
  deviceInfo,
}: ConnectPageProps) {
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
      icon: <GmailIcon style={{ color: '#ffffff', fontSize: '1.5rem' }} />,
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
      <style>
        {`
          .bright-placeholder::placeholder {
            color: rgba(255, 255, 255, 0.9) !important;
            opacity: 1 !important;
          }
          .bright-placeholder::-webkit-input-placeholder {
            color: rgba(255, 255, 255, 0.9) !important;
            opacity: 1 !important;
          }
          .bright-placeholder::-moz-placeholder {
            color: rgba(255, 255, 255, 0.9) !important;
            opacity: 1 !important;
          }
          .bright-placeholder:-ms-input-placeholder {
            color: rgba(255, 255, 255, 0.9) !important;
            opacity: 1 !important;
          }
        `}
      </style>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: isDarkMode ? '#0f172a' : '#00bbdc',
              zIndex: 1500,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: deviceInfo?.isMobile ? 'flex-start' : 'center',
              alignItems: 'center',
              color: '#ffffff',
              padding: deviceInfo?.isMobile
                ? '20px 16px'
                : deviceInfo?.isTablet
                ? '30px 24px'
                : '40px',
              overflowY: 'auto',
            }}
          >
            {/* Back button with slide left to right effect */}
            <motion.button
              onClick={() => {
                onClose();
                onOpenBurgerMenu();
              }}
              initial={{ x: 20 }}
              animate={{ x: 0 }}
              whileHover={{ x: -5 }}
              transition={{ duration: 0.3 }}
              style={{
                borderRadius: '50%',
                position: 'absolute',
                top: deviceInfo?.isMobile ? '16px' : '20px',
                right: deviceInfo?.isMobile ? '16px' : '20px',
                zIndex: 1001,
                width: deviceInfo?.isMobile ? '48px' : '50px',
                height: deviceInfo?.isMobile ? '48px' : '50px',
                border: 'none',
                backgroundColor: isDarkMode ? '#131D4F' : '#00bbdc',
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
                  fontSize: deviceInfo?.isMobile
                    ? '2.5rem'
                    : deviceInfo?.isTablet
                    ? '3rem'
                    : '4rem',
                  fontWeight: '900',
                  fontFamily: 'Lato, sans-serif',
                  marginBottom: deviceInfo?.isMobile ? '20px' : '30px',
                  marginTop: deviceInfo?.isMobile ? '40px' : '0px',
                  background: 'linear-gradient(45deg, #ffffff, #e2e8f0)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  letterSpacing: '-0.02em',
                }}
              >
                Let's Connect!
              </h1>

              <p
                style={{
                  fontSize: deviceInfo?.isMobile
                    ? '1.1rem'
                    : deviceInfo?.isTablet
                    ? '1.3rem'
                    : '1.5rem',
                  lineHeight: '1.8',
                  fontFamily: 'Lato, sans-serif',
                  marginBottom: deviceInfo?.isMobile
                    ? '30px'
                    : deviceInfo?.isTablet
                    ? '40px'
                    : '50px',
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
                  display: 'grid',
                  gridTemplateColumns: deviceInfo?.isMobile
                    ? '1fr'
                    : deviceInfo?.isTablet
                    ? '1fr'
                    : 'repeat(auto-fit, minmax(400px, 1fr))',
                  gap: deviceInfo?.isMobile
                    ? '40px'
                    : deviceInfo?.isTablet
                    ? '50px'
                    : '60px',
                  alignItems: 'start',
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
                >
                  <h2
                    style={{
                      fontSize: deviceInfo?.isMobile
                        ? '1.5rem'
                        : deviceInfo?.isTablet
                        ? '1.75rem'
                        : '2rem',
                      fontWeight: '700',
                      fontFamily: 'Lato, sans-serif',
                      marginBottom: deviceInfo?.isMobile ? '20px' : '30px',
                      color: '#ffffff',
                      textAlign: deviceInfo?.isMobile ? 'center' : 'left',
                    }}
                  >
                    Links
                  </h2>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '15px',
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
                              : 'rgba(255, 255, 255, 0.1)',
                          borderRadius: deviceInfo?.isMobile ? '12px' : '15px',
                          padding: deviceInfo?.isMobile
                            ? '12px 16px 15px 16px'
                            : '12px 20px 15px 20px',
                          backdropFilter: 'blur(10px)',
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
                          gap: deviceInfo?.isMobile ? '16px' : '20px',
                          willChange: 'transform, background-color, opacity',
                        }}
                        onMouseEnter={() => setHoveredCardIndex(index)}
                        onMouseLeave={() => setHoveredCardIndex(null)}
                      >
                        <div
                          style={{
                            fontSize: deviceInfo?.isMobile
                              ? '1.25rem'
                              : '1.5rem',
                            flexShrink: 0,
                          }}
                        >
                          {method.icon}
                        </div>
                        <div>
                          <h3
                            style={{
                              fontSize: deviceInfo?.isMobile
                                ? '1rem'
                                : deviceInfo?.isTablet
                                ? '1.1rem'
                                : '1.2rem',
                              fontWeight: '600',
                              fontFamily: 'Lato, sans-serif',
                              marginBottom: '5px',
                              color: '#ffffff',
                            }}
                          >
                            {method.title}
                          </h3>
                          <p
                            style={{
                              fontSize: deviceInfo?.isMobile
                                ? '0.8rem'
                                : '0.9rem',
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
                >
                  <h2
                    style={{
                      fontSize: deviceInfo?.isMobile
                        ? '1.5rem'
                        : deviceInfo?.isTablet
                        ? '1.75rem'
                        : '2rem',
                      fontWeight: '700',
                      fontFamily: 'Lato, sans-serif',
                      marginBottom: deviceInfo?.isMobile ? '20px' : '30px',
                      color: '#ffffff',
                      textAlign: deviceInfo?.isMobile ? 'center' : 'left',
                    }}
                  >
                    Straight from site
                  </h2>

                  <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                    {/* Name Field */}
                    <div style={{ marginBottom: '20px' }}>
                      <input
                        type='text'
                        name='name'
                        placeholder='Your Name'
                        value={formData.name}
                        onChange={handleInputChange}
                        className='bright-placeholder'
                        style={{
                          width: '100%',
                          padding: deviceInfo?.isMobile
                            ? '12px 16px'
                            : '15px 20px',
                          borderRadius: deviceInfo?.isMobile ? '10px' : '12px',
                          border: formErrors.name
                            ? '2px solid #ef4444'
                            : '2px solid rgba(255, 255, 255, 0.2)',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          color: '#ffffff',
                          fontSize: deviceInfo?.isMobile ? '0.9rem' : '1rem',
                          fontFamily: 'Lato, sans-serif',
                          outline: 'none',
                          transition: 'border-color 0.3s ease',
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
                    <div style={{ marginBottom: '20px' }}>
                      <input
                        type='email'
                        name='email'
                        placeholder='Your Email'
                        value={formData.email}
                        onChange={handleInputChange}
                        className='bright-placeholder'
                        style={{
                          width: '100%',
                          padding: deviceInfo?.isMobile
                            ? '12px 16px'
                            : '15px 20px',
                          borderRadius: deviceInfo?.isMobile ? '10px' : '12px',
                          border: formErrors.email
                            ? '2px solid #ef4444'
                            : '2px solid rgba(255, 255, 255, 0.2)',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          color: '#ffffff',
                          fontSize: deviceInfo?.isMobile ? '0.9rem' : '1rem',
                          fontFamily: 'Lato, sans-serif',
                          outline: 'none',
                          transition: 'border-color 0.3s ease',
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
                    <div style={{ marginBottom: '20px' }}>
                      <textarea
                        name='message'
                        placeholder='Your Message'
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={5}
                        className='bright-placeholder'
                        style={{
                          width: '100%',
                          padding: deviceInfo?.isMobile
                            ? '12px 16px'
                            : '15px 20px',
                          borderRadius: deviceInfo?.isMobile ? '10px' : '12px',
                          border: formErrors.message
                            ? '2px solid #ef4444'
                            : '2px solid rgba(255, 255, 255, 0.2)',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          color: '#ffffff',
                          fontSize: deviceInfo?.isMobile ? '0.9rem' : '1rem',
                          fontFamily: 'Lato, sans-serif',
                          outline: 'none',
                          transition: 'border-color 0.3s ease',
                          resize: 'vertical',
                          minHeight: deviceInfo?.isMobile ? '100px' : '120px',
                          maxHeight: deviceInfo?.isMobile ? '300px' : '400px',
                          overflowY: 'auto',
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
                        padding: deviceInfo?.isMobile
                          ? '12px 24px'
                          : '15px 30px',
                        borderRadius: deviceInfo?.isMobile ? '10px' : '12px',
                        border: isSubmitting ? '2px solid #ffffff' : 'none',
                        backgroundColor: isSubmitting
                          ? 'rgba(255, 255, 255, 0.9)'
                          : isDarkMode
                          ? '#131D4F'
                          : '#00bbdc',
                        color: isSubmitting
                          ? isDarkMode
                            ? '#0f172a'
                            : '#00bbdc'
                          : '#ffffff',
                        fontSize: deviceInfo?.isMobile ? '1rem' : '1.1rem',
                        fontWeight: '600',
                        fontFamily: 'Lato, sans-serif',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: deviceInfo?.isMobile ? '8px' : '10px',
                        opacity: 1,
                        boxShadow: isSubmitting
                          ? '0 4px 12px rgba(255, 255, 255, 0.3)'
                          : 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSubmitting) {
                          (
                            e.target as HTMLButtonElement
                          ).style.backgroundColor = '#FFFFFF';
                          (e.target as HTMLButtonElement).style.color =
                            isDarkMode ? '#0f172a' : '#00bbdc';
                          (e.target as HTMLButtonElement).style.transform =
                            'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSubmitting) {
                          (
                            e.target as HTMLButtonElement
                          ).style.backgroundColor = isDarkMode
                            ? '#131D4F'
                            : '#00bbdc';
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
                    bottom: deviceInfo?.isMobile ? '20px' : '30px',
                    right: deviceInfo?.isMobile ? '20px' : '30px',
                    left: deviceInfo?.isMobile ? '20px' : 'auto',
                    background:
                      submitStatus === 'error' ? '#ef4444' : '#32d74b',
                    color: '#ffffff',
                    padding: deviceInfo?.isMobile ? '16px 20px' : '20px 30px',
                    borderRadius: deviceInfo?.isMobile ? '10px' : '12px',
                    fontSize: deviceInfo?.isMobile ? '0.9rem' : '1rem',
                    fontWeight: '600',
                    fontFamily: 'Lato, sans-serif',
                    boxShadow:
                      submitStatus === 'error'
                        ? '0 10px 30px rgba(239, 68, 68, 0.3)'
                        : '0 10px 30px rgba(50, 215, 75, 0.3)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    gap: deviceInfo?.isMobile ? '8px' : '10px',
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
