'use client';
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type AutoCarouselContextType = {
  autoCarouselEnabled: boolean;
  setAutoCarouselEnabled: (enabled: boolean) => void;
  disableAutoCarousel: () => void;
};

const AutoCarouselContext = createContext<AutoCarouselContextType | undefined>(undefined);

export const AutoCarouselProvider = ({ children }: { children: ReactNode }) => {
  const [autoCarouselEnabled, setAutoCarouselEnabledState] = useState(() => {
    // Initialize from localStorage if available, otherwise default to true
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('autoCarouselEnabled');
        if (saved !== null) {
          return saved === 'true';
        }
      } catch (error) {
        // If localStorage access fails (e.g., private browsing), use default value
        console.warn('Failed to read from localStorage:', error);
      }
    }
    return true;
  });

  // Save auto carousel state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('autoCarouselEnabled', String(autoCarouselEnabled));
      } catch (error) {
        // If localStorage is full or unavailable, log but don't crash
        console.warn('Failed to save to localStorage:', error);
      }
    }
  }, [autoCarouselEnabled]);

  const setAutoCarouselEnabled = useCallback((enabled: boolean) => {
    setAutoCarouselEnabledState(enabled);
  }, []);

  const disableAutoCarousel = useCallback(() => {
    setAutoCarouselEnabledState(false);
  }, []);

  return (
    <AutoCarouselContext.Provider value={{ autoCarouselEnabled, setAutoCarouselEnabled, disableAutoCarousel }}>
      {children}
    </AutoCarouselContext.Provider>
  );
};

export const useAutoCarousel = () => {
  const context = useContext(AutoCarouselContext);
  if (!context) {
    throw new Error('useAutoCarousel must be used within an AutoCarouselProvider');
  }
  return context;
};
