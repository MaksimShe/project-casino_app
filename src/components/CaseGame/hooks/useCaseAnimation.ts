import { useCallback, useEffect, useRef, useState } from 'react';
import type { useAnimation } from 'framer-motion';
import { useCaseStore } from '@/stores/useCaseStore';
import { useGameStore, AudioSound } from '@/stores/useGameStore';
import { CASE_VISUAL, CASE_ANIMATION, CaseViewState } from '../constants';

export const useCaseAnimation = (controls: ReturnType<typeof useAnimation>) => {
  const store = useCaseStore();
  const { playAudio } = useGameStore();
  const [isMobile, setIsMobile] = useState(false);
  const lastItemIndexRef = useRef<number>(-1);

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
      store.setViewState(CaseViewState.RESULT);
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
    store.setViewState(CaseViewState.RESULT);
  }, [controls, calculateFinalPosition, store]);

  const handleAnimationUpdate = useCallback(
    (latest: { x?: number }) => {
      // Only play ticks during the normal animation (not during skip)
      if (!store.isAnimating || typeof latest.x !== 'number') return;

      const itemSlotWidth = isMobile ? 100 : CASE_VISUAL.ITEM_SLOT_WIDTH;
      const itemWidth = itemSlotWidth + CASE_VISUAL.ITEM_SLOT_GAP;

      // Calculate which item is currently at the center
      const currentItemIndex = Math.floor(-latest.x / itemWidth);

      // Play tick sound when a new item crosses the center
      if (
        currentItemIndex !== lastItemIndexRef.current &&
        currentItemIndex >= 0
      ) {
        lastItemIndexRef.current = currentItemIndex;
        playAudio(AudioSound.ROULETTE_TICK);
      }
    },
    [store.isAnimating, isMobile, playAudio]
  );

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
    handleAnimationUpdate,
  };
};
