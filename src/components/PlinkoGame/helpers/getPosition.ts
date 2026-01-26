import { PLINKO_BOARD } from '../constants';

/**
 * Calculate peg position for a specific row and column
 * @param row Row number (0-indexed)
 * @param col Column number (0-indexed)
 * @returns {x, y} coordinates
 */
export function getPegPosition(row: number, col: number): { x: number; y: number } {
  const { WIDTH, ROW_SPACING, COL_SPACING, PADDING_TOP } = PLINKO_BOARD;
  const centerX = WIDTH / 2;

  const pegsInRow = row + 3;
  const rowY = PADDING_TOP + (row + 1) * ROW_SPACING;
  const totalWidth = (pegsInRow - 1) * COL_SPACING;
  const startX = centerX - totalWidth / 2;
  const pegX = startX + col * COL_SPACING;

  return { x: pegX, y: rowY };
}

/**
 * Calculate slot position at the bottom of the board
 * @param slotIndex Slot index (0-indexed)
 * @param totalSlots Total number of slots
 * @returns {x, y} coordinates
 */
export function getSlotPosition(
  slotIndex: number,
  totalSlots: number
): { x: number; y: number } {
  const { WIDTH, SLOT_WIDTH } = PLINKO_BOARD;
  const centerX = WIDTH / 2;
  const totalWidth = totalSlots * SLOT_WIDTH;
  const startX = centerX - totalWidth / 2;
  const slotX = startX + slotIndex * SLOT_WIDTH + SLOT_WIDTH / 2;

  return { x: slotX, y: 0 }; // Y will be calculated based on board height
}
