import { useEffect } from 'react';
import { MINES_MODAL_CONFIG } from '@/types/mines';

/**
 * Custom hook that auto-closes modals after a specified delay
 * Used by Win and Lose modals to automatically start a new game
 */
export function useMinesModalAutoClose(
  onClose: () => void,
  delay: number = MINES_MODAL_CONFIG.AUTO_CLOSE_DELAY
) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, delay);

    return () => clearTimeout(timer);
  }, [onClose, delay]);
}
