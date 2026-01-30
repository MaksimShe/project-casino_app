import { memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { useCaseStore } from '@/stores/useCaseStore';
import { WinningItemDisplay } from './components/WinningItemDisplay';
import { useCaseNotification } from './hooks/useCaseNotification';
import { USER_QUERY_KEY } from '@/hooks/useCurrentUser';
import type { CurrentUserResponse } from '@/types/auth';

export const WinModal = memo(() => {
  const { openingResult, viewState, selectedCase, resetGame, setViewState } =
    useCaseStore();
  const queryClient = useQueryClient();
  const { showWinNotification } = useCaseNotification();

  const handleSell = useCallback(() => {
    if (!openingResult) return;

    // Add item value to balance
    queryClient.setQueryData<CurrentUserResponse>(USER_QUERY_KEY, oldData => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        balance: oldData.balance + openingResult.item.value,
      };
    });

    // Sync with server
    queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });

    // Show notification
    showWinNotification(openingResult.item.value, openingResult.profit);

    // Return to selection
    resetGame();
  }, [openingResult, queryClient, showWinNotification, resetGame]);

  const handleSellAndAgain = useCallback(() => {
    if (!openingResult || !selectedCase) return;

    // Add item value to balance
    queryClient.setQueryData<CurrentUserResponse>(USER_QUERY_KEY, oldData => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        balance: oldData.balance + openingResult.item.value,
      };
    });

    // Sync with server
    queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });

    // Show notification
    showWinNotification(openingResult.item.value, openingResult.profit);

    // Return to selection state but keep the case selected
    setViewState('selection');
  }, [
    openingResult,
    selectedCase,
    queryClient,
    showWinNotification,
    setViewState,
  ]);

  if (viewState !== 'result' || !openingResult) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex flex-col items-center gap-8 px-4">
          <WinningItemDisplay result={openingResult} />

          {/* Action buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSell}
              className="rounded-lg bg-gray-700 px-8 py-3 font-bold text-white transition-all hover:bg-gray-600"
            >
              Sell
            </button>
            <button
              onClick={handleSellAndAgain}
              className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 font-bold text-white transition-all hover:from-purple-500 hover:to-pink-500"
            >
              Sell + Again
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});

WinModal.displayName = 'WinModal';
