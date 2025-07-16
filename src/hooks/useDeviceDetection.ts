import { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  isLowPerformance: boolean;
  screenWidth: number;
  screenHeight: number;
  devicePixelRatio: number;
  orientation: 'portrait' | 'landscape';
  isRetinaDisplay: boolean;
  supportsWebGL: boolean;
  isLandscapeMobile: boolean;
}

const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    // Initial values - will be updated after mount
    const initialWidth =
      typeof window !== 'undefined' ? window.innerWidth : 1024;
    const initialHeight =
      typeof window !== 'undefined' ? window.innerHeight : 768;
    const initialPixelRatio =
      typeof window !== 'undefined' ? window.devicePixelRatio : 1;

    const isMobileWidth = initialWidth < 768;
    const isLandscape = initialWidth > initialHeight;
    const aspectRatio = initialWidth / initialHeight;

    // Landscape mobile: mobile width but in landscape with significant aspect ratio difference
    const isLandscapeMobile = isMobileWidth && isLandscape && aspectRatio > 1.5;

    return {
      isMobile: isMobileWidth && !isLandscapeMobile, // Regular mobile excludes landscape mobile
      isTablet: initialWidth >= 768 && initialWidth < 1024,
      isDesktop: initialWidth >= 1024,
      isLandscapeMobile,
      isTouchDevice: false,
      isLowPerformance: false,
      screenWidth: initialWidth,
      screenHeight: initialHeight,
      devicePixelRatio: initialPixelRatio,
      orientation: isLandscape ? 'landscape' : 'portrait',
      isRetinaDisplay: initialPixelRatio > 1,
      supportsWebGL: false,
    };
  });

  const detectDevice = () => {
    if (typeof window === 'undefined') return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const pixelRatio = window.devicePixelRatio || 1;

    // Detect touch capability
    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0;

    // Detect low performance devices
    const isLowPerformance = (() => {
      // Check for limited memory (less than 4GB)
      if ('deviceMemory' in navigator) {
        return (navigator as any).deviceMemory < 4;
      }

      // Check for slow CPU (less than 4 cores)
      if ('hardwareConcurrency' in navigator) {
        return navigator.hardwareConcurrency < 4;
      }

      // Fallback: assume mobile devices are lower performance
      return width < 768;
    })();

    // Check WebGL support
    const supportsWebGL = (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!(
          canvas.getContext('webgl') ||
          canvas.getContext('experimental-webgl') ||
          canvas.getContext('webgl2')
        );
      } catch (e) {
        return false;
      }
    })();

    const isMobileWidth = width < 768;
    const isLandscape = width > height;
    const aspectRatio = width / height;

    // Landscape mobile: mobile width but in landscape with significant aspect ratio difference
    const isLandscapeMobile = isMobileWidth && isLandscape && aspectRatio > 1.5;

    setDeviceInfo({
      isMobile: isMobileWidth && !isLandscapeMobile, // Regular mobile excludes landscape mobile
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
      isLandscapeMobile,
      isTouchDevice,
      isLowPerformance,
      screenWidth: width,
      screenHeight: height,
      devicePixelRatio: pixelRatio,
      orientation: isLandscape ? 'landscape' : 'portrait',
      isRetinaDisplay: pixelRatio > 1.5, // More accurate retina detection
      supportsWebGL,
    });
  };

  useEffect(() => {
    // Initial detection
    detectDevice();

    // Listen for resize events
    const handleResize = () => {
      detectDevice();
    };

    // Listen for orientation changes
    const handleOrientationChange = () => {
      // Delay to ensure dimensions are updated
      setTimeout(detectDevice, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return deviceInfo;
};

export default useDeviceDetection;
