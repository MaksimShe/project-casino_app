'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/utils/token';
import { ROUTES } from '@/constants/routes';

export function useAuthRedirect(redirectTo: string = ROUTES.HOMEPAGE) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const authStatus = isAuthenticated();
    setIsAuth(authStatus);
    setIsLoading(false);

    if (authStatus) {
      router.push(redirectTo);
    }
  }, [redirectTo, router]);

  return { isAuthenticated: isAuth, isLoading };
}
