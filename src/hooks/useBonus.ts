'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bonusService } from '@/services/BonusService.class';
import { authService } from '@/services/AuthService.class';
import type { BonusClaimResponse, BonusStatusResponse } from '@/types/bonus';
import { USER_QUERY_KEY } from './useCurrentUser';

export const BONUS_STATUS_QUERY_KEY = ['bonusStatus'];

// New hook for checking bonus status
export function useBonusStatus() {
  return useQuery<BonusStatusResponse>({
    queryKey: BONUS_STATUS_QUERY_KEY,
    queryFn: async () => {
      // Check auth inside queryFn to avoid SSR mismatch and enable reactivity
      if (!authService.isAuthenticated()) {
        throw new Error('Not authenticated');
      }
      return bonusService.getBonusStatus();
    },
    // Always enabled - auth check happens in queryFn
    enabled: typeof window !== 'undefined',
    retry: false,
    staleTime: 30 * 1000, // Fresh for 30 seconds
    refetchInterval: 30 * 1000, // Poll every 30 seconds
  });
}

export function useBonus() {
  const queryClient = useQueryClient();

  const claimMutation = useMutation<BonusClaimResponse>({
    mutationFn: () => bonusService.claimBonus(),
    onSuccess: () => {
      // Update user balance
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      // Update bonus status
      queryClient.invalidateQueries({ queryKey: BONUS_STATUS_QUERY_KEY });
    },
  });

  return {
    claimBonus: claimMutation.mutate,
    isClaimingBonus: claimMutation.isPending,
    claimError: claimMutation.error,
    claimData: claimMutation.data,
  };
}
