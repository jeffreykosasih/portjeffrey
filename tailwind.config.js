/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      // Mobile devices
      xs: '320px', // Small mobile (portrait)
      sm: '480px', // Mobile landscape / larger mobile
      mobile: '640px', // Large mobile devices

      // Tablet devices
      md: '768px', // Tablet portrait
      tablet: '900px', // Tablet landscape / small laptop

      // Laptop and desktop
      lg: '1024px', // Small laptop
      laptop: '1280px', // Standard laptop
      xl: '1440px', // Large laptop / small desktop
      desktop: '1600px', // Standard desktop
      '2xl': '1920px', // Large desktop
      '3xl': '2560px', // Ultra-wide / 4K displays

      // Orientation-specific breakpoints
      landscape: { raw: '(orientation: landscape)' },
      portrait: { raw: '(orientation: portrait)' },

      // Combined device + orientation breakpoints
      'mobile-landscape': {
        raw: '(max-width: 900px) and (orientation: landscape)',
      },
      'tablet-landscape': {
        raw: '(min-width: 768px) and (max-width: 1024px) and (orientation: landscape)',
      },
      'mobile-portrait': {
        raw: '(max-width: 640px) and (orientation: portrait)',
      },
      'tablet-portrait': {
        raw: '(min-width: 640px) and (max-width: 900px) and (orientation: portrait)',
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0ea5e9', // sky-500
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      fontSize: {
        'responsive-xs': ['0.75rem', { lineHeight: '1rem' }],
        'responsive-sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'responsive-base': ['1rem', { lineHeight: '1.5rem' }],
        'responsive-lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'responsive-xl': ['1.25rem', { lineHeight: '1.75rem' }],
        'responsive-2xl': ['1.5rem', { lineHeight: '2rem' }],
        'responsive-3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        'responsive-4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      minHeight: {
        touch: '44px',
        'screen-safe':
          'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
      },
    },
  },
  plugins: [],
};
