import { motion } from 'framer-motion';
import { CASE_ANIMATION } from '../constants';
import caseImg from '@/../public/cases-game/case-img.png';
import Image from 'next/image';

export const CaseDisplay = () => {
  return (
    <motion.div
      className="absolute top-3/5 left-1/2 flex -translate-x-1/2 flex-col"
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
