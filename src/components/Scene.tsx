import React, {
  Suspense,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { Canvas, useFrame, ThreeEvent, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import ObjectPopupMenu from './ObjectPopupMenu';

interface SceneProps {
  isDarkMode: boolean;
  showIsland: boolean;
  showSea: boolean;
  deviceInfo?: any;
  onNavigateToConnect?: () => void;
  onNavigateToPage?: (page: string) => void;
  onPlayClickSound?: () => void;
  showExploreNotification?: boolean;
  isBurgerMenuOpen?: boolean;
  triggerInitialZoom?: boolean;
}

// ============================================
// Interactive Object Wrapper

interface InteractiveObjectProps {
  children: React.ReactNode;
  onHover: (hovered: boolean) => void;
  onClick?: () => void;
  boundingBox?: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
}

// Component to apply brightness effect on hover
function ObjectBrightness({
  object,
  isHovered,
  isDarkMode,
}: {
  object: any;
  isHovered: boolean;
  isDarkMode?: boolean;
}) {
  const originalMaterials = useRef<Map<any, any>>(new Map());

  useEffect(() => {
    if (!object) return;

    object.traverse((child: any) => {
      if (child.isMesh && child.material) {
        // Store original material properties
        if (!originalMaterials.current.has(child.material)) {
          const original = {
            color: child.material.color.clone(),
            emissive: child.material.emissive
              ? child.material.emissive.clone()
              : null,
            emissiveIntensity: child.material.emissiveIntensity || 0,
          };
          originalMaterials.current.set(child.material, original);
        }

        const original = originalMaterials.current.get(child.material);

        if (isHovered) {
          // Apply balanced brightness effect that won't cause disappearing
          const colorMultiplier = isDarkMode ? 2.2 : 1.4; // Reduced multipliers to prevent overexposure
          const emissiveMultiplier = isDarkMode ? 2.0 : 1.2;
          const emissiveBoost = isDarkMode ? 0.5 : 0.2;

          child.material.color
            .copy(original.color)
            .multiplyScalar(colorMultiplier);

          if (child.material.emissive && original.emissive) {
            child.material.emissive
              .copy(original.emissive)
              .multiplyScalar(emissiveMultiplier);
          }

          if ('emissiveIntensity' in child.material) {
            child.material.emissiveIntensity = Math.min(
              isDarkMode ? 1.5 : 1.0, // Reduced max values to prevent overexposure
              original.emissiveIntensity + emissiveBoost
            );
          }
        } else {
          // Restore original properties
          child.material.color.copy(original.color);
          if (child.material.emissive && original.emissive) {
            child.material.emissive.copy(original.emissive);
          }
          if ('emissiveIntensity' in child.material) {
            child.material.emissiveIntensity = original.emissiveIntensity;
          }
        }

        child.material.needsUpdate = true;
      }
    });
  }, [object, isHovered, isDarkMode]);

  return null;
}

function InteractiveObject({
  children,
  onHover,
  onClick,
  boundingBox = [10, 10, 10],
  position = [0, 0, 0],
  rotation,
  isDarkMode,
}: InteractiveObjectProps & { isDarkMode?: boolean }) {
  const timeoutRef = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const objectRef = useRef<any>(null);

  const handlePointerEnter = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      document.body.style.cursor = 'pointer';
      setIsHovered(true);
      onHover(true);
    },
    [onHover]
  );

  const handlePointerLeave = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      // Remove timeout - keep brightness while cursor is on object
      document.body.style.cursor = 'default';
      setIsHovered(false);
      onHover(false);
    },
    [onHover]
  );

  // Cleanup effect no longer needed since we removed setTimeout

  return (
    <group>
      <mesh
        position={position}
        rotation={rotation}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={onClick}
        visible={false}
      >
        <boxGeometry args={boundingBox} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <group ref={objectRef}>{children}</group>
    </group>
  );
}

// Utility Functions

interface MaterialSettings {
  isLight?: boolean;
  isNatural?: boolean;
  isWood?: boolean;
  isMetal?: boolean;
  isCrystal?: boolean;
  fallbackColor?: { r: number; g: number; b: number };
  emissiveColor?: string;
  emissiveIntensity?: number;
}

function applyMaterialSettings(
  material: any,
  isDarkMode: boolean,
  settings: MaterialSettings = {}
) {
  if (!material?.color) return;

  const {
    isLight = false,
    isNatural = false,
    isWood = false,
    isMetal = false,
    isCrystal = false,
    fallbackColor = { r: 0.6, g: 0.5, b: 0.4 },
    emissiveColor = '#000000',
    emissiveIntensity = 0,
  } = settings;

  // Set material properties
  if ('roughness' in material) {
    material.roughness = isCrystal
      ? 0.1
      : isNatural
      ? 0.8
      : isMetal
      ? 0.3
      : 0.7;
  }
  if ('metalness' in material) {
    material.metalness = isCrystal
      ? 0.8
      : isMetal
      ? 0.7
      : isNatural
      ? 0.0
      : 0.1;
  }

  // Store original color once
  if (!material.userData) material.userData = {};
  if (!material.userData.originalColor) {
    const brightness = material.color.r + material.color.g + material.color.b;
    const isOverBright =
      brightness > 2.8 ||
      (material.color.r > 0.95 &&
        material.color.g > 0.95 &&
        material.color.b > 0.95);

    material.userData.originalColor = isOverBright
      ? fallbackColor
      : {
          r: material.color.r,
          g: material.color.g,
          b: material.color.b,
        };
  }

  // Reset to original color
  const { r, g, b } = material.userData.originalColor;
  material.color.setRGB(r, g, b);

  // Apply lighting effects
  if (isDarkMode) {
    if (isLight || isCrystal) {
      if (material.emissive?.setHex) material.emissive.setHex(emissiveColor);
      if ('emissiveIntensity' in material)
        material.emissiveIntensity = emissiveIntensity || 1.0;
      if (isCrystal && material.emissive?.copy)
        material.emissive.copy(material.color);
    } else {
      if (material.emissive?.setHex) material.emissive.setHex(0x000000);
      if ('emissiveIntensity' in material) material.emissiveIntensity = 0;
    }
  } else {
    // Sunlight brightness
    const brightFactor = isNatural ? 2.2 : isWood ? 1.8 : isMetal ? 1.6 : 1.9;
    material.color.multiplyScalar(brightFactor);

    // Add warm sunlight tint
    if (!isLight && !isCrystal) {
      const warmTint = isNatural ? 0.05 : 0.03;
      material.color.r = Math.min(1.0, material.color.r + warmTint);
      material.color.g = Math.min(1.0, material.color.g + warmTint * 0.8);
    }

    if (material.emissive?.setHex) material.emissive.setHex(0x000000);
    if ('emissiveIntensity' in material) material.emissiveIntensity = 0;
  }

  if ('needsUpdate' in material) material.needsUpdate = true;
}

function safeTraverse(object: any, callback: (node: any) => void) {
  if (!object) return;

  try {
    callback(object);
    if (object.children?.length) {
      object.children.forEach((child: any) => {
        if (child && typeof child === 'object') {
          safeTraverse(child, callback);
        }
      });
    }
  } catch (error) {
    console.warn('Error during scene traversal:', error);
  }
}

function processSceneNode(
  scene: any,
  isDarkMode: boolean,
  materialProcessor: (node: any, material: any) => void
) {
  if (!scene?.clone) {
    console.warn('Scene is invalid, skipping processing');
    return null;
  }

  let clonedScene;
  try {
    clonedScene = scene.clone();

    // Deep clone materials to prevent sharing
    clonedScene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        child.material = Array.isArray(child.material)
          ? child.material.map((mat: any) => mat.clone())
          : child.material.clone();
      }
    });
  } catch (error) {
    console.warn('Failed to clone scene:', error);
    return scene;
  }

  if (!clonedScene) return scene;

  safeTraverse(clonedScene, (node: any) => {
    if (!node?.isMesh) return;

    const nodeName = node.name?.toLowerCase() || '';
    const parentName = node.parent?.name?.toLowerCase() || '';

    // Remove spheres but keep fire elements
    const isFireElement = ['fire', 'flame', 'ember'].some(
      (term) => nodeName.includes(term) || parentName.includes(term)
    );

    const isSphere =
      node.geometry &&
      (['SphereGeometry', 'SphereBufferGeometry'].includes(
        node.geometry.type
      ) ||
        nodeName.includes('sphere') ||
        parentName.includes('sphere'));

    if (!isFireElement && isSphere) {
      try {
        node.removeFromParent?.();
      } catch (error) {
        console.warn('Error removing sphere node:', error);
      }
      return;
    }

    // Process materials
    if (node.material) {
      try {
        const materials = Array.isArray(node.material)
          ? node.material
          : [node.material];
        materials.forEach((material: any) => {
          if (material) materialProcessor(node, material);
        });
      } catch (error) {
        console.warn('Error processing material:', error);
      }
    }
  });

  return clonedScene;
}

// Island Terrain Components

function SimpleIsland({
  isDarkMode,
  deviceInfo,
}: {
  isDarkMode: boolean;
  deviceInfo?: any;
}) {
  const { scene } = useGLTF('/models/object_island.glb');

  // Adjust island scale based on device to maintain proportions with zoomed camera
  const getIslandScale = () => {
    if (deviceInfo?.isLandscapeMobile) {
      return [0.51, 0.51, 0.51] as [number, number, number]; // Between desktop and mobile scaling
    } else if (deviceInfo?.isMobile) {
      return [0.55, 0.55, 0.55] as [number, number, number]; // Slightly larger for mobile
    } else if (deviceInfo?.isTablet) {
      return [0.52, 0.52, 0.52] as [number, number, number]; // Slightly larger for tablet
    } else {
      return [0.5, 0.5, 0.5] as [number, number, number]; // Original desktop scale
    }
  };

  const clonedScene = processSceneNode(scene, isDarkMode, (node, material) => {
    // Store original color if not already stored
    if (!material.userData) material.userData = {};
    if (!material.userData.originalColor) {
      const brightness = material.color.r + material.color.g + material.color.b;
      const isOverBright =
        brightness > 2.8 ||
        (material.color.r > 0.95 &&
          material.color.g > 0.95 &&
          material.color.b > 0.95);

      material.userData.originalColor = isOverBright
        ? { r: 0.6, g: 0.5, b: 0.4 } // Fallback color for overbright materials
        : {
            r: material.color.r,
            g: material.color.g,
            b: material.color.b,
          };
    }

    const { r, g, b } = material.userData.originalColor;
    material.color.setRGB(r, g, b);

    if (isDarkMode) {
      material.color.multiplyScalar(0.1);
    } else {
      material.color.multiplyScalar(2.4);
    }

    // Set material properties for natural terrain
    if ('roughness' in material) material.roughness = 1.8;
    if ('metalness' in material) material.metalness = 0.1;
    material.needsUpdate = true;
  });

  // Handle case where scene processing failed
  if (!clonedScene) {
    return null;
  }

  return (
    <primitive
      object={clonedScene}
      position={[0, -2, 0]}
      scale={getIslandScale()}
    />
  );
}

// Buildings & Structures

function SimpleCloud({
  modelPath,
  position,
  scale,
  isDarkMode,
}: {
  modelPath: string;
  position: [number, number, number];
  scale: number;
  isDarkMode: boolean;
}) {
  const { scene } = useGLTF(modelPath);

  if (!scene) {
    return (
      <mesh position={position}>
        <boxGeometry args={[5, 2.5, 5]} />
        <meshStandardMaterial color={isDarkMode ? '#1a237e' : '#ffffff'} />
      </mesh>
    );
  }

  const clonedScene = processSceneNode(scene, isDarkMode, (node, material) => {
    if ('roughness' in material) material.roughness = 0.9;
    if ('metalness' in material) material.metalness = 0.0;

    if (isDarkMode) {
      material.color.setHex(0x1a237e);
    } else {
      material.color.setHex(0xffffff);
      material.color.multiplyScalar(1.8);
      if (material.emissive?.setHex) material.emissive.setHex(0xffffff);
      if ('emissiveIntensity' in material) material.emissiveIntensity = 0.5;
    }

    material.needsUpdate = true;
  });

  // Handle case where scene processing failed
  if (!clonedScene) {
    return null;
  }

  return (
    <primitive
      object={clonedScene}
      position={position}
      scale={[scale, scale, scale]}
      rotation={[0, 0, 0]}
    />
  );
}

function AnimatedCloud({
  modelPath,
  basePosition,
  scale,
  moveRange,
  isDarkMode,
  speed = 1,
  isBurgerMenuOpen,
}: {
  modelPath: string;
  basePosition: [number, number, number];
  scale: number;
  moveRange: number;
  isDarkMode: boolean;
  speed?: number;
  isBurgerMenuOpen?: boolean;
}) {
  const cloudRef = useRef<any>(null);
  const frameCountRef = useRef(0);

  useFrame(({ clock }) => {
    // Throttle animations when burger menu is open for better performance
    frameCountRef.current++;
    const shouldUpdate = isBurgerMenuOpen
      ? frameCountRef.current % 3 === 0
      : true;

    if (cloudRef.current && shouldUpdate) {
      const time = clock.getElapsedTime();

      // Create a triangle wave function for smooth back-and-forth movement
      // This makes clouds travel from -moveRange to +moveRange and back
      const cycle = (time * speed * 0.02) % 2; // Much slower cycle - complete cycle every 100/speed seconds
      let progress;

      if (cycle < 1) {
        // Moving from left to right (0 to 1)
        progress = cycle;
      } else {
        // Moving from right to left (1 to 0)
        progress = 2 - cycle;
      }

      // Smooth the movement with easing
      const eased = 0.5 - 0.5 * Math.cos(progress * Math.PI);

      // Map to actual position range
      const xOffset = (eased - 0.5) * 2 * moveRange;
      cloudRef.current.position.x = basePosition[0] + xOffset;
    }
  });

  return (
    <group ref={cloudRef} position={basePosition}>
      <SimpleCloud
        modelPath={modelPath}
        position={[0, 0, 0]}
        scale={scale}
        isDarkMode={isDarkMode}
      />
    </group>
  );
}

function SimpleClouds({
  isDarkMode,
  deviceInfo,
  isBurgerMenuOpen,
}: {
  isDarkMode: boolean;
  deviceInfo?: any;
  isBurgerMenuOpen?: boolean;
}) {
  // Enhanced cloud settings - 4 clouds total (2 left, 2 right)
  const getCloudSettings = () => {
    if (deviceInfo?.isLandscapeMobile) {
      return {
        scale1: 4.2,
        scale2: 3.7,
        scale3: 4.0,
        scale4: 4.4,
        positions: {
          cloud1: [-98, 36, 145] as [number, number, number], // Left back
          cloud2: [-98, 36, 72] as [number, number, number], // Left front
          cloud3: [98, 36, 145] as [number, number, number], // Right back
          cloud4: [98, 36, 72] as [number, number, number], // Right front
        },
      };
    } else if (deviceInfo?.isMobile) {
      return {
        scale1: 5,
        scale2: 4.5,
        scale3: 4.8,
        scale4: 5.2,
        positions: {
          cloud1: [-90, 40, 130] as [number, number, number], // Left back
          cloud2: [-90, 40, 65] as [number, number, number], // Left front
          cloud3: [90, 40, 130] as [number, number, number], // Right back
          cloud4: [90, 40, 65] as [number, number, number], // Right front
        },
      };
    } else if (deviceInfo?.isTablet) {
      return {
        scale1: 4.5,
        scale2: 4,
        scale3: 4.3,
        scale4: 4.7,
        positions: {
          cloud1: [-95, 37, 140] as [number, number, number], // Left back
          cloud2: [-95, 37, 70] as [number, number, number], // Left front
          cloud3: [95, 37, 140] as [number, number, number], // Right back
          cloud4: [95, 37, 70] as [number, number, number], // Right front
        },
      };
    } else {
      return {
        scale1: 4,
        scale2: 3.5,
        scale3: 3.8,
        scale4: 4.2,
        positions: {
          cloud1: [-100, 35, 150] as [number, number, number], // Left back
          cloud2: [-100, 35, 75] as [number, number, number], // Left front
          cloud3: [100, 35, 150] as [number, number, number], // Right back
          cloud4: [100, 35, 75] as [number, number, number], // Right front
        },
      };
    }
  };

  const cloudSettings = getCloudSettings();

  return (
    <group>
      {/* Left side clouds */}
      <AnimatedCloud
        modelPath='/models/object_cloud1.glb'
        basePosition={cloudSettings.positions.cloud1}
        scale={cloudSettings.scale1}
        moveRange={70}
        speed={0.5}
        isDarkMode={isDarkMode}
        isBurgerMenuOpen={isBurgerMenuOpen}
      />
      <AnimatedCloud
        modelPath='/models/object_cloud2.glb'
        basePosition={cloudSettings.positions.cloud2}
        scale={cloudSettings.scale2}
        moveRange={70}
        speed={0.5}
        isDarkMode={isDarkMode}
        isBurgerMenuOpen={isBurgerMenuOpen}
      />

      {/* Right side clouds */}
      <AnimatedCloud
        modelPath='/models/object_cloud3.glb'
        basePosition={cloudSettings.positions.cloud3}
        scale={cloudSettings.scale3}
        moveRange={70}
        speed={0.6}
        isDarkMode={isDarkMode}
        isBurgerMenuOpen={isBurgerMenuOpen}
      />
      <AnimatedCloud
        modelPath='/models/object_cloud4.glb'
        basePosition={cloudSettings.positions.cloud4}
        scale={cloudSettings.scale4}
        moveRange={70}
        speed={0.4}
        isDarkMode={isDarkMode}
        isBurgerMenuOpen={isBurgerMenuOpen}
      />
    </group>
  );
}

function SimpleBoat({
  isDarkMode,
  isBurgerMenuOpen,
}: {
  isDarkMode: boolean;
  isBurgerMenuOpen?: boolean;
}) {
  const { scene } = useGLTF('/models/object_boat.glb');
  const boatRef = useRef<any>(null);
  const frameCountRef = useRef(0);

  useFrame(({ clock }) => {
    // Throttle animations when burger menu is open for better performance
    frameCountRef.current++;
    const shouldUpdate = isBurgerMenuOpen
      ? frameCountRef.current % 2 === 0
      : true;

    if (boatRef.current && shouldUpdate) {
      const time = clock.getElapsedTime();
      boatRef.current.position.y = Math.sin(time * 0.8) * 0.5;
    }
  });

  if (!scene) {
    return (
      <group ref={boatRef} position={[-15, 4, -40]}>
        <mesh>
          <boxGeometry args={[36, 12, 18]} />
          <meshStandardMaterial
            color={isDarkMode ? '#8B4513' : '#D2691E'}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
      </group>
    );
  }

  const clonedScene = processSceneNode(scene, isDarkMode, (node, material) => {
    if (!material.userData) material.userData = {};
    if (isDarkMode) {
      material.color.multiplyScalar(0.1);
    } else {
      material.color.multiplyScalar(1.5);
    }
  });

  // Handle case where scene processing failed
  if (!clonedScene) {
    return (
      <group ref={boatRef} position={[-15, 4, -40]}>
        <mesh>
          <boxGeometry args={[36, 12, 18]} />
          <meshStandardMaterial
            color={isDarkMode ? '#8B4513' : '#D2691E'}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
      </group>
    );
  }

  return (
    <group
      ref={boatRef}
      position={[-15, 1, -40]}
      scale={[6, 6, 6]}
      rotation={[0, 5, 0]}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

function SimpleTwoChairs({ isDarkMode }: { isDarkMode: boolean }) {
  const { scene } = useGLTF('/models/object_two_chairs.glb');

  if (!scene) {
    return (
      <group position={[0, 0, 0]}>
        <mesh>
          <boxGeometry args={[4, 3, 4]} />
          <meshStandardMaterial
            color={isDarkMode ? '#8B4513' : '#D2691E'}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
      </group>
    );
  }

  const clonedScene = processSceneNode(scene, isDarkMode, (node, material) => {
    // Store original color if not already stored
    if (!material.userData) material.userData = {};
    if (isDarkMode) {
      material.color.multiplyScalar(0.1);
    } else {
      material.color.multiplyScalar(2);
    }
  });

  if (!clonedScene) {
    return (
      <group position={[0, 0, 0]}>
        <mesh>
          <boxGeometry args={[4, 3, 4]} />
          <meshStandardMaterial
            color={isDarkMode ? '#8B4513' : '#D2691E'}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
      </group>
    );
  }

  return (
    <primitive
      object={clonedScene}
      position={[-23, 0.5, -15]}
      scale={[2, 2, 2]}
      rotation={[0, 2.5, 0]}
    />
  );
}

function SimpleHouse({ isDarkMode }: { isDarkMode: boolean }) {
  const { scene } = useGLTF('/models/object_house.glb');

  if (!scene) {
    return (
      <group position={[0, 0, 0]}>
        <mesh>
          <boxGeometry args={[6, 8, 6]} />
          <meshStandardMaterial
            color={isDarkMode ? '#654321' : '#8B4513'}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
      </group>
    );
  }

  const clonedScene = processSceneNode(scene, isDarkMode, (node, material) => {
    // Store original color if not already stored
    if (!material.userData) material.userData = {};
    if (!material.userData.originalColor) {
      const brightness = material.color.r + material.color.g + material.color.b;
      const isOverBright =
        brightness > 2.8 ||
        (material.color.r > 0.95 &&
          material.color.g > 0.95 &&
          material.color.b > 0.95);

      material.userData.originalColor = isOverBright
        ? { r: 0.5, g: 0.3, b: 0.2 } // Fallback color for overbright materials
        : {
            r: material.color.r,
            g: material.color.g,
            b: material.color.b,
          };
    }

    const { r, g, b } = material.userData.originalColor;
    material.color.setRGB(r, g, b);

    if (isDarkMode) {
      material.color.multiplyScalar(0.125);
    } else {
      material.color.multiplyScalar(2.6);
    }

    // Set material properties for house materials
    if ('roughness' in material) material.roughness = 0.7;
    if ('metalness' in material) material.metalness = 0.1;
    material.needsUpdate = true;
  });

  if (!clonedScene) {
    return (
      <group position={[0, 0, 0]}>
        <mesh>
          <boxGeometry args={[6, 8, 6]} />
          <meshStandardMaterial
            color={isDarkMode ? '#654321' : '#8B4513'}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
      </group>
    );
  }

  return (
    <primitive
      object={clonedScene}
      position={[15, 0, 15]}
      scale={[2.5, 2.5, 2.5]}
      rotation={[0, 3.75, 0]}
    />
  );
}

function SimpleStoneHead({ isDarkMode }: { isDarkMode: boolean }) {
  const { scene } = useGLTF('/models/object_stone_head.glb');
  const stoneRef = useRef<any>(null);

  if (!scene) {
    return (
      <group ref={stoneRef} position={[0, 0, 0]}>
        <mesh>
          <boxGeometry args={[3, 4, 3]} />
          <meshStandardMaterial
            color={isDarkMode ? '#444444' : '#888888'}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      </group>
    );
  }

  const clonedScene = processSceneNode(scene, isDarkMode, (node, material) => {
    // Store original color if not already stored
    if (!material.userData) material.userData = {};

    // Apply high contrast settings for stone head
    if (isDarkMode) {
      material.color.multiplyScalar(0.3);
    } else {
      material.color.multiplyScalar(0.75);
    }
  });

  if (!clonedScene) {
    return (
      <group ref={stoneRef} position={[0, 0, 0]}>
        <mesh>
          <boxGeometry args={[3, 4, 3]} />
          <meshStandardMaterial
            color={isDarkMode ? '#444444' : '#888888'}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      </group>
    );
  }

  return (
    <primitive
      object={clonedScene}
      scale={[5, 5, 5]}
      rotation={[0, 4.5, 0]}
      position={[20, -1, -10]}
    />
  );
}

function SimpleSurfboard({ isDarkMode }: { isDarkMode: boolean }) {
  const { scene } = useGLTF('/models/object_surfboard.glb');

  if (!scene) {
    return (
      <group position={[0, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.5, 0.1, 3]} />
          <meshStandardMaterial
            color='#FF6B35'
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
      </group>
    );
  }

  const clonedScene = processSceneNode(scene, isDarkMode, (node, material) => {
    if (!material.userData) material.userData = {};

    if (isDarkMode) {
      material.color.multiplyScalar(0.15);
    } else {
      material.color.multiplyScalar(4);
    }
  });

  if (!clonedScene) {
    return (
      <group position={[0, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.5, 0.1, 3]} />
          <meshStandardMaterial
            color='#FF6B35'
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
      </group>
    );
  }

  return (
    <primitive
      object={clonedScene}
      position={[-16, 5, 12]}
      scale={[6.5, 5, 5]}
      rotation={[0, 5.5, 0]}
    />
  );
}

function SimpleIslandLamp({
  isDarkMode,
  position = [0, 0, 0],
  rotation,
  deviceInfo,
}: {
  isDarkMode: boolean;
  position?: [number, number, number];
  rotation?: [number, number, number];
  deviceInfo?: any;
}) {
  const { scene } = useGLTF('/models/object_island_lamp.glb');

  // Use the same scale calculation as the island for consistency
  const getLampScale = () => {
    if (deviceInfo?.isLandscapeMobile) {
      return [0.51, 0.51, 0.51] as [number, number, number];
    } else if (deviceInfo?.isMobile) {
      return [0.55, 0.55, 0.55] as [number, number, number];
    } else if (deviceInfo?.isTablet) {
      return [0.52, 0.52, 0.52] as [number, number, number];
    } else {
      return [0.5, 0.5, 0.5] as [number, number, number];
    }
  };

  if (!scene) {
    return (
      <group position={position}>
        <mesh>
          <cylinderGeometry args={[0.5, 0.5, 4]} />
          <meshStandardMaterial
            color={isDarkMode ? '#444444' : '#888888'}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
      </group>
    );
  }

  const clonedScene = processSceneNode(scene, isDarkMode, (node, material) => {
    // Store original color if not already stored - same as island processing
    if (!material.userData) material.userData = {};
    if (!material.userData.originalColor) {
      const brightness = material.color.r + material.color.g + material.color.b;
      const isOverBright =
        brightness > 2.8 ||
        (material.color.r > 0.95 &&
          material.color.g > 0.95 &&
          material.color.b > 0.95);

      material.userData.originalColor = isOverBright
        ? { r: 0.6, g: 0.5, b: 0.4 } // Fallback color for overbright materials
        : {
            r: material.color.r,
            g: material.color.g,
            b: material.color.b,
          };
    }

    const { r, g, b } = material.userData.originalColor;
    material.color.setRGB(r, g, b);

    if (isDarkMode) {
      material.color.multiplyScalar(0.05);
    } else {
      material.color.multiplyScalar(1.4);
    }

    // Set material properties for natural terrain - same as island
    if ('roughness' in material) material.roughness = 0.8;
    if ('metalness' in material) material.metalness = 0.0;
    material.needsUpdate = true;
  });

  // Handle case where scene processing failed
  if (!clonedScene) {
    return (
      <group position={position}>
        <mesh>
          <cylinderGeometry args={[0.5, 0.5, 4]} />
          <meshStandardMaterial
            color={isDarkMode ? '#444444' : '#888888'}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
      </group>
    );
  }

  return (
    <primitive
      object={clonedScene}
      position={position}
      rotation={rotation}
      scale={getLampScale()}
    />
  );
}

// Environment (Sky, Sea, Camera)

function SimpleSky({ isDarkMode }: { isDarkMode: boolean }) {
  const skyColor = isDarkMode ? '#0a1322' : '#02bbdc';

  return (
    <mesh scale={[1000, 1000, 1000]}>
      <sphereGeometry args={[1, 64, 32]} />
      <meshBasicMaterial color={skyColor} side={2} />
    </mesh>
  );
}

function SimpleSea({ isDarkMode }: { isDarkMode: boolean }) {
  const seaColor = isDarkMode ? '#010f19' : '#56ffff';

  return (
    <mesh
      position={[0, -2, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[2000, 1000, 1]}
    >
      <planeGeometry args={[1, 1, 64, 64]} />
      <meshBasicMaterial color={seaColor} side={2} />
    </mesh>
  );
}

function SimpleOceanWaves({
  isDarkMode,
  isBurgerMenuOpen,
}: {
  isDarkMode: boolean;
  isBurgerMenuOpen?: boolean;
}) {
  const { scene } = useGLTF('/models/object_ocean_waves.glb');
  const wavesRef = useRef<any>(null);
  const frameCountRef = useRef(0);

  useFrame(({ clock }) => {
    // Throttle animations when burger menu is open for better performance
    frameCountRef.current++;
    const shouldUpdate = isBurgerMenuOpen
      ? frameCountRef.current % 2 === 0
      : true;

    if (wavesRef.current) {
      wavesRef.current.position.y = -1.5;
      wavesRef.current.position.x = -3;

      if (shouldUpdate) {
        const time = clock.getElapsedTime();
        wavesRef.current.rotation.y = Math.sin(time * 0.3) * 0.5;
      }
    }
  });

  if (!scene) {
    // Fallback - create a simple animated plane if model fails to load
    return (
      <group ref={wavesRef} position={[0, -2, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[2000, 1000, 1]}>
          <planeGeometry args={[1, 1, 32, 32]} />
          <meshStandardMaterial
            color={isDarkMode ? '#000a0f' : '#1a4d66'}
            transparent
            opacity={0.6}
          />
        </mesh>
      </group>
    );
  }

  const clonedScene = processSceneNode(scene, isDarkMode, (node, material) => {
    // Simplified water material processing
    if (isDarkMode) {
      material.color.setHex(0x000a0f);
    } else {
      material.color.setHex(0x1a4d66);
    }

    // Water-specific properties
    if ('roughness' in material) material.roughness = 0.2;
    if ('metalness' in material) material.metalness = 0.0;
    if ('transparent' in material) material.transparent = true;
    if ('opacity' in material) material.opacity = isDarkMode ? 0.4 : 0.7;
    material.needsUpdate = true;
  });

  // Handle case where scene processing failed
  if (!clonedScene) {
    return (
      <group ref={wavesRef} position={[0, -2, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[2000, 1000, 1]}>
          <planeGeometry args={[1, 1, 32, 32]} />
          <meshStandardMaterial
            color={isDarkMode ? '#000a0f' : '#1a4d66'}
            transparent
            opacity={0.6}
            side={2}
          />
        </mesh>
      </group>
    );
  }

  return (
    <group
      ref={wavesRef}
      position={[0, -2, 0]} // Match original SimpleSea position
      scale={[80, 0.8, 40]} // Significantly increased scale to match original sea coverage (2000x1000 area)
      rotation={[0, 0, 0]}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

// Animated Camera Component with smooth zoom
function AnimatedCamera({
  deviceInfo,
  triggerInitialZoom = false,
}: {
  deviceInfo?: any;
  triggerInitialZoom?: boolean;
}) {
  const cameraRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomProgress, setZoomProgress] = useState(0);
  const [initialZoomTriggered, setInitialZoomTriggered] = useState(false);

  // Enhanced camera settings with landscape mobile support - much closer positions
  const getCameraSettings = () => {
    if (deviceInfo?.isLandscapeMobile) {
      // Landscape mobile - bring camera much closer for better visibility
      return {
        position: [-2.5, 15, -80] as [number, number, number],
        fov: 50,
      };
    } else if (deviceInfo?.isMobile) {
      if (deviceInfo.orientation === 'portrait') {
        return {
          position: [-10, 35, -100] as [number, number, number],
          fov: 70,
        };
      } else {
        // Regular mobile landscape - legacy support
        return {
          position: [-2.5, 15, -80] as [number, number, number],
          fov: 50,
        };
      }
    } else if (deviceInfo?.isTablet) {
      if (deviceInfo.orientation === 'portrait') {
        return {
          position: [-10, 35, -95] as [number, number, number],
          fov: 60,
        };
      } else {
        return {
          position: [-2.5, 15, -80] as [number, number, number],
          fov: 50,
        };
      }
    } else {
      // Desktop
      return {
        position: [-2.5, 15, -80] as [number, number, number],
        fov: 50,
      };
    }
  };

  const cameraSettings = getCameraSettings();

  // Calculate starting position (slightly further away) for smooth zoom animation
  const getStartingPosition = (): [number, number, number] => {
    const [x, y, z] = cameraSettings.position;
    // Move camera slightly back for a subtle zoom effect
    return [x, y, z - 10]; // Move 30 units further back for subtle zoom
  };

  const startingPosition = getStartingPosition();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle initial zoom trigger
  useEffect(() => {
    if (triggerInitialZoom && !initialZoomTriggered) {
      setInitialZoomTriggered(true);
      setIsZooming(true);
      setZoomProgress(0);
    }
  }, [triggerInitialZoom, initialZoomTriggered]);

  useFrame((state, delta) => {
    if (!cameraRef.current || !mounted) return;

    // Set camera FOV
    cameraRef.current.fov = cameraSettings.fov;
    cameraRef.current.updateProjectionMatrix();

    // Handle zoom animation
    if (isZooming && zoomProgress < 1) {
      const newProgress = Math.min(zoomProgress + delta * 0.6, 1); // Slower zoom over ~3.3 seconds
      setZoomProgress(newProgress);

      // Smoother easing function for gentle animation (ease-in-out)
      const easedProgress =
        newProgress < 0.5
          ? 2 * newProgress * newProgress
          : 1 - Math.pow(-2 * newProgress + 2, 2) / 2;

      // Interpolate between starting position and target position
      const [startX, startY, startZ] = startingPosition;
      const [targetX, targetY, targetZ] = cameraSettings.position;

      const currentX = startX + (targetX - startX) * easedProgress;
      const currentY = startY + (targetY - startY) * easedProgress;
      const currentZ = startZ + (targetZ - startZ) * easedProgress;

      cameraRef.current.position.set(currentX, currentY, currentZ);

      // Stop zooming when complete
      if (newProgress >= 1) {
        setIsZooming(false);
        cameraRef.current.position.set(targetX, targetY, targetZ);
      }
    } else if (!isZooming && initialZoomTriggered) {
      // Ensure camera is at final position when not zooming
      const [targetX, targetY, targetZ] = cameraSettings.position;
      cameraRef.current.position.set(targetX, targetY, targetZ);
    }
  });

  // Determine initial position based on whether zoom is triggered
  const initialPosition =
    triggerInitialZoom && !initialZoomTriggered
      ? startingPosition
      : cameraSettings.position;

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={initialPosition}
      fov={cameraSettings.fov}
    />
  );
}

// Screen Position Tracker Component
function ScreenPositionTracker({
  onUpdatePositions,
}: {
  onUpdatePositions: (positions: Record<string, [number, number]>) => void;
}) {
  const { camera, size } = useThree();

  // Object positions in 3D world space (matching InteractiveObject positions)
  const objectPositions = {
    twochairs: new THREE.Vector3(-23, 0.5, -15),
    house: new THREE.Vector3(15, 0, 15),
    stonehead: new THREE.Vector3(20, -1, -10),
    surfboard: new THREE.Vector3(-16, 5, 12),
  };

  useFrame(() => {
    const screenPositions: Record<string, [number, number]> = {};

    Object.entries(objectPositions).forEach(([key, worldPos]) => {
      // Clone the position to avoid modifying the original
      const pos = worldPos.clone();

      // Project 3D position to 2D screen coordinates
      pos.project(camera);

      // Convert from normalized device coordinates to pixel coordinates
      const x = (pos.x * 0.5 + 0.5) * size.width;
      const y = (pos.y * -0.5 + 0.5) * size.height;

      screenPositions[key] = [x, y];
    });

    onUpdatePositions(screenPositions);
  });

  return null; // This component doesn't render anything
}

// Main Scene Component

function SceneComponent({
  isDarkMode,
  showIsland,
  showSea,
  deviceInfo,
  onNavigateToConnect,
  onNavigateToPage,
  onPlayClickSound,
  showExploreNotification,
  isBurgerMenuOpen,
  triggerInitialZoom,
}: SceneProps) {
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);
  const [hoveredTwoChairs, setHoveredTwoChairs] = useState(false);
  const [hoveredHouse, setHoveredHouse] = useState(false);
  const [hoveredStoneHead, setHoveredStoneHead] = useState(false);
  const [hoveredSurfboard, setHoveredSurfboard] = useState(false);
  const [currentPopup, setCurrentPopup] = useState<
    'twochairs' | 'house' | 'stonehead' | 'surfboard' | null
  >(null);
  const [objectScreenPositions, setObjectScreenPositions] = useState<
    Record<string, [number, number]>
  >({});

  useEffect(() => {
    const timer = setTimeout(() => setSceneLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hoveredObject) {
      document.body.style.cursor = 'default';
    }
  }, [hoveredObject]);

  const handleNavigation = useCallback(
    (page: string) => {
      onPlayClickSound?.();
      const navigationMap = {
        skillset: () => onNavigateToPage?.('skillset'),
        connect: () => onNavigateToConnect?.(),
        profile: () => onNavigateToPage?.('profile'),
        portfolio: () => onNavigateToPage?.('portfolio'),
      };
      navigationMap[page as keyof typeof navigationMap]?.();
    },
    [onNavigateToPage, onNavigateToConnect, onPlayClickSound]
  );

  const createHoverHandler = useCallback(
    (objectName: string, setHovered: (value: boolean) => void) => {
      return (hovered: boolean) => {
        setHoveredObject(hovered ? objectName : null);
        setHovered(hovered);
        setCurrentPopup(
          hovered
            ? (objectName as 'twochairs' | 'house' | 'stonehead' | 'surfboard')
            : null
        );
      };
    },
    []
  );

  const handleTwoChairsHover = createHoverHandler(
    'twochairs',
    setHoveredTwoChairs
  );
  const handleHouseHover = createHoverHandler('house', setHoveredHouse);
  const handleStoneHeadHover = createHoverHandler(
    'stonehead',
    setHoveredStoneHead
  );
  const handleSurfboardHover = createHoverHandler(
    'surfboard',
    setHoveredSurfboard
  );

  // Helper function to get responsive bounding boxes for better mobile interaction
  const getBoundingBox = (
    baseBox: [number, number, number]
  ): [number, number, number] => {
    if (deviceInfo?.isMobile) {
      // Make bounding boxes 30% larger on mobile for easier tapping
      return [baseBox[0] * 1.3, baseBox[1] * 1.3, baseBox[2] * 1.3];
    } else if (deviceInfo?.isTablet) {
      // Make bounding boxes 15% larger on tablet
      return [baseBox[0] * 1.15, baseBox[1] * 1.15, baseBox[2] * 1.15];
    }
    return baseBox; // Original size for desktop
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Scene Fade-in Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: isDarkMode ? '#000000' : '#ffffff',
          opacity: sceneLoaded ? 0 : 1,
          transition: 'opacity 1.2s ease-out',
          zIndex: 10,
          pointerEvents: sceneLoaded ? 'none' : 'all',
        }}
      />

      {/* Object Popup Menu */}
      <ObjectPopupMenu
        objectType={currentPopup}
        isDarkMode={isDarkMode}
        deviceInfo={deviceInfo}
        objectPosition={
          currentPopup ? objectScreenPositions[currentPopup] : undefined
        }
      />

      {/* Reduce render load while menu is open */}
      <Canvas
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          background: 'transparent',
          filter:
            showExploreNotification && !isBurgerMenuOpen ? 'blur(2px)' : 'none',
          transition: 'filter 0.3s ease-in-out',
        }}
        frameloop='always'
        dpr={(() => {
          if (typeof window === 'undefined') return 1;
          const max = deviceInfo?.isMobile ? 1.5 : 2;
          return Math.min(window.devicePixelRatio || 1, max);
        })()}
        onCreated={({ gl }) => {
          // Better performance on mobile devices
          const max = deviceInfo?.isMobile ? 1.5 : 2;
          const pixelRatio = Math.min(window.devicePixelRatio || 1, max);
          gl.setPixelRatio(pixelRatio);

          // Ensure accurate color rendering
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.NoToneMapping;
        }}
        onPointerMissed={() => {
          setTimeout(() => {
            document.body.style.cursor = 'default';
            setHoveredObject(null);
            setHoveredTwoChairs(false);
            setHoveredHouse(false);
            setHoveredStoneHead(false);
            setHoveredSurfboard(false);
            setCurrentPopup(null);
          }, 100);
        }}
      >
        <SimpleSky isDarkMode={isDarkMode} />
        <SimpleSea isDarkMode={isDarkMode} />

        {/* Simplified lighting system */}
        {isDarkMode ? (
          <>
            <ambientLight intensity={0.3} color='#b8c6db' />
            <directionalLight
              position={[-20, 40, 70]}
              intensity={0.8}
              color='#e6f3ff'
            />
          </>
        ) : (
          <>
            <ambientLight intensity={0.4} color='#fff5e6' />
            <directionalLight
              position={[20, 40, 15]}
              intensity={4.5}
              color='#fff8dc'
            />
          </>
        )}

        <Suspense fallback={null}>
          {/* Island Terrain */}
          <SimpleIsland
            key={`island-${isDarkMode}`}
            isDarkMode={isDarkMode}
            deviceInfo={deviceInfo}
          />

          {/* New Interactive Objects positioned above the island */}
          <InteractiveObject
            onHover={handleTwoChairsHover}
            onClick={() => handleNavigation('connect')}
            boundingBox={getBoundingBox([8, 8, 8])}
            position={[-23, 5, -15]}
            isDarkMode={isDarkMode}
          >
            <SimpleTwoChairs
              key={`twochairs-${isDarkMode}`}
              isDarkMode={isDarkMode}
            />
          </InteractiveObject>

          <InteractiveObject
            onHover={handleHouseHover}
            onClick={() => handleNavigation('portfolio')}
            boundingBox={getBoundingBox([20, 15, 15])}
            position={[14, 8, 15]}
            isDarkMode={isDarkMode}
          >
            <SimpleHouse key={`house-${isDarkMode}`} isDarkMode={isDarkMode} />
          </InteractiveObject>

          <InteractiveObject
            onHover={handleStoneHeadHover}
            onClick={() => handleNavigation('profile')}
            boundingBox={getBoundingBox([8, 10, 15])}
            position={[20, 6, -10]}
            isDarkMode={isDarkMode}
          >
            <SimpleStoneHead
              key={`stonehead-${isDarkMode}`}
              isDarkMode={isDarkMode}
            />
          </InteractiveObject>

          <InteractiveObject
            onHover={handleSurfboardHover}
            onClick={() => handleNavigation('skillset')}
            boundingBox={getBoundingBox([20, 10, 8])}
            rotation={[0, 2, 0]}
            position={[-16, 6, 12]}
            isDarkMode={isDarkMode}
          >
            <SimpleSurfboard
              key={`surfboard-${isDarkMode}`}
              isDarkMode={isDarkMode}
            />
          </InteractiveObject>

          {/* Island Lamps (non-interactive) - positioned around the island */}
          <SimpleIslandLamp
            key={`lamp1-${isDarkMode}`}
            isDarkMode={isDarkMode}
            position={[17.5, 0.5, 0]}
            rotation={[0, 1, 0]}
            deviceInfo={deviceInfo}
          />
          <SimpleIslandLamp
            key={`lamp2-${isDarkMode}`}
            isDarkMode={isDarkMode}
            position={[-5, 0.5, 20]}
            rotation={[0, 5.5, 0]}
            deviceInfo={deviceInfo}
          />
          <SimpleIslandLamp
            key={`lamp3-${isDarkMode}`}
            isDarkMode={isDarkMode}
            position={[-25, 0.5, 0]}
            rotation={[0, 5.5, 0]}
            deviceInfo={deviceInfo}
          />

          {/* Boat (non-interactive) */}
          <SimpleBoat
            isDarkMode={isDarkMode}
            isBurgerMenuOpen={isBurgerMenuOpen}
          />

          {/* Environmental Elements */}
          <SimpleClouds
            isDarkMode={isDarkMode}
            deviceInfo={deviceInfo}
            isBurgerMenuOpen={isBurgerMenuOpen}
          />

          {/* Ocean Waves - visible even when burger menu is open */}
          {showSea && (
            <SimpleOceanWaves
              isDarkMode={isDarkMode}
              isBurgerMenuOpen={isBurgerMenuOpen}
            />
          )}
        </Suspense>

        <AnimatedCamera
          deviceInfo={deviceInfo}
          triggerInitialZoom={triggerInitialZoom}
        />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={false}
          target={[0, 0, 0]}
          maxDistance={
            deviceInfo?.isLandscapeMobile
              ? 120 // Adjusted for closer camera positions
              : deviceInfo?.isMobile
              ? 140
              : deviceInfo?.isTablet
              ? 130
              : 110
          }
          minDistance={
            deviceInfo?.isLandscapeMobile
              ? 60 // Adjusted for closer camera positions
              : deviceInfo?.isMobile
              ? 70
              : deviceInfo?.isTablet
              ? 65
              : 55
          }
        />

        {/* Screen Position Tracker */}
        <ScreenPositionTracker onUpdatePositions={setObjectScreenPositions} />
      </Canvas>
    </div>
  );
}

// Preload 3D models for better performance
useGLTF.preload('/models/object_island.glb');
useGLTF.preload('/models/object_boat.glb');
useGLTF.preload('/models/object_two_chairs.glb');
useGLTF.preload('/models/object_house.glb');
useGLTF.preload('/models/object_stone_head.glb');
useGLTF.preload('/models/object_surfboard.glb');
useGLTF.preload('/models/object_island_lamp.glb');
useGLTF.preload('/models/object_cloud1.glb');
useGLTF.preload('/models/object_cloud2.glb');
useGLTF.preload('/models/object_cloud3.glb');
useGLTF.preload('/models/object_cloud4.glb');
useGLTF.preload('/models/object_ocean_waves.glb');

export default React.memo(SceneComponent);
