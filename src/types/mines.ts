// Mines Game Type Definitions

export enum MinesGameStatus {
  IDLE = 'idle',
  ACTIVE = 'active',
  WON = 'won',
  LOST = 'lost',
}

export type GridSize = 5 | 6 | 7 | 8;

export interface MinesStartGameRequest {
  amount: number;
  minesCount: number;
  gridSize: GridSize;
  clientSeed?: string;
}

export interface MinesStartGameResponse {
  gameId: string;
  amount: number;
  minesCount: number;
  gridSize: GridSize;
  totalTiles: number;
  serverSeedHash: string;
  multipliers: number[];
}

export interface MinesRevealCellRequest {
  gameId: string;
  position: number;
}

export interface MinesRevealCellResponse {
  position: number;
  isMine: boolean;
  currentMultiplier?: number;
  currentValue?: number;
  revealedTiles?: number[];
  safeTilesLeft?: number;
  gridSize?: number;
  totalTiles?: number;
}

export interface MinesCashoutRequest {
  gameId: string;
}

export interface MinesCashoutResponse {
  winAmount: number;
  multiplier: number;
  serverSeed: string;
  minePositions: number[];
  gridSize: number;
  totalTiles: number;
}

export interface MinesActiveGameData {
  _id: string;
  gridSize: number;
  betAmount: number;
  minesCount: number;
  revealedPositions: number[];
  totalTiles: number;
  currentMultiplier?: number;
  currentValue?: number;
}

export interface MinesActiveGameResponse {
  game: MinesActiveGameData | null;
}

export enum MinesCellState {
  UNREVEALED = 'unrevealed',
  SAFE = 'safe',
  MINE = 'mine',
}

export interface MinesCellData {
  index: number;
  state: MinesCellState;
}

// Error message enum for consistent error handling
export enum MinesErrorMessage {
  START_GAME = 'Failed to start game',
  REVEAL_CELL = 'Failed to reveal cell',
  CASHOUT = 'Failed to cashout',
  DEFAULT = 'Please try again.',
}

// Grid size display mapping
export const GRID_SIZE_DISPLAY_MAP: Record<string, GridSize> = {
  '5x5': 5,
  '6x6': 6,
  '7x7': 7,
  '8x8': 8,
} as const;

// Modal configuration constants
export const MINES_MODAL_CONFIG = {
  AUTO_CLOSE_DELAY: 2000, // ms
} as const;
