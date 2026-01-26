import { memo } from 'react';
import { motion } from 'framer-motion';
import cn from 'classnames';
import { formatNumber } from '@/utils/format';

interface PlinkoSlotProps {
  multiplier: number;
  isHighlighted: boolean;
  index: number;
}

export const PlinkoSlot = memo<PlinkoSlotProps>(
  ({ multiplier, isHighlighted }) => {
    const getColorClass = (mult: number): string => {
      if (mult >= 100) return 'bg-[#9E34EB]';
      if (mult >= 10) return 'bg-[var(--system-error-color)]';
      if (mult >= 5) return 'bg-[#D34521]';
      if (mult >= 2) return 'bg-[#D38321]';
      if (mult >= 1) return 'bg-[#D3B621]';
      return 'bg-[var(--system-success-color)]';
    };

    const colorClass = getColorClass(multiplier);

    return (
      <motion.div
        className={cn(
          'flex h-8 w-11 items-center justify-center gap-1 rounded text-white',
          colorClass
        )}
        animate={{
          scale: isHighlighted ? [1, 1.2, 1, 1.15, 1] : 1,
        }}
        transition={{
          duration: 0.6,
          ease: 'easeOut',
        }}
      >
        <span className="text-xs font-bold">{formatNumber(multiplier)}x</span>
      </motion.div>
    );
  }
);

PlinkoSlot.displayName = 'PlinkoSlot';
