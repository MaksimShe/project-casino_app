import { toast } from 'sonner';
import { useGameStore, AudioSound } from '@/stores/useGameStore';

/**
 * Shows a balance notification (win/loss) if notifications are enabled
 * @param difference - The balance difference (positive for win, negative for loss)
 * @param options - Optional toast options
 */
export function showBalanceNotification(
  difference: number,
  options?: { description?: string }
) {
  const { isNotificationsOn, playAudio } = useGameStore.getState();

  // Don't show balance notifications if disabled
  if (!isNotificationsOn) {
    return;
  }

  // Play notify sound
  playAudio(AudioSound.NOTIFY);

  if (difference > 0) {
    toast.success(`Won $${difference.toFixed(2)}!`, {
      description: options?.description || `Profit: +$${difference.toFixed(2)}`,
    });
  } else if (difference < 0) {
    toast.error(`Lost $${Math.abs(difference).toFixed(2)}`, {
      description:
        options?.description || `Loss: -$${Math.abs(difference).toFixed(2)}`,
    });
  } else {
    toast.info('Break even!', options);
  }
}

/**
 * Shows an error notification (always shown, ignores notification settings)
 * @param message - The error message
 * @param description - Optional error description
 */
export function showErrorNotification(message: string, description?: string) {
  toast.error(message, {
    description,
  });
}

/**
 * Shows an info notification if notifications are enabled
 * @param message - The info message
 * @param options - Optional toast options
 */
export function showInfoNotification(
  message: string,
  options?: { description?: string }
) {
  const { isNotificationsOn } = useGameStore.getState();

  if (!isNotificationsOn) {
    return;
  }

  toast.info(message, options);
}
