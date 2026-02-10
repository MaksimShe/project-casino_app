import { GameType } from '@/components/Dashboard/GameSelector/constants';
import type { TranslationKeys } from '@/i18n/translations/en';

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
  additionalInfos?: string[];
}

// Default Values
export const PANEL_DEFAULTS = {
  INITIAL_BET_AMOUNT: 10,
  MIN_BET: 1,
  MIN_BALANCE: 1,
} as const;

export const getGamesConfig = (
  t: TranslationKeys
): Partial<Record<GameType, GameConfig>> => ({
  [GameType.CRASH]: {
    title: t.configPanel.crash,
    inputs: [
      {
        name: t.configPanel.betInput,
        default: true,
      },
      {
        name: t.configPanel.autoCashout,
        smallButtons: [],
        toggle: true,
      },
    ],
    buttons: [t.configPanel.placeBetButton, t.configPanel.cashoutButton],
    additionalInfos: [
      t.configPanel.currentMultiplier,
      t.configPanel.potentialWin,
    ],
  },

  [GameType.MINES]: {
    title: t.configPanel.mines,
    inputs: [
      {
        name: t.configPanel.betInput,
        default: true,
      },
      {
        name: t.configPanel.minesAmount,
        smallButtons: ['1', '3', '5', '10', '24'],
        toggle: false,
      },
    ],
    gameSettings: [
      {
        title: t.configPanel.gridSize,
        smallButtons: ['5x5', '6x6', '7x7', '8x8'],
      },
    ],
    buttons: [t.configPanel.placeBetButton, t.configPanel.cashoutButton],
    additionalInfos: [
      t.configPanel.currentMultiplier,
      t.configPanel.winAmount,
      t.configPanel.nextMultiplier,
    ],
  },

  [GameType.PLINKO]: {
    title: t.configPanel.plinko,
    inputs: [
      {
        name: t.configPanel.betInput,
        default: true,
      },
    ],
    gameSettings: [
      {
        title: t.configPanel.risk,
        smallButtons: [
          t.configPanel.riskLow,
          t.configPanel.riskMedium,
          t.configPanel.riskHigh,
        ],
      },
      {
        title: t.configPanel.rows,
        smallButtons: ['8', '10', '12', '14', '16'],
      },
    ],
    buttons: [t.configPanel.dropButton],
  },
});
