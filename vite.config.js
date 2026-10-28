import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Import path module

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Enable access from local network
    port: 3000, // Set a specific port for consistency
    open: true,
    // PERFORMANCE FIX: Optimize dev server
    hmr: {
      overlay: false, // Disable error overlay for performance
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // PERFORMANCE FIX: Optimize build settings
    target: 'esnext',
    minify: 'oxc', // Smaller first-load JS than terser here
    // Lightning CSS rewrites CSS for these browsers. With 'esnext' it drops
    // -webkit- fallbacks and switches media queries to range syntax.
    cssTarget: ['chrome87', 'edge88', 'firefox78', 'safari14', 'ios14'],
    rolldownOptions: {
      output: {
        // PERFORMANCE FIX: Manual chunking to reduce bundle size
        codeSplitting: {
          groups: [
            // Separate Three.js and React Three Fiber into their own chunk.
            // React rides along, as it did under Vite 4 (ui-vendor came out empty).
            {
              name: 'three-vendor',
              test: /[\\/]node_modules[\\/](three|@react-three[\\/](fiber|drei)|react|react-dom)[\\/]/,
            },
            // Separate Framer Motion into its own chunk
            {
              name: 'animation-vendor',
              test: /[\\/]node_modules[\\/](framer-motion|gsap)[\\/]/,
            },
          ],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  // PERFORMANCE FIX: Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
    ],
    exclude: ['@fortawesome/fontawesome-svg-core'], // Exclude heavy icon libraries from pre-bundling
  },
});
