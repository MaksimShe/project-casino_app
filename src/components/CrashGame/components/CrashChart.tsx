import { useMemo, useEffect, useRef } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';
import { useCrashStore } from '@/stores/useCrashStore';
import ChartLeftAxis from './ChartLeftAxis';
import ChartBottomAxis from './ChartBottomAxis';
import { formatNumber } from '@/utils/format';

const PX_PER_MULT = 100;
const MAX_TIME = 488;

export default function CrashChart() {
  const timeSpacing = 20;
  const multSpacing = 20;

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
      markers.push({ value: '·', key: String(i + 0.5) });
    }
    return markers;
  }, []);

  // Generate static multiplier markers up to 500x - memoized, never changes
  const multiplierMarkers = useMemo(() => {
    const markers: { value: string; key: string }[] = [];
    const current = 1.0;
    const step = 0.2;
    const maxStatic = 500;

    for (let i = current; i <= maxStatic; i += step) {
      markers.push({ value: formatNumber(i, 1) + 'x', key: String(i) });
      markers.push({ value: '------', key: String(i + 0.1) });
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
      const offset = baseOffset + delta * PX_PER_MULT * 2; // 2x faster scroll for left axis
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
    <div className="absolute inset-0 h-full w-full max-sm:hidden">
      {/* LEFT SIDE - Multiplier Axis */}
      <ChartLeftAxis
        multiplierMarkers={multiplierMarkers}
        smoothMultiplierOffset={smoothMultiplierOffset}
        multSpacing={multSpacing}
      />

      {/* BOTTOM - Time Axis */}
      <ChartBottomAxis
        timeMarkers={timeMarkers}
        timeOffsetMotion={timeOffsetMotion}
        timeSpacing={timeSpacing}
      />
    </div>
  );
}
