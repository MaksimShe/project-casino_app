'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bonusService } from '@/services/BonusService.class';
import type { BonusClaimResponse } from '@/types/bonus';
import { USER_QUERY_KEY } from './useCurrentUser';

export function useBonus() {
  const queryClient = useQueryClient();

  const claimMutation = useMutation<BonusClaimResponse>({
    mutationFn: () => bonusService.claimBonus(),
    onSuccess: () => {
      // Update user balance
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });

  return {
    claimBonus: claimMutation.mutate,
    isClaimingBonus: claimMutation.isPending,
    claimError: claimMutation.error,
    claimData: claimMutation.data,
  };
}
