'use client';

import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/AuthService.class';
import { type CurrentUserResponse } from '@/types/auth';

export const USER_QUERY_KEY = ['currentUser'];

export function useCurrentUser() {
  return useQuery<CurrentUserResponse>({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      // Check auth inside queryFn to avoid SSR mismatch
      if (!authService.isAuthenticated()) {
        throw new Error('Not authenticated');
      }
      return authService.getCurrentUser();
    },
    // Always enabled - auth check happens in queryFn
    enabled: typeof window !== 'undefined',
    retry: false,
    staleTime: 30 * 1000, // 30 seconds
  });
}
