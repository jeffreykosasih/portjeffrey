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

interface SceneProps {
  isDarkMode: boolean;
  showIsland: boolean;
  showSea: boolean;
  deviceInfo?: any;
  onNavigateToConnect?: () => void;
  onNavigateToPage?: (page: string) => void;
  onPlayClickSound?: () => void;
}

// ============================================
// Interactive Object Wrapper

interface InteractiveObjectProps {
  children: React.ReactNode;
  onHover: (hovered: boolean) => void;
  onClick?: () => void;
  boundingBox?: [number, number, number];
  position?: [number, number, number];
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
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={onClick}
        visible={false}
      >
        <boxGeometry args={boundingBox} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <group ref={objectRef}>
        <ObjectBrightness
          object={objectRef.current}
          isHovered={isHovered}
          isDarkMode={isDarkMode}
        />
        {children}
      </group>
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
    if (deviceInfo?.isMobile) {
      return [0.55, 0.55, 0.55] as [number, number, number]; // Slightly larger for mobile
    } else if (deviceInfo?.isTablet) {
      return [0.52, 0.52, 0.52] as [number, number, number]; // Slightly larger for tablet
    } else {
      return [0.5, 0.5, 0.5] as [number, number, number]; // Original desktop scale
    }
  };

  const clonedScene = processSceneNode(scene, isDarkMode, (node, material) => {
    const nodeName = node.name?.toLowerCase() || '';
    const materialName = material.name?.toLowerCase() || '';

    const isLampLight =
      material.color.r > 0.9 &&
      material.color.g > 0.9 &&
      material.color.b > 0.7;

    const isFence =
      nodeName.includes('fence') ||
      nodeName.includes('rail') ||
      nodeName.includes('post') ||
      materialName.includes('fence') ||
      materialName.includes('rail');

    if (isLampLight) {
      applyMaterialSettings(material, isDarkMode, {
        isLight: true,
        fallbackColor: { r: 1.5, g: 1.0, b: 0.6 },
      });
    } else if (isFence) {
      applyMaterialSettings(material, isDarkMode, {
        isWood: true,
        fallbackColor: { r: 0.8, g: 0.6, b: 0.4 },
      });
    }
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
    material.roughness = 0.9;
    material.metalness = 0.0;

    if (isDarkMode) {
      // Make clouds dark blue in dark mode
      material.color.setHex(0x1a237e); // Dark blue color
    } else {
      // Make clouds extremely bright and clear white in bright mode like sunlight
      material.color.setHex(0xffffff);
      material.color.multiplyScalar(1.8); // Reduced to prevent overexposure
      if (material.emissive && material.emissive.setHex) {
        material.emissive.setHex(0xffffff);
      }
      if ('emissiveIntensity' in material) {
        material.emissiveIntensity = 0.5; // Enhanced glow
      }
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
}: {
  modelPath: string;
  basePosition: [number, number, number];
  scale: number;
  moveRange: number;
  isDarkMode: boolean;
  speed?: number;
}) {
  const cloudRef = useRef<any>(null);

  useFrame(({ clock }) => {
    if (cloudRef.current) {
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
}: {
  isDarkMode: boolean;
  deviceInfo?: any;
}) {
  // Adjust cloud positioning and scale based on device
  const getCloudSettings = () => {
    if (deviceInfo?.isMobile) {
      return {
        // Bring clouds slightly closer and make them bigger for mobile visibility
        scale1: 5,
        scale2: 4.5,
        scale3: 4.8,
        scale4: 5.2,
        positions: {
          cloud1: [0, 35, 130] as [number, number, number],
          cloud2: [0, 35, 40] as [number, number, number],
          cloud3: [-90, 40, 130] as [number, number, number],
          cloud4: [-90, 40, 65] as [number, number, number],
        },
      };
    } else if (deviceInfo?.isTablet) {
      return {
        // Medium adjustments for tablet
        scale1: 4.5,
        scale2: 4,
        scale3: 4.3,
        scale4: 4.7,
        positions: {
          cloud1: [0, 32, 140] as [number, number, number],
          cloud2: [0, 32, 45] as [number, number, number],
          cloud3: [-95, 37, 140] as [number, number, number],
          cloud4: [-95, 37, 70] as [number, number, number],
        },
      };
    } else {
      return {
        // Original desktop settings
        scale1: 4,
        scale2: 3.5,
        scale3: 3.8,
        scale4: 4.2,
        positions: {
          cloud1: [0, 30, 150] as [number, number, number],
          cloud2: [0, 30, 50] as [number, number, number],
          cloud3: [-100, 35, 150] as [number, number, number],
          cloud4: [-100, 35, 75] as [number, number, number],
        },
      };
    }
  };

  const cloudSettings = getCloudSettings();

  return (
    <group>
      <AnimatedCloud
        modelPath='/models/object_cloud1.glb'
        basePosition={cloudSettings.positions.cloud1}
        scale={cloudSettings.scale1}
        moveRange={70}
        speed={0.5}
        isDarkMode={isDarkMode}
      />
      <AnimatedCloud
        modelPath='/models/object_cloud2.glb'
        basePosition={cloudSettings.positions.cloud2}
        scale={cloudSettings.scale2}
        moveRange={70}
        speed={0.5}
        isDarkMode={isDarkMode}
      />
      <AnimatedCloud
        modelPath='/models/object_cloud3.glb'
        basePosition={cloudSettings.positions.cloud3}
        scale={cloudSettings.scale3}
        moveRange={70}
        speed={0.5}
        isDarkMode={isDarkMode}
      />
      <AnimatedCloud
        modelPath='/models/object_cloud4.glb'
        basePosition={cloudSettings.positions.cloud4}
        scale={cloudSettings.scale4}
        moveRange={70}
        speed={0.5}
        isDarkMode={isDarkMode}
      />
    </group>
  );
}

function SimpleBonfire({ isDarkMode }: { isDarkMode: boolean }) {
  const { scene } = useGLTF('/models/object_bonfire.glb?v=1');
  const fireRef = useRef<any>(null);

  const fallbackBonfire = (
    <group ref={fireRef} position={[0, 2, 0]}>
      <mesh>
        <cylinderGeometry args={[1, 1, 0.5]} />
        <meshStandardMaterial color='#D2691E' roughness={0.7} metalness={0.1} />
      </mesh>
    </group>
  );

  if (!scene) return fallbackBonfire;

  const clonedScene = processSceneNode(scene, isDarkMode, (node, material) => {
    const nodeName = node.name?.toLowerCase() || '';
    const materialName = material.name?.toLowerCase() || '';

    // Make bonfire extra distinctive as SKILLSET object
    const isFireElement = ['fire', 'flame', 'ember', 'glow'].some(
      (term) => nodeName.includes(term) || materialName.includes(term)
    );

    if (isFireElement) {
      // Enhanced fire effects for skillset identification
      applyMaterialSettings(material, isDarkMode, {
        isLight: true,
        emissiveColor: '#ff4400',
        emissiveIntensity: isDarkMode ? 2.5 : 1.0,
      });
      material.color.multiplyScalar(isDarkMode ? 7.5 : 5.0);
    }
  });

  if (!clonedScene) return fallbackBonfire;

  const bonfirePosition: [number, number, number] = [-15, 1, -17.5];
  const bonfireScale: [number, number, number] = [2, 2, 2];
  const bonfireRotation: [number, number, number] = [0, 5, 0];

  return (
    <group
      ref={fireRef}
      position={bonfirePosition}
      scale={bonfireScale}
      rotation={bonfireRotation}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

function SimpleBoat({ isDarkMode }: { isDarkMode: boolean }) {
  const { scene } = useGLTF('/models/object_boat.glb');
  const boatRef = useRef<any>(null);

  useFrame(({ clock }) => {
    if (boatRef.current) {
      const time = clock.getElapsedTime();
      boatRef.current.position.y = Math.sin(time * 0.8) * 0.5;
    }
  });

  if (!scene) {
    return (
      <group ref={boatRef} position={[-13, 0, -45]}>
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
    const nodeName = node.name?.toLowerCase() || '';
    const materialName = material.name?.toLowerCase() || '';

    const isWhiteWindow =
      material.color.r > 0.8 &&
      material.color.g > 0.8 &&
      material.color.b > 0.8 &&
      (nodeName.includes('window') ||
        nodeName.includes('circle') ||
        materialName.includes('window') ||
        materialName.includes('circle'));

    const isWoodElement =
      nodeName.includes('wood') ||
      nodeName.includes('plank') ||
      materialName.includes('wood') ||
      materialName.includes('plank');

    if (isWhiteWindow && isDarkMode) {
      applyMaterialSettings(material, isDarkMode, {
        isLight: true,
        emissiveColor: '#88ccff',
        emissiveIntensity: 3.0,
        fallbackColor: { r: 1.0, g: 1.0, b: 1.0 },
      });
      if (material.emissive?.setRGB) {
        material.emissive.setRGB(0.6, 0.8, 1.0);
      }
      if ('roughness' in material) {
        material.roughness = 0.05;
      }
    } else if (isWoodElement) {
      applyMaterialSettings(material, isDarkMode, {
        isWood: true,
        fallbackColor: { r: 0.6, g: 0.4, b: 0.2 },
      });
      // Maintain brightness in both modes
    } else {
      applyMaterialSettings(material, isDarkMode, {
        fallbackColor: { r: 0.5, g: 0.35, b: 0.25 },
      });
      // Maintain brightness in both modes
    }
  });

  // Handle case where scene processing failed
  if (!clonedScene) {
    return (
      <group ref={boatRef} position={[-13, 0, -45]}>
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
      position={[-15, 2, -40]}
      scale={[6, 6, 6]}
      rotation={[0, 5, 0]}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

function SimpleAkuAku({ isDarkMode }: { isDarkMode: boolean }) {
  const { scene } = useGLTF('/models/object_aku_aku.glb');
  const maskRef = useRef<any>(null);

  useFrame(({ clock }) => {
    if (maskRef.current) {
      const time = clock.getElapsedTime();
      // Only up and down movement, no rotation
      maskRef.current.position.y = 3 + Math.sin(time * 1.5) * 1;
    }
  });

  if (!scene) {
    return (
      <group ref={maskRef} position={[15, 3, 8]}>
        <mesh>
          <boxGeometry args={[2, 2.5, 0.5]} />
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
    const nodeName = node.name?.toLowerCase() || '';
    const materialName = material.name?.toLowerCase() || '';

    applyMaterialSettings(material, isDarkMode);
    if (isDarkMode) {
      // Make other Aku Aku parts shine bright in dark mode
      material.color.multiplyScalar(12.0);
    } else {
      // Enhanced sunlight brightness for other parts
      material.color.multiplyScalar(7);
    }
  });

  // Handle case where scene processing failed
  if (!clonedScene) {
    return (
      <group ref={maskRef} position={[15, 3, 8]}>
        <mesh>
          <boxGeometry args={[2, 2.5, 0.5]} />
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
    <group ref={maskRef} position={[22.5, 0, 0]} scale={[65, 65, 65]}>
      <primitive object={clonedScene} rotation={[0, 3.5, 0]} />
    </group>
  );
}

function SimpleCar({ isDarkMode }: { isDarkMode: boolean }) {
  const { scene } = useGLTF('/models/object_car_house.glb');

  if (!scene) {
    return null;
  }

  const clonedScene = processSceneNode(scene, isDarkMode, (node, material) => {
    const nodeName = node.name?.toLowerCase() || '';
    const materialName = material.name?.toLowerCase() || '';

    const isCarLight =
      nodeName.includes('light') ||
      nodeName.includes('headlight') ||
      materialName.includes('light') ||
      materialName.includes('headlight');

    const isCarMetal =
      nodeName.includes('metal') ||
      nodeName.includes('body') ||
      materialName.includes('metal') ||
      materialName.includes('body');

    const isPinkSmoke =
      nodeName.includes('smoke') ||
      nodeName.includes('chimney') ||
      materialName.includes('smoke') ||
      materialName.includes('chimney') ||
      (material.color &&
        material.color.r > 0.7 &&
        material.color.g < 0.5 &&
        material.color.b > 0.7); // Pink-ish colors

    if (isCarLight) {
      applyMaterialSettings(material, isDarkMode, {
        isLight: true,
        emissiveColor: '#ffffff',
        emissiveIntensity: isDarkMode ? 1.2 : 0.3,
        fallbackColor: { r: 1.0, g: 1.0, b: 0.9 },
      });
    } else if (isPinkSmoke) {
      applyMaterialSettings(material, isDarkMode, {
        fallbackColor: { r: 1.0, g: 0.5, b: 0.8 },
      });
      if (isDarkMode) {
        // Same brightness as light mode
        material.color.multiplyScalar(1.8);
      } else {
        // Enhanced sunlight brightness
        material.color.multiplyScalar(1.8);
      }
    } else if (isCarMetal) {
      applyMaterialSettings(material, isDarkMode, {
        isMetal: true,
        fallbackColor: { r: 0.8, g: 0.1, b: 0.1 },
      });
      if (isDarkMode) {
        // Same brightness as light mode
        material.color.multiplyScalar(1.6);
      } else {
        // Enhanced sunlight brightness for car metal
        material.color.multiplyScalar(1.6);
      }
    } else {
      applyMaterialSettings(material, isDarkMode);
      if (isDarkMode) {
        // Same brightness as light mode
        material.color.multiplyScalar(2.8);
      } else {
        // Enhanced sunlight brightness for other car parts
        material.color.multiplyScalar(2.8);
      }
    }
  });

  // Handle case where scene processing failed
  if (!clonedScene) {
    return null;
  }

  return (
    <primitive
      object={clonedScene}
      position={[10.5, 0, 15]}
      scale={[5.5, 5.5, 5.5]}
      rotation={[0, 2, 0]}
    />
  );
}

function SimpleCafe({ isDarkMode }: { isDarkMode: boolean }) {
  const { scene } = useGLTF('/models/object_cafe_beach.glb');

  if (!scene) {
    return null;
  }

  const clonedScene = processSceneNode(scene, isDarkMode, (node, material) => {
    const nodeName = node.name?.toLowerCase() || '';
    const materialName = material.name?.toLowerCase() || '';

    const isWindowLight =
      nodeName.includes('window') ||
      nodeName.includes('light') ||
      materialName.includes('window') ||
      materialName.includes('light');

    const isWoodStructure =
      nodeName.includes('wood') ||
      nodeName.includes('frame') ||
      materialName.includes('wood') ||
      materialName.includes('frame');

    const isSignElement =
      nodeName.includes('sign') ||
      nodeName.includes('logo') ||
      materialName.includes('sign') ||
      materialName.includes('logo');

    // Make cafe extra distinctive as PORTFOLIO object
    const isPortfolioDisplay =
      isSignElement ||
      isWindowLight ||
      nodeName.includes('display') ||
      materialName.includes('display');

    if (isWindowLight) {
      // Enhanced window effects for portfolio identification
      applyMaterialSettings(material, isDarkMode, {
        isLight: true,
        emissiveColor: isDarkMode ? '#88ccff' : '#ffdd88',
        emissiveIntensity: isDarkMode ? 1.8 : 0.5,
        fallbackColor: { r: 1.0, g: 0.9, b: 0.7 },
      });
      if (isDarkMode && material.emissive?.setRGB) {
        material.emissive.setRGB(0.5, 0.8, 1.0); // Blue portfolio glow
      }
    } else if (isSignElement) {
      // Enhanced signs for portfolio branding
      applyMaterialSettings(material, isDarkMode, {
        isLight: isDarkMode, // Make signs glow in dark mode
        emissiveColor: '#4488ff',
        emissiveIntensity: isDarkMode ? 1.0 : 0,
        fallbackColor: { r: 0.9, g: 0.7, b: 0.4 },
      });
      if (isDarkMode) {
        material.color.multiplyScalar(1.8); // Reduced to prevent disappearing
        if (material.emissive?.setRGB) {
          material.emissive.setRGB(0.3, 0.5, 1.0); // Blue glow for portfolio
        }
      } else {
        material.color.multiplyScalar(1.8); // Reduced for portfolio
      }
    } else if (isWoodStructure) {
      applyMaterialSettings(material, isDarkMode, {
        isWood: true,
        fallbackColor: { r: 0.6, g: 0.4, b: 0.2 },
      });
      if (isDarkMode) {
        // Same brightness as light mode
        material.color.multiplyScalar(2.8);
      } else {
        // Enhanced sunlight brightness for wood structure
        material.color.multiplyScalar(2.8);
      }
    } else {
      applyMaterialSettings(material, isDarkMode);
      if (isDarkMode) {
        // Same brightness as light mode
        material.color.multiplyScalar(2.5);
      } else {
        // Enhanced sunlight brightness for other cafe parts
        material.color.multiplyScalar(2.5);
      }
    }
  });

  // Handle case where scene processing failed
  if (!clonedScene) {
    return null;
  }

  return (
    <primitive
      object={clonedScene}
      position={[-17.5, 3, 10]}
      scale={[0.25, 0.25, 0.25]}
      rotation={[0, 2, 0]}
    />
  );
}

// Environment (Sky, Sea, Camera)

function SimpleSky({ isDarkMode }: { isDarkMode: boolean }) {
  const skyColors = isDarkMode
    ? { top: '#162542', bottom: '#020918' }
    : { top: '#00bbdc', bottom: '#00bbdc' };

  return (
    <mesh scale={[1000, 1000, 1000]}>
      <sphereGeometry args={[1, 64, 32]} />
      <shaderMaterial
        key={isDarkMode ? 'dark-sky' : 'light-sky'}
        vertexShader={`
          varying vec3 vWorldPosition;
          void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vWorldPosition;
          void main() {
            float height = normalize(vWorldPosition).y;
            float t = smoothstep(-0.5, 0.8, height);
            
            vec3 topColor = vec3(${
              parseInt(skyColors.top.slice(1, 3), 16) / 255
            }, ${parseInt(skyColors.top.slice(3, 5), 16) / 255}, ${
          parseInt(skyColors.top.slice(5, 7), 16) / 255
        });
            vec3 bottomColor = vec3(${
              parseInt(skyColors.bottom.slice(1, 3), 16) / 255
            }, ${parseInt(skyColors.bottom.slice(3, 5), 16) / 255}, ${
          parseInt(skyColors.bottom.slice(5, 7), 16) / 255
        });
            
            vec3 color = mix(bottomColor, topColor, t);
            gl_FragColor = vec4(color, 1.0);
          }
        `}
        side={2}
      />
    </mesh>
  );
}

function SimpleSea({ isDarkMode }: { isDarkMode: boolean }) {
  const seaColor = isDarkMode ? '#010819' : '#56ffff';

  return (
    <mesh
      position={[0, -2, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[2000, 1000, 1]}
    >
      <planeGeometry args={[1, 1, 1, 1]} />
      <meshBasicMaterial
        color={isDarkMode ? 0x010819 : 0x56ffff}
        transparent={false}
        opacity={1.0}
        side={2}
        toneMapped={false}
      />
    </mesh>
  );
}

// Animated Camera Component with smooth zoom
function AnimatedCamera({ deviceInfo }: { deviceInfo?: any }) {
  const cameraRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);

  // Responsive camera positioning based on device
  const getCameraSettings = () => {
    if (deviceInfo?.isMobile) {
      return {
        position: [-10, 70, -380] as [number, number, number], // Zoom out more for mobile
        startFov: 70,
        endFov: 60,
      };
    } else if (deviceInfo?.isTablet) {
      return {
        position: [-10, 60, -340] as [number, number, number], // Medium zoom for tablet
        startFov: 65,
        endFov: 55,
      };
    } else {
      return {
        position: [-10, 55, -300] as [number, number, number], // Original desktop position
        startFov: 60,
        endFov: 50,
      };
    }
  };

  const cameraSettings = getCameraSettings();

  useEffect(() => {
    setMounted(true);
  }, []);

  useFrame(({ clock }) => {
    if (cameraRef.current && mounted) {
      const time = clock.getElapsedTime();

      // Smooth FOV transition for zoom effect
      const progress = Math.min(time / 3, 1); // 3 seconds to complete
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

      // Use device-specific FOV values
      const currentFov =
        cameraSettings.startFov +
        (cameraSettings.endFov - cameraSettings.startFov) * easeProgress;

      cameraRef.current.fov = currentFov;
      cameraRef.current.updateProjectionMatrix();
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={cameraSettings.position}
      fov={cameraSettings.startFov}
    />
  );
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
}: SceneProps) {
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);
  const [hoveredBonfire, setHoveredBonfire] = useState(false);
  const [hoveredCarHouse, setHoveredCarHouse] = useState(false);
  const [hoveredAkuAku, setHoveredAkuAku] = useState(false);
  const [hoveredCafe, setHoveredCafe] = useState(false);

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
      };
    },
    []
  );

  const handleBonfireHover = createHoverHandler('bonfire', setHoveredBonfire);
  const handleCarHouseHover = createHoverHandler(
    'carhouse',
    setHoveredCarHouse
  );
  const handleAkuAkuHover = createHoverHandler('akuaku', setHoveredAkuAku);
  const handleCafeHover = createHoverHandler('cafe', setHoveredCafe);

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

      {/* Bottom Center Title Display for Objects */}
      <AnimatePresence mode='wait'>
        {(hoveredBonfire ||
          hoveredCarHouse ||
          hoveredAkuAku ||
          hoveredCafe) && (
          <motion.div
            key={`object-title-${
              hoveredBonfire
                ? 'Skillset'
                : hoveredCarHouse
                ? 'Connect'
                : hoveredAkuAku
                ? 'Profile'
                : hoveredCafe
                ? 'Portfolio'
                : ''
            }`}
            style={{
              position: 'fixed',
              bottom: '2%', // Moved up from bottom to be more centered
              left: '47.5%',
              transform: 'translateX(-50%)',
              zIndex: 9999,
              pointerEvents: 'none',
            }}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{
              duration: 0.25,
              ease: 'easeOut',
              exit: { duration: 0.2, ease: 'easeIn' },
            }}
          >
            <div
              style={{
                fontFamily: 'Lato, sans-serif',
                fontWeight: '700',
                fontSize: deviceInfo?.isMobile
                  ? '1.2rem'
                  : deviceInfo?.isTablet
                  ? '1.35rem'
                  : '1.5rem',
                color: isDarkMode ? '#FFFFFF' : '#FFFFFF',
                textShadow:
                  '0 4px 12px rgba(0, 0, 0, 0.8), 0 2px 6px rgba(0, 0, 0, 0.6)',
                padding: deviceInfo?.isMobile ? '8px 16px' : '10px 20px',
              }}
            >
              {hoveredBonfire
                ? 'Skillset'
                : hoveredCarHouse
                ? 'Connect'
                : hoveredAkuAku
                ? 'Profile'
                : hoveredCafe
                ? 'Portfolio'
                : ''}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Canvas
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          background: 'transparent',
        }}
        onCreated={({ gl }) => {
          // Better performance on mobile devices
          const pixelRatio = deviceInfo?.isMobile
            ? Math.min(window.devicePixelRatio, 1.5)
            : Math.min(window.devicePixelRatio, 2);
          gl.setPixelRatio(pixelRatio);
        }}
        onPointerMissed={() => {
          setTimeout(() => {
            document.body.style.cursor = 'default';
            setHoveredObject(null);
            setHoveredBonfire(false);
            setHoveredCarHouse(false);
            setHoveredAkuAku(false);
            setHoveredCafe(false);
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
              position={[-20, 30, 10]}
              intensity={0.8}
              color='#e6f3ff'
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-far={100}
              shadow-camera-left={-50}
              shadow-camera-right={50}
              shadow-camera-top={50}
              shadow-camera-bottom={-50}
            />
          </>
        ) : (
          <>
            <ambientLight intensity={0.4} color='#fff5e6' />
            <directionalLight
              position={[20, 40, 15]}
              intensity={1.5}
              color='#fff8dc'
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-far={100}
              shadow-camera-left={-50}
              shadow-camera-right={50}
              shadow-camera-top={50}
              shadow-camera-bottom={-50}
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

          {/* Buildings & Structures */}
          <InteractiveObject
            onHover={handleCafeHover}
            onClick={() => handleNavigation('portfolio')}
            boundingBox={getBoundingBox([12, 15, 8])}
            position={[-15, 8, 10]}
            isDarkMode={isDarkMode}
          >
            <SimpleCafe key={`cafe-${isDarkMode}`} isDarkMode={isDarkMode} />
          </InteractiveObject>

          {/* Vehicles */}
          <InteractiveObject
            onHover={handleCarHouseHover}
            onClick={() => handleNavigation('connect')}
            boundingBox={getBoundingBox([15, 12, 15])}
            position={[10.5, 6, 15]}
            isDarkMode={isDarkMode}
          >
            <SimpleCar key={`car-${isDarkMode}`} isDarkMode={isDarkMode} />
          </InteractiveObject>
          <SimpleBoat key={`boat-${isDarkMode}`} isDarkMode={isDarkMode} />

          {/* Decorative Objects */}
          <InteractiveObject
            onHover={handleBonfireHover}
            onClick={() => handleNavigation('skillset')}
            boundingBox={getBoundingBox([4, 6, 4])}
            position={[-15, 3, -17.5]}
            isDarkMode={isDarkMode}
          >
            <SimpleBonfire
              key={`bonfire-${isDarkMode}`}
              isDarkMode={isDarkMode}
            />
          </InteractiveObject>

          {/* Animated Characters */}
          <InteractiveObject
            onHover={handleAkuAkuHover}
            onClick={() => handleNavigation('profile')}
            boundingBox={getBoundingBox([10, 12, 8])}
            position={[20, 6, 0]}
            isDarkMode={isDarkMode}
          >
            <SimpleAkuAku
              key={`akuaku-${isDarkMode}`}
              isDarkMode={isDarkMode}
            />
          </InteractiveObject>

          {/* Environmental Elements */}
          <SimpleClouds
            key={`clouds-${isDarkMode}`}
            isDarkMode={isDarkMode}
            deviceInfo={deviceInfo}
          />
        </Suspense>

        <AnimatedCamera deviceInfo={deviceInfo} />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={false}
          target={[0, 0, 0]}
          maxDistance={
            deviceInfo?.isMobile ? 120 : deviceInfo?.isTablet ? 100 : 80
          }
          minDistance={
            deviceInfo?.isMobile ? 60 : deviceInfo?.isTablet ? 50 : 40
          }
        />
      </Canvas>
    </div>
  );
}

// Preload 3D models for better performance
useGLTF.preload('/models/object_island.glb');
useGLTF.preload('/models/object_bonfire.glb');
useGLTF.preload('/models/object_aku_aku.glb');
useGLTF.preload('/models/object_boat.glb');
useGLTF.preload('/models/object_car_house.glb');
useGLTF.preload('/models/object_cafe_beach.glb');
useGLTF.preload('/models/object_cloud1.glb');
useGLTF.preload('/models/object_cloud2.glb');
useGLTF.preload('/models/object_cloud3.glb');
useGLTF.preload('/models/object_cloud4.glb');

export default React.memo(SceneComponent);
