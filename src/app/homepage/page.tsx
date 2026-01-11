'use client';

import { Leaderboard } from '@/components/Dashboard/Leaderboard';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { ROUTES } from '@/constants/routes';
import { GameSelector } from '@/components/Dashboard/GameSelector';
import { LiveChat } from '@/components/Dashboard/LiveChat';

export default function MainPage() {
  useAuthRedirect(ROUTES.HOMEPAGE);

  return (
    <div className="m-10 flex items-center justify-between">
      <Leaderboard />
      <GameSelector />
      <LiveChat />
    </div>
  );
}
