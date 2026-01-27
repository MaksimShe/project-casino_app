import { useRef, useCallback } from 'react';
import type { PlinkoBall, PlinkoPeg } from '@/types/plinko';
import { calculatePathCoordinates } from '../helpers';
import { findClosestPeg } from '../helpers/checkPegCollision';

interface UsePlinkoPhysicsProps {
  lines: number;
  pegs: PlinkoPeg[];
  onPegCollision?: (pegId: string) => void;
  isMobile?: boolean;
}

/**
 * Hook for simulating Plinko ball physics along backend-provided path
 * Follows the path from the backend while detecting collisions for visual effects
 */
export function usePlinkoPhysics({
  lines,
  pegs,
  onPegCollision,
  isMobile = false,
}: UsePlinkoPhysicsProps) {
  const lastCollisionTime = useRef<Map<string, number>>(new Map());
  const collisionCooldown = 100; // ms between collision detections for same ball

  /**
   * Update ball position following backend path
   */
  const updateBall = useCallback(
    (ball: PlinkoBall): PlinkoBall => {
      if (ball.isComplete) return ball;

      // Get path coordinates including final slot position
      const pathCoords = calculatePathCoordinates(
        ball.path,
        lines,
        ball.finalSlot ?? undefined,
        isMobile
      );

      // Check if we've reached the end of the path
      if (ball.currentPathIndex >= pathCoords.length - 1) {
        return {
          ...ball,
          isComplete: true,
        };
      }

      // Get current target position from path
      const targetIndex = Math.min(
        ball.currentPathIndex + 1,
        pathCoords.length - 1
      );
      const target = pathCoords[targetIndex];

      // Calculate direction to target
      const dx = target.x - ball.x;
      const dy = target.y - ball.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // If close enough to target, move to next point in path
      if (distance < 5) {
        const newBall = {
          ...ball,
          x: target.x,
          y: target.y,
          currentPathIndex: targetIndex,
        };

        // Check for peg collision at this position for visual highlight
        // Only check for peg collisions, not when reaching the final slot
        const isAtFinalSlot = targetIndex === pathCoords.length - 1;
        if (!isAtFinalSlot) {
          const now = Date.now();
          const lastTime = lastCollisionTime.current.get(ball.id) || 0;

          if (now - lastTime > collisionCooldown) {
            const collidedPeg = findClosestPeg(ball.x, ball.y, pegs, isMobile);
            if (collidedPeg && onPegCollision) {
              onPegCollision(collidedPeg.id);
              lastCollisionTime.current.set(ball.id, now);
            }
          }
        }

        return newBall;
      }

      // Smooth interpolation towards target
      const speed = 3; // pixels per frame
      const vx = (dx / distance) * speed;
      const vy = (dy / distance) * speed;

      return {
        ...ball,
        x: ball.x + vx,
        y: ball.y + vy,
        vx,
        vy,
      };
    },
    [lines, pegs, onPegCollision, collisionCooldown, isMobile]
  );

  return { updateBall };
}
