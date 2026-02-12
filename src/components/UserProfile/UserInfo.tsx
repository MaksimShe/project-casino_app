'use client';

import { memo } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import Image from 'next/image';
import { StatsItem } from '@/components/UserProfile/StatsItem';

interface UserInfoProps {
  username: string;
  avatarURL?: string;
  gamesPlayed: number;
  winRate: number;
}

export const UserInfo = memo(
  ({ username, avatarURL, gamesPlayed, winRate }: UserInfoProps) => {
    const { t } = useTranslation();
    const lossRate = 100 - winRate;
    const userCountry = '🇮🇱';
    const stats = [
      {
        title: t.userProfile.totalGames,
        description: gamesPlayed,
      },
      {
        title: t.userProfile.winRate,
        description: winRate + '%',
      },
      {
        title: t.userProfile.lossRate,
        description: lossRate + '%',
      },
      {
        title: t.userProfile.location,
        description: userCountry,
      },
    ];

    return (
      <div>
        <div className="mb-8 flex flex-col items-center gap-1">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-b from-[#FFCD71] to-[#E59603] p-0.5">
            <div className="relative h-full w-full overflow-hidden rounded-full bg-[var(--sidebar-bg)]">
              {avatarURL ? (
                <Image
                  src={avatarURL}
                  alt="avatar"
                  height={96}
                  width={96}
                  className="object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-4xl font-bold text-[var(--main-text-color)]">
                  {username?.charAt(0).toUpperCase() ?? '?'}
                </span>
              )}
            </div>
          </div>
          <div>
            <p className="mb-2 text-2xl font-bold text-[var(--main-text-color)]">
              {username}
            </p>
          </div>
        </div>
        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-10 rounded-2xl bg-[var(--bg-user-stats)] px-24 py-4 md:grid-cols-4">
          {stats.map(stat => (
            <StatsItem
              key={stat.title}
              title={stat.title}
              description={stat.description}
            />
          ))}
        </div>
      </div>
    );
  }
);
