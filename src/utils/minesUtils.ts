import { AuthApiError } from '@/services/AuthService.class';
import { showErrorNotification } from '@/utils/notifications';
import { MinesErrorMessage } from '@/types/mines';
import { type QueryClient } from '@tanstack/react-query';
import { USER_QUERY_KEY } from '@/hooks/useCurrentUser';

/**
 * Handles errors from Mines game API calls with consistent error messaging
 */
export function handleMinesError(error: unknown, operation: MinesErrorMessage) {
  console.error(`${operation}:`, error);

  if (error instanceof AuthApiError) {
    showErrorNotification(operation, error.message);
  } else {
    showErrorNotification(operation, MinesErrorMessage.DEFAULT);
  }
}

/**
 * Updates user balance after game actions
 */
export function updateUserBalance(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
}
