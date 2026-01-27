import type { PlinkoPeg } from '@/types/plinko';
import { PLINKO_PHYSICS, PLINKO_PHYSICS_MOBILE } from '../constants';

/**
 * Check if a ball collides with a peg
 * @param ballX Ball x position
 * @param ballY Ball y position
 * @param peg Peg object
 * @param isMobile Whether to use mobile dimensions
 * @returns true if collision detected
 */
export function checkPegCollision(
  ballX: number,
  ballY: number,
  peg: PlinkoPeg,
  isMobile = false
): boolean {
  const PHYSICS = isMobile ? PLINKO_PHYSICS_MOBILE : PLINKO_PHYSICS;
  const { BALL_RADIUS, PEG_RADIUS } = PHYSICS;
  const collisionDistance = BALL_RADIUS + PEG_RADIUS;

  const dx = ballX - peg.x;
  const dy = ballY - peg.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance < collisionDistance;
}

export function findClosestPeg(
  ballX: number,
  ballY: number,
  pegs: PlinkoPeg[],
  isMobile = false
): PlinkoPeg | null {
  let closestPeg: PlinkoPeg | null = null;
  let minDistance = Infinity;

  for (const peg of pegs) {
    const dx = ballX - peg.x;
    const dy = ballY - peg.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (
      distance < minDistance &&
      checkPegCollision(ballX, ballY, peg, isMobile)
    ) {
      minDistance = distance;
      closestPeg = peg;
    }
  }

  return closestPeg;
}
