import { CRASH_POINT_COLOR_THRESHOLDS, UI_CONFIG } from './constants';

interface Game {
  crashPoint: number;
}

interface GlobalGameHistoryProps {
  games: Game[];
  onRefresh: () => void;
}

export default function GlobalGameHistory({
  games,
  onRefresh,
}: GlobalGameHistoryProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          Last {UI_CONFIG.HISTORY_DISPLAY_COUNT} Games
        </span>
        <button
          onClick={onRefresh}
          className="rounded bg-purple-600 px-3 py-1 text-xs text-white transition-colors hover:bg-purple-700"
        >
          Refresh History
        </button>
      </div>
      <div className="flex flex-wrap justify-center gap-1">
        {games.slice(0, UI_CONFIG.HISTORY_DISPLAY_COUNT).map((game, index) => {
          const crashPoint = game.crashPoint;
          let colorClass: string;
          if (crashPoint < CRASH_POINT_COLOR_THRESHOLDS.YELLOW) {
            colorClass = 'bg-gray-900/50 text-gray-300';
          } else if (crashPoint < CRASH_POINT_COLOR_THRESHOLDS.BLUE) {
            colorClass = 'bg-yellow-900/50 text-yellow-300';
          } else if (crashPoint < CRASH_POINT_COLOR_THRESHOLDS.PURPLE) {
            colorClass = 'bg-blue-900/50 text-blue-300';
          } else {
            colorClass = 'bg-purple-900/50 text-purple-300';
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
