import { useMemo, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useCrashStore } from '@/stores/useCrashStore';

const PX_PER_MULT = 200;
const MAX_TIME = 488;

export default function CrashChart() {
  const timeSpacing = 20;
  const multSpacing = 40;

  // Internal time tracking
  const gameStartTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Motion values for smooth animation (these don't cause rerenders when updated)
  const timeOffsetMotion = useMotionValue(0);
  const multiplierOffsetMotion = useMotionValue(0);

  // Smooth spring animation for multiplier axis
  const smoothMultiplierOffset = useSpring(multiplierOffsetMotion, {
    stiffness: 120,
    damping: 20,
    mass: 0.5,
  });

  // Generate sliding time markers - memoized, never changes
  const timeMarkers = useMemo(() => {
    const markers: { value: string; key: string }[] = [];
    for (let i = 0; i <= MAX_TIME; i++) {
      markers.push({ value: String(i) + 's', key: String(i) });
      markers.push({ value: '|', key: String(i + 0.5) });
    }
    return markers;
  }, []);

  // Generate static multiplier markers up to 500x - memoized, never changes
  const multiplierMarkers = useMemo(() => {
    const markers: number[] = [];
    let current = 0.0;
    const maxStatic = 500;

    while (current <= maxStatic) {
      markers.push(current);
      current = parseFloat((current + 0.2).toFixed(2));
    }

    return markers;
  }, []);

  // Main animation loop - reads from Zustand store without causing rerenders
  useEffect(() => {
    const updateAnimation = () => {
      // Get latest values directly from Zustand store (no rerenders)
      const { multiplier, gameState } = useCrashStore.getState();

      // Update time offset
      if (gameState === 'running') {
        if (!gameStartTimeRef.current) {
          gameStartTimeRef.current = Date.now();
        }

        const elapsed = Date.now() - gameStartTimeRef.current!;
        const seconds = elapsed / 1000;
        const timeOffset = -seconds * (timeSpacing * 4);
        timeOffsetMotion.set(timeOffset);
      } else {
        gameStartTimeRef.current = null;
        timeOffsetMotion.set(0);
      }

      // Update multiplier offset (every frame, using store value)
      const baseOffset = -30;
      const delta = Math.max(0, multiplier - 1);
      const offset = baseOffset + delta * PX_PER_MULT;
      multiplierOffsetMotion.set(offset);

      animationFrameRef.current = requestAnimationFrame(updateAnimation);
    };

    animationFrameRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [timeSpacing, timeOffsetMotion, multiplierOffsetMotion]);

  return (
    <div className="absolute inset-0 h-[560px] w-[700px] overflow-hidden">
      {/* LEFT SIDE - Multiplier Axis */}
      <div className="absolute top-0 bottom-0 left-0 w-32">
        {/* Sliding multiplier markers - 1.0x at center, higher numbers above */}
        <motion.div
          className="absolute top-0 bottom-0 left-8 flex flex-col-reverse items-end pb-[30%]"
          style={{ y: smoothMultiplierOffset }}
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
              key={time.key}
              className="font-mono text-base whitespace-nowrap"
              style={{ minWidth: `${timeSpacing}px`, textAlign: 'center' }}
            >
              {time.value}
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
