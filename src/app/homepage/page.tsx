'use client';

import { Leaderboard } from '@/components/Dashboard/Leaderboard';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { ROUTES } from '@/constants/routes';
import { GameSelector } from '@/components/Dashboard/GameSelector';

export default function MainPage() {
  useAuthRedirect(ROUTES.HOMEPAGE);

  return (
    <div className="mt-16 ml-10 flex gap-10">
      <Leaderboard />
      <GameSelector />
    </div>
  );
}
