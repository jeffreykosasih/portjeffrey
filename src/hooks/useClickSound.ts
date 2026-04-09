import { useRef, useCallback } from 'react';

type UseClickSoundOptions = number | { click?: number };

interface SoundRefs {
  click: HTMLAudioElement | null;
}

// Audio paths for UI sounds
const SOUND_PATHS = {
  click: '/assets/audio/sound_click.mp3',
} as const;

const clampVolume = (volume: number): number => Math.min(Math.max(volume, 0), 1);

export function useClickSound(options: UseClickSoundOptions = 0.45) {
  const audioRefs = useRef<SoundRefs>({
    click: null,
  });

  const getVolumeForType = useCallback(
    (): number => {
      if (typeof options === 'number') {
        return clampVolume(options);
      }

      const fallbackVolume = 0.45;
      const volume = options.click ?? fallbackVolume;
      return clampVolume(volume);
    },
    [options]
  );

  // Lazy audio initialization
  const initializeAudio = useCallback(
    () => {
      if (!audioRefs.current.click) {
        audioRefs.current.click = new Audio(SOUND_PATHS.click);
        audioRefs.current.click.volume = getVolumeForType();
        audioRefs.current.click.preload = 'auto';
      }
    },
    [getVolumeForType]
  );

  // Play sound with autoplay policy handling
  const playSound = useCallback(
    () => {
      initializeAudio();

      const audio = audioRefs.current.click;
      if (audio) {
        audio.volume = getVolumeForType();
        audio.currentTime = 0;
        audio.play().catch(() => {
          // Silently handle autoplay policy restrictions
        });
      }
    },
    [getVolumeForType, initializeAudio]
  );

  const playClickSound = useCallback(() => playSound(), [playSound]);

  return { playClickSound, playSound };
}
