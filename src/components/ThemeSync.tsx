'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/stores/useGameStore';

export function ThemeSync() {
  const isDarkMode = useGameStore(state => state.isDarkMode);

  useEffect(() => {
    const root = document.documentElement;

    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  return null;
}
