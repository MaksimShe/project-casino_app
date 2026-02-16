import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCaseStore } from '@/stores/useCaseStore';
import { caseService } from '@/services/CaseService.class';
import { AuthApiError } from '@/services/AuthService.class';
import { USER_QUERY_KEY } from '@/hooks/useCurrentUser';
import { useShowNotification } from '@/hooks/useShowNotification';
import { generateAnimationItems } from '../helpers/generateAnimationItems';
import type { CurrentUserResponse } from '@/types/auth';
import type { CaseItem } from '@/types/case';
import { type Rarity, CaseViewState } from '../constants';

interface UseOpenCaseOptions {
  casePrice: number;
  caseItems: CaseItem[];
}

export const useOpenCase = ({ casePrice, caseItems }: UseOpenCaseOptions) => {
  const store = useCaseStore();
  const queryClient = useQueryClient();
  const { showError } = useShowNotification();

  return useMutation({
    mutationFn: async (id: string) => {
      queryClient.setQueryData<CurrentUserResponse>(USER_QUERY_KEY, oldData => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          balance: oldData.balance - casePrice,
        };
      });

      return caseService.openCase(id);
    },
    onSuccess: data => {
      store.setOpeningResult({
        item: {
          id: data.item.id,
          name: data.item.name,
          rarity: data.item.rarity as Rarity,
          value: data.item.value,
          chance: 0,
          imageUrl: data.item.imageUrl || data.item.image || '❓',
        },
        profit: data.itemValue - data.casePrice,
        newBalance: data.newBalance,
        proofData: {
          serverSeed: data.serverSeed,
          clientSeed: data.clientSeed,
          nonce: data.nonce,
          roll: data.roll,
        },
      });

      // Generate animation items
      const items = generateAnimationItems(caseItems, data.item);
      store.setAnimationItems(items);

      // Add to session stats
      store.addToSessionStats(data.casePrice, data.itemValue);

      if (store.skipAnimation) {
        store.setViewState(CaseViewState.RESULT);
        store.setIsAnimating(false);
        store.setIsOpening(false);
      } else {
        store.setViewState(CaseViewState.OPENING);
        store.setIsAnimating(true);
        store.setIsOpening(false);
      }

      queryClient.setQueryData<CurrentUserResponse>(USER_QUERY_KEY, oldData => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          balance: data.newBalance,
        };
      });
    },
    onError: error => {
      queryClient.setQueryData<CurrentUserResponse>(USER_QUERY_KEY, oldData => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          balance: oldData.balance + casePrice,
        };
      });

      // Show error notification
      if (error instanceof AuthApiError) {
        if (error.status === 400) {
          showError(
            'Insufficient balance',
            'Please add more funds to your account'
          );
        } else if (error.status === 401) {
          showError('Session expired', 'Please login again');
        } else {
          showError('Failed to open case', error.message);
        }
      } else {
        showError(
          'Network error',
          'Please check your connection and try again'
        );
      }

      store.setIsOpening(false);
    },
  });
};
