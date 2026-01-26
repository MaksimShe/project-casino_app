// Physics constants ported from old project
export const PLINKO_PHYSICS = {
  GRAVITY: 0.5,
  BOUNCE_DAMPING: 0.57,
  FRICTION: 0.95,
  PEG_RADIUS: 6,
  BALL_RADIUS: 8,
  SPAWNER_PEG_RADIUS: 10,
  SPAWNER_GAP: 60,
  COUNTER_START_PEGS: 3,
} as const;

// Game configuration options
export const PLINKO_CONFIG = {
  RISK_LEVELS: ['low', 'medium', 'high'] as const,
  LINES: [8, 10, 12, 14, 16] as const,
  BALL_OPTIONS: [1, 2, 5, 10] as const,
  MIN_BET: 0.1,
  MAX_BET: 100,
} as const;

// Board dimensions and spacing
export const PLINKO_BOARD = {
  WIDTH: 800,
  BASE_HEIGHT: 400,
  ROW_SPACING: 30,
  COL_SPACING: 35,
  SLOT_WIDTH: 40,
  SLOT_HEIGHT: 20,
  PADDING_TOP: 20,
  PADDING_BOTTOM: 60,
} as const;

// Animation settings
export const PLINKO_ANIMATION = {
  FPS: 30,
  FRAME_DURATION: 1000 / 30, // ~33ms
  BALL_SPAWN_DELAY: 300, // ms between ball spawns
  PEG_HIGHLIGHT_DURATION: 300, // ms
  SLOT_HIGHLIGHT_DURATION: 1000, // ms
} as const;
