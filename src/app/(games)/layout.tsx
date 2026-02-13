'use client';

import { Header } from '@/components/Header/Header';
import History from '@/shared/History/History';
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout';
import { GoHomepage } from '@/shared/GoHomepage/GoHomepage';
import { Toaster } from 'sonner';
import { useCaseStore } from '@/stores/useCaseStore';
import { CaseViewState } from '@/components/CaseGame/constants';
import { type ReactNode } from 'react';

export default function GamesLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { isAnimating, viewState } = useCaseStore();
  const shouldHideHistory = isAnimating || viewState === CaseViewState.RESULT;

  return (
    <ProtectedLayout>
      <Header />
      <div className="flex min-h-[calc(100vh-100px)] flex-col justify-between max-lg:min-h-[calc(100vh-60px)]">
        <div>
          <GoHomepage />
          {children}
        </div>
        {!shouldHideHistory && <History />}
      </div>
      <Toaster richColors />
    </ProtectedLayout>
  );
}
