import { AuthApiError } from '@/services/AuthService.class';
import { MinesErrorMessage } from '@/types/mines';
import { type QueryClient } from '@tanstack/react-query';
import { USER_QUERY_KEY } from '@/hooks/useCurrentUser';

export function handleMinesError(
  error: unknown,
  operation: MinesErrorMessage,
  showError: (message: string, description?: string) => void
) {
  console.error(`${operation}:`, error);

  if (error instanceof AuthApiError) {
    showError(operation, error.message);
  } else {
    showError(operation, MinesErrorMessage.DEFAULT);
  }
}

export function updateUserBalance(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
}
