import type { PlinkoPeg } from '@/types/plinko';
import { PLINKO_PHYSICS } from '../constants';

/**
 * Check if a ball collides with a peg
 * @param ballX Ball x position
 * @param ballY Ball y position
 * @param peg Peg object
 * @returns true if collision detected
 */
export function checkPegCollision(
  ballX: number,
  ballY: number,
  peg: PlinkoPeg
): boolean {
  const { BALL_RADIUS, PEG_RADIUS, SPAWNER_PEG_RADIUS } = PLINKO_PHYSICS;
  const pegRadius = peg.isSpawner ? SPAWNER_PEG_RADIUS : PEG_RADIUS;
  const collisionDistance = BALL_RADIUS + pegRadius;

  const dx = ballX - peg.x;
  const dy = ballY - peg.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance < collisionDistance;
}

/**
 * Find the closest peg to a ball position
 * @param ballX Ball x position
 * @param ballY Ball y position
 * @param pegs Array of pegs
 * @returns Closest peg or null
 */
export function findClosestPeg(
  ballX: number,
  ballY: number,
  pegs: PlinkoPeg[]
): PlinkoPeg | null {
  let closestPeg: PlinkoPeg | null = null;
  let minDistance = Infinity;

  for (const peg of pegs) {
    const dx = ballX - peg.x;
    const dy = ballY - peg.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < minDistance && checkPegCollision(ballX, ballY, peg)) {
      minDistance = distance;
      closestPeg = peg;
    }
  }

  return closestPeg;
}
