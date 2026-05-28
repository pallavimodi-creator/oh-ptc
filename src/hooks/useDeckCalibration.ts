import { useState, useCallback } from 'react';

const STORAGE_KEY_PREFIX = 'deck-timestamps-';

export interface DeckCalibration {
  timestamps: number[];
  isCalibrating: boolean;
  startCalibration: () => void;
  markSlide: (audioCurrentTime: number) => void;
  cancelCalibration: () => void;
  clearCalibration: () => void;
  getSlideForTime: (currentTime: number, duration: number, totalSlides: number) => number;
}

export function useDeckCalibration(deckKey: string, totalSlides: number): DeckCalibration {
  const storageKey = STORAGE_KEY_PREFIX + deckKey;

  const loadTimestamps = (): number[] => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  };

  const [timestamps, setTimestamps] = useState<number[]>(loadTimestamps);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationMarks, setCalibrationMarks] = useState<number[]>([]);

  const startCalibration = useCallback(() => {
    setIsCalibrating(true);
    setCalibrationMarks([0]); // Slide 1 starts at 0
  }, []);

  const markSlide = useCallback((audioCurrentTime: number) => {
    setCalibrationMarks(prev => {
      const next = [...prev, audioCurrentTime];
      // If we've marked all slide transitions, save and finish
      if (next.length >= totalSlides) {
        localStorage.setItem(storageKey, JSON.stringify(next));
        setTimestamps(next);
        setIsCalibrating(false);
        return next;
      }
      return next;
    });
  }, [totalSlides, storageKey]);

  const cancelCalibration = useCallback(() => {
    setIsCalibrating(false);
    setCalibrationMarks([]);
  }, []);

  const clearCalibration = useCallback(() => {
    localStorage.removeItem(storageKey);
    setTimestamps([]);
  }, [storageKey]);

  const getSlideForTime = useCallback((currentTime: number, duration: number, totalSlides: number): number => {
    if (timestamps.length >= totalSlides) {
      // Use calibrated timestamps
      for (let i = timestamps.length - 1; i >= 0; i--) {
        if (currentTime >= timestamps[i]) return i;
      }
      return 0;
    }
    // Fallback: even distribution
    return Math.min(Math.floor((currentTime / duration) * totalSlides), totalSlides - 1);
  }, [timestamps]);

  return {
    timestamps,
    isCalibrating,
    startCalibration,
    markSlide,
    cancelCalibration,
    clearCalibration,
    getSlideForTime,
  };
}
