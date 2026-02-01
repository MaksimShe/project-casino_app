import { useCallback, useEffect, useState } from 'react';
import type { useAnimation } from 'framer-motion';
import { useCaseStore } from '@/stores/useCaseStore';
import { CASE_VISUAL, CASE_ANIMATION } from '../constants';

export const useCaseAnimation = (controls: ReturnType<typeof useAnimation>) => {
  const store = useCaseStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const calculateFinalPosition = useCallback(() => {
    const itemSlotWidth = isMobile ? 100 : CASE_VISUAL.ITEM_SLOT_WIDTH;
    const itemWidth = itemSlotWidth + CASE_VISUAL.ITEM_SLOT_GAP;
    const winningPosition = CASE_VISUAL.WINNING_ITEM_INDEX * itemWidth;

    return -(winningPosition + itemWidth / 2);
  }, [isMobile]);

  const handleAnimationComplete = useCallback(() => {
    store.setIsAnimating(false);
    setTimeout(() => {
      store.setViewState('result');
    }, CASE_ANIMATION.RESULT_DELAY);
  }, [store]);

  const handleSkip = useCallback(async () => {
    await controls.start({
      x: calculateFinalPosition(),
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    });

    store.setIsAnimating(false);
    store.setViewState('result');
  }, [controls, calculateFinalPosition, store]);

  // Start animation on mount
  useEffect(() => {
    controls.start({
      x: calculateFinalPosition(),
      transition: {
        duration: CASE_ANIMATION.TOTAL_DURATION / 1000,
        ease: [0.1, 0.2, 0.2, 0.99],
      },
    });
  }, [controls, calculateFinalPosition]);

  return {
    calculateFinalPosition,
    handleAnimationComplete,
    handleSkip,
  };
};
