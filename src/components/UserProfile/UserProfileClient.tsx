'use client';

import { UserInfo } from './UserInfo';
import { Bonus } from './Bonus';
import type { CurrentUserResponse, LeaderboardResponse } from '@/types/auth';
import type { BonusStatusResponse } from '@/types/bonus';

interface UserProfileClientProps {
  initialUser: CurrentUserResponse | null;
  initialLeaderboard: LeaderboardResponse | null;
  initialBonusStatus: BonusStatusResponse | null;
}

export function UserProfileClient({
  initialUser,
  initialLeaderboard,
  initialBonusStatus,
}: UserProfileClientProps) {
  const gamesPlayed = initialUser?.gamesPlayed || 0;
  const winRate = initialLeaderboard?.currentUser?.winRate || 0;

  return (
    <div className="flex flex-col items-center justify-center px-4 pb-8">
      <UserInfo
        username={initialUser?.username || ''}
        avatarURL={initialUser?.avatarURL}
        gamesPlayed={gamesPlayed}
        winRate={winRate}
      />

      {/* Bonus section */}
      <Bonus initialBonusStatus={initialBonusStatus} />
    </div>
  );
}
