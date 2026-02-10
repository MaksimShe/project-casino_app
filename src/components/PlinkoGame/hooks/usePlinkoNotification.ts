import { useEffect, useRef } from 'react';
import { usePlinkoStore } from '@/stores/usePlinkoStore';
import { useShowNotification } from '@/hooks/useShowNotification';

/**
 * Hook for managing Plinko game notifications
 * Shows ONE notification at the end of a game session with total stats
 */
export function usePlinkoNotification() {
  const { isActiveGame, sessionTotalBet, sessionTotalWin, resetSessionStats } =
    usePlinkoStore();
  const { showGameResult } = useShowNotification();

  const wasActiveRef = useRef(false);

  useEffect(() => {
    // Game just ended (was active, now inactive)
    if (wasActiveRef.current && !isActiveGame) {
      // Check if there were any bets in this session
      if (sessionTotalBet > 0) {
        // Calculate profit
        const profit = sessionTotalWin - sessionTotalBet;

        // Show notification
        showGameResult(profit);

        // Reset session stats for next game
        resetSessionStats();
      }
    }

    // Track active state for next check
    wasActiveRef.current = isActiveGame;
  }, [
    isActiveGame,
    sessionTotalBet,
    sessionTotalWin,
    resetSessionStats,
    showGameResult,
  ]);
}
