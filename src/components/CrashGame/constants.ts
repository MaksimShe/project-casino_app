// Rocket Position Constants
export const ROCKET_POSITION = {
  START: { x: 11, y: 87 } as { x: number; y: number }, // Bottom-left starting position
  CENTER: { x: 50, y: 50 } as { x: number; y: number }, // Center position during flight
};

// Animation Duration Constants
export const ANIMATION_DURATION = {
  LAUNCH: 1500, // Rocket launch animation
  CRASH_EXPLOSION: 1000, // Crash explosion display time
  RESPAWN: 500, // Respawn animation
  RESPAWN_TRANSITION: 500, // CSS transition duration for respawn
  POST_CRASH_FETCH_DELAY: 1500, // Delay before fetching new game after crash
} as const;

// Shake Intensity Thresholds
export const SHAKE_THRESHOLDS = {
  HEAVY: 1.4, // Multiplier threshold for heavy shake
  MEDIUM: 1.2, // Multiplier threshold for medium shake
} as const;

// Crash Point Color Thresholds for History
export const CRASH_POINT_COLOR_THRESHOLDS = {
  YELLOW: 2, // Below this: gray, above: yellow
  BLUE: 10, // Below this: yellow, above: blue
  PURPLE: 100, // Below this: blue, above: purple
} as const;

// WebSocket Configuration
export const WEBSOCKET_CONFIG = {
  RECONNECTION_ATTEMPTS: 10,
  RECONNECTION_DELAY: 1000,
  TIMEOUT: 20000,
} as const;

// UI Configuration
export const UI_CONFIG = {
  GAME_ID_DISPLAY_LENGTH: 8, // Number of characters to show from game ID
  HISTORY_DISPLAY_COUNT: 10, // Number of recent games to display
  COUNTDOWN_UPDATE_INTERVAL: 100, // Update countdown every 100ms
} as const;

// Game Logic Constants
export const GAME_CONSTANTS = {
  INITIAL_MULTIPLIER: 1.0,
  MULTIPLIER_ACTIVE_THRESHOLD: 1.0, // Show cashout when multiplier > this
} as const;
