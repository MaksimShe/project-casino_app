'use client';

import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/AuthService.class';

export const ACCOUNT_COUNT_QUERY_KEY = ['accountCount'];

export function useAccountCount() {
  return useQuery<number>({
    queryKey: ACCOUNT_COUNT_QUERY_KEY,
    queryFn: async () => {
      if (!authService.isAuthenticated()) {
        throw new Error('Not authenticated');
      }
      const users = await authService.getAllUsers();
      return users.length;
    },
    enabled: typeof window !== 'undefined',
    retry: false,
    staleTime: 60 * 1000, // 60 seconds - cache for 1 minute
    refetchInterval: 60 * 1000, // Refetch every minute to keep count updated
  });
}
