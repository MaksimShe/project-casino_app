'use client';

import { useQuery } from '@tanstack/react-query';
import { authService, AuthApiError } from '@/services/AuthService.class';

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

// Query options
export interface HistoryQueryOptions {
  limit?: number;
  offset?: number;
  enabled?: boolean;
}

// For crash game: determine game type based on history type
export type CrashHistoryType = 'myBets' | 'allGames';

// Endpoint mapping
const HISTORY_ENDPOINTS: Record<HistoryGameType, string> = {
  cases: '/cases/history',
  mines: '/mines/history',
  plinko: '/plinko/history',
  crash: '/crash/history',
  crashBets: '/crash/bets/history',
};

// Helper to get crash endpoint based on type
function getCrashEndpoint(historyType: CrashHistoryType): string {
  return historyType === 'myBets'
    ? HISTORY_ENDPOINTS.crashBets
    : HISTORY_ENDPOINTS.crash;
}

export const HISTORY_QUERY_KEY = ['history'];

async function fetchHistory<T extends HistoryGameType>(
  gameType: T,
  limit: number,
  offset: number
): Promise<HistoryResponseMap[T]> {
  const accessToken = authService.getAccessToken();
  if (!accessToken) {
    throw new AuthApiError('No access token found', 401);
  }

  const endpoint = HISTORY_ENDPOINTS[gameType];
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}?limit=${limit}&offset=${offset}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const text = await response.text();
  let data: HistoryResponseMap[T] | null = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new AuthApiError(
        `Invalid response from server: ${text.substring(0, 100)}`,
        response.status
      );
    }
  }

  if (!response.ok) {
    const errorMessage =
      (data as { message?: string })?.message ||
      `Request failed with status ${response.status}`;
    throw new AuthApiError(errorMessage, response.status);
  }

  if (data === null) {
    throw new AuthApiError('Empty response from server', response.status);
  }

  return data;
}

export function useHistoryTable<T extends HistoryGameType>(
  gameType: T,
  options: HistoryQueryOptions = {}
) {
  const { limit = 10, offset = 0, enabled = true } = options;

  return useQuery<HistoryResponseMap[T]>({
    queryKey: [...HISTORY_QUERY_KEY, gameType, limit, offset],
    queryFn: async () => {
      if (!authService.isAuthenticated()) {
        throw new Error('Not authenticated');
      }
      return fetchHistory(gameType, limit, offset);
    },
    enabled: typeof window !== 'undefined' && enabled,
    retry: false,
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Helper function to extract items from history response
export function getHistoryItems<T extends HistoryGameType>(
  data: HistoryResponseMap[T] | undefined
): HistoryItemMap[T] | undefined {
  if (!data) return undefined;

  if ('openings' in data) return data.openings as HistoryItemMap[T];
  if ('games' in data) return data.games as HistoryItemMap[T];
  if ('drops' in data) return data.drops as HistoryItemMap[T];
  if ('bets' in data) return data.bets as HistoryItemMap[T];

  return undefined;
}

// Type mapping for items
export type HistoryItemMap = {
  cases: CaseOpeningHistoryItem[];
  mines: MinesHistoryItem[];
  plinko: PlinkoHistoryItem[];
  crash: CrashGameHistoryItem[];
  crashBets: CrashBetHistoryItem[];
};

// Special fetch function for crash history
async function fetchCrashHistory(
  historyType: CrashHistoryType,
  limit: number,
  offset: number
): Promise<CrashHistoryResponse | CrashBetsHistoryResponse> {
  const accessToken = authService.getAccessToken();
  if (!accessToken) {
    throw new AuthApiError('No access token found', 401);
  }

  const endpoint = getCrashEndpoint(historyType);
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}?limit=${limit}&offset=${offset}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const text = await response.text();
  let data: CrashHistoryResponse | CrashBetsHistoryResponse | null = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new AuthApiError(
        `Invalid response from server: ${text.substring(0, 100)}`,
        response.status
      );
    }
  }

  if (!response.ok) {
    const errorMessage =
      (data as { message?: string })?.message ||
      `Request failed with status ${response.status}`;
    throw new AuthApiError(errorMessage, response.status);
  }

  if (data === null) {
    throw new AuthApiError('Empty response from server', response.status);
  }

  return data;
}

// Special hook for crash game with toggle support
export function useCrashHistory(
  historyType: CrashHistoryType,
  options: HistoryQueryOptions = {}
) {
  const { limit = 10, offset = 0, enabled = true } = options;

  return useQuery<CrashHistoryResponse | CrashBetsHistoryResponse>({
    queryKey: [...HISTORY_QUERY_KEY, 'crash', historyType, limit, offset],
    queryFn: async () => {
      if (!authService.isAuthenticated()) {
        throw new Error('Not authenticated');
      }
      return fetchCrashHistory(historyType, limit, offset);
    },
    enabled: typeof window !== 'undefined' && enabled,
    retry: false,
    staleTime: 30 * 1000,
  });
}
