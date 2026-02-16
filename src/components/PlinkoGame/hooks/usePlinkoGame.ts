import { useCallback, useEffect, useRef } from 'react';
import { usePlinkoStore } from '@/stores/usePlinkoStore';
import { plinkoService } from '@/services/PlinkoService.class';
import { AuthApiError } from '@/services/AuthService.class';
import { useQueryClient } from '@tanstack/react-query';
import { USER_QUERY_KEY } from '@/hooks/useCurrentUser';
import { HISTORY_QUERY_KEY } from '@/hooks/useHistoryTable';
import { useShowNotification } from '@/hooks/useShowNotification';
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
    multipliers,
    setLastDropResults,
    setTotalWin,
    setLastDropBet,
    setDropSessionId,
    addToSessionStats,
    setMultipliers,
  } = usePlinkoStore();

  const queryClient = useQueryClient();
  const { showError } = useShowNotification();

  // Track pending win amount to add after animation completes
  const pendingWinRef = useRef<number | null>(null);
  const wasActiveGameRef = useRef(false);
  const historyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track previous risk/lines to detect actual changes
  const prevRiskRef = useRef(risk);
  const prevLinesRef = useRef(lines);

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

  const handleDrop = useCallback(async () => {
    try {
      queryClient.setQueryData<CurrentUserResponse>(USER_QUERY_KEY, oldData => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          balance: oldData.balance - betAmount,
        };
      });

      const response = await plinkoService.drop({
        amount: betAmount,
        balls: 1,
        risk,
        lines,
      });

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
          showError(
            'Insufficient balance',
            'Please add more funds to your account'
          );
        } else if (error.status === 401) {
          showError('Session expired', 'Please login again');
        } else {
          showError('Drop failed', error.message);
        }
      } else {
        showError(
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
    showError,
  ]);

  /**
   * Fetch multipliers when risk or lines change (skip initial mount if multipliers already exist)
   */
  useEffect(() => {
    const riskChanged = prevRiskRef.current !== risk;
    const linesChanged = prevLinesRef.current !== lines;

    // Only fetch if risk or lines actually changed AND we're not on initial mount with existing multipliers
    if (riskChanged || linesChanged) {
      fetchMultipliers();
      prevRiskRef.current = risk;
      prevLinesRef.current = lines;
    } else if (multipliers.length === 0) {
      // If no multipliers exist yet (shouldn't happen with server-side fetch, but fallback)
      fetchMultipliers();
      prevRiskRef.current = risk;
      prevLinesRef.current = lines;
    }
  }, [risk, lines, multipliers.length, fetchMultipliers]);

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
