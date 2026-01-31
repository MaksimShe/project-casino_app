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

  const handleStop = () => {
    controls.stop();
  };

  if (!selectedCase) return null;

  return (
    <div className="relative h-screen w-[788px] overflow-hidden">
      {/* Skip Button */}
      {isAnimating && (
        <button
          onClick={handleSkip}
          className="absolute top-8 right-8 z-30 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:bg-purple-700 active:scale-95"
        >
          Skip Opening
        </button>
      )}

      {/* TEMP: Stop Button for Development */}
      {isAnimating && (
        <button
          onClick={handleStop}
          className="absolute top-8 right-48 z-30 rounded-lg bg-yellow-600 px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:bg-yellow-700 active:scale-95"
        >
          STOP (DEV)
        </button>
      )}

      {/* Case Display */}
      <CaseDisplay />

      {/* Winning indicator line */}
      <Image
        src={winIndicatorImg}
        alt="line"
        height={CASE_VISUAL.ITEM_SLOT_HEIGHT + 24}
        width={CASE_VISUAL.ITEM_SLOT_HEIGHT / 9.6}
        className="absolute -top-[31px] left-1/2 z-20 translate-y-1/2"
      />

      {/* Scrolling strip container */}
      <div
        className="absolute flex items-center overflow-hidden rounded-3xl border border-amber-300 bg-black"
        style={{
          left: 0,
          right: 0,
          top: `calc(${CASE_VISUAL.CASE_Y_POSITION} + ${CASE_VISUAL.STRIP_Y_OFFSET}px)`,
          height: `${CASE_VISUAL.ITEM_SLOT_HEIGHT + 48}px`,
        }}
      >
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
