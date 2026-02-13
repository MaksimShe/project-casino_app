import { Header } from '@/components/Header/Header';
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout';
import { type ReactNode } from 'react';

export default function HomepageLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ProtectedLayout>
      <Header />
      {children}
    </ProtectedLayout>
  );
}
