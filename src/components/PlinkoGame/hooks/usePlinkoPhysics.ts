import { useRef, useCallback } from 'react';
import type { PlinkoBall, PlinkoPeg } from '@/types/plinko';
import { calculatePathCoordinates } from '../helpers';
import { findClosestPeg } from '../helpers/checkPegCollision';
import { PLINKO_PHYSICS_TUNING } from '../constants';

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
  const collisionCooldown = PLINKO_PHYSICS_TUNING.COLLISION_COOLDOWN_MS;

  /**
   * Update ball position following backend path
   */
  const updateBall = useCallback(
    (ball: PlinkoBall): PlinkoBall => {
      if (ball.isComplete) return ball;

      // Apply jump offset decay (gradually reduce bounce offset)
      const jumpDecay = PLINKO_PHYSICS_TUNING.JUMP_DECAY_RATE;
      const decayedJumpOffsetX = ball.jumpOffsetX * jumpDecay;
      const decayedJumpOffsetY = ball.jumpOffsetY * jumpDecay;

      // Check for pause state (ball is paused after collision)
      if (ball.pauseUntil && Date.now() < ball.pauseUntil) {
        // Still apply jump offset decay during pause
        return {
          ...ball,
          jumpOffsetX:
            Math.abs(decayedJumpOffsetX) >
            PLINKO_PHYSICS_TUNING.JUMP_OFFSET_THRESHOLD
              ? decayedJumpOffsetX
              : 0,
          jumpOffsetY:
            Math.abs(decayedJumpOffsetY) >
            PLINKO_PHYSICS_TUNING.JUMP_OFFSET_THRESHOLD
              ? decayedJumpOffsetY
              : 0,
        };
      }

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

      // Calculate direction to target (jump offsets are visual only, don't affect path calculation)
      const dx = target.x - ball.x;
      const dy = target.y - ball.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // If close enough to target, move to next point in path
      if (distance < PLINKO_PHYSICS_TUNING.PATH_POINT_THRESHOLD) {
        const newBall = {
          ...ball,
          x: target.x,
          y: target.y,
          currentPathIndex: targetIndex,
          jumpOffsetX:
            Math.abs(decayedJumpOffsetX) >
            PLINKO_PHYSICS_TUNING.JUMP_OFFSET_THRESHOLD
              ? decayedJumpOffsetX
              : 0,
          jumpOffsetY:
            Math.abs(decayedJumpOffsetY) >
            PLINKO_PHYSICS_TUNING.JUMP_OFFSET_THRESHOLD
              ? decayedJumpOffsetY
              : 0,
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

              // Calculate jump direction (away from peg + upward)
              const pegDx = ball.x - collidedPeg.x;
              const pegDy = ball.y - collidedPeg.y;
              const pegDist = Math.sqrt(pegDx * pegDx + pegDy * pegDy);

              // Normalize and create bounce offset
              const bounceStrength = isMobile
                ? PLINKO_PHYSICS_TUNING.BOUNCE_STRENGTH_MOBILE
                : PLINKO_PHYSICS_TUNING.BOUNCE_STRENGTH_DESKTOP;
              const jumpX =
                pegDist > 0 ? (pegDx / pegDist) * bounceStrength : 0;
              const jumpY =
                -bounceStrength * PLINKO_PHYSICS_TUNING.BOUNCE_UPWARD_BIAS;

              // Pause, boost speed, and add jump effect
              return {
                ...newBall,
                pauseUntil:
                  Date.now() + PLINKO_PHYSICS_TUNING.COLLISION_PAUSE_MS,
                speed: Math.min(
                  ball.speed * PLINKO_PHYSICS_TUNING.COLLISION_SPEED_BOOST,
                  PLINKO_PHYSICS_TUNING.MAX_SPEED
                ),
                jumpOffsetX: jumpX,
                jumpOffsetY: jumpY,
              };
            }
          }
        }

        return newBall;
      }

      // Apply damping to speed (gradual slowdown from air resistance)
      const dampedSpeed = ball.speed * PLINKO_PHYSICS_TUNING.SPEED_DAMPING;

      // Smooth interpolation towards target with current speed
      const vx = (dx / distance) * dampedSpeed;
      const vy = (dy / distance) * dampedSpeed;

      return {
        ...ball,
        x: ball.x + vx,
        y: ball.y + vy,
        vx,
        vy,
        speed: Math.max(dampedSpeed, PLINKO_PHYSICS_TUNING.MIN_SPEED),
        jumpOffsetX:
          Math.abs(decayedJumpOffsetX) >
          PLINKO_PHYSICS_TUNING.JUMP_OFFSET_THRESHOLD
            ? decayedJumpOffsetX
            : 0,
        jumpOffsetY:
          Math.abs(decayedJumpOffsetY) >
          PLINKO_PHYSICS_TUNING.JUMP_OFFSET_THRESHOLD
            ? decayedJumpOffsetY
            : 0,
      };
    },
    [lines, pegs, onPegCollision, collisionCooldown, isMobile]
  );

  return { updateBall };
}
