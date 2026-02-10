'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/AuthService.class';
import { ROUTES } from '@/constants/routes';
import { AuthVerificationProvider } from '@/contexts/AuthVerificationContext';

interface ProtectedLayoutProps {
  children: ReactNode;
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const hasTokens = authService.isAuthenticated();

      if (!hasTokens) {
        setIsVerifying(false);
        router.push(ROUTES.LOGIN);
        return;
      }

      // Verify token is still valid
      try {
        await authService.getCurrentUser();
      } catch (error) {
        // Token refresh failed or session expired
        console.error('Authentication verification failed:', error);
        authService.removeTokens();
        router.push(ROUTES.LOGIN);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAuth();
  }, [router]);

  // Optional timeout: enable controls after 10s if verification is still pending
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isVerifying) {
        console.warn('Verification timeout - proceeding anyway');
        setIsVerifying(false);
      }
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, [isVerifying]);

  return (
    <AuthVerificationProvider isVerifying={isVerifying}>
      {children}
    </AuthVerificationProvider>
  );
}
