import { memo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import cn from 'classnames';
import { useCaseStore } from '@/stores/useCaseStore';
import { caseService } from '@/services/CaseService.class';
import { AuthApiError } from '@/services/AuthService.class';
import { USER_QUERY_KEY } from '@/hooks/useCurrentUser';
import { showErrorNotification } from '@/utils/notifications';
import { generateAnimationItems } from './helpers/generateAnimationItems';
import { CaseContent } from './components/CaseContent';
import type { CaseDetailsResponse } from '@/types/case';
import type { CurrentUserResponse } from '@/types/auth';
import caseImg from '@/../public/cases-game/case-img.png';
import arrowBackIcon from '@/../public/cases-game/arrow-back.svg';
import Image from 'next/image';
import { ROUTES } from '@/constants/routes';

interface CaseDetailsProps {
  caseData: CaseDetailsResponse;
}

export const CaseDetails = memo(({ caseData }: CaseDetailsProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const store = useCaseStore();

  // Open case mutation
  const openMutation = useMutation({
    mutationFn: async (id: string) => {
      // Optimistically subtract case price from balance
      queryClient.setQueryData<CurrentUserResponse>(USER_QUERY_KEY, oldData => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          balance: oldData.balance - caseData.price,
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
          rarity: data.item.rarity as
            | 'Common'
            | 'Uncommon'
            | 'Rare'
            | 'Epic'
            | 'Legendary'
            | 'Gold',
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
      const items = generateAnimationItems(caseData.items, data.item);
      store.setAnimationItems(items);

      // Add to session stats
      store.addToSessionStats(data.casePrice, data.itemValue);

      // Start animation or skip to result
      if (store.skipAnimation) {
        store.setViewState('result');
        store.setIsAnimating(false);
        store.setIsOpening(false);
      } else {
        store.setViewState('opening');
        store.setIsAnimating(true);
        store.setIsOpening(false);
      }

      // Update user balance
      queryClient.setQueryData<CurrentUserResponse>(USER_QUERY_KEY, oldData => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          balance: data.newBalance,
        };
      });
    },
    onError: error => {
      // Restore balance on error
      queryClient.setQueryData<CurrentUserResponse>(USER_QUERY_KEY, oldData => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          balance: oldData.balance + caseData.price,
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
    if (store.isOpening || store.isAnimating) {
      return;
    }

    store.setIsOpening(true);
    openMutation.mutate(caseData.id);
  }, [store, openMutation, caseData.id]);

  const handleToggleSkipAnimation = useCallback(() => {
    store.setSkipAnimation(!store.skipAnimation);
  }, [store]);

  const isOpening = openMutation.isPending || store.isOpening;

  return (
    <div className="min-h-screen w-full lg:px-8">
      {/* Case Details */}
      <div className="pt-4 max-lg:px-6">
        {/* Case Main */}
        <div className="flex justify-between max-lg:flex-col max-lg:justify-center">
          <div className="flex max-sm:flex-col">
            <div className="mr-8 mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-600/30 hover:scale-105 max-sm:w-full">
              <button
                onClick={() => router.push(ROUTES.CASEGAME)}
                className="flex h-full w-full items-center justify-center"
              >
                <Image src={arrowBackIcon} alt="back" width={16} height={16} />
              </button>
            </div>
            <div className="mb-12 flex w-full flex-col gap-6 max-lg:items-center">
              <h1 className="mb-4 w-full text-5xl font-bold text-white max-sm:text-center">
                {caseData.name}
              </h1>
              <Image src={caseImg} alt="case" width={450} height={200} />
            </div>
          </div>
          {/* Open button and settings */}
          <div className="flex flex-col items-center justify-center gap-4">
            <button
              onClick={handleOpenCase}
              disabled={isOpening}
              className={cn(
                'h-12 w-7/12 min-w-64 rounded-full px-12 font-bold text-white transition-all',
                'bg-gradient-to-t from-[#BA0034] to-[#FF185F]',
                {
                  'cursor-not-allowed opacity-50': isOpening,
                  'hover:shadow-lg hover:shadow-purple-500/50': !isOpening,
                }
              )}
            >
              {isOpening ? 'Opening...' : `Open case $${caseData.price}`}
            </button>

            {/* Skip animation toggle */}
            <div className="mb-10 flex items-center gap-3">
              <span className="text-sm text-white/70">Skip Animation</span>
              <button
                onClick={handleToggleSkipAnimation}
                className={`h-5 w-10 rounded-full transition-colors ${
                  store.skipAnimation
                    ? 'bg-[var(--system-success-color)]'
                    : 'bg-[var(--system-error-color)]'
                }`}
              >
                <div
                  className={`h-4 w-4 rounded-full bg-white transition-transform ${
                    store.skipAnimation ? 'translate-x-5.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Case Contents */}
        <div className="mb-12">
          <h2 className="mb-6 text-3xl font-semibold text-white">
            Case Contents
          </h2>
          <CaseContent items={caseData.items} />
        </div>
      </div>
    </div>
  );
});

CaseDetails.displayName = 'CaseDetails';
