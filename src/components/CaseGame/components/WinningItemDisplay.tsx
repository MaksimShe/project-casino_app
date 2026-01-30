import { memo } from 'react';
import { motion } from 'framer-motion';
import cn from 'classnames';
import { formatNumber } from '@/utils/format';
import { getRarityColor } from '../helpers/getRarityColor';
import { CASE_ANIMATION, CASE_VISUAL } from '../constants';
import type { OpeningResult } from '@/types/case';

interface WinningItemDisplayProps {
  result: OpeningResult;
}

export const WinningItemDisplay = memo<WinningItemDisplayProps>(
  ({ result }) => {
    const rarityColors = getRarityColor(result.item.rarity);
    const isProfit = result.profit > 0;

    return (
      <motion.div
        className={cn(
          'flex flex-col items-center rounded-2xl border-4 p-8',
          rarityColors.border,
          rarityColors.glow
        )}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: CASE_ANIMATION.WINNING_ITEM_SCALE_DURATION / 1000,
          ease: 'easeOut',
        }}
      >
        {/* Large emoji */}
        <motion.div
          className="mb-4"
          style={{ fontSize: CASE_VISUAL.WINNING_EMOJI_SIZE }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {result.item.image}
        </motion.div>

        {/* Item name */}
        <h2 className="mb-2 text-3xl font-bold text-white">
          {result.item.name}
        </h2>

        {/* Rarity */}
        <div
          className={cn(
            'mb-4 rounded-lg px-4 py-2 text-lg font-bold text-white',
            rarityColors.bg
          )}
        >
          {result.item.rarity}
        </div>

        {/* Value */}
        <p className="mb-2 text-2xl font-bold text-green-400">
          ${formatNumber(result.item.value)}
        </p>

        {/* Profit/Loss */}
        <p
          className={cn('text-xl font-semibold', {
            'text-green-400': isProfit,
            'text-red-400': !isProfit,
          })}
        >
          {isProfit ? '+' : ''}${formatNumber(result.profit)}
        </p>
      </motion.div>
    );
  }
);

WinningItemDisplay.displayName = 'WinningItemDisplay';
