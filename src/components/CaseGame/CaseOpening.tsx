import { memo } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useCaseStore } from '@/stores/useCaseStore';
import { useCaseAnimation } from './hooks/useCaseAnimation';
import { CaseDisplay } from './components/CaseDisplay';
import { ItemSlot } from './components/ItemSlot';
import Image from 'next/image';
import winIndicatorImg from '@/../public/cases-game/line.svg';
import { useTranslation } from '@/i18n/useTranslation';
import { CASE_VISUAL } from '@/components/CaseGame/constants';

export const CaseOpening = memo(() => {
  const { selectedCase, animationItems, isAnimating } = useCaseStore();
  const { t } = useTranslation();
  const controls = useAnimation();
  const { handleAnimationComplete, handleSkip } = useCaseAnimation(controls);

  if (!selectedCase) return null;

  return (
    <div className="relative h-[calc(100vh-200px)] w-[820px] overflow-hidden">
      {/* Case Display */}
      <CaseDisplay />

      {/* Scrolling strip container */}
      <div className="absolute top-1/12 right-0 left-0 mx-6 flex h-60 items-center overflow-hidden rounded-3xl border border-amber-300 bg-black max-sm:h-48">
        {/* Winning indicator line */}
        <Image
          src={winIndicatorImg}
          alt="line"
          height={116}
          width={20}
          className="absolute left-1/2 z-20 -translate-x-1/2"
        />
        <motion.div
          className="absolute left-1/2 flex justify-center"
          style={{ gap: CASE_VISUAL.ITEM_SLOT_GAP }}
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
          className="absolute top-[45%] left-1/2 -translate-x-1/2 rounded-lg border px-6 py-3 text-[var(--main-text-color)] transition-all hover:scale-105 active:scale-95 max-sm:top-[42%]"
        >
          {t.casesGame.skipOpening}
        </button>
      )}
    </div>
  );
});
