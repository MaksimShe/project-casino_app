import { AuthApiError } from '@/services/AuthService.class';
import { showErrorNotification } from '@/utils/notifications';
import { MinesErrorMessage } from '@/types/mines';
import { type QueryClient } from '@tanstack/react-query';
import { USER_QUERY_KEY } from '@/hooks/useCurrentUser';

export function handleMinesError(error: unknown, operation: MinesErrorMessage) {
  console.error(`${operation}:`, error);

  if (error instanceof AuthApiError) {
    showErrorNotification(operation, error.message);
  } else {
    showErrorNotification(operation, MinesErrorMessage.DEFAULT);
  }
}

export function updateUserBalance(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
}
