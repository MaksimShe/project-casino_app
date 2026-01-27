import { getPegPosition, getSlotPosition } from './getPosition';
import { PLINKO_BOARD, PLINKO_BOARD_MOBILE } from '../constants';

/**
 * Convert backend path array (0s and 1s) to visual coordinates
 * @param path Array of 0s (left) and 1s (right)
 * @param lines Number of lines in the board
 * @param finalSlotIndex The final slot index where the ball lands (optional)
 * @param isMobile Whether to use mobile dimensions
 * @returns Array of {x, y} coordinates for ball to follow
 */
export function calculatePathCoordinates(
  path: number[],
  lines: number,
  finalSlotIndex?: number,
  isMobile = false
): Array<{ x: number; y: number }> {
  const coordinates: Array<{ x: number; y: number }> = [];
  const BOARD = isMobile ? PLINKO_BOARD_MOBILE : PLINKO_BOARD;
  const { WIDTH, PADDING_TOP, ROW_SPACING, PADDING_BOTTOM } = BOARD;
  const centerX = WIDTH / 2;

  // Starting position (center top)
  coordinates.push({ x: centerX, y: PADDING_TOP });

  // Track current column position
  let currentCol = 1; // Start at middle of first row (3 pegs, index 1)

  // Generate coordinates for each step in path
  for (let row = 0; row < path.length && row < lines; row++) {
    const direction = path[row]; // 0 = left, 1 = right

    // Update column based on direction
    // Each row has one more peg than the last
    if (direction !== 0) {
      // Go right - increment column index
      currentCol = currentCol + 1;
    }

    // Get the peg position for this row and column
    const pegPos = getPegPosition(row, currentCol, isMobile);
    coordinates.push(pegPos);
  }

  // Add final slot position if provided
  if (finalSlotIndex !== undefined) {
    const totalSlots = lines + 1;
    const slotPos = getSlotPosition(finalSlotIndex, totalSlots, isMobile);

    // Calculate slot Y position (bottom of the board minus some padding)
    const slotY = PADDING_TOP + lines * ROW_SPACING + PADDING_BOTTOM - 20;

    coordinates.push({ x: slotPos.x, y: slotY });
  }

  return coordinates;
}

/**
 * Get the slot index from a path array
 * The final column position determines which slot the ball lands in
 * @param path Array of 0s and 1s
 * @returns Slot index
 */
export function getSlotIndexFromPath(path: number[]): number {
  let currentCol = 1; // Start at middle of first row

  for (const direction of path) {
    if (direction === 1) {
      currentCol++;
    }
    // If direction is 0, currentCol stays the same (relative to expanding grid)
  }

  return currentCol;
}
