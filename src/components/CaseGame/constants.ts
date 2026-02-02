// Rarity types and values
export const RARITIES = [
  'Common',
  'Uncommon',
  'Rare',
  'Epic',
  'Legendary',
  'Gold',
] as const;
export type Rarity = (typeof RARITIES)[number];

// View state enum
export enum CaseViewState {
  SELECTION = 'selection',
  OPENING = 'opening',
  RESULT = 'result',
}

// Animation timing
export const CASE_ANIMATION = {
  // Opening animation phases
  FAST_SCROLL_DURATION: 2000, // ms
  MEDIUM_SCROLL_DURATION: 2000, // ms
  SLOW_SCROLL_DURATION: 2500, // ms
  SETTLE_DURATION: 500, // ms
  TOTAL_DURATION: 7000, // ms - total animation

  // Case scaling
  CASE_SCALE_DELAY: 200, // ms - delay before case scales
  CASE_SCALE_DURATION: 600, // ms - case scale animation
  CASE_SCALE_SIZE: 1.3, // scale factor

  // Result
  RESULT_DELAY: 800, // ms - delay before showing modal
  WINNING_ITEM_SCALE_DURATION: 800, // ms
} as const;

// Visual layout
export const CASE_VISUAL = {
  CASE_X_POSITION: '50%',
  CASE_Y_POSITION: '30%',

  // Scrolling strip
  ITEM_SLOT_WIDTH: 160, // px
  ITEM_SLOT_HEIGHT: 192, // px
  ITEM_SLOT_GAP: 20, // px
  STRIP_Y_OFFSET: -180, // px above case
  IMAGE_PADDING: 24,
  IMAGE_ASPECT_RATIO: 9.6,

  // Animation items
  TOTAL_ITEMS_COUNT: 60, // items in strip
  WINNING_ITEM_INDEX: 52, // where win lands
  VISIBLE_ITEMS: 7, // visible at once

  // Winning item display
  WINNING_ITEM_SCALE: 1.2,
  WINNING_EMOJI_SIZE: '16rem', // text-8xl
} as const;

// Config
export const CASE_CONFIG = {
  MIN_PRICE: 1,
  MAX_PRICE: 10000,
} as const;
