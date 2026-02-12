'use client';

import { Header } from '@/components/Header/Header';
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout';
import { GoHomepage } from '@/shared/GoHomepage/GoHomepage';

export default function GamesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedLayout>
      <Header />
      <div className="flex min-h-[calc(100vh-100px)] flex-col max-lg:min-h-[calc(100vh-60px)]">
        <div>
          <GoHomepage />
          {children}
        </div>
      </div>
    </ProtectedLayout>
  );
}
