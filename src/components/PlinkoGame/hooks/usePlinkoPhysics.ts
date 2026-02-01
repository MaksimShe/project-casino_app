import { useCallback, useRef } from 'react';
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
   * Update ball position following backend path with realistic curved motion
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

      // Check if ball passed or is close to target (important with gravity!)
      // Check both distance and if ball has moved past target vertically
      const hasPassedTarget = ball.y >= target.y - 5;
      const isCloseToTarget =
        distance < PLINKO_PHYSICS_TUNING.PATH_POINT_THRESHOLD * 2;

      // If close enough OR passed the target, move to next point in path
      if (isCloseToTarget || hasPassedTarget) {
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
            // Find closest peg to ball's current position
            // This ensures we detect collision at the actual peg center
            const collidedPeg = findClosestPeg(
              newBall.x,
              newBall.y,
              pegs,
              isMobile
            );
            if (collidedPeg && onPegCollision) {
              onPegCollision(collidedPeg.id);
              lastCollisionTime.current.set(ball.id, now);

              const bounceStrength = isMobile
                ? PLINKO_PHYSICS_TUNING.BOUNCE_STRENGTH_MOBILE
                : PLINKO_PHYSICS_TUNING.BOUNCE_STRENGTH_DESKTOP;

              const jumpX = 0;
              const jumpY =
                -bounceStrength * PLINKO_PHYSICS_TUNING.BOUNCE_UPWARD_BIAS;

              const nextTargetIndex = Math.min(
                targetIndex + 1,
                pathCoords.length - 1
              );
              const nextTarget = pathCoords[nextTargetIndex];
              const horizontalDistance = nextTarget.x - newBall.x;

              const initialUpwardVelocity = -6;
              const gravity = PLINKO_PHYSICS_TUNING.GRAVITY_STRENGTH;

              const timeToComplete = Math.abs(
                (2 * initialUpwardVelocity) / gravity
              );

              const arcVelocityX = horizontalDistance / timeToComplete;

              return {
                ...newBall,
                pauseUntil:
                  Date.now() + PLINKO_PHYSICS_TUNING.COLLISION_PAUSE_MS,
                speed: PLINKO_PHYSICS_TUNING.INITIAL_BALL_SPEED * 1.2,
                vx: arcVelocityX,
                vy: initialUpwardVelocity,
                jumpOffsetX: jumpX,
                jumpOffsetY: jumpY,
              };
            }
          }
        }

        return newBall;
      }

      let newVx = ball.vx;
      let newVy = ball.vy;

      newVy += PLINKO_PHYSICS_TUNING.GRAVITY_STRENGTH;

      newVx *= 0.995;
      newVy *= 0.995;

      const currentSpeed = Math.sqrt(newVx * newVx + newVy * newVy);
      const adjustedSpeed = Math.max(
        currentSpeed,
        PLINKO_PHYSICS_TUNING.MIN_SPEED
      );

      return {
        ...ball,
        x: ball.x + newVx,
        y: ball.y + newVy,
        vx: newVx,
        vy: newVy,
        speed: adjustedSpeed,
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
