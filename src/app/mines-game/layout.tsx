'use client';

import { Header } from '@/components/Header/Header';
import History from '@/shared/History/History';
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout';

export default function MinesGameLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedLayout>
      <Header />
      {children}
      <History />
    </ProtectedLayout>
  );
}
