import { LeaderBoardItem } from './LeaderBoardItem';

interface CurrentUserProps {
  username: string;
  rank: number;
  totalWagered: number;
  gamesPlayed: number;
  winRate: number;
}

export const CurrentUser = ({
  username,
  rank,
  totalWagered,
  gamesPlayed,
  winRate,
}: CurrentUserProps) => {
  return (
    <>
      <div className="my-2 border-t border-dashed border-gray-500" />
      <LeaderBoardItem
        username={username}
        rank={rank}
        totalWagered={totalWagered}
        gamesPlayed={gamesPlayed}
        winRate={winRate}
        isCurrentUser={true}
        showYouLabel={true}
      />
    </>
  );
};
