'use client';

import Image from 'next/image';
import coin from '@/../public/leaderboard_icons/dollar.svg';
import cup from '@/../public/leaderboard_icons/gold cup.svg';
import firstPlace from '@/../public/leaderboard_icons/1st-place.svg';
import secondPlace from '@/../public/leaderboard_icons/2nd-place.svg';
import thirdPlace from '@/../public/leaderboard_icons/3rd-place.svg';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { formatNumber } from '@/utils/format';

export const Leaderboard = () => {
  const { data, isLoading, error } = useLeaderboard('all');

  const topImage = (place: number) => {
    switch (place) {
      case 1:
        return (
          <Image
            src={firstPlace}
            alt="1"
            height={50}
            width={50}
            className="mx-4"
          />
        );
      case 2:
        return (
          <Image
            src={secondPlace}
            alt="2"
            height={50}
            width={50}
            className="mx-4"
          />
        );
      case 3:
        return (
          <Image
            src={thirdPlace}
            alt="3"
            height={50}
            width={50}
            className="mx-4"
          />
        );
      default:
        return (
          <span className="flex w-20 items-center justify-center text-2xl font-semibold text-white">
            {place}
          </span>
        );
    }
  };
  const players = data?.players ?? [];
  const currentUser = data?.currentUser;
  const isCurrentUserInTop = players.some(
    p => currentUser && p.username === currentUser.username
  );

  return (
    <div className="relative box-border flex w-72 flex-col rounded-2xl bg-[#423E69] p-4 max-lg:w-full">
      <Image
        src={cup}
        alt="Cup"
        width={122}
        height={122}
        className="absolute -top-12 -left-12"
      />

      <div className="mb-6 flex flex-col items-center">
        <p className="text-2xl font-bold text-white">Leaderboard</p>
        <p className="text-[16px]">Top players</p>
      </div>
      <div className="flex flex-col gap-4">
        {isLoading && <p className="text-center text-white">Loading...</p>}
        {error && (
          <p className="text-center text-red-400">Failed to load leaderboard</p>
        )}
        {players.map(player => {
          const isCurrentPlayer =
            currentUser && player.username === currentUser.username;
          return (
            <div
              key={player.username}
              className={`flex rounded-xl shadow-[0px_2px_10px_0px_#BFD8FF33] ${
                isCurrentPlayer
                  ? 'bg-[#3A3766] ring-2 ring-[var(--system-success-color)]'
                  : 'bg-[#24243F]'
              }`}
            >
              {topImage(player.rank)}
              <div className="box-border flex h-[73px] w-full flex-col p-4 pl-0">
                <div className="flex justify-between">
                  <h3>{player.username}</h3>
                  <div className="flex gap-2">
                    <Image src={coin} alt="coin" width={16} height={16} />
                    <h3>{formatNumber(player.totalWagered)}</h3>
                  </div>
                </div>
                <div className="flex justify-between">
                  <h4>{player.gamesPlayed} games</h4>
                  <p className="text-sm text-[var(--system-success-color)]">
                    {formatNumber(player.winRate)}% win
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        {currentUser && !isCurrentUserInTop && (
          <>
            <div className="my-2 border-t border-dashed border-gray-500" />
            <div className="flex rounded-xl bg-[#3A3766]">
              {topImage(currentUser.rank)}
              <div className="box-border flex h-[73px] w-full flex-col p-4 pl-0">
                <div className="flex justify-between">
                  <h3>{currentUser.username} (You)</h3>
                  <div className="flex gap-2">
                    <Image src={coin} alt="coin" width={16} height={16} />
                    <h3>{formatNumber(currentUser.totalWagered)}</h3>
                  </div>
                </div>
                <div className="flex justify-between">
                  <h4>{currentUser.gamesPlayed} games</h4>
                  <p className="text-sm text-[var(--system-success-color)]">
                    {formatNumber(currentUser.winRate)}% win
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
        {!isLoading && !error && players.length === 0 && (
          <p className="text-center text-white">No players yet</p>
        )}
      </div>
    </div>
  );
};
