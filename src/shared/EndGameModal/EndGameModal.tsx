import { formatNumber } from '@/utils/format';
import cn from 'classnames';
import { useTranslation } from '@/i18n/useTranslation';
import { useEffect, useRef } from 'react';
import { useShowNotification } from '@/hooks/useShowNotification';

export interface EndGameModalProps {
  isWin: boolean;
  amount: number;
  multiplier?: number;
  additionalInfo?: string;
  autoCloseDelay?: number;
  onClose?: () => void;
  betAmount?: number;
}

export const EndGameModal = ({
  isWin,
  amount,
  multiplier,
  additionalInfo,
  autoCloseDelay = 2000,
  onClose,
  betAmount,
}: EndGameModalProps) => {
  const { t } = useTranslation();
  const { showGameResult } = useShowNotification();
  const notificationShownRef = useRef(false);

  // Show notification when modal appears (only once)
  useEffect(() => {
    if (notificationShownRef.current) return;

    if (isWin && betAmount !== undefined) {
      // Win: profit = winAmount - betAmount
      const profit = amount - betAmount;
      showGameResult(profit);
      notificationShownRef.current = true;
    } else if (!isWin) {
      // Loss: profit = -amount (amount is the bet amount for losses)
      const profit = -amount;
      showGameResult(profit);
      notificationShownRef.current = true;
    }
  }, [amount, betAmount, isWin, showGameResult]);

  useEffect(() => {
    if (autoCloseDelay > 0 && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [autoCloseDelay, onClose]);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center rounded-xl bg-black/50 backdrop-blur-xs">
      <div
        className={cn(
          'rounded-xl border p-6',
          isWin
            ? 'border-[var(--modal-win-border)] bg-[var(--modal-win-bg)]'
            : 'border-[var(--modal-lose-border)] bg-[var(--modal-lose-bg)]'
        )}
      >
        <h2
          className={cn(
            'mb-2 text-2xl font-bold',
            isWin
              ? 'text-[var(--modal-win-text)]'
              : 'text-[var(--modal-lose-text)]'
          )}
        >
          {isWin ? t.modalWindows.titleWin : t.modalWindows.titleLose}
        </h2>
        <div className="space-y-1 text-[var(--main-text-color)]">
          <p>
            {isWin ? t.modalWindows.win : t.modalWindows.lose} $
            {formatNumber(amount)}
            {multiplier && ` (${formatNumber(multiplier)}x)`}
          </p>
          {additionalInfo && <p>{additionalInfo}</p>}
        </div>
      </div>
    </div>
  );
};
