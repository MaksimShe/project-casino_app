import { useCallback } from 'react';
import { toast } from 'sonner';
import { useGameStore, AudioSound } from '@/stores/useGameStore';
import { useTranslation } from '@/i18n/useTranslation';

/**
 * Unified notification hook for all games
 * Handles win/loss notifications, errors, and info messages with i18n support
 */
export function useShowNotification() {
  const isNotificationsOn = useGameStore(state => state.isNotificationsOn);
  const playAudio = useGameStore(state => state.playAudio);
  const { t } = useTranslation();

  /**
   * Shows a game result notification (win/loss/break even)
   * @param profit - The profit amount (positive for win, negative for loss, 0 for break even)
   * @param options - Optional custom description
   */
  const showGameResult = useCallback(
    (profit: number, options?: { description?: string }) => {
      if (!isNotificationsOn) {
        return;
      }

      // Play notify sound
      playAudio(AudioSound.NOTIFY);

      if (profit > 0) {
        toast.success(
          t.notification.won.replace('{{amount}}', profit.toFixed(2)),
          {
            description:
              options?.description ||
              t.notification.profit.replace('{{amount}}', profit.toFixed(2)),
          }
        );
      } else if (profit < 0) {
        toast.error(
          t.notification.lost.replace(
            '{{amount}}',
            Math.abs(profit).toFixed(2)
          ),
          {
            description:
              options?.description ||
              t.notification.loss.replace(
                '{{amount}}',
                Math.abs(profit).toFixed(2)
              ),
          }
        );
      } else {
        toast.info(t.notification.breakEven, options);
      }
    },
    [isNotificationsOn, playAudio, t]
  );

  /**
   * Shows an error notification (always shown, ignores notification settings)
   * @param message - The error message
   * @param description - Optional error description
   */
  const showError = useCallback((message: string, description?: string) => {
    toast.error(message, {
      description,
    });
  }, []);

  /**
   * Shows an info notification if notifications are enabled
   * @param message - The info message
   * @param description - Optional info description
   */
  const showInfo = useCallback(
    (message: string, description?: string) => {
      if (!isNotificationsOn) {
        return;
      }

      toast.info(message, {
        description,
      });
    },
    [isNotificationsOn]
  );

  /**
   * Shows a success notification if notifications are enabled
   * @param message - The success message
   * @param description - Optional success description
   */
  const showSuccess = useCallback(
    (message: string, description?: string) => {
      if (!isNotificationsOn) {
        return;
      }

      // Play notify sound
      playAudio(AudioSound.NOTIFY);

      toast.success(message, {
        description,
      });
    },
    [isNotificationsOn, playAudio]
  );

  return {
    showGameResult,
    showError,
    showInfo,
    showSuccess,
  };
}
