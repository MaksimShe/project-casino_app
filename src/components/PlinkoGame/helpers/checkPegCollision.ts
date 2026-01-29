import type { PlinkoPeg } from '@/types/plinko';
import { PLINKO_PHYSICS, PLINKO_PHYSICS_MOBILE } from '../constants';

/**
 * Check if a ball collides with CENTER TOP of peg only
 * @param ballX Ball x position
 * @param ballY Ball y position
 * @param peg Peg object
 * @param isMobile Whether to use mobile dimensions
 * @returns true if collision detected at center top
 */
export function checkPegCollision(
  ballX: number,
  ballY: number,
  peg: PlinkoPeg,
  isMobile = false
): boolean {
  const PHYSICS = isMobile ? PLINKO_PHYSICS_MOBILE : PLINKO_PHYSICS;
  const { PEG_RADIUS } = PHYSICS;

  const dx = ballX - peg.x;
  const dy = ballY - peg.y;

  const horizontalDistance = Math.abs(dx);
  const verticalOffset = dy;

  const centerTolerance = PEG_RADIUS * 0.7;
  const isAtCenter = horizontalDistance <= centerTolerance;

  const isAtTop =
    verticalOffset >= -PEG_RADIUS * 1.5 && verticalOffset <= PEG_RADIUS * 0.5;

  return isAtCenter && isAtTop;
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
