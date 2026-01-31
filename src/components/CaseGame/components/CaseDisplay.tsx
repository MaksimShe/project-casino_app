import { motion } from 'framer-motion';
import { CASE_ANIMATION, CASE_VISUAL } from '../constants';
import caseImg from '@/../public/cases-game/case-img.png';
import Image from 'next/image';

export const CaseDisplay = () => {
  return (
    <motion.div
      className="absolute flex -translate-x-1/2 flex-col"
      style={{
        left: CASE_VISUAL.CASE_X_POSITION,
        top: '45%',
      }}
      initial={{ scale: 1 }}
      animate={{ scale: CASE_ANIMATION.CASE_SCALE_SIZE }}
      transition={{
        delay: CASE_ANIMATION.CASE_SCALE_DELAY / 1000,
        duration: CASE_ANIMATION.CASE_SCALE_DURATION / 1000,
        ease: 'easeOut',
      }}
    >
      <Image src={caseImg} alt="case" width={300} height={200} />
    </motion.div>
  );
};

CaseDisplay.displayName = 'CaseDisplay';
