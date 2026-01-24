export const GAME_DISPLAY_LAYOUT = {
  CONTAINER_HEIGHT: 550,
  CONTAINER_HEIGHT_MOBILE: 350,
  GAME_AREA_HEIGHT: 500,
  GAME_AREA_HEIGHT_MOBILE: 300,
  GAME_AREA_PADDING_LEFT: 16, // pl-16 = 4rem = 64px, but using value for reference
  GAME_AREA_MARGIN_BOTTOM: 16,
} as const;

export const GAME_DISPLAY_COLORS = {
  BACKGROUND: '#1a1625',
  SHADOW_GLOW: 'rgba(227, 61, 148, 0.6)',
  CRASHED_OVERLAY: 'black/50',
  CRASHED_TEXT: 'text-red-400',
} as const;

export const GAME_DISPLAY_POSITIONING = {
  MULTIPLIER: {
    TOP: 'top-3/12',
    RIGHT: 'right-1/2',
    TRANSFORM: 'translate-x-1/2',
  },
  CRASHED_MESSAGE: {
    Z_INDEX: 30,
  },
} as const;

export const GAME_DISPLAY_TEXT = {
  CRASHED_MESSAGE_SIZE: 'text-4xl',
  CRASHED_MESSAGE_WEIGHT: 'font-bold',
} as const;
