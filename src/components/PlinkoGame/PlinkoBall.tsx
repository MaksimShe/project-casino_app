import { memo } from 'react';
import { motion } from 'framer-motion';
import type { PlinkoBall as PlinkoBallType } from '@/types/plinko';
import { useIsMobile } from './hooks/useIsMobile';
import {
  PLINKO_PHYSICS,
  PLINKO_PHYSICS_MOBILE,
  PLINKO_ANIMATION,
} from './constants';

interface PlinkoBallProps {
  ball: PlinkoBallType;
}

export const PlinkoBall = memo<PlinkoBallProps>(({ ball }) => {
  const isMobile = useIsMobile();
  const PHYSICS = isMobile ? PLINKO_PHYSICS_MOBILE : PLINKO_PHYSICS;
  const radius = PHYSICS.BALL_RADIUS;

  // Apply jump offsets to ball position for bounce effect
  const visualX = ball.x + ball.jumpOffsetX;
  const visualY = ball.y + ball.jumpOffsetY;

  return (
    <motion.div
      className="absolute h-[6px] w-[6px] rounded-full bg-gradient-to-br from-[var(--btn-primary-start)] to-[var(--btn-primary-end)] shadow-lg md:h-4 md:w-4"
      initial={{
        x: visualX - radius,
        y: visualY - radius,
      }}
      animate={{
        x: visualX - radius, // Offset by radius
        y: visualY - radius,
        scale: ball.isComplete ? 0 : 1,
      }}
      transition={{
        type: 'tween',
        duration: PLINKO_ANIMATION.FRAME_DURATION_SECONDS,
        ease: 'linear',
      }}
    />
  );
});

PlinkoBall.displayName = 'PlinkoBall';
