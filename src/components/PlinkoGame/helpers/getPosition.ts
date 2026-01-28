import {
  PLINKO_BOARD,
  PLINKO_BOARD_MOBILE,
  PLINKO_BOARD_STRUCTURE,
} from '../constants';

/**
 * Calculate peg position for a specific row and column
 * @param row Row number (0-indexed)
 * @param col Column number (0-indexed)
 * @param isMobile Whether to use mobile dimensions
 * @returns {x, y} coordinates
 */
export function getPegPosition(
  row: number,
  col: number,
  isMobile = false
): { x: number; y: number } {
  const BOARD = isMobile ? PLINKO_BOARD_MOBILE : PLINKO_BOARD;
  const { WIDTH, ROW_SPACING, COL_SPACING, PADDING_TOP } = BOARD;
  const centerX = WIDTH / 2;

  const pegsInRow = row + PLINKO_BOARD_STRUCTURE.INITIAL_PEGS_COUNT;
  const rowY =
    PADDING_TOP + (row + PLINKO_BOARD_STRUCTURE.ROW_OFFSET) * ROW_SPACING;
  const totalWidth = (pegsInRow - 1) * COL_SPACING;
  const startX = centerX - totalWidth / 2;
  const pegX = startX + col * COL_SPACING;

  return { x: pegX, y: rowY };
}

/**
 * Calculate slot position at the bottom of the board
 * @param slotIndex Slot index (0-indexed)
 * @param totalSlots Total number of slots
 * @param isMobile Whether to use mobile dimensions
 * @returns {x, y} coordinates
 */
export function getSlotPosition(
  slotIndex: number,
  totalSlots: number,
  isMobile = false
): { x: number; y: number } {
  const BOARD = isMobile ? PLINKO_BOARD_MOBILE : PLINKO_BOARD;
  const { WIDTH, SLOT_WIDTH } = BOARD;
  const centerX = WIDTH / 2;
  const totalWidth = totalSlots * SLOT_WIDTH;
  const startX = centerX - totalWidth / 2;
  const slotX = startX + slotIndex * SLOT_WIDTH + SLOT_WIDTH / 2;

  return { x: slotX, y: 0 }; // Y will be calculated based on board height
}
