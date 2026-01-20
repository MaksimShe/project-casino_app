import Image from 'next/image';
import cup from '@/../public/leaderboard_icons/gold cup.svg';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { LeaderBoardItem } from './components/LeaderBoardItem';
import { NoPlayersYet } from './components/NoPlayersYet';

export const Leaderboard = () => {
  const { data, isLoading, error } = useLeaderboard('all');

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
          const isCurrentPlayer = Boolean(
            currentUser && player.username === currentUser.username
          );
          return (
            <LeaderBoardItem
              key={player.username}
              username={player.username}
              rank={player.rank}
              totalWagered={player.totalWagered}
              gamesPlayed={player.gamesPlayed}
              winRate={player.winRate}
              isCurrentUser={isCurrentPlayer}
            />
          );
        })}
        {currentUser && !isCurrentUserInTop && (
          <div className="rounded-lg bg-gradient-to-b from-[#FFCD71] to-[#E59603] p-[2px]">
            <div className="rounded-md bg-black">
              <LeaderBoardItem
                username={currentUser.username}
                rank={currentUser.rank}
                totalWagered={currentUser.totalWagered}
                gamesPlayed={currentUser.gamesPlayed}
                winRate={currentUser.winRate}
              />
            </div>
          </div>
        )}
        {!isLoading && !error && players.length === 0 && <NoPlayersYet />}
      </div>
    </div>
  );
};
