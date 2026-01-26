import { memo } from 'react';
import { motion } from 'framer-motion';
import type { PlinkoPeg as PlinkoPlinkoPegType } from '@/types/plinko';
import cn from 'classnames';

interface PlinkoPegProps {
  peg: PlinkoPlinkoPegType;
  isHighlighted: boolean;
}

export const PlinkoPeg = memo<PlinkoPegProps>(({ peg, isHighlighted }) => {
  return (
    <motion.div
      className={cn(
        'absolute rounded-full',
        peg.isSpawner
          ? 'h-5 w-5 bg-blue-500 shadow-lg shadow-blue-500/50'
          : 'h-3 w-3 bg-[#ADB5BD] shadow-[0_0_16px_0_#FFFFFF40]',
        isHighlighted &&
          !peg.isSpawner &&
          'bg-amber-500 shadow-lg shadow-amber-500/60'
      )}
      style={{
        left: '50%',
        top: 0,
        x: peg.x - (peg.isSpawner ? 10 : 6), // Offset by radius
        y: peg.y - (peg.isSpawner ? 10 : 6),
      }}
      animate={{
        scale: isHighlighted && !peg.isSpawner ? [1, 1.3, 1] : 1,
      }}
      transition={{
        duration: 0.3,
        ease: 'easeOut',
      }}
    />
  );
});

PlinkoPeg.displayName = 'PlinkoPeg';
