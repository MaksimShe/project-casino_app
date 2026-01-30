import { memo } from 'react';
import { motion } from 'framer-motion';
import { useCaseStore } from '@/stores/useCaseStore';
import { useCaseAnimation } from './hooks/useCaseAnimation';
import { CaseDisplay } from './components/CaseDisplay';
import { ItemSlot } from './components/ItemSlot';
import { CASE_ANIMATION, CASE_VISUAL } from './constants';

export const CaseOpening = memo(() => {
  const { selectedCase, animationItems } = useCaseStore();
  const { calculateFinalPosition, handleAnimationComplete } =
    useCaseAnimation();

  if (!selectedCase) return null;

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Case Display */}
      <CaseDisplay caseName={selectedCase.name} />

      {/* Winning indicator line */}
      <div
        className="pointer-events-none absolute z-20 w-1 bg-purple-500"
        style={{
          left: '50%',
          top: `calc(${CASE_VISUAL.CASE_Y_POSITION} + ${CASE_VISUAL.STRIP_Y_OFFSET}px)`,
          height: `${CASE_VISUAL.ITEM_SLOT_HEIGHT}px`,
          transform: 'translateX(-50%)',
        }}
      />

      {/* Scrolling strip container */}
      <div
        className="absolute overflow-hidden"
        style={{
          left: 0,
          right: 0,
          top: `calc(${CASE_VISUAL.CASE_Y_POSITION} + ${CASE_VISUAL.STRIP_Y_OFFSET}px)`,
          height: `${CASE_VISUAL.ITEM_SLOT_HEIGHT}px`,
        }}
      >
        <motion.div
          className="absolute flex"
          style={{
            left: '50%',
            gap: `${CASE_VISUAL.ITEM_SLOT_GAP}px`,
          }}
          initial={{ x: 0 }}
          animate={{
            x: calculateFinalPosition(),
          }}
          transition={{
            duration: CASE_ANIMATION.TOTAL_DURATION / 1000,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          onAnimationComplete={handleAnimationComplete}
        >
          {animationItems.map((item, index) => (
            <ItemSlot
              key={`${item.id}-${index}`}
              item={item}
              isWinning={index === CASE_VISUAL.WINNING_ITEM_INDEX}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
});

CaseOpening.displayName = 'CaseOpening';
