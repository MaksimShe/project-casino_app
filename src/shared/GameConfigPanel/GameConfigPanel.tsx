'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  gamesConfig,
  type GameConfig,
  PANEL_DEFAULTS,
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
  maxBetCanBe?: number;
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
  buttonDisabled = false,
  betAmount: controlledBetAmount,
  balance,
  maxBetCanBe = CONFIG_PANEL.MAX_BET,
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

  const handleBetChange = (value: number) => {
    if (controlledBetAmount === undefined) {
      setInternalBetAmount(value);
    }
    onBetChange?.(value);
  };

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

  const isButtonDisabled = useMemo(() => {
    if (buttonDisabled) return true;
    if (betAmount < PANEL_DEFAULTS.MIN_BET) return true;
    if (balance !== undefined) {
      if (balance < PANEL_DEFAULTS.MIN_BALANCE) return true;
      if (betAmount > balance) return true;
    }
    return false;
  }, [buttonDisabled, betAmount, balance]);

  if (!config) return null;

  const defaultPrimary: ButtonState = {
    label: config.buttons[0] || 'Place bet',
  };

  const hasSecondButton = config.buttons.length > 1;
  const defaultSecondary: ButtonState | undefined = hasSecondButton
    ? { label: config.buttons[1] }
    : undefined;
  const infoItems =
    config.additionalInfos?.map(label => ({
      label,
      value: infoValues[label],
    })) ?? [];

  return (
    <div className="flex h-fit w-full max-w-[var(--panel-max-width)] flex-col gap-8 rounded-xl bg-[var(--panel-bg)] px-8 py-6">
      <p className="text-center font-[var(--panel-title-weight)] text-[var(--panel-title-size)]">
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
                maxValue={maxBetCanBe}
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
              disabled={isGameActive}
            />
          );
        })}
      </div>

      {config.gameSettings && (
        <GameSettings
          settings={config.gameSettings}
          onSettingChange={onSettingChange}
          disabled={isGameActive}
        />
      )}

      <ActionButton
        primaryState={primaryButton || defaultPrimary}
        secondaryState={secondaryButton || defaultSecondary}
        isSecondary={isGameActive}
        onToggle={onActionToggle}
        disabled={isButtonDisabled}
      />
      <InfoDisplay items={infoItems} />
    </div>
  );
});

export default GameConfigPanel;
