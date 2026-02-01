'use client';

import { Header } from '@/components/Header/Header';
import History from '@/shared/History/History';
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout';
import { GoHomepage } from '@/shared/GoHomepage/GoHomepage';
import { Toaster } from 'sonner';

export default function GamesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedLayout>
      <Header />
      <GoHomepage />
      {children}
      <History />
      <Toaster richColors />
    </ProtectedLayout>
  );
}
