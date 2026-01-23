'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import {
  useHistoryTable,
  useCrashHistory,
  type HistoryGameType,
  type CrashHistoryType,
} from '@/hooks/useHistoryTable';
import { formatNumber } from '@/utils/format';
import { HISTORY_CONFIG } from '@/shared/History/constants';

// Detect game type from URL pathname
function getGameTypeFromPath(pathname: string): HistoryGameType | null {
  const match = pathname.match(/\/(crash|mines|plinko|cases)-game/);
  if (!match) return null;

  const gameName = match[1];
  return gameName as HistoryGameType;
}

// Format value based on its type and key name
function formatValue(key: string, value: unknown): React.ReactNode {
  if (value === null || value === undefined) return '—';

  // Handle dates (createdAt, startsAt, etc.)
  if (
    key.toLowerCase().includes('at') ||
    key.toLowerCase().includes('date') ||
    key.toLowerCase().includes('time')
  ) {
    const dateValue = new Date(value as string);
    if (!isNaN(dateValue.getTime())) {
      return dateValue.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  }

  // Handle money (amount, price, value, win, balance, etc.)
  if (
    key.toLowerCase().includes('amount') ||
    key.toLowerCase().includes('win') ||
    key.toLowerCase().includes('profit')
  ) {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      const formatted = `$${formatNumber(Math.abs(numValue))}`;
      if (
        key.toLowerCase().includes('profit') ||
        key.toLowerCase().includes('win')
      ) {
        return (
          <span className="text-[var(--system-success-color)]">
            {formatted}
          </span>
        );
      }
      return formatted;
    }
  }

  if (key.toLowerCase().includes('point')) {
    const numValue = Number(value);
    let colorClass = '';
    if (numValue < 2) {
      colorClass = 'text-gray-300';
    } else if (numValue < 10) {
      colorClass = 'text-yellow-300';
    } else if (numValue < 100) {
      colorClass = 'text-blue-300';
    } else {
      colorClass = 'text-purple-300';
    }
    if (!isNaN(numValue)) {
      return <span className={colorClass}>{formatNumber(numValue)}x</span>;
    }
  }

  // Handle multipliers
  if (key.toLowerCase().includes('multiplier')) {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      return (
        <span className="text-[var(--system-success-color)]">
          {formatNumber(numValue)}x
        </span>
      );
    }
  }

  // Handle status
  if (key.toLowerCase().includes('status') || key.toLowerCase() === 'state') {
    const statusValue = String(value).toLowerCase();
    let colorClass = 'bg-gray-500/20 text-gray-400';

    if (statusValue === 'won') {
      colorClass = 'text-[var(--system-success-color)]';
    } else {
      colorClass = 'text-[var(--system-error-color)]';
    }

    return (
      <span className={`rounded px-2 py-1 text-sm ${colorClass}`}>
        {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
      </span>
    );
  }

  // Handle rarity/risk levels
  if (
    key.toLowerCase().includes('rarity') ||
    key.toLowerCase().includes('risk')
  ) {
    const levelValue = String(value).toLowerCase();
    let colorClass = 'bg-gray-500/20 text-[var(--second-text-color)]';

    if (levelValue === 'legendary' || levelValue === 'high') {
      colorClass = 'bg-red-500/20 text-red-400';
    } else if (levelValue === 'epic' || levelValue === 'medium') {
      colorClass = 'bg-yellow-500/20 text-yellow-400';
    } else if (levelValue === 'rare') {
      colorClass = 'bg-blue-500/20 text-blue-400';
    } else if (levelValue === 'common' || levelValue === 'low') {
      colorClass = 'bg-green-500/20 text-green-400';
    }

    return (
      <span className={`rounded px-2 py-1 text-xs ${colorClass}`}>
        {String(value)}
      </span>
    );
  }

  // Handle IDs (shorten them)
  if (
    key.toLowerCase().includes('id') ||
    key.toLowerCase().includes('hash') ||
    key.toLowerCase().includes('seed')
  ) {
    const strValue = String(value);
    if (strValue.length > 16) {
      return (
        <span className="font-mono text-xs text-gray-400">
          {strValue.slice(-8)}
        </span>
      );
    }
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value.length;
  }

  // Handle objects (nested data)
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  // Default: just return the value as string
  return String(value);
}

// Convert camelCase/snake_case to Title Case
function formatColumnName(key: string): string {
  console.log(key);
  let newKey = key;
  //crash game
  if (key.includes('amount')) {
    newKey = 'bet';
  }
  if (key.includes('createdAt')) {
    newKey = 'time';
  }

  return newKey
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

// Universal table component using TanStack Table
function UniversalTable({
  data,
  gameType,
  crashHistoryType,
}: {
  data: Record<string, unknown>[];
  gameType: HistoryGameType | null;
  crashHistoryType?: CrashHistoryType;
}) {
  // Generate columns dynamically from data
  const columns = useMemo<ColumnDef<Record<string, unknown>>[]>(() => {
    if (!data || data.length === 0) return [];

    // Get all unique keys from all objects
    const allKeys = Array.from(
      new Set(data.flatMap(item => Object.keys(item)))
    ).filter(
      key =>
        key !== '__v' &&
        key !== 'userId' &&
        !key.startsWith('_') &&
        key !== 'serverSeedHash' &&
        key !== 'clientSeed' &&
        key !== 'serverSeed' &&
        key !== 'nonce' &&
        !key.toLowerCase().includes('id')
    );

    // Define custom column order for crash game "My Bets"
    const crashBetsOrder = [
      'createdAt',
      'amount',
      'cashoutMultiplier',
      'crashPoint',
      'winAmount',
      'status',
    ];

    // Sort keys based on game type
    let sortedKeys = allKeys;
    if (gameType === 'crash' && crashHistoryType === 'myBets') {
      sortedKeys = [
        ...crashBetsOrder.filter(key => allKeys.includes(key)),
        ...allKeys.filter(key => !crashBetsOrder.includes(key)),
      ];
    }

    return sortedKeys.map(key => ({
      accessorKey: key,
      header: formatColumnName(key),
      cell: info => formatValue(key, info.getValue()),
    }));
  }, [data, gameType, crashHistoryType]);

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!data || data.length === 0) {
    return (
      <div className="py-8 text-center text-gray-400">
        No history data available
      </div>
    );
  }

  return (
    <div className="h-64 overflow-auto rounded-t-lg">
      <table className="w-full rounded-t-2xl border-x-2 border-[#ADB5BD33] text-sm shadow-none">
        <thead className="sticky top-0 z-10">
          {table.getHeaderGroups().map(headerGroup => (
            <tr
              key={headerGroup.id}
              className="bg-[#ADB5BD33] text-left text-gray-300 backdrop-blur-sm"
            >
              {headerGroup.headers.map(header => (
                <th key={header.id} className="px-4 py-3 font-bold">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-4 py-3 text-white">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function History() {
  const pathname = usePathname();
  const gameType = getGameTypeFromPath(pathname);

  // For crash game, always show "myBets"
  const crashHistoryQuery = useCrashHistory('myBets', {
    limit: HISTORY_CONFIG.LIMIT,
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
        <p className="text-gray-400">Unable to detect game type from URL</p>
      </div>
    );
  }

  // Extract array from response
  let historyData: Record<string, unknown>[] = [];
  if (data) {
    if ('openings' in data)
      historyData = data.openings as unknown as Record<string, unknown>[];
    if ('games' in data)
      historyData = data.games as unknown as Record<string, unknown>[];
    if ('drops' in data)
      historyData = data.drops as unknown as Record<string, unknown>[];
    if ('bets' in data)
      historyData = data.bets as unknown as Record<string, unknown>[];
  }

  return (
    <div className="p-6 pb-0">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[32px] font-black text-white">Game history</p>
      </div>

      {isLoading && (
        <div className="py-8 text-center text-gray-400">Loading history...</div>
      )}

      {error && (
        <div className="py-8 text-center text-red-400">
          Failed to load history: {error.message}
        </div>
      )}

      {!isLoading && !error && (
        <UniversalTable
          data={historyData}
          gameType={gameType}
          crashHistoryType="myBets"
        />
      )}
    </div>
  );
}
