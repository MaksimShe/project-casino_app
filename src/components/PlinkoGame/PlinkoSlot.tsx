import { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import cn from 'classnames';
import { formatNumber } from '@/utils/format';
import { usePlinkoStore } from '@/stores/usePlinkoStore';
import { PLINKO_ANIMATION } from './constants';

interface PlinkoSlotProps {
  multiplier: number;
  index: number;
}

const getColorClass = (mult: number): string => {
  if (mult >= 100) return 'bg-[#9E34EB]';
  if (mult >= 10) return 'bg-[var(--system-error-color)]';
  if (mult >= 5) return 'bg-[#D34521]';
  if (mult >= 2) return 'bg-[#D38321]';
  if (mult >= 1) return 'bg-[#D3B621]';
  return 'bg-[var(--system-success-color)]';
};

export const PlinkoSlot = memo<PlinkoSlotProps>(({ multiplier, index }) => {
  // Only subscribe to this specific slot's collision timestamp
  const collisionTimestamp: number | undefined = usePlinkoStore(state =>
    state.slotCollisions.get(index)
  );

  // Track highlight state
  const [isHighlighted, setIsHighlighted] = useState(false);

  // Handle highlight animation when collision occurs
  useEffect(() => {
    if (collisionTimestamp) {
      setIsHighlighted(true);
      const timer = setTimeout(() => {
        setIsHighlighted(false);
      }, PLINKO_ANIMATION.COLLISION_ANIMATION_DURATION);

      return () => clearTimeout(timer);
    }
  }, [collisionTimestamp]);

  const colorClass = getColorClass(multiplier);

  return (
    <div className="relative">
      <motion.div
        className={cn(
          'flex h-4 w-5 items-center justify-center gap-1 rounded text-[var(--main-text-color)] md:h-8 md:w-11',
          colorClass
        )}
        animate={{
          scale: isHighlighted ? [1, 1.3, 1.15, 1] : 1,
        }}
        transition={{
          duration: PLINKO_ANIMATION.COLLISION_ANIMATION_DURATION / 1000,
          ease: 'easeOut',
        }}
      >
        <span className="text-[8px] font-bold md:text-xs">
          {multiplier > 100
            ? formatNumber(multiplier, 0)
            : formatNumber(multiplier)}
          x
        </span>
      </motion.div>

      {/* Glow effect on collision */}
      <AnimatePresence>
        {isHighlighted && (
          <motion.div
            key={collisionTimestamp}
            className={cn('absolute inset-0 -z-10 rounded blur-sm', colorClass)}
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: PLINKO_ANIMATION.COLLISION_ANIMATION_DURATION / 1000,
              ease: 'easeOut',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
});
