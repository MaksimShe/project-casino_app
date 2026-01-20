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
      <LeaderBoardItem
        username={username}
        rank={rank}
        totalWagered={totalWagered}
        gamesPlayed={gamesPlayed}
        winRate={winRate}
        isCurrentUser
        showYouLabel
      />
    </>
  );
};
