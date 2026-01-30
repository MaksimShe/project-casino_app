import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCaseStore } from '@/stores/useCaseStore';
import { caseService } from '@/services/CaseService.class';
import { AuthApiError } from '@/services/AuthService.class';
import { USER_QUERY_KEY } from '@/hooks/useCurrentUser';
import { showErrorNotification } from '@/utils/notifications';
import { generateAnimationItems } from '../helpers/generateAnimationItems';
import type { CurrentUserResponse } from '@/types/auth';

export const useCaseGame = () => {
  const store = useCaseStore();
  const queryClient = useQueryClient();

  // Fetch all cases
  const { data: casesData, isLoading: casesLoading } = useQuery({
    queryKey: ['cases'],
    queryFn: async () => {
      const response = await caseService.getAllCases();
      store.setAvailableCases(response.cases);
      return response;
    },
  });

  // Fetch case details when selected
  const { data: caseDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ['case', store.selectedCase?.id],
    queryFn: () => caseService.getCaseDetails(store.selectedCase!.id),
    enabled: !!store.selectedCase,
  });

  // Open case mutation
  const openMutation = useMutation({
    mutationFn: async (id: string) => {
      // Optimistically subtract case price from balance
      const casePrice = store.selectedCase?.price || 0;
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
      // Store result
      store.setOpeningResult({
        item: {
          id: data.item.id,
          name: data.item.name,
          rarity: data.item.rarity,
          value: data.item.value,
          chance: 0,
          image: data.item.image,
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
      const items = generateAnimationItems(caseDetails?.items || [], data.item);
      store.setAnimationItems(items);

      // Add to session stats
      store.addToSessionStats(data.casePrice, data.itemValue);

      // Start animation
      store.setViewState('opening');
      store.setIsAnimating(true);
      store.setIsOpening(false);
    },
    onError: error => {
      // Restore balance on error
      const casePrice = store.selectedCase?.price || 0;
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
          showErrorNotification(
            'Insufficient balance',
            'Please add more funds to your account'
          );
        } else if (error.status === 401) {
          showErrorNotification('Session expired', 'Please login again');
        } else {
          showErrorNotification('Failed to open case', error.message);
        }
      } else {
        showErrorNotification(
          'Network error',
          'Please check your connection and try again'
        );
      }

      store.setIsOpening(false);
    },
  });

  const handleOpenCase = useCallback(() => {
    if (!store.selectedCase || store.isOpening || store.isAnimating) {
      return;
    }

    store.setIsOpening(true);
    openMutation.mutate(store.selectedCase.id);
  }, [store, openMutation]);

  return {
    cases: casesData?.cases || [],
    caseDetails,
    isLoading: casesLoading || detailsLoading,
    handleOpenCase,
    isOpening: openMutation.isPending || store.isOpening,
  };
};
