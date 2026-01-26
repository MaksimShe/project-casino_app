'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/AuthService.class';
import { ROUTES } from '@/constants/routes';
import { FullScreenLoader } from '@/components/ui/FullScreenLoader';

interface ProtectedLayoutProps {
  children: ReactNode;
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const hasTokens = authService.isAuthenticated();

      if (!hasTokens) {
        setIsAuthenticated(false);
        setIsLoading(false);
        router.push(ROUTES.LOGIN);
        return;
      }

      // Verify token is still valid
      try {
        await authService.getCurrentUser();
        setIsAuthenticated(true);
      } catch (error) {
        // Token refresh failed or session expired
        console.error('Authentication verification failed:', error);
        authService.removeTokens();
        setIsAuthenticated(false);
        router.push(ROUTES.LOGIN);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

  if (isLoading || !isAuthenticated) {
    return <FullScreenLoader message="Verifying access" />;
  }

  return <>{children}</>;
}
