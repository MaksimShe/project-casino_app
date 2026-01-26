import { memo } from 'react';
import { motion } from 'framer-motion';
import type { PlinkoPeg as PlinkoPlinkoPegType } from '@/types/plinko';
import cn from 'classnames';
import { PLINKO_PHYSICS } from '@/components/PlinkoGame/constants';

interface PlinkoPegProps {
  peg: PlinkoPlinkoPegType;
  isHighlighted: boolean;
}

export const PlinkoPeg = memo<PlinkoPegProps>(({ peg, isHighlighted }) => {
  return (
    <motion.div
      className={cn(
        'absolute h-4 w-4 rounded-full bg-[#ADB5BD] shadow-[0_0_16px_0_#FFFFFF40]',
        isHighlighted &&
          !peg.isSpawner &&
          'bg-amber-500 shadow-lg shadow-amber-500/60'
      )}
      style={{
        left: 0,
        top: 0,
        x: peg.x - PLINKO_PHYSICS.PEG_RADIUS, // Offset by radius
        y: peg.y - PLINKO_PHYSICS.PEG_RADIUS,
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
