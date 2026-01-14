'use client';

import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/AuthService.class';
import { type LeaderboardResponse, type LeaderboardPeriod } from '@/types/auth';

export const LEADERBOARD_QUERY_KEY = ['leaderboard'];

export function useLeaderboard(period: LeaderboardPeriod = 'all') {
  return useQuery<LeaderboardResponse>({
    queryKey: [...LEADERBOARD_QUERY_KEY, period],
    queryFn: async () => {
      if (!authService.isAuthenticated()) {
        throw new Error('Not authenticated');
      }
      return authService.getLeaderboard(period);
    },
    enabled: typeof window !== 'undefined',
    retry: false,
    staleTime: 30 * 1000, // 30 seconds
  });
}
