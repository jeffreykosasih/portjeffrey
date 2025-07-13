import React, { useEffect, useRef, useState } from 'react';

interface OceanAudioProps {
  isActive: boolean; // Should start when main app is shown and loading is complete
  volume?: number;
}

export default function OceanAudio({
  isActive,
  volume = 0.2,
}: OceanAudioProps): React.JSX.Element | null {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const fadeIntervalRef = useRef<number | null>(null);

  // Fade in audio
  const fadeIn = (targetVolume: number, duration: number = 3000) => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    const steps = duration / 50; // Update every 50ms
    const stepChange = targetVolume / steps;
    let currentStep = 0;
    audio.volume = 0;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      const newVolume = stepChange * currentStep;

      if (currentStep >= steps) {
        audio.volume = targetVolume;
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
        }
      } else {
        audio.volume = newVolume;
      }
    }, 50);
  };

  // Fade out audio
  const fadeOut = (duration: number = 1000) => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    const startVolume = audio.volume;
    const steps = duration / 50;
    const stepChange = startVolume / steps;
    let currentStep = 0;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      const newVolume = startVolume - stepChange * currentStep;

      if (currentStep >= steps) {
        audio.volume = 0;
        audio.pause();
        setIsPlaying(false);
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
        }
      } else {
        audio.volume = newVolume;
      }
    }, 50);
  };

  // Handle playing/stopping based on isActive
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isActive && !isPlaying) {
      // Start playing
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          fadeIn(volume);
        })
        .catch(() => {
          // Ocean audio autoplay blocked by browser policy

          // Try to play on user interaction
          const handleUserInteraction = () => {
            audio
              .play()
              .then(() => {
                setIsPlaying(true);
                fadeIn(volume);
              })
              .catch(console.error);

            // Remove listeners after first interaction
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('keydown', handleUserInteraction);
            document.removeEventListener('touchstart', handleUserInteraction);
          };

          document.addEventListener('click', handleUserInteraction);
          document.addEventListener('keydown', handleUserInteraction);
          document.addEventListener('touchstart', handleUserInteraction);
        });
    } else if (!isActive && isPlaying) {
      // Stop playing
      fadeOut();
    }
  }, [isActive, isPlaying, volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      src='/assets/audio/sound_ocean.mp3'
      loop
      preload='auto'
      style={{ display: 'none' }}
    />
  );
}
