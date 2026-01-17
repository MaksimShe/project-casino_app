import Image from 'next/image';
import coin from '@/../public/leaderboard_icons/dollar.svg';
import firstPlace from '@/../public/leaderboard_icons/1st-place.svg';
import secondPlace from '@/../public/leaderboard_icons/2nd-place.svg';
import thirdPlace from '@/../public/leaderboard_icons/3rd-place.svg';
import { formatNumber } from '@/utils/format';

interface LeaderBoardItemProps {
  username: string;
  rank: number;
  totalWagered: number;
  gamesPlayed: number;
  winRate: number;
  isCurrentUser?: boolean;
  showYouLabel?: boolean;
}

const getRankImage = (place: number) => {
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

export const LeaderBoardItem = ({
  username,
  rank,
  totalWagered,
  gamesPlayed,
  winRate,
  isCurrentUser = false,
  showYouLabel = false,
}: LeaderBoardItemProps) => {
  return (
    <div
      className={`flex rounded-xl shadow-[0px_2px_10px_0px_#BFD8FF33] ${
        isCurrentUser
          ? 'bg-gradient-to-b from-[#FFCD71] to-[#E59603] p-[2px]'
          : ''
      }`}
    >
      <div className="flex w-full rounded-[10px] bg-[#24243F]">
        {getRankImage(rank)}
        <div className="box-border flex h-[73px] w-full flex-col p-4 pl-0">
          <div className="flex justify-between">
            <h3>
              {username}
              {showYouLabel && ' (You)'}
            </h3>
            <div className="flex gap-2">
              <Image src={coin} alt="coin" width={16} height={16} />
              <h3>{formatNumber(totalWagered)}</h3>
            </div>
          </div>
          <div className="flex justify-between">
            <h4>{gamesPlayed} games</h4>
            <p className="text-sm text-[var(--system-success-color)]">
              {formatNumber(winRate)}% win
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
