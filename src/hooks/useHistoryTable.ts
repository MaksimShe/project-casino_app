'use client';

import { useQuery } from '@tanstack/react-query';
import { authService, AuthApiError } from '@/services/AuthService.class';
import type {
  HistoryGameType,
  HistoryResponseMap,
  HistoryQueryOptions,
  CrashHistoryType,
  CrashHistoryResponse,
  CrashBetsHistoryResponse,
} from './useHistoryTable.types';

export type {
  HistoryGameType,
  HistoryResponseMap,
  HistoryQueryOptions,
  CrashHistoryType,
  CaseOpeningHistoryItem,
  MinesHistoryItem,
  PlinkoHistoryItem,
  CrashGameHistoryItem,
  CrashBetHistoryItem,
  CasesHistoryResponse,
  MinesHistoryResponse,
  PlinkoHistoryResponse,
  CrashHistoryResponse,
  CrashBetsHistoryResponse,
  HistoryResponse,
  HistoryItemMap,
} from './useHistoryTable.types';

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
  });
}

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
  });
}
