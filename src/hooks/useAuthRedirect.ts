'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/utils/token';
import { ROUTES } from '@/constants/routes';

export function useAuthRedirect(redirectTo: string = ROUTES.HOME) {
  const router = useRouter();
  const isAuth = isAuthenticated();

  useEffect(() => {
    if (isAuth) {
      router.push(redirectTo);
    }
  }, [isAuth, redirectTo, router]);

  return { isAuthenticated: isAuth };
}
