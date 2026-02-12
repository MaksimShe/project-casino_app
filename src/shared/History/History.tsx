'use client';

import { usePathname } from 'next/navigation';
import {
  useHistoryTable,
  useCrashHistory,
  type HistoryGameType,
} from '@/hooks/useHistoryTable';
import { HISTORY_CONFIG, TABLE_STYLES, TEXT_STYLES } from './constants';
import { getGameTypeFromPath } from './utils';
import { UniversalTable } from './components/UniversalTable';

// Extract history data from response
function extractHistoryData(data: unknown): Record<string, unknown>[] {
  if (!data || typeof data !== 'object') return [];

  const dataKeys = ['openings', 'games', 'drops', 'bets'];
  for (const key of dataKeys) {
    if (key in data) {
      return (data as Record<string, unknown>)[key] as unknown as Record<
        string,
        unknown
      >[];
    }
  }

  return [];
}

export default function History() {
  const pathname = usePathname();
  const gameType = getGameTypeFromPath(pathname);

  // For crash game, always show "myBets"
  const crashHistoryQuery = useCrashHistory('myBets', {
    limit: HISTORY_CONFIG.LIMIT,
    enabled: gameType === 'crash',
  });

  // For other games, use regular hook
  const regularHistoryQuery = useHistoryTable(
    gameType === 'crash' ? 'mines' : (gameType as HistoryGameType),
    {
      limit: HISTORY_CONFIG.LIMIT,
      enabled: gameType !== null && gameType !== 'crash',
    }
  );

  const query = gameType === 'crash' ? crashHistoryQuery : regularHistoryQuery;
  const { data, isLoading, error } = query;

  if (!gameType) {
    return (
      <div className="rounded-xl bg-[#1a1625] p-6">
        <p className={TABLE_STYLES.NO_DATA_TEXT_COLOR}>
          Unable to detect game type from URL
        </p>
      </div>
    );
  }

  const historyData = extractHistoryData(data);

  return (
    <div className="p-6 pb-0">
      <div className="mb-4 flex items-center justify-between">
        <p
          className={`${TEXT_STYLES.TITLE_SIZE} ${TEXT_STYLES.TITLE_WEIGHT} ${TEXT_STYLES.TITLE_COLOR}`}
        >
          Game history
        </p>
      </div>

      {error ? (
        <div className={`py-8 text-center ${TABLE_STYLES.ERROR_TEXT_COLOR}`}>
          Failed to load history: {error.message}
        </div>
      ) : (
        <UniversalTable
          data={historyData}
          gameType={gameType}
          crashHistoryType="myBets"
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
