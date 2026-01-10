'use client';

import { Leaderboard } from '@/components/Leaderboard';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { ROUTES } from '@/constants/routes';

export default function MainPage() {
  useAuthRedirect(ROUTES.HOMEPAGE);

  return (
    <div className="mt-20 ml-20">
      <Leaderboard />
    </div>
  );
}
