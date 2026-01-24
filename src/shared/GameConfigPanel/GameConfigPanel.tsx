'use client';

import React, { useState, useCallback } from 'react';
import {
  gamesConfig,
  type GameConfig,
  PANEL_LAYOUT,
  PANEL_DEFAULTS,
  PANEL_COLORS,
  PANEL_TEXT,
} from '@/shared/GameConfigPanel/constants';
import { type GameType } from '@/components/Dashboard/GameSelector/constants';
import {
  BetInput,
  ActionButton,
  GameSettings,
  InfoDisplay,
  OptionInput,
  type ButtonState,
} from './components';
import { CONFIG_PANEL } from '@/constants/configPanel';

interface Props {
  game: GameType;
  isGameActive?: boolean;
  onBetChange?: (value: number) => void;
  onActionToggle?: (isSecondary: boolean) => void;
  onSettingChange?: (title: string, value: string) => void;
  primaryButton?: ButtonState;
  secondaryButton?: ButtonState;
  infoValues?: Record<string, string | number>;
  optionValues?: Record<string, string>;
  onOptionChange?: (name: string, value: string) => void;
  optionToggles?: Record<string, boolean>;
  onOptionToggleChange?: (name: string, enabled: boolean) => void;
  buttonDisabled?: boolean;
  betAmount?: number;
  balance?: number;
}

const GameConfigPanel = React.memo(function GameConfigPanel({
  game,
  isGameActive,
  onBetChange,
  onActionToggle,
  onSettingChange,
  primaryButton,
  secondaryButton,
  infoValues = {},
  optionValues: controlledOptionValues,
  onOptionChange,
  optionToggles,
  onOptionToggleChange,
  buttonDisabled,
  betAmount: controlledBetAmount,
  balance,
}: Props) {
  const config: GameConfig | undefined = gamesConfig[game];
  const [internalBetAmount, setInternalBetAmount] = useState<number>(
    PANEL_DEFAULTS.INITIAL_BET_AMOUNT
  );
  const [internalOptionValues, setInternalOptionValues] = useState<
    Record<string, string>
  >({});
  const betAmount = controlledBetAmount ?? internalBetAmount;
  const optionValues = controlledOptionValues ?? internalOptionValues;

  const handleBetChange = useCallback(
    (value: number) => {
      if (controlledBetAmount === undefined) {
        setInternalBetAmount(value);
      }
      onBetChange?.(value);
    },
    [onBetChange, controlledBetAmount]
  );

  const handleOptionChange = useCallback(
    (name: string, value: string) => {
      if (controlledOptionValues === undefined) {
        setInternalOptionValues(prev => ({ ...prev, [name]: value }));
      }
      onOptionChange?.(name, value);
    },
    [onOptionChange, controlledOptionValues]
  );

  const handleOptionToggleChange = useCallback(
    (name: string, enabled: boolean) => {
      onOptionToggleChange?.(name, enabled);
    },
    [onOptionToggleChange]
  );

  if (!config) return null;

  const defaultPrimary: ButtonState = {
    label: config.buttons[0] || 'Place bet',
  };

  const hasSecondButton = config.buttons.length > 1;
  const defaultSecondary: ButtonState | undefined = hasSecondButton
    ? { label: config.buttons[1] }
    : undefined;

  const infoItems = config.additionalInfos.map(label => ({
    label,
    value: infoValues[label],
  }));

  return (
    <div
      className={`flex h-fit w-full ${PANEL_LAYOUT.MAX_WIDTH} flex-col gap-8 rounded-xl px-8 py-6`}
      style={{ backgroundColor: PANEL_COLORS.BACKGROUND }}
    >
      <p
        className={`${PANEL_TEXT.TITLE_ALIGN} ${PANEL_TEXT.TITLE_SIZE} ${PANEL_TEXT.TITLE_WEIGHT}`}
        style={{ color: PANEL_COLORS.TEXT_TITLE }}
      >
        {config.title} Configuration
      </p>

      <div className="space-y-4">
        {config.inputs.map(input => {
          if (input.default) {
            return (
              <BetInput
                key={input.name}
                label={input.name}
                value={betAmount}
                onChange={handleBetChange}
                maxValue={CONFIG_PANEL.MAX_BET}
                balance={balance}
              />
            );
          }

          return (
            <OptionInput
              key={input.name}
              label={input.name}
              value={optionValues[input.name] || ''}
              onChange={value => handleOptionChange(input.name, value)}
              options={input.smallButtons}
              hasToggle={input.toggle}
              toggleEnabled={optionToggles?.[input.name]}
              onToggleChange={enabled =>
                handleOptionToggleChange(input.name, enabled)
              }
            />
          );
        })}
      </div>

      {config.gameSettings && (
        <GameSettings
          settings={config.gameSettings}
          onSettingChange={onSettingChange}
        />
      )}

      <ActionButton
        primaryState={primaryButton || defaultPrimary}
        secondaryState={secondaryButton || defaultSecondary}
        isSecondary={isGameActive}
        onToggle={onActionToggle}
        disabled={
          buttonDisabled ||
          betAmount < PANEL_DEFAULTS.MIN_BET ||
          (balance !== undefined &&
            (balance < PANEL_DEFAULTS.MIN_BALANCE || betAmount > balance))
        }
      />
      <InfoDisplay items={infoItems} />
    </div>
  );
});

export default GameConfigPanel;
