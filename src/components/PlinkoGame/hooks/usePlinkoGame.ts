import { useCallback, useEffect } from 'react';
import { usePlinkoStore } from '@/stores/usePlinkoStore';
import { plinkoService } from '@/services/PlinkoService.class';
import { AuthApiError } from '@/services/AuthService.class';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

/**
 * Main hook for coordinating Plinko game logic
 * Handles API calls, error handling, and state coordination
 */
export function usePlinkoGame() {
  const {
    risk,
    lines,
    betAmount,
    isDropping,
    isAnimating,
    setIsDropping,
    setLastDropResults,
    setTotalWin,
    setMultipliers,
    resetAnimationState,
  } = usePlinkoStore();

  const queryClient = useQueryClient();

  /**
   * Fetch multipliers for current configuration
   */
  const fetchMultipliers = useCallback(async () => {
    try {
      const response = await plinkoService.getMultipliers(risk, lines);
      setMultipliers(response.multipliers);
    } catch (error) {
      console.error('Failed to fetch multipliers:', error);
      // Use fallback multipliers from helper
      // setMultipliers(generateMultipliers(risk, lines));
    }
  }, [risk, lines, setMultipliers]);

  /**
   * Handle drop (place bet and start game)
   */
  const handleDrop = useCallback(async () => {
    // Reset previous animation state
    resetAnimationState();

    setIsDropping(true);

    try {
      // Call drop API
      const response = await plinkoService.drop({
        amount: betAmount,
        balls: 1,
        risk,
        lines,
      });

      // Update results
      setLastDropResults(response.drops);
      setTotalWin(response.totalWin);

      // Invalidate user balance query to refetch
      queryClient.invalidateQueries({ queryKey: ['user'] });

      // Show success message
      const profit = response.totalWin - response.totalBet;
      if (profit > 0) {
        toast.success(`Won $${response.totalWin.toFixed(2)}!`, {
          description: `Profit: +$${profit.toFixed(2)}`,
        });
      } else if (profit < 0) {
        toast.error(`Lost $${Math.abs(profit).toFixed(2)}`, {
          description: `Total bet: $${response.totalBet.toFixed(2)}`,
        });
      } else {
        toast.info('Break even!');
      }
    } catch (error) {
      console.error('Drop failed:', error);

      if (error instanceof AuthApiError) {
        if (error.status === 400) {
          toast.error('Insufficient balance', {
            description: 'Please add more funds to your account',
          });
        } else if (error.status === 401) {
          toast.error('Session expired', {
            description: 'Please login again',
          });
        } else {
          toast.error('Drop failed', {
            description: error.message,
          });
        }
      } else {
        toast.error('Network error', {
          description: 'Please check your connection and try again',
        });
      }

      // Reset state on error
      setLastDropResults(null);
    } finally {
      setIsDropping(false);
    }
  }, [
    isDropping,
    isAnimating,
    betAmount,
    risk,
    lines,
    setIsDropping,
    setLastDropResults,
    setTotalWin,
    resetAnimationState,
    queryClient,
  ]);

  /**
   * Fetch multipliers when risk or lines change
   */
  useEffect(() => {
    fetchMultipliers();
  }, [fetchMultipliers]);

  return {
    handleDrop,
    fetchMultipliers,
  };
}
