'use client';

import { createContext, useContext, type ReactNode } from 'react';

interface AuthVerificationContextType {
  isVerifying: boolean;
}

const AuthVerificationContext = createContext<AuthVerificationContextType>({
  isVerifying: false,
});

interface AuthVerificationProviderProps {
  children: ReactNode;
  isVerifying: boolean;
}

export function AuthVerificationProvider({
  children,
  isVerifying,
}: AuthVerificationProviderProps) {
  return (
    <AuthVerificationContext.Provider value={{ isVerifying }}>
      {children}
    </AuthVerificationContext.Provider>
  );
}

export function useAuthVerification() {
  const context = useContext(AuthVerificationContext);
  if (context === undefined) {
    throw new Error(
      'useAuthVerification must be used within AuthVerificationProvider'
    );
  }
  return context;
}
