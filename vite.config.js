import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Import path module

export default defineConfig({
  plugins: [react()],
  server: {
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
    minify: 'terser',
    rollupOptions: {
      output: {
        // PERFORMANCE FIX: Manual chunking to reduce bundle size
        manualChunks: {
          // Separate Three.js and React Three Fiber into their own chunk
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          // Separate Framer Motion into its own chunk
          'animation-vendor': ['framer-motion', 'gsap'],
          // Separate UI libraries
          'ui-vendor': ['react', 'react-dom'],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
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
