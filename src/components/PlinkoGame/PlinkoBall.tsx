import { memo } from 'react';
import { motion } from 'framer-motion';
import type { PlinkoBall as PlinkoBallType } from '@/types/plinko';

interface PlinkoBallProps {
  ball: PlinkoBallType;
}

export const PlinkoBall = memo<PlinkoBallProps>(({ ball }) => {
  return (
    <motion.div
      className="absolute h-4 w-4 rounded-full bg-gradient-to-br from-[var(--btn-primary-start)] to-[var(--btn-primary-end)] shadow-lg"
      style={{
        left: '50%',
        top: 0,
      }}
      animate={{
        x: ball.x - 8, // Offset by radius
        y: ball.y - 8,
        scale: ball.isComplete ? 0 : 1,
      }}
      transition={{
        type: 'tween',
        duration: 0.036, // ~30fps
        ease: 'linear',
      }}
    />
  );
});

PlinkoBall.displayName = 'PlinkoBall';
