import { useCallback, useEffect, useRef } from 'react';
import { usePlinkoStore } from '@/stores/usePlinkoStore';
import { plinkoService } from '@/services/PlinkoService.class';
import { AuthApiError } from '@/services/AuthService.class';
import { useQueryClient } from '@tanstack/react-query';
import { USER_QUERY_KEY } from '@/hooks/useCurrentUser';
import { HISTORY_QUERY_KEY } from '@/hooks/useHistoryTable';
import { showErrorNotification } from '@/utils/notifications';
import type { CurrentUserResponse } from '@/types/auth';
import { PLINKO_ANIMATION } from '../constants';

/**
 * Main hook for coordinating Plinko game logic
 * Handles API calls, error handling, and state coordination
 */
export function usePlinkoGame() {
  const {
    risk,
    lines,
    betAmount,
    isActiveGame,
    setLastDropResults,
    setTotalWin,
    setLastDropBet,
    setDropSessionId,
    addToSessionStats,
    setMultipliers,
  } = usePlinkoStore();

  const queryClient = useQueryClient();

  // Track pending win amount to add after animation completes
  const pendingWinRef = useRef<number | null>(null);
  const wasActiveGameRef = useRef(false);
  const historyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Fetch multipliers for current configuration
   */
  const fetchMultipliers = useCallback(async () => {
    try {
      const response = await plinkoService.getMultipliers(risk, lines);
      setMultipliers(response.multipliers);
    } catch (error) {
      console.error('Failed to fetch multipliers:', error);
    }
  }, [risk, lines, setMultipliers]);

  /**
   * Handle drop (place bet and start game)
   */
  const handleDrop = useCallback(async () => {
    try {
      // Immediately subtract bet amount from balance (optimistic update)
      queryClient.setQueryData<CurrentUserResponse>(USER_QUERY_KEY, oldData => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          balance: oldData.balance - betAmount,
        };
      });

      // Call drop API
      const response = await plinkoService.drop({
        amount: betAmount,
        balls: 1,
        risk,
        lines,
      });

      // Create unique session ID for this drop
      const sessionId = `${Date.now()}-${Math.random()}`;

      // Update results
      setLastDropResults(response.drops);
      setTotalWin(response.totalWin);
      setLastDropBet(response.totalBet);
      setDropSessionId(sessionId);

      // Add to session stats
      addToSessionStats(response.totalBet, response.totalWin);

      // Store pending win to add after animation completes
      pendingWinRef.current = response.totalWin;
    } catch (error) {
      console.error('Drop failed:', error);

      // Restore balance on error (revert optimistic update)
      queryClient.setQueryData<CurrentUserResponse>(USER_QUERY_KEY, oldData => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          balance: oldData.balance + betAmount,
        };
      });

      if (error instanceof AuthApiError) {
        if (error.status === 400) {
          showErrorNotification(
            'Insufficient balance',
            'Please add more funds to your account'
          );
        } else if (error.status === 401) {
          showErrorNotification('Session expired', 'Please login again');
        } else {
          showErrorNotification('Drop failed', error.message);
        }
      } else {
        showErrorNotification(
          'Network error',
          'Please check your connection and try again'
        );
      }
      // Reset state on error
      setLastDropResults(null);
    }
  }, [
    betAmount,
    risk,
    lines,
    setLastDropResults,
    setTotalWin,
    setLastDropBet,
    setDropSessionId,
    addToSessionStats,
    queryClient,
  ]);

  /**
   * Fetch multipliers when risk or lines change
   */
  useEffect(() => {
    fetchMultipliers();
  }, [fetchMultipliers]);

  /**
   * Watch for animation completion (isActiveGame: true -> false)
   * When animation completes, add pending win to balance and update history
   */
  useEffect(() => {
    // Detect transition from active (true) to inactive (false)
    if (
      wasActiveGameRef.current &&
      !isActiveGame &&
      pendingWinRef.current !== null
    ) {
      // Animation completed, add win to balance
      queryClient.setQueryData<CurrentUserResponse>(USER_QUERY_KEY, oldData => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          balance: oldData.balance + pendingWinRef.current!,
        };
      });

      // Sync with server after animation
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });

      // Clear any existing history timeout
      if (historyTimeoutRef.current) {
        clearTimeout(historyTimeoutRef.current);
      }

      // Update game history after delay
      historyTimeoutRef.current = setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: [...HISTORY_QUERY_KEY, 'plinko'],
        });
        historyTimeoutRef.current = null;
      }, PLINKO_ANIMATION.HISTORY_UPDATE_DELAY);

      // Clear pending win
      pendingWinRef.current = null;
    }

    // Update ref for next iteration
    wasActiveGameRef.current = isActiveGame;

    // Cleanup timeout on unmount
    return () => {
      if (historyTimeoutRef.current) {
        clearTimeout(historyTimeoutRef.current);
      }
    };
  }, [isActiveGame, queryClient]);

  return {
    handleDrop,
    fetchMultipliers,
  };
}
