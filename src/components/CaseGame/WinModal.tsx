import { memo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { useCaseStore } from '@/stores/useCaseStore';
import { WinningItemDisplay } from './components/WinningItemDisplay';
import { useCaseNotification } from './hooks/useCaseNotification';
import { USER_QUERY_KEY } from '@/hooks/useCurrentUser';
import type { CurrentUserResponse } from '@/types/auth';
import { CaseViewState } from './constants';

interface WinModalProps {
  onOpenAgain?: () => void;
}

export const WinModal = memo(({ onOpenAgain }: WinModalProps) => {
  const { openingResult, viewState, selectedCase, resetGame } = useCaseStore();
  const queryClient = useQueryClient();
  const { showWinNotification } = useCaseNotification();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Lock scroll when modal is open
  useEffect(() => {
    if (viewState === CaseViewState.RESULT && openingResult) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [viewState, openingResult]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

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
    if (!openingResult || !selectedCase || !onOpenAgain) return;

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

    // Clear opening result and animation state, then return to selection
    useCaseStore.setState({
      openingResult: null,
      isOpening: false,
      isAnimating: false,
      animationItems: [],
      animationProgress: 0,
      viewState: CaseViewState.SELECTION,
    });

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Trigger new case opening after a short delay to ensure state is clean
    timeoutRef.current = setTimeout(() => {
      onOpenAgain();
      timeoutRef.current = null;
    }, 100);
  }, [
    openingResult,
    selectedCase,
    queryClient,
    showWinNotification,
    onOpenAgain,
  ]);

  if (viewState !== CaseViewState.RESULT || !openingResult) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="absolute inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/10 max-sm:items-start sm:backdrop-blur-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex max-h-screen flex-col items-center gap-8 overflow-y-auto px-4 py-8 max-sm:mt-28">
          <WinningItemDisplay
            result={openingResult}
            caseName={selectedCase?.name}
          />

          {/* Action buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSell}
              className="h-12 w-52 rounded-full bg-gradient-to-t from-[var(--btn-primary-start)] to-[var(--btn-primary-end)] font-bold text-white shadow-white max-sm:w-40"
            >
              Sell this
            </button>
            <button
              onClick={handleSellAndAgain}
              className="h-12 w-52 rounded-2xl bg-gradient-to-b from-[var(--btn-secondary-start)] to-[var(--btn-secondary-end)] font-bold text-white max-sm:w-40"
            >
              Sell + Try again
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});
