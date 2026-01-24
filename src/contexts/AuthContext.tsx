'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { authService } from '@/services/AuthService.class';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  handleAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    authService.isAuthenticated()
  );

  const handleAuthError = useCallback(() => {
    authService.removeTokens();
    setIsAuthenticated(false);
    router.push(ROUTES.LOGIN);
  }, [router]);

  // Update auth state when tokens change (e.g., after login)
  useEffect(() => {
    const checkAuth = () => {
      const hasTokens = authService.isAuthenticated();
      setIsAuthenticated(hasTokens);
    };

    // Check on mount and when storage changes
    checkAuth();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken' || e.key === 'refreshToken') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, handleAuthError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}
