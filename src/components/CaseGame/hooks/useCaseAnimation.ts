import { useCallback, useEffect } from 'react';
import type { AnimationControls } from 'framer-motion';
import { useCaseStore } from '@/stores/useCaseStore';
import { CASE_VISUAL, CASE_ANIMATION } from '../constants';

export const useCaseAnimation = (controls: AnimationControls) => {
  const store = useCaseStore();

  const calculateFinalPosition = useCallback(() => {
    const itemWidth = CASE_VISUAL.ITEM_SLOT_WIDTH + CASE_VISUAL.ITEM_SLOT_GAP;
    const winningPosition = CASE_VISUAL.WINNING_ITEM_INDEX * itemWidth;

    // Center the winning item in viewport
    // Container starts at 50% (center), so we need to move it left by:
    // winningPosition + itemWidth/2 to center the item
    return -(winningPosition + itemWidth / 2);
  }, []);

  const handleAnimationComplete = useCallback(() => {
    store.setIsAnimating(false);

    // Show modal after delay
    setTimeout(() => {
      store.setViewState('result');
    }, CASE_ANIMATION.RESULT_DELAY);
  }, [store]);

  const handleSkip = useCallback(async () => {
    // Stop current animation and jump to final position
    await controls.start({
      x: calculateFinalPosition(),
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    });

    // Immediately show result
    store.setIsAnimating(false);
    store.setViewState('result');
  }, [controls, calculateFinalPosition, store]);

  // Start animation on mount
  useEffect(() => {
    controls.start({
      x: calculateFinalPosition(),
      transition: {
        duration: CASE_ANIMATION.TOTAL_DURATION / 1000,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    });
  }, [controls, calculateFinalPosition]);

  return {
    calculateFinalPosition,
    handleAnimationComplete,
    handleSkip,
  };
};
