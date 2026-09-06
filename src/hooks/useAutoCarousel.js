import { useState, useEffect, useRef, useCallback } from 'react';

export const useAutoCarousel = (totalItems, interval = 5000) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef(null);

  const next = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % totalItems);
  }, [totalItems]);

  const prev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + totalItems) % totalItems);
  }, [totalItems]);

  const goTo = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    if (isPlaying && totalItems > 1) {
      timerRef.current = setInterval(next, interval);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, next, interval, totalItems]);

  const pause = () => setIsPlaying(false);
  const play = () => setIsPlaying(true);

  return {
    currentIndex,
    next,
    prev,
    goTo,
    pause,
    play
  };
};
