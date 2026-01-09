'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CoinProps {
  id: number;
  x: number;
  y: number;
  mouseX: number;
  mouseY: number;
  eyeState: boolean;
}

function Coin({ x, y, mouseX, mouseY, eyeState }: CoinProps) {
  const calculateEyePosition = (eyeX: number, eyeY: number) => {
    const dx = mouseX - eyeX;
    const dy = mouseY - eyeY;
    const angle = Math.atan2(dy, dx);
    const distance = Math.min(Math.sqrt(dx * dx + dy * dy) / 100, 3);

    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    };
  };

  const leftEye = calculateEyePosition(x + 25, y + 30);
  const rightEye = calculateEyePosition(x + 45, y + 30);

  const getEyeVariants = () => {
    if (eyeState) return { height: 4 };
    return { height: 24 };
  };

  return (
    <motion.div
      className="absolute"
      style={{ left: x, top: y }}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] shadow-lg">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent" />

        {/* LEFT EYE */}
        <motion.div
          className="absolute top-5 left-5 w-6 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-white"
          animate={getEyeVariants()}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <motion.div
            className="absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1a1a2e]"
            animate={{
              x: leftEye.x * 3,
              y: leftEye.y * 3,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          />
        </motion.div>

        {/* RIGHT EYE */}
        <motion.div
          className="absolute top-5 -right-1 w-6 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-white"
          animate={getEyeVariants()}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <motion.div
            className="absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1a1a2e]"
            animate={{
              x: rightEye.x * 3,
              y: rightEye.y * 3,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

interface AnimatedBackgroundProps {
  eyeState?: boolean;
}

export function AnimatedBackground({
  eyeState = false,
}: AnimatedBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [coins, setCoins] = useState<{ id: number; x: number; y: number }[]>(
    []
  );

  useEffect(() => {
    // Generate random coin positions
    const generateCoins = () => {
      const newCoins = [];
      const coinCount = 8;

      for (let i = 0; i < coinCount; i++) {
        newCoins.push({
          id: i,
          x: Math.random() * (window.innerWidth - 100),
          y: Math.random() * (window.innerHeight - 100),
        });
      }

      setCoins(newCoins);
    };

    generateCoins();

    // Handle mouse move
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', generateCoins);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', generateCoins);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-20">
      {coins.map(coin => (
        <Coin
          key={coin.id}
          id={coin.id}
          x={coin.x}
          y={coin.y}
          mouseX={mousePosition.x}
          mouseY={mousePosition.y}
          eyeState={eyeState}
        />
      ))}
    </div>
  );
}
