import { memo } from 'react';
import { CRASH_POINT_COLOR_THRESHOLDS, UI_CONFIG } from './constants';
import updateIcon from '@/../public/logo/update.svg';
import Image from 'next/image';

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
          let colorClass: string;
          if (crashPoint < CRASH_POINT_COLOR_THRESHOLDS.YELLOW) {
            colorClass =
              'bg-[var(--history-gray-bg)] text-[var(--history-gray-text)]';
          } else if (crashPoint < CRASH_POINT_COLOR_THRESHOLDS.BLUE) {
            colorClass =
              'bg-[var(--history-yellow-bg)] text-[var(--history-yellow-text)]';
          } else if (crashPoint < CRASH_POINT_COLOR_THRESHOLDS.PURPLE) {
            colorClass =
              'bg-[var(--history-blue-bg)] text-[var(--history-blue-text)]';
          } else {
            colorClass =
              'bg-[var(--history-purple-bg)] text-[var(--history-purple-text)]';
          }
          return (
            <span
              key={index}
              className={`rounded px-2 py-1 text-xs font-semibold ${colorClass}`}
            >
              {crashPoint.toFixed(2)}x
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default memo(GlobalGameHistory);
