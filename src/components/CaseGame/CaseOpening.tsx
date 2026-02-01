import { memo } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useCaseStore } from '@/stores/useCaseStore';
import { useCaseAnimation } from './hooks/useCaseAnimation';
import { CaseDisplay } from './components/CaseDisplay';
import { ItemSlot } from './components/ItemSlot';
import { CASE_VISUAL } from './constants';
import Image from 'next/image';
import winIndicatorImg from '@/../public/cases-game/line.svg';

export const CaseOpening = memo(() => {
  const { selectedCase, animationItems, isAnimating } = useCaseStore();
  const controls = useAnimation();
  const { handleAnimationComplete, handleSkip } = useCaseAnimation(controls);

  if (!selectedCase) return null;

  return (
    <div className="relative h-screen w-[820px] overflow-hidden">
      {/* Case Display */}
      <CaseDisplay />

      {/* Scrolling strip container */}
      <div
        className="absolute mx-6 flex h-60 items-center overflow-hidden rounded-3xl border border-amber-300 bg-black max-sm:h-48"
        style={{
          left: 0,
          right: 0,
          top: `calc(${CASE_VISUAL.CASE_Y_POSITION} + ${CASE_VISUAL.STRIP_Y_OFFSET}px)`,
        }}
      >
        {/* Winning indicator line */}
        <Image
          src={winIndicatorImg}
          alt="line"
          height={CASE_VISUAL.ITEM_SLOT_HEIGHT + 24}
          width={CASE_VISUAL.ITEM_SLOT_HEIGHT / 9.6}
          className="absolute left-1/2 z-20 -translate-x-1/2"
        />
        <motion.div
          className="absolute flex justify-center"
          style={{
            left: '50%',
            gap: `${CASE_VISUAL.ITEM_SLOT_GAP}px`,
          }}
          initial={{ x: 0 }}
          animate={controls}
          onAnimationComplete={handleAnimationComplete}
        >
          {animationItems.map((item, index) => (
            <ItemSlot key={`${item.id}-${index}`} item={item} />
          ))}
        </motion.div>
      </div>
      {isAnimating && (
        <button
          onClick={handleSkip}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 rounded-lg border px-6 py-3 text-white transition-all hover:scale-105 active:scale-95 sm:top-[39%]"
        >
          Skip opening
        </button>
      )}
    </div>
  );
});

CaseOpening.displayName = 'CaseOpening';
