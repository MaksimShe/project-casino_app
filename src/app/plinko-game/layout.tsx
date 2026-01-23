import { Header } from '@/components/Header/Header';
import History from '@/shared/History/History';

export default function PlinkoGameLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <History />
    </>
  );
}
