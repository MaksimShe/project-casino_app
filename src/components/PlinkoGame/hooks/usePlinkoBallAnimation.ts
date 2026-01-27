import { useEffect, useRef, useCallback } from 'react';
import type { PlinkoBall, PlinkoDrop } from '@/types/plinko';
import { usePlinkoStore } from '@/stores/usePlinkoStore';
import {
  PLINKO_ANIMATION,
  PLINKO_BOARD,
  PLINKO_BOARD_MOBILE,
} from '../constants';
import { usePlinkoPhysics } from './usePlinkoPhysics';
import type { PlinkoPeg } from '@/types/plinko';

interface UsePlinkoBallAnimationProps {
  dropResults: PlinkoDrop[] | null;
  pegs: PlinkoPeg[];
  lines: number;
  dropSessionId: string | null;
  isMobile?: boolean;
}

/**
 * Hook for managing ball animations
 * Spawns balls sequentially, animates them along paths, and removes them when complete
 */
export function usePlinkoBallAnimation({
  dropResults,
  pegs,
  lines,
  dropSessionId,
  isMobile = false,
}: UsePlinkoBallAnimationProps) {
  const {
    addBall,
    updateBall,
    removeBall,
    registerPegCollision,
    registerSlotCollision,
    setIsActiveGame,
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
    onPegCollision: registerPegCollision,
    isMobile,
  });

  /**
   * Spawn a new ball from drop result
   */
  const spawnBall = useCallback(
    (drop: PlinkoDrop, index: number) => {
      const BOARD = isMobile ? PLINKO_BOARD_MOBILE : PLINKO_BOARD;
      const { WIDTH, PADDING_TOP } = BOARD;
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
    [addBall, isMobile]
  );

  /**
   * Animation loop
   */
  const animate = useCallback(
    (timestamp: number) => {
      if (!dropResults || dropResults.length === 0) {
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

          // Register slot collision
          if (ball.finalSlot !== null) {
            registerSlotCollision(ball.finalSlot);
          }

          // Remove ball after short delay
          setTimeout(() => {
            removeBall(ball.id);
          }, 500);
        } else if (!ball.isComplete) {
          updateBall(ball.id, ball);
        }
      });

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
      registerSlotCollision,
    ]
  );

  /**
   * Start animation when drop results are available
   */
  useEffect(() => {
    if (dropResults && dropResults.length > 0 && dropSessionId) {
      // Reset counters and refs for new drop session
      spawnedCountRef.current = 0;
      lastSpawnTimeRef.current = 0;
      lastFrameTimeRef.current = 0;
      completedBallsRef.current = new Set();
      if (completionTimerRef.current) {
        clearTimeout(completionTimerRef.current);
        completionTimerRef.current = null;
      }

      // Start animation
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
  }, [dropResults, dropSessionId, animate]);

  /**
   * Track active game state based on active balls
   */
  useEffect(() => {
    const { activeBalls } = usePlinkoStore.getState();
    const hasActiveBalls = activeBalls.length > 0;

    // Update isActiveGame based on whether there are active balls
    setIsActiveGame(hasActiveBalls);
  }, [setIsActiveGame]);

  // Monitor activeBalls changes
  useEffect(() => {
    const unsubscribe = usePlinkoStore.subscribe(state => {
      const hasActiveBalls = state.activeBalls.length > 0;
      if (state.isActiveGame !== hasActiveBalls) {
        setIsActiveGame(hasActiveBalls);
      }
    });

    return unsubscribe;
  }, [setIsActiveGame]);

  return null;
}
