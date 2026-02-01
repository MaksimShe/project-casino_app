export const HISTORY_CONFIG = {
  LIMIT: 10,
  ID_DISPLAY_LENGTH: 16,
  TABLE_HEIGHT: 'h-64',
} as const;

// Field filters
export const EXCLUDED_FIELDS = [
  '__v',
  'userId',
  'serverSeedHash',
  'clientSeed',
  'serverSeed',
  'nonce',
  'ballsCount',
  'completed',
  'updatedAt',
  'completedAt',
] as const;

// Field name patterns to exclude
export const EXCLUDED_FIELD_PATTERNS = {
  UNDERSCORE_PREFIX: '_',
  ID_SUFFIX: 'id',
} as const;

// Crash point color thresholds
export const CRASH_POINT_THRESHOLDS = {
  LOW: 2,
  MEDIUM: 10,
  HIGH: 100,
} as const;

// Crash point colors
export const CRASH_POINT_COLORS = {
  VERY_LOW: 'text-gray-300',
  LOW: 'text-yellow-300',
  MEDIUM: 'text-blue-300',
  HIGH: 'text-purple-300',
} as const;

// Status colors
export const STATUS_COLORS = {
  DEFAULT: 'bg-gray-500/20 text-gray-400',
  WON: 'text-[var(--system-success-color)]',
  LOST: 'text-[var(--system-error-color)]',
  SUCCESS: 'text-[var(--system-success-color)]',
} as const;

// Rarity/Risk level colors
export const LEVEL_COLORS = {
  DEFAULT: 'bg-gray-500/20 text-[var(--second-text-color)]',
  LEGENDARY: 'bg-red-500/20 text-red-400',
  HIGH: 'bg-red-500/20 text-red-400',
  EPIC: 'bg-yellow-500/20 text-yellow-400',
  MEDIUM: 'bg-yellow-500/20 text-yellow-400',
  RARE: 'bg-blue-500/20 text-blue-400',
  COMMON: 'bg-green-500/20 text-green-400',
  LOW: 'bg-green-500/20 text-green-400',
} as const;

// Date format options
export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
} as const;

// Column order for crash game "My Bets"
export const CRASH_BETS_COLUMN_ORDER = [
  'createdAt',
  'amount',
  'cashoutMultiplier',
  'crashPoint',
  'winAmount',
  'status',
] as const;

export const PLINKO_COLUMN_ORDER = [
  'createdAt',
  'betAmount',
  'linesCount',
  'riskLevel',
  'avgMultiplier',
  'totalWin',
] as const;

// Table styling
export const TABLE_STYLES = {
  BORDER_COLOR: '#ADB5BD33',
  HEADER_BG: '#ADB5BD33',
  TEXT_SIZE: 'text-sm',
  HEADER_TEXT_COLOR: 'text-gray-300',
  CELL_TEXT_COLOR: 'text-white',
  CELL_PADDING: 'px-4 py-3',
  HEADER_PADDING: 'px-4 py-3',
  NO_DATA_TEXT_COLOR: 'text-gray-400',
  LOADING_TEXT_COLOR: 'text-gray-400',
  ERROR_TEXT_COLOR: 'text-red-400',
} as const;

// Field name mappings for display
export const FIELD_NAME_MAPPINGS: Record<string, string> = {
  amount: 'bet',
  createdAt: 'time',
} as const;

// Text styles
export const TEXT_STYLES = {
  TITLE_SIZE: 'text-[32px]',
  TITLE_WEIGHT: 'font-black',
  TITLE_COLOR: 'text-white',
  ID_FONT: 'font-mono',
  ID_SIZE: 'text-xs',
  ID_COLOR: 'text-gray-400',
  TAG_SIZE: 'text-xs',
  TAG_PADDING: 'px-2 py-1',
  TAG_BORDER_RADIUS: 'rounded',
  STATUS_TAG_SIZE: 'text-sm',
} as const;
