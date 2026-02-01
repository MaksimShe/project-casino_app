import { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PlinkoPeg as PlinkoPegType } from '@/types/plinko';
import {
  PLINKO_PHYSICS,
  PLINKO_PHYSICS_MOBILE,
  PLINKO_ANIMATION,
} from './constants';
import { usePlinkoStore } from '@/stores/usePlinkoStore';
import { useIsMobile } from './hooks/useIsMobile';

interface PlinkoPegProps {
  peg: PlinkoPegType;
}

export const PlinkoPeg = memo<PlinkoPegProps>(({ peg }) => {
  const isMobile = useIsMobile();
  const PHYSICS = isMobile ? PLINKO_PHYSICS_MOBILE : PLINKO_PHYSICS;

  // Only subscribe to this specific peg's collision timestamp
  const collisionTimestamp = usePlinkoStore(state =>
    state.pegCollisions.get(peg.id)
  );

  // Track highlight state
  const [isHighlighted, setIsHighlighted] = useState(false);

  // Handle highlight animation when collision occurs
  useEffect(() => {
    if (collisionTimestamp) {
      setIsHighlighted(true);
      const timer = setTimeout(() => {
        setIsHighlighted(false);
      }, PLINKO_ANIMATION.COLLISION_ANIMATION_DURATION);

      return () => clearTimeout(timer);
    }
  }, [collisionTimestamp]);

  return (
    <div
      className="absolute"
      style={{
        left: peg.x - PHYSICS.PEG_RADIUS,
        top: peg.y - PHYSICS.PEG_RADIUS,
      }}
    >
      <motion.div
        className="h-[6px] w-[6px] rounded-full bg-[#ADB5BD] shadow-[0_0_16px_0_#FFFFFF40] md:h-4 md:w-4"
        animate={{
          scale: isHighlighted && !peg.isSpawner ? [1, 1.4, 1] : 1,
          backgroundColor:
            isHighlighted && !peg.isSpawner ? '#f59e0b' : '#ADB5BD',
        }}
        transition={{
          duration: PLINKO_ANIMATION.COLLISION_ANIMATION_DURATION / 1000,
          ease: 'easeOut',
        }}
      />

      {/* Glow effect on collision */}
      <AnimatePresence>
        {isHighlighted && !peg.isSpawner && (
          <motion.div
            key={collisionTimestamp}
            className="absolute inset-0 rounded-full bg-amber-500"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: PLINKO_ANIMATION.COLLISION_ANIMATION_DURATION / 1000,
              ease: 'easeOut',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
});

PlinkoPeg.displayName = 'PlinkoPeg';
