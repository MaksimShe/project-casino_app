// Game types for history
export type HistoryGameType =
  | 'cases'
  | 'mines'
  | 'plinko'
  | 'crash'
  | 'crashBets';

// Cases history types
export interface CaseOpeningHistoryItem {
  id: string;
  createdAt: string;
  caseName: string;
  casePrice: number;
  itemName: string;
  itemValue: number;
  itemRarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  itemImage: string;
  profit: number;
}

export interface CasesHistoryResponse {
  openings: CaseOpeningHistoryItem[];
}

// Mines history types
export interface MinesHistoryItem {
  _id: string;
  betAmount: number;
  minesCount: number;
  revealedTiles: number[];
  status: 'won' | 'lost' | 'active';
  winAmount: number;
  multiplier: number;
  createdAt: string;
}

export interface MinesHistoryResponse {
  games: MinesHistoryItem[];
}

// Plinko history types
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

export interface PlinkoHistoryResponse {
  drops: PlinkoHistoryItem[];
}

// Crash games history types (Provably Fair)
export interface CrashGameHistoryItem {
  gameId: string;
  crashPoint: number;
  hash: string;
  seed: string;
}

export interface CrashHistoryResponse {
  games: CrashGameHistoryItem[];
}

// Crash bets history types
export interface CrashBetHistoryItem {
  betId: string;
  gameId: string;
  amount: number;
  cashoutMultiplier?: number;
  winAmount?: number;
  status: 'won' | 'lost';
  crashPoint: number;
  createdAt: string;
}

export interface CrashBetsHistoryResponse {
  bets: CrashBetHistoryItem[];
}

// Union type for all history responses
export type HistoryResponse =
  | CasesHistoryResponse
  | MinesHistoryResponse
  | PlinkoHistoryResponse
  | CrashHistoryResponse
  | CrashBetsHistoryResponse;

// Type mapping for each game type
export type HistoryResponseMap = {
  cases: CasesHistoryResponse;
  mines: MinesHistoryResponse;
  plinko: PlinkoHistoryResponse;
  crash: CrashHistoryResponse;
  crashBets: CrashBetsHistoryResponse;
};

// Type mapping for items
export type HistoryItemMap = {
  cases: CaseOpeningHistoryItem[];
  mines: MinesHistoryItem[];
  plinko: PlinkoHistoryItem[];
  crash: CrashGameHistoryItem[];
  crashBets: CrashBetHistoryItem[];
};

// Query options
export interface HistoryQueryOptions {
  limit?: number;
  offset?: number;
  enabled?: boolean;
}

// For crash game: determine game type based on history type
export type CrashHistoryType = 'myBets' | 'allGames';
