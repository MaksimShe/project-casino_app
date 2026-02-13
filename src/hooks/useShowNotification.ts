import { useCallback } from 'react';
import { toast } from 'sonner';
import { useGameStore, AudioSound } from '@/stores/useGameStore';
import { useTranslation } from '@/i18n/useTranslation';

export function useShowNotification() {
  const isNotificationsOn = useGameStore(state => state.isNotificationsOn);
  const playAudio = useGameStore(state => state.playAudio);
  const { t } = useTranslation();

  const showGameResult = useCallback(
    (profit: number, options?: { description?: string }) => {
      if (!isNotificationsOn) {
        return;
      }

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

  const showError = useCallback((message: string, description?: string) => {
    toast.error(message, {
      description,
    });
  }, []);

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

  const showSuccess = useCallback(
    (message: string, description?: string) => {
      if (!isNotificationsOn) {
        return;
      }

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
