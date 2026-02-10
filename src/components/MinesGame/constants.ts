import type { GridSize } from '@/types/mines';

export const MINES_IMAGES = {
  COIN: '/mines-game/coin.svg',
  BOMB: '/mines-game/bomb.svg',
};

export const GRID_DIMENSIONS = {
  5: { rows: 5, cols: 5 },
  6: { rows: 6, cols: 6 },
  7: { rows: 7, cols: 7 },
  8: { rows: 8, cols: 8 },
} as Record<GridSize, { rows: number; cols: number }>;
