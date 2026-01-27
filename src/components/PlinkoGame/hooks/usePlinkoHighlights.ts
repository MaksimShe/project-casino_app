import { useEffect, useRef } from 'react';
import { usePlinkoStore } from '@/stores/usePlinkoStore';
import { PLINKO_ANIMATION } from '../constants';

/**
 * Hook for cleaning up old collision timestamps
 * Periodically removes collisions from the store after they expire
 */
export function usePlinkoHighlights() {
  const cleanupOldCollisions = usePlinkoStore(
    state => state.cleanupOldCollisions
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Cleanup old collisions periodically
    intervalRef.current = setInterval(() => {
      cleanupOldCollisions();
    }, PLINKO_ANIMATION.COLLISION_CLEANUP_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [cleanupOldCollisions]);

  return null;
}
