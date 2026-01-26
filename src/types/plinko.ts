// API Request/Response Types (matching backend_dock.md)

export interface DropRequest {
  amount: number;
  balls: number;
  risk: 'low' | 'medium' | 'high';
  lines: number;
}

export interface PlinkoDrop {
  dropId: string;
  path: number[]; // Array of 0s and 1s representing left/right movements
  slotIndex: number;
  multiplier: number;
  winAmount: number;
  serverSeed: string;
  clientSeed: string;
  nonce: number;
}

export interface DropResponse {
  drops: PlinkoDrop[];
  totalBet: number;
  totalWin: number;
  newBalance: number;
}

export interface MultipliersResponse {
  multipliers: number[];
}

export interface PlinkoHistoryItem {
  _id: string;
  betAmount: number;
  ballsCount: number;
  riskLevel: 'low' | 'medium' | 'high';
  linesCount: number;
  totalWin: number;
  avgMultiplier: string;
  createdAt: string;
}

export interface HistoryResponse {
  drops: PlinkoHistoryItem[];
}

export interface PlinkoRecentItem {
  _id: string;
  userId: {
    _id: string;
    username: string;
  };
  betAmount: number;
  ballsCount: number;
  riskLevel: 'low' | 'medium' | 'high';
  linesCount: number;
  createdAt: string;
}

export interface RecentResponse {
  drops: PlinkoRecentItem[];
}

// UI Types

export interface PlinkoBall {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isComplete: boolean;
  finalSlot: number | null;
  finalMultiplier: number | null;
  path: number[]; // Path from backend
  currentPathIndex: number;
}

export interface PlinkoPeg {
  id: string;
  x: number;
  y: number;
  row: number;
  col: number;
  isSpawner?: boolean;
}

export interface PlinkoConfig {
  risk: 'low' | 'medium' | 'high';
  lines: 8 | 10 | 12 | 14 | 16;
  ballsCount: 1 | 2 | 5 | 10;
  betAmount: number;
}
