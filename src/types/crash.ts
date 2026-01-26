import type { GameState } from '@/components/CrashGame/GameDisplay';

export type CrashGameState = GameState;

export interface CrashBet {
  betId: string;
  amount: number;
  autoCashout?: number;
}

export interface CrashCurrentGame {
  gameId: string;
  state: CrashGameState;
  multiplier?: number;
  serverSeedHash: string;
  myBet?: CrashBet;
}

export interface PlaceBetRequest {
  amount: number;
  autoCashout?: number;
}

export interface PlaceBetResponse {
  betId: string;
  amount: number;
  gameId: string;
}

export interface CashoutRequest {
  betId: string;
}

export interface CashoutResponse {
  multiplier: number;
  winAmount: number;
}

// WebSocket event payloads
export interface GameTickPayload {
  gameId: string;
  multiplier: number;
  elapsed: number;
}

export interface GameCrashPayload {
  gameId: string;
  crashPoint: number;
  serverSeed: string;
  reveal?: string;
}

export interface GameWaitingPayload {
  gameId: string;
  startsAt: number;
  serverSeedHash: string;
}

export interface GameStartPayload {
  gameId: string;
  startedAt: number;
}

export interface BetPlacedPayload {
  betId: string;
  odg: number;
  odh: string;
  userId: string;
  username: string;
  amount: number;
  autoCashout?: number;
}

export interface BetCashoutPayload {
  betId: string;
  userId: string;
  username: string;
  multiplier: number;
  winAmount: number;
}

export interface PlayerBet {
  betId: string;
  odg: number;
  odh: string;
  userId: string;
  username: string;
  amount: number;
  autoCashout?: number;
  cashedOut: boolean;
  cashoutMultiplier?: number;
  winAmount?: number;
}

export interface SubscribeGamePayload {
  gameId: string;
}

export interface MultiplierDataPoint {
  time: number; // milliseconds elapsed since game start
  multiplier: number; // current multiplier value
}
