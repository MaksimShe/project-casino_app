import type { PlinkoPeg } from '@/types/plinko';
import { PLINKO_BOARD, PLINKO_BOARD_MOBILE } from '../constants';

/**
 * Generates peg positions for the Plinko board
 * @param lines Number of lines (rows) - determines board height and peg count
 * @param isMobile Whether to use mobile dimensions
 * @returns Array of peg objects with positions and metadata
 */
export function generatePegs(lines: number, isMobile = false): PlinkoPeg[] {
  const pegs: PlinkoPeg[] = [];
  const BOARD = isMobile ? PLINKO_BOARD_MOBILE : PLINKO_BOARD;
  const { WIDTH, ROW_SPACING, COL_SPACING, PADDING_TOP } = BOARD;

  const centerX = WIDTH / 2;
  // Generate regular pegs
  for (let row = 0; row < lines; row++) {
    const pegsInRow = row + 3; // Start with 3 pegs, increase by 1 each row
    const rowY = PADDING_TOP + (row + 1) * ROW_SPACING;

    // Calculate total width needed for this row
    const totalWidth = (pegsInRow - 1) * COL_SPACING;
    const startX = centerX - totalWidth / 2;

    for (let col = 0; col < pegsInRow; col++) {
      const pegX = startX + col * COL_SPACING;
      pegs.push({
        id: `peg-${row}-${col}`,
        x: pegX,
        y: rowY,
        row,
        col,
        isSpawner: false,
      });
    }
  }

  return pegs;
}
