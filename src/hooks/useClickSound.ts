import { useRef, useCallback } from 'react';

type SoundType = 'click' | 'hover';

interface SoundRefs {
  click: HTMLAudioElement | null;
  hover: HTMLAudioElement | null;
}

// Audio paths for UI sounds
const SOUND_PATHS = {
  click: '/assets/audio/sound_click.mp3',
  hover: '/assets/audio/sound_hover.wav',
} as const;

export function useClickSound(volume: number = 0.45) {
  const audioRefs = useRef<SoundRefs>({
    click: null,
    hover: null,
  });

  // Lazy audio initialization
  const initializeAudio = useCallback(
    (type: SoundType) => {
      if (!audioRefs.current[type]) {
        audioRefs.current[type] = new Audio(SOUND_PATHS[type]);
        audioRefs.current[type]!.volume = volume;
        audioRefs.current[type]!.preload = 'auto';
      }
    },
    [volume]
  );

  // Play sound with autoplay policy handling
  const playSound = useCallback(
    (type: SoundType = 'click') => {
      initializeAudio(type);

      const audio = audioRefs.current[type];
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {
          // Silently handle autoplay policy restrictions
        });
      }
    },
    [initializeAudio]
  );

  // Convenience methods
  const playClickSound = useCallback(() => playSound('click'), [playSound]);
  const playHoverSound = useCallback(() => playSound('hover'), [playSound]);

  return { playClickSound, playHoverSound, playSound };
}
