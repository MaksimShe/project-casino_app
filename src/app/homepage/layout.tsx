import { Header } from '@/components/Header/Header';
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout';

export default function HomepageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedLayout>
      <Header />
      {children}
    </ProtectedLayout>
  );
}
