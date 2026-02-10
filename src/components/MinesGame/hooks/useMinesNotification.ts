import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useMinesStore } from '@/stores/useMinesStore';
import { useGameStore } from '@/stores/useGameStore';
import { AudioSound } from '@/stores/useGameStore';
import { MinesGameStatus } from '@/types/mines';
import { useTranslation } from '@/i18n/useTranslation';

/**
 * Hook for managing Mines game notifications
 * Shows notification when game ends (cashout or hit mine)
 */
export function useMinesNotification() {
  const gameStatus = useMinesStore(state => state.gameStatus);
  const amount = useMinesStore(state => state.amount);
  const currentWinnings = useMinesStore(state => state.currentWinnings);
  const isNotificationsOn = useGameStore(state => state.isNotificationsOn);
  const playAudio = useGameStore(state => state.playAudio);
  const { t } = useTranslation();

  const prevStatusRef = useRef<MinesGameStatus>(MinesGameStatus.IDLE);

  useEffect(() => {
    const prevStatus = prevStatusRef.current;

    // Game just ended (was active, now won or lost)
    if (
      prevStatus === MinesGameStatus.ACTIVE &&
      (gameStatus === MinesGameStatus.WON ||
        gameStatus === MinesGameStatus.LOST)
    ) {
      if (!isNotificationsOn) {
        prevStatusRef.current = gameStatus;
        return;
      }

      // Play notify sound
      playAudio(AudioSound.NOTIFY);

      if (gameStatus === MinesGameStatus.WON) {
        // Calculate profit (winnings - bet amount)
        const profit = currentWinnings - amount;

        if (profit > 0) {
          toast.success(
            t.notification.won.replace(
              '{{amount}}',
              currentWinnings.toFixed(2)
            ),
            {
              description: t.notification.profit.replace(
                '{{amount}}',
                profit.toFixed(2)
              ),
            }
          );
        } else if (profit < 0) {
          toast.error(
            t.notification.lost.replace(
              '{{amount}}',
              Math.abs(profit).toFixed(2)
            ),
            {
              description: t.notification.loss.replace(
                '{{amount}}',
                Math.abs(profit).toFixed(2)
              ),
            }
          );
        } else {
          toast.info(t.notification.breakEven, {
            description: t.notification.cashedOut.replace(
              '{{amount}}',
              currentWinnings.toFixed(2)
            ),
          });
        }
      } else if (gameStatus === MinesGameStatus.LOST) {
        // Lost the bet amount
        toast.error(
          t.notification.lost.replace('{{amount}}', amount.toFixed(2)),
          {
            description: t.notification.loss.replace(
              '{{amount}}',
              amount.toFixed(2)
            ),
          }
        );
      }
    }

    // Track status for next check
    prevStatusRef.current = gameStatus;
  }, [gameStatus, amount, currentWinnings, isNotificationsOn, playAudio, t]);
}
