import { GameType } from '@/components/Dashboard/GameSelector/constants';

export interface InputConfig {
  name: string;
  default?: boolean;
  smallButtons?: string[];
  toggle?: boolean;
}

export interface GameSettingConfig {
  title: string;
  smallButtons: string[];
}

export interface GameConfig {
  title: string;
  inputs: InputConfig[];
  gameSettings?: GameSettingConfig[];
  buttons: string[];
  additionalInfos: string[];
}

// UI Layout Constants
export const PANEL_LAYOUT = {
  MAX_WIDTH: 'max-w-sm',
  PADDING_X: 8,
  PADDING_Y: 6,
  GAP: 8,
  INPUTS_SPACING: 4,
} as const;

// Default Values
export const PANEL_DEFAULTS = {
  INITIAL_BET_AMOUNT: 10,
  MIN_BET: 1,
  MIN_BALANCE: 1,
} as const;

// Colors
export const PANEL_COLORS = {
  BACKGROUND: '#423E6980',
  TEXT_PRIMARY: 'white',
  TEXT_TITLE: 'white',
} as const;

// Text Styles
export const PANEL_TEXT = {
  TITLE_SIZE: 'text-3xl',
  TITLE_WEIGHT: 'font-semibold',
  TITLE_ALIGN: 'text-center',
} as const;

export const gamesConfig: Partial<Record<GameType, GameConfig>> = {
  [GameType.CRASH]: {
    title: 'Crash',
    inputs: [
      {
        name: 'Bet Amount',
        default: true,
      },
      {
        name: 'Auto Cashout (optional)',
        smallButtons: [],
        toggle: true,
      },
    ],
    buttons: ['Place bet', 'Cashout'],
    additionalInfos: ['Current multiplayer:', 'Potential win:'],
  },

  [GameType.MINES]: {
    title: 'Mines',
    inputs: [
      {
        name: 'Bet Amount',
        default: true,
      },
      {
        name: 'Mines Amount',
        smallButtons: ['1', '3', '5', '10', '24'],
        toggle: false,
      },
    ],
    gameSettings: [
      {
        title: 'Grid size:',
        smallButtons: ['5x5', '6x6', '7x7', '8x8'],
      },
    ],
    buttons: ['Place bet', 'Cashout'],
    additionalInfos: ['Current multiplayer:', 'Win amount:'],
  },

  [GameType.PLINKO]: {
    title: 'Plinko',
    inputs: [
      {
        name: 'Bet Amount',
        default: true,
      },
    ],
    gameSettings: [
      {
        title: 'Risk',
        smallButtons: ['Low', 'Medium', 'High', 'Extreme'],
      },
      {
        title: 'Rows',
        smallButtons: ['8', '10', '12', '14', '16'],
      },
    ],
    buttons: ['Place bet'],
    additionalInfos: [],
  },
};
