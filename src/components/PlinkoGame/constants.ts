// Physics constants ported from old project
export const PLINKO_PHYSICS = {
  GRAVITY: 0.5,
  BOUNCE_DAMPING: 0.57,
  FRICTION: 0.95,
  PEG_RADIUS: 8,
  BALL_RADIUS: 8,
  SPAWNER_GAP: 60,
  COUNTER_START_PEGS: 3,
} as const;

export const PLINKO_PHYSICS_MOBILE = {
  ...PLINKO_PHYSICS,
  PEG_RADIUS: 3.2,
  BALL_RADIUS: 3.2,
  SPAWNER_GAP: 30,
} as const;

// Game configuration options
export const PLINKO_CONFIG = {
  RISK_LEVELS: ['low', 'medium', 'high'] as const,
  LINES: [8, 10, 12, 14, 16] as const,
  BALL_OPTIONS: [1, 2, 5, 10] as const,
  MIN_BET: 1,
  MAX_BET: 100,
} as const;

// Board dimensions and spacing
export const PLINKO_BOARD = {
  WIDTH: 830,
  BASE_HEIGHT: 400,
  ROW_SPACING: 40,
  COL_SPACING: 43,
  SLOT_WIDTH: 40,
  SLOT_HEIGHT: 20,
  PADDING_TOP: 20,
  PADDING_BOTTOM: 80,
} as const;

// Mobile board dimensions (< 768px)
export const PLINKO_BOARD_MOBILE = {
  WIDTH: 380,
  BASE_HEIGHT: 400,
  ROW_SPACING: 20,
  COL_SPACING: 21,
  SLOT_WIDTH: 20,
  SLOT_HEIGHT: 10,
  PADDING_TOP: 10,
  PADDING_BOTTOM: 40,
} as const;

// Animation settings
export const PLINKO_ANIMATION = {
  FPS: 30,
  FRAME_DURATION: 1000 / 30, // ~33ms
  BALL_SPAWN_DELAY: 300, // ms between ball spawns
  COLLISION_ANIMATION_DURATION: 100, // ms - peg/slot highlight animation duration
  COLLISION_CLEANUP_INTERVAL: 100, // ms - how often to cleanup old collisions
  COLLISION_MAX_AGE: 500, // ms - max time to keep collision timestamps in store
} as const;
