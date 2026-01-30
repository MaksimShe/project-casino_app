import { useCallback } from 'react';
import { useCaseStore } from '@/stores/useCaseStore';
import { CASE_VISUAL, CASE_ANIMATION } from '../constants';

export const useCaseAnimation = () => {
  const store = useCaseStore();

  const calculateFinalPosition = useCallback(() => {
    const itemWidth = CASE_VISUAL.ITEM_SLOT_WIDTH + CASE_VISUAL.ITEM_SLOT_GAP;
    const winningPosition = CASE_VISUAL.WINNING_ITEM_INDEX * itemWidth;

    // Center the winning item in viewport
    if (typeof window !== 'undefined') {
      return -(winningPosition - window.innerWidth / 2 + itemWidth / 2);
    }
    return -winningPosition;
  }, []);

  const handleAnimationComplete = useCallback(() => {
    store.setIsAnimating(false);

    // Show modal after delay
    setTimeout(() => {
      store.setViewState('result');
    }, CASE_ANIMATION.RESULT_DELAY);
  }, [store]);

  return {
    calculateFinalPosition,
    handleAnimationComplete,
  };
};
