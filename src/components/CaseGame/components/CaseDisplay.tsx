import { memo } from 'react';
import { motion } from 'framer-motion';
import { CASE_ANIMATION, CASE_VISUAL } from '../constants';
import caseImg from '@/../public/cases-game/case-img.png';
import Image from 'next/image';

interface CaseDisplayProps {
  caseName: string;
}

export const CaseDisplay = memo<CaseDisplayProps>(({ caseName }) => {
  return (
    <motion.div
      className="absolute flex flex-col items-center justify-center"
      style={{
        left: CASE_VISUAL.CASE_X_POSITION,
        top: CASE_VISUAL.CASE_Y_POSITION,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ scale: 1 }}
      animate={{ scale: CASE_ANIMATION.CASE_SCALE_SIZE }}
      transition={{
        delay: CASE_ANIMATION.CASE_SCALE_DELAY / 1000,
        duration: CASE_ANIMATION.CASE_SCALE_DURATION / 1000,
        ease: 'easeOut',
      }}
    >
      <div className="flex h-32 w-32 items-center justify-center rounded-lg border-4 border-purple-500 bg-purple-900/40">
        <Image src={caseImg} alt="case" width={350} height={200} />
      </div>
      <p className="mt-2 text-lg font-bold text-white">{caseName}</p>
    </motion.div>
  );
});

CaseDisplay.displayName = 'CaseDisplay';
