import { memo } from 'react';
import { motion } from 'framer-motion';
import { getRarityColor } from '../helpers/getRarityColor';
import { CASE_ANIMATION, CASE_VISUAL } from '../constants';
import type { OpeningResult } from '@/types/case';
import Image from 'next/image';
import caseImg from '@/../public/cases-game/case-img.png';

interface WinningItemDisplayProps {
  result: OpeningResult;
  caseName?: string;
}

export const WinningItemDisplay = memo<WinningItemDisplayProps>(
  ({ result, caseName }) => {
    const rarityColors = getRarityColor(result.item.rarity);

    return (
      <motion.div
        className="relative flex w-[500px] items-center justify-center overflow-hidden rounded-2xl p-1"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: CASE_ANIMATION.WINNING_ITEM_SCALE_DURATION / 1000,
          ease: 'easeOut',
        }}
      >
        {/* Gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${rarityColors.hex}, ${rarityColors.hex}20)`,
          }}
        />

        {/* Small dot in left bottom corner */}
        <div
          className="absolute bottom-8 left-8 z-20 h-3 w-3 rounded-full"
          style={{ backgroundColor: rarityColors.hex }}
        />

        {/* Content */}
        <div className="relative z-10 flex w-full flex-col items-center rounded-xl bg-[#423E69] p-8">
          {/* Item name */}
          <p className="mb-2 w-full text-3xl font-bold text-white">
            {result.item.name}
          </p>
          {/* Case name */}
          <p className="mb-4 flex w-full gap-2">
            <Image src={caseImg} alt="case" width={40} height={16} />
            {caseName || 'Unknown Case'}
          </p>
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
            {result.item.imageUrl}
          </motion.div>
          <p className="text-xl text-green-400">{result.item.value}$</p>
        </div>
      </motion.div>
    );
  }
);

WinningItemDisplay.displayName = 'WinningItemDisplay';
