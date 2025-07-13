import { useRef, useCallback } from 'react';

type SoundType = 'click' | 'hover';

interface SoundRefs {
  click: HTMLAudioElement | null;
  hover: HTMLAudioElement | null;
}

export function useClickSound(volume: number = 0.45) {
  const audioRefs = useRef<SoundRefs>({
    click: null,
    hover: null,
  });

  // Initialize audio for a specific sound type
  const initializeAudio = useCallback(
    (type: SoundType) => {
      if (!audioRefs.current[type]) {
        const soundPaths = {
          click: '/assets/audio/sound_click.mp3',
          hover: '/assets/audio/sound_hover.wav',
        };

        audioRefs.current[type] = new Audio(soundPaths[type]);
        audioRefs.current[type]!.volume = volume;
        audioRefs.current[type]!.preload = 'auto';
      }
    },
    [volume]
  );

  const playSound = useCallback(
    (type: SoundType = 'click') => {
      initializeAudio(type);

      const audio = audioRefs.current[type];
      if (audio) {
        // Reset audio to beginning in case it's still playing
        audio.currentTime = 0;
        audio.play().catch(() => {
          // Sound blocked by browser autoplay policy
        });
      }
    },
    [initializeAudio]
  );

  const playClickSound = useCallback(() => playSound('click'), [playSound]);
  const playHoverSound = useCallback(() => playSound('hover'), [playSound]);

  return { playClickSound, playHoverSound, playSound };
}
