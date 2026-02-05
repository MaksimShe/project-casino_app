import type { GridSize } from '@/types/mines';

export const MINES_CONSTANTS = {
  // Grid dimensions
  GRID_DIMENSIONS: {
    5: { rows: 5, cols: 5 },
    6: { rows: 6, cols: 6 },
    7: { rows: 7, cols: 7 },
    8: { rows: 8, cols: 8 },
  } as Record<GridSize, { rows: number; cols: number }>,

  // Cell size (px)
  CELL_SIZE: 70,
  CELL_GAP: 8,

  // Animation durations (ms)
  REVEAL_DURATION: 200,
  MINE_REVEAL_DELAY: 100,

  // Assets
  COIN_IMAGE: '/mines-game/coin.svg',
  BOMB_IMAGE: '/mines-game/bomb.svg',
} as const;
