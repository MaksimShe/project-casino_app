import { useCallback } from 'react';
import { toast } from 'sonner';
import { formatNumber } from '@/utils/format';

export const useCaseNotification = () => {
  const showWinNotification = useCallback((amount: number, profit: number) => {
    if (profit > 0) {
      toast.success(
        `Won $${formatNumber(amount)}! Profit: $${formatNumber(profit)}`
      );
    } else if (profit < 0) {
      toast.error(`Lost $${formatNumber(Math.abs(profit))}`);
    } else {
      toast.message(`Draw $${formatNumber(Math.abs(profit))}`);
    }
  }, []);

  return { showWinNotification };
};
