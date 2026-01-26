import { useEffect, useRef, useCallback } from 'react';
import type { PlinkoBall, PlinkoDrop } from '@/types/plinko';
import { usePlinkoStore } from '@/stores/usePlinkoStore';
import { PLINKO_ANIMATION, PLINKO_BOARD } from '../constants';
import { usePlinkoPhysics } from './usePlinkoPhysics';
import type { PlinkoPeg } from '@/types/plinko';

interface UsePlinkoBallAnimationProps {
  dropResults: PlinkoDrop[] | null;
  pegs: PlinkoPeg[];
  lines: number;
  onComplete?: () => void;
}

/**
 * Hook for managing ball animations
 * Spawns balls sequentially, animates them along paths, and removes them when complete
 */
export function usePlinkoBallAnimation({
  dropResults,
  pegs,
  lines,
  onComplete,
}: UsePlinkoBallAnimationProps) {
  const {
    addBall,
    updateBall,
    removeBall,
    setIsAnimating,
    highlightPeg,
    highlightSlot,
  } = usePlinkoStore();

  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const spawnedCountRef = useRef<number>(0);
  const lastSpawnTimeRef = useRef<number>(0);
  const completedBallsRef = useRef<Set<string>>(new Set());
  const completionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Physics hook for updating ball positions
  const { updateBall: updateBallPhysics } = usePlinkoPhysics({
    lines,
    pegs,
    onPegCollision: highlightPeg,
  });

  /**
   * Spawn a new ball from drop result
   */
  const spawnBall = useCallback(
    (drop: PlinkoDrop, index: number) => {
      const { WIDTH, PADDING_TOP } = PLINKO_BOARD;
      const centerX = WIDTH / 2;

      const ball: PlinkoBall = {
        id: `ball-${drop.dropId}-${index}-${Date.now()}`,
        x: centerX,
        y: PADDING_TOP,
        vx: 0,
        vy: 0,
        isComplete: false,
        finalSlot: drop.slotIndex,
        finalMultiplier: drop.multiplier,
        path: drop.path,
        currentPathIndex: 0,
      };

      addBall(ball);
    },
    [addBall]
  );

  /**
   * Animation loop
   */
  const animate = useCallback(
    (timestamp: number) => {
      if (!dropResults || dropResults.length === 0) {
        setIsAnimating(false);
        return;
      }

      // Spawn balls sequentially with delay
      const { BALL_SPAWN_DELAY } = PLINKO_ANIMATION;
      if (spawnedCountRef.current < dropResults.length) {
        if (timestamp - lastSpawnTimeRef.current >= BALL_SPAWN_DELAY) {
          const drop = dropResults[spawnedCountRef.current];
          spawnBall(drop, spawnedCountRef.current);
          spawnedCountRef.current++;
          lastSpawnTimeRef.current = timestamp;
        }
      }

      // Get fresh state from store to avoid stale closures
      const currentBalls = usePlinkoStore.getState().activeBalls;

      // Update all active balls
      const updatedBalls = currentBalls.map(ball => updateBallPhysics(ball));

      // Update balls in store and track completed ones
      updatedBalls.forEach(ball => {
        if (ball.isComplete && !completedBallsRef.current.has(ball.id)) {
          // Mark as completed
          completedBallsRef.current.add(ball.id);

          // Highlight final slot
          if (ball.finalSlot !== null) {
            highlightSlot(ball.finalSlot);
          }

          // Remove ball after short delay
          setTimeout(() => {
            removeBall(ball.id);
          }, 500);
        } else if (!ball.isComplete) {
          updateBall(ball.id, ball);
        }
      });

      // Check if all balls are spawned and completed
      const allBallsSpawned = spawnedCountRef.current >= dropResults.length;
      const allBallsCompleted =
        completedBallsRef.current.size >= dropResults.length;

      if (allBallsSpawned && allBallsCompleted) {
        // Wait a bit for balls to be removed, then end animation
        if (!completionTimerRef.current) {
          completionTimerRef.current = setTimeout(() => {
            setIsAnimating(false);
            if (onComplete) {
              onComplete();
            }
          }, 1000);
        }
        return;
      }

      // Continue animation
      // eslint-disable-next-line react-hooks/immutability
      animationFrameRef.current = requestAnimationFrame(animate);
    },
    [
      dropResults,
      spawnBall,
      updateBallPhysics,
      updateBall,
      removeBall,
      highlightSlot,
      setIsAnimating,
      onComplete,
    ]
  );

  /**
   * Start animation when drop results are available
   */
  useEffect(() => {
    if (dropResults && dropResults.length > 0) {
      // Reset counters and refs
      spawnedCountRef.current = 0;
      lastSpawnTimeRef.current = 0;
      lastFrameTimeRef.current = 0;
      completedBallsRef.current = new Set();
      if (completionTimerRef.current) {
        clearTimeout(completionTimerRef.current);
        completionTimerRef.current = null;
      }

      // Start animation
      setIsAnimating(true);
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (completionTimerRef.current) {
        clearTimeout(completionTimerRef.current);
      }
    };
  }, [dropResults, animate, setIsAnimating]);

  return null;
}
