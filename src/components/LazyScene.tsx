import React, { Suspense } from 'react';
import { DeviceInfo } from '../lib/types';

// PERFORMANCE FIX: Lazy load the heavy 3D scene component
const SceneComponent = React.lazy(() => import('./Scene'));

// Error Boundary for debugging
class SceneErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Scene Error:', error, errorInfo);
  }

  render() {
    if ((this.state as any).hasError) {
      return (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#ff4444',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            fontSize: '1.2rem',
            padding: '20px',
            zIndex: 1000,
          }}
        >
          <h2>Scene Loading Error</h2>
          <p>Error: {(this.state as any).error?.message}</p>
          <p>Check browser console for details</p>
        </div>
      );
    }

    return (this.props as any).children;
  }
}

interface LazySceneProps {
  isDarkMode: boolean;
  showIsland: boolean;
  showSea: boolean;
  deviceInfo?: any;
  onNavigateToConnect?: () => void;
  onNavigateToPage?: (page: string) => void;
  onPlayClickSound?: () => void;
}

// Simple loading fallback to prevent layout shift
function SceneLoadingFallback({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: isDarkMode
          ? 'linear-gradient(to bottom, #162542 0%, #020918 100%)'
          : 'linear-gradient(to bottom, #00bbdc 0%, #87ceeb 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
      }}
    >
      <div
        style={{
          color: isDarkMode ? '#F8F6E3' : '#FFFFFF',
          fontSize: '1.2rem',
          fontFamily: 'Lato, sans-serif',
          opacity: 0.8,
        }}
      >
        Loading 3D Scene...
      </div>
    </div>
  );
}

export default function LazyScene({
  isDarkMode,
  showIsland,
  showSea,
  deviceInfo,
  onNavigateToConnect,
  onNavigateToPage,
  onPlayClickSound,
}: LazySceneProps): React.JSX.Element {
  return (
    <SceneErrorBoundary>
      <Suspense fallback={<SceneLoadingFallback isDarkMode={isDarkMode} />}>
        <SceneComponent
          isDarkMode={isDarkMode}
          showIsland={showIsland}
          showSea={showSea}
          deviceInfo={deviceInfo}
          onNavigateToConnect={onNavigateToConnect}
          onNavigateToPage={onNavigateToPage}
          onPlayClickSound={onPlayClickSound}
        />
      </Suspense>
    </SceneErrorBoundary>
  );
}
