import { memo } from 'react';
import { UI_CONFIG } from './constants';
import { getCrashPointColorClass } from './helpers';
import updateIcon from '@/../public/logo/update.svg';
import Image from 'next/image';
import { formatNumber } from '@/utils/format';

interface Game {
  crashPoint: number;
}

interface GlobalGameHistoryProps {
  games: Game[];
  onRefresh: () => void;
}

function GlobalGameHistory({ games, onRefresh }: GlobalGameHistoryProps) {
  return (
    <div className="flex w-full flex-col gap-2 px-6">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          Last global {UI_CONFIG.HISTORY_DISPLAY_COUNT} Games
        </span>
        <button
          onClick={onRefresh}
          className="transition-colors hover:scale-110 active:scale-85"
        >
          <Image
            src={updateIcon}
            alt="update"
            width={24}
            height={24}
            className="drop-shadow-[0_2px_2px_rgba(255,255,255,0.6)]"
          />
        </button>
      </div>
      <div className="flex flex-wrap justify-center gap-1">
        {games.slice(0, UI_CONFIG.HISTORY_DISPLAY_COUNT).map((game, index) => {
          const crashPoint = game.crashPoint;
          const colorClass = getCrashPointColorClass(crashPoint);

          return (
            <span
              key={index}
              className={`rounded px-2 py-1 text-xs font-semibold ${colorClass}`}
            >
              {formatNumber(crashPoint)}x
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default memo(GlobalGameHistory);
