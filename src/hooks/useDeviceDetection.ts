import { useState, useEffect } from 'react';
import { DeviceInfo } from '../lib/types';
import { Breakpoints } from '../lib/responsiveUtils';

const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    // Server-side safe initial values
    const initialWidth =
      typeof window !== 'undefined' ? window.innerWidth : 1024;
    const initialHeight =
      typeof window !== 'undefined' ? window.innerHeight : 768;
    const initialPixelRatio =
      typeof window !== 'undefined' ? window.devicePixelRatio : 1;

    return getDeviceInfoFromDimensions(
      initialWidth,
      initialHeight,
      initialPixelRatio
    );
  });

  const detectDevice = () => {
    if (typeof window === 'undefined') return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const pixelRatio = window.devicePixelRatio || 1;

    setDeviceInfo(getDeviceInfoFromDimensions(width, height, pixelRatio));
  };

  useEffect(() => {
    detectDevice();

    const handleResize = () => detectDevice();
    const handleOrientationChange = () => setTimeout(detectDevice, 100);

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return deviceInfo;
};

// Helper function to determine device info from dimensions
const getDeviceInfoFromDimensions = (
  width: number,
  height: number,
  pixelRatio: number
): DeviceInfo => {
  const isLandscape = width > height;
  const aspectRatio = width / height;

  const isMobileWidth = width < Breakpoints.mobile;
  const isTabletWidth =
    width >= Breakpoints.mobile && width < Breakpoints.tablet;
  const isDesktopWidth = width >= Breakpoints.desktop;
  const isLandscapeMobile =
    isMobileWidth && isLandscape && aspectRatio > Breakpoints.landscapeRatio;

  // Client-side feature detection
  const isTouchDevice =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0);

  const isLowPerformance =
    typeof window !== 'undefined' &&
    (() => {
      if ('deviceMemory' in navigator && (navigator as any).deviceMemory < 4)
        return true;
      if (
        'hardwareConcurrency' in navigator &&
        navigator.hardwareConcurrency < 4
      )
        return true;
      return width < 768;
    })();

  const supportsWebGL =
    typeof window !== 'undefined' &&
    (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!(
          canvas.getContext('webgl') ||
          canvas.getContext('experimental-webgl') ||
          canvas.getContext('webgl2')
        );
      } catch {
        return false;
      }
    })();

  return {
    isMobile: isMobileWidth && !isLandscapeMobile,
    isTablet: isTabletWidth,
    isDesktop:
      isDesktopWidth ||
      (width >= Breakpoints.tablet && width < Breakpoints.desktop),
    isLandscapeMobile,
    isTouchDevice,
    isLowPerformance,
    screenWidth: width,
    screenHeight: height,
    devicePixelRatio: pixelRatio,
    orientation: isLandscape ? 'landscape' : 'portrait',
    isRetinaDisplay: pixelRatio > 1.5,
    supportsWebGL,
  };
};

export default useDeviceDetection;
