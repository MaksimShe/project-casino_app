'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/utils/token';
import { authService } from '@/services/AuthService.class';
import { ROUTES } from '@/constants/routes';

export function useRequireAuth() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const hasTokens = isAuthenticated();

      if (!hasTokens) {
        setIsAuth(false);
        setIsLoading(false);
        router.push(ROUTES.LOGIN);
        return;
      }

      // Verify tokens are still valid by trying to get current user
      try {
        await authService.getCurrentUser();
        setIsAuth(true);
      } catch {
        // Token refresh failed or session expired
        authService.removeTokens();
        setIsAuth(false);
        router.push(ROUTES.LOGIN);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return { isAuthenticated: isAuth, isLoading };
}
