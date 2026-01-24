import { useMemo, useEffect, useState, useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';

interface CrashChartProps {
  currentMultiplier: number;
  gameState: 'waiting' | 'running' | 'crashed';
}

const PX_PER_MULT = 200;
const MAX_TIME = 488;

export default function CrashChart({
  currentMultiplier,
  gameState,
}: CrashChartProps) {
  const timeSpacing = 20;
  const multSpacing = 40;

  // Internal time tracking
  const [internalTime, setInternalTime] = useState(0);
  const gameStartTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Motion values for smooth animation
  const timeOffsetMotion = useMotionValue(0);
  const multiplierOffsetMotion = useMotionValue(0);

  // Use internal time or provided elapsed time
  const totalSeconds = Math.max(0, internalTime) / 1000;
  const elapsedSeconds = Math.floor(totalSeconds);

  // Generate sliding time markers - fixed 1-second steps
  const timeMarkers = useMemo(() => {
    const markers: string[] = [];
    for (let i = 0; i <= MAX_TIME; i++) {
      //488 - max time what can be
      markers.push(String(i) + 's');
      markers.push('|');
    }
    return markers;
  }, [elapsedSeconds]);

  // Generate sliding multiplier markers with dynamic step sizes
  const multiplierMarkers = useMemo(() => {
    const markers: number[] = [];

    // Add values below 1.0x (at the bottom)

    // Add values from 1.0x and up
    const safeMultiplier = Math.max(1.0, currentMultiplier);
    const maxMultiplier = Math.ceil(safeMultiplier) + 10;

    let current = 0.0;
    while (current <= maxMultiplier) {
      markers.push(current);
      const step = 0.2;
      current = parseFloat((current + step).toFixed(2));
    }

    return markers;
  }, [currentMultiplier]);

  // Main animation loop - updates both time and motion values
  useEffect(() => {
    if (gameState === 'running') {
      if (!gameStartTimeRef.current) {
        gameStartTimeRef.current = Date.now();
      }

      const updateAnimation = () => {
        const elapsed = Date.now() - gameStartTimeRef.current!;
        setInternalTime(elapsed);

        // Update time offset: MOVE LEFT as time increases
        const seconds = elapsed / 1000;
        const timeOffset = -seconds * (timeSpacing * 4);
        timeOffsetMotion.set(timeOffset);

        animationFrameRef.current = requestAnimationFrame(updateAnimation);
      };

      animationFrameRef.current = requestAnimationFrame(updateAnimation);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    } else {
      // Reset when not running
      gameStartTimeRef.current = null;
      setInternalTime(0);
      timeOffsetMotion.set(0);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  }, [gameState, timeSpacing, timeOffsetMotion]);

  // Update multiplier offset when multiplier changes
  useEffect(() => {
    const baseOffset = -30;
    const delta = Math.max(0, currentMultiplier - 1);
    const offset = baseOffset + delta * PX_PER_MULT;

    // просто сетимо нову позицію
    multiplierOffsetMotion.set(offset);
  }, [currentMultiplier]);

  return (
    <div className="absolute inset-0 h-[560px] w-[700px] overflow-hidden">
      {/* LEFT SIDE - Multiplier Axis */}
      <div className="absolute top-0 bottom-0 left-0 w-32">
        {/* Sliding multiplier markers - 1.0x at center, higher numbers above */}
        <motion.div
          className="absolute top-0 bottom-0 left-8 flex flex-col-reverse items-end pb-[30%]"
          style={{ y: multiplierOffsetMotion }}
          transition={{
            type: 'tween',
            ease: 'linear',
            duration: 0.1,
          }}
        >
          {multiplierMarkers.map(mult => (
            <div
              key={mult}
              className="text-base whitespace-nowrap"
              style={{
                minHeight: `${multSpacing}px`,
                lineHeight: `${multSpacing}px`,
              }}
            >
              {mult.toFixed(1)}x
            </div>
          ))}
        </motion.div>

        {/* Fixed lupe at vertical center (1x origin) - NO TEXT */}
        <div className="absolute left-8 z-20 flex h-full flex-col">
          <div className="flex-11 backdrop-blur-sm" />
          <div className="h-8 w-12 border-2 border-purple-500 bg-gray-900/20" />
          <div className="flex-12 backdrop-blur-sm" />
        </div>
      </div>

      {/* BOTTOM - Time Axis */}
      <div className="absolute right-0 bottom-0 left-0 h-24">
        {/* Sliding time markers - 0s at center, slides LEFT as time increases */}
        <motion.div
          className="absolute right-0 bottom-6 -left-3.5 flex pl-[54%] text-white opacity-90"
          style={{
            x: timeOffsetMotion,
            gap: `${timeSpacing}px`,
          }}
        >
          {timeMarkers.map(time => (
            <div
              key={time}
              className="font-mono text-base whitespace-nowrap"
              style={{ minWidth: `${timeSpacing}px`, textAlign: 'center' }}
            >
              {time}
            </div>
          ))}
        </motion.div>

        {/* Fixed lupe at horizontal center (0s origin) - NO TEXT */}
        <div className="absolute bottom-5 z-20 flex h-10 w-full">
          <div className="flex-7 backdrop-blur-sm" />
          <div className="mt-2 h-8 w-12 border-2 border-purple-500 bg-gray-900/20" />
          <div className="flex-6 backdrop-blur-sm" />
        </div>
      </div>
    </div>
  );
}
