import { formatNumber } from '@/utils/format';
import {
  CRASH_POINT_THRESHOLDS,
  CRASH_POINT_COLORS,
  STATUS_COLORS,
  LEVEL_COLORS,
  DATE_FORMAT_OPTIONS,
  HISTORY_CONFIG,
  FIELD_NAME_MAPPINGS,
  TEXT_STYLES,
} from './constants';
import type { HistoryGameType } from '@/hooks/useHistoryTable';

// Detect game type from URL pathname
export function getGameTypeFromPath(pathname: string): HistoryGameType | null {
  const match = pathname.match(/\/(crash|mines|plinko|cases)-game/);
  if (!match) return null;

  const gameName = match[1];
  return gameName as HistoryGameType;
}

// Convert camelCase/snake_case to Title Case
export function formatColumnName(key: string): string {
  let newKey = key;

  // Apply field name mappings
  if (FIELD_NAME_MAPPINGS[key]) {
    newKey = FIELD_NAME_MAPPINGS[key];
  }

  return newKey
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

// Get color class for crash point
function getCrashPointColor(numValue: number): string {
  if (numValue < CRASH_POINT_THRESHOLDS.LOW) {
    return CRASH_POINT_COLORS.VERY_LOW;
  } else if (numValue < CRASH_POINT_THRESHOLDS.MEDIUM) {
    return CRASH_POINT_COLORS.LOW;
  } else if (numValue < CRASH_POINT_THRESHOLDS.HIGH) {
    return CRASH_POINT_COLORS.MEDIUM;
  } else {
    return CRASH_POINT_COLORS.HIGH;
  }
}

// Get color class for status
function getStatusColor(statusValue: string): string {
  const lowerStatus = statusValue.toLowerCase();
  if (lowerStatus === 'won') {
    return STATUS_COLORS.WON;
  } else {
    return STATUS_COLORS.LOST;
  }
}

// Get color class for rarity/risk level
function getLevelColor(levelValue: string): string {
  const lowerLevel = levelValue.toLowerCase();

  const colorMap: Record<string, string> = {
    legendary: LEVEL_COLORS.LEGENDARY,
    high: LEVEL_COLORS.HIGH,
    epic: LEVEL_COLORS.EPIC,
    medium: LEVEL_COLORS.MEDIUM,
    rare: LEVEL_COLORS.RARE,
    common: LEVEL_COLORS.COMMON,
    low: LEVEL_COLORS.LOW,
  };

  return colorMap[lowerLevel] || LEVEL_COLORS.DEFAULT;
}

// Check if key represents a date field
function isDateField(key: string): boolean {
  return (
    key.toLowerCase().includes('at') ||
    key.toLowerCase().includes('date') ||
    key.toLowerCase().includes('time')
  );
}

// Check if key represents a money field
function isMoneyField(key: string): boolean {
  return (
    key.toLowerCase().includes('amount') ||
    key.toLowerCase().includes('win') ||
    key.toLowerCase().includes('profit')
  );
}

// Check if key represents a profit/win field
function isProfitField(key: string): boolean {
  return (
    key.toLowerCase().includes('profit') || key.toLowerCase().includes('win')
  );
}

// Check if key represents a point field
function isPointField(key: string): boolean {
  return key.toLowerCase().includes('point');
}

// Check if key represents a multiplier field
function isMultiplierField(key: string): boolean {
  return key.toLowerCase().includes('multiplier');
}

// Check if key represents a status field
function isStatusField(key: string): boolean {
  return key.toLowerCase().includes('status') || key.toLowerCase() === 'state';
}

// Check if key represents a rarity/risk field
function isLevelField(key: string): boolean {
  return (
    key.toLowerCase().includes('rarity') || key.toLowerCase().includes('risk')
  );
}

// Check if key represents an ID field
function isIdField(key: string): boolean {
  return (
    key.toLowerCase().includes('id') ||
    key.toLowerCase().includes('hash') ||
    key.toLowerCase().includes('seed')
  );
}

// Format value based on its type and key name
export function formatValue(key: string, value: unknown): React.ReactNode {
  if (value === null || value === undefined) return '—';

  // Handle dates
  if (isDateField(key)) {
    const dateValue = new Date(value as string);
    if (!isNaN(dateValue.getTime())) {
      return dateValue.toLocaleString('en-US', DATE_FORMAT_OPTIONS);
    }
  }

  // Handle money
  if (isMoneyField(key)) {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      const formatted = `$${formatNumber(Math.abs(numValue))}`;
      if (isProfitField(key)) {
        return <span className={STATUS_COLORS.SUCCESS}>{formatted}</span>;
      }
      return formatted;
    }
  }

  // Handle crash points
  if (isPointField(key)) {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      const colorClass = getCrashPointColor(numValue);
      return <span className={colorClass}>{formatNumber(numValue)}x</span>;
    }
  }

  // Handle multipliers
  if (isMultiplierField(key)) {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      return (
        <span className={STATUS_COLORS.SUCCESS}>{formatNumber(numValue)}x</span>
      );
    }
  }

  // Handle status
  if (isStatusField(key)) {
    const statusValue = String(value);
    const colorClass = getStatusColor(statusValue);

    return (
      <span
        className={`${TEXT_STYLES.TAG_BORDER_RADIUS} ${TEXT_STYLES.TAG_PADDING} ${TEXT_STYLES.STATUS_TAG_SIZE} ${colorClass}`}
      >
        {statusValue.charAt(0).toUpperCase() + statusValue.slice(1)}
      </span>
    );
  }

  // Handle rarity/risk levels
  if (isLevelField(key)) {
    const levelValue = String(value);
    const colorClass = getLevelColor(levelValue);

    return (
      <span
        className={`${TEXT_STYLES.TAG_BORDER_RADIUS} ${TEXT_STYLES.TAG_PADDING} ${TEXT_STYLES.TAG_SIZE} ${colorClass}`}
      >
        {levelValue}
      </span>
    );
  }

  // Handle IDs (shorten them)
  if (isIdField(key)) {
    const strValue = String(value);
    if (strValue.length > HISTORY_CONFIG.ID_DISPLAY_LENGTH) {
      return (
        <span
          className={`${TEXT_STYLES.ID_FONT} ${TEXT_STYLES.ID_SIZE} ${TEXT_STYLES.ID_COLOR}`}
        >
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
