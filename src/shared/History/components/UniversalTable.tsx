import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import type {
  HistoryGameType,
  CrashHistoryType,
} from '@/hooks/useHistoryTable';
import { formatValue, formatColumnName } from '../utils';
import {
  EXCLUDED_FIELDS,
  EXCLUDED_FIELD_PATTERNS,
  CRASH_BETS_COLUMN_ORDER,
  TABLE_STYLES,
  HISTORY_CONFIG,
} from '../constants';

interface UniversalTableProps {
  data: Record<string, unknown>[];
  gameType: HistoryGameType | null;
  crashHistoryType?: CrashHistoryType;
  isLoading?: boolean;
}

export function UniversalTable({
  data,
  gameType,
  crashHistoryType,
  isLoading = false,
}: UniversalTableProps) {
  // Generate columns dynamically from data
  const columns = useMemo<ColumnDef<Record<string, unknown>>[]>(() => {
    if (!data || data.length === 0) return [];

    // Get all unique keys from all objects
    const allKeys = Array.from(
      new Set(data.flatMap(item => Object.keys(item)))
    ).filter(
      key =>
        !EXCLUDED_FIELDS.includes(key as any) &&
        !key.startsWith(EXCLUDED_FIELD_PATTERNS.UNDERSCORE_PREFIX) &&
        !key.toLowerCase().includes(EXCLUDED_FIELD_PATTERNS.ID_SUFFIX)
    );

    // Sort keys based on game type
    let sortedKeys = allKeys;
    if (gameType === 'crash' && crashHistoryType === 'myBets') {
      sortedKeys = [
        ...CRASH_BETS_COLUMN_ORDER.filter(key => allKeys.includes(key)),
        ...allKeys.filter(key => !CRASH_BETS_COLUMN_ORDER.includes(key as any)),
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

  // Show loading on server and when actually loading on client
  const isServerSide = typeof window === 'undefined';
  const shouldShowLoading = isServerSide || isLoading;

  if (shouldShowLoading && (!data || data.length === 0)) {
    return (
      <div className={`py-8 text-center ${TABLE_STYLES.LOADING_TEXT_COLOR}`}>
        Loading history...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`py-8 text-center ${TABLE_STYLES.NO_DATA_TEXT_COLOR}`}>
        No history data available
      </div>
    );
  }

  return (
    <div
      className={`${HISTORY_CONFIG.TABLE_HEIGHT} overflow-auto rounded-t-lg`}
    >
      <table
        className={`w-full rounded-t-2xl border-x-2 ${TABLE_STYLES.TEXT_SIZE} shadow-none`}
        style={{ borderColor: TABLE_STYLES.BORDER_COLOR }}
      >
        <thead
          className="sticky top-0 z-10 rounded-t-2xl border-x-2 backdrop-blur-sm"
          style={{
            borderColor: TABLE_STYLES.BORDER_COLOR,
            backgroundColor: TABLE_STYLES.HEADER_BG,
          }}
        >
          {table.getHeaderGroups().map(headerGroup => (
            <tr
              key={headerGroup.id}
              className={`text-left ${TABLE_STYLES.HEADER_TEXT_COLOR}`}
            >
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className={`${TABLE_STYLES.HEADER_PADDING} font-bold`}
                >
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
                <td
                  key={cell.id}
                  className={`${TABLE_STYLES.CELL_PADDING} ${TABLE_STYLES.CELL_TEXT_COLOR}`}
                >
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
