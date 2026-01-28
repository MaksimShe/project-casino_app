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

// Risk level constants
export const RISK_LEVEL = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export type RiskLevel = (typeof RISK_LEVEL)[keyof typeof RISK_LEVEL];

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
  FRAME_DURATION_SECONDS: 0.036, // ~30fps for framer-motion
  BALL_SPAWN_DELAY: 300, // ms between ball spawns
  COLLISION_ANIMATION_DURATION: 100, // ms - peg/slot highlight animation duration
  COLLISION_CLEANUP_INTERVAL: 100, // ms - how often to cleanup old collisions
  COLLISION_MAX_AGE: 500, // ms - max time to keep collision timestamps in store
  BALL_REMOVAL_DELAY: 500, // ms - delay before removing completed ball
  HISTORY_UPDATE_DELAY: 8000, // ms - delay before updating game history
} as const;

// Physics tuning for ball movement and collisions
export const PLINKO_PHYSICS_TUNING = {
  // Jump/Bounce effects
  JUMP_DECAY_RATE: 0.92,
  JUMP_OFFSET_THRESHOLD: 0.1,
  BOUNCE_STRENGTH_DESKTOP: 12,
  BOUNCE_STRENGTH_MOBILE: 8,
  BOUNCE_UPWARD_BIAS: 0.8,
  COLLISION_PAUSE_MS: 50,
  COLLISION_SPEED_BOOST: 1.18,
  MAX_SPEED: 8,

  // Movement physics
  PATH_POINT_THRESHOLD: 5,
  SPEED_DAMPING: 0.98,
  MIN_SPEED: 2,
  INITIAL_BALL_SPEED: 5.5,

  // Collision detection
  COLLISION_COOLDOWN_MS: 100,
} as const;

// Board structure constants
export const PLINKO_BOARD_STRUCTURE = {
  INITIAL_PEGS_COUNT: 3, // Starting number of pegs in first row
  START_COLUMN_INDEX: 1, // Middle column of first row
  ROW_OFFSET: 1, // Offset for row position calculation
  SLOT_Y_OFFSET: 20, // Y offset for slot position from padding bottom
} as const;
