'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  getGamesConfig,
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
import { useTranslation } from '@/i18n/useTranslation';
import { useAuthVerification } from '@/contexts/AuthVerificationContext';

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
  settingValues?: Record<string, string>;
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
  settingValues,
}: Props) {
  const { t, language } = useTranslation();
  const { isVerifying } = useAuthVerification();
  const gamesConfig = getGamesConfig(t);
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

  // Disable all config controls during verification or active game
  const isConfigDisabled = isVerifying || isGameActive;

  const isButtonDisabled = useMemo(() => {
    if (isVerifying) return true;
    if (buttonDisabled) return true;
    if (betAmount < PANEL_DEFAULTS.MIN_BET) return true;
    if (balance !== undefined) {
      if (balance < PANEL_DEFAULTS.MIN_BALANCE) return true;
      if (betAmount > balance) return true;
    }
    return false;
  }, [isVerifying, buttonDisabled, betAmount, balance]);

  if (!config) return null;

  const defaultPrimary: ButtonState = {
    label: config.buttons[0] || t.configPanel.placeBetButton,
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

  const panelTitle =
    language === 'ua'
      ? `${t.configPanel.titleEnd} ${config.title}`
      : `${config.title} ${t.configPanel.titleEnd}`;

  return (
    <div className="relative flex h-fit w-full max-w-[var(--panel-max-width)] flex-col gap-8 rounded-xl bg-[var(--panel-bg)] px-8 py-6">
      {/* Verification overlay - using pointer-events to prevent layout issues */}
      {isVerifying && (
        <div className="pointer-events-auto absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-[#1a1a2e]/80">
          <div className="flex items-center gap-2 text-white">
            <div className="relative h-5 w-5">
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#FFCD71]" />
            </div>
            <span className="text-sm">Verifying access...</span>
          </div>
        </div>
      )}

      <p className="text-center font-[var(--panel-title-weight)] text-[var(--panel-title-size)]">
        {panelTitle}
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
                disabled={isConfigDisabled}
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
              disabled={isConfigDisabled}
            />
          );
        })}
      </div>

      {config.gameSettings && (
        <GameSettings
          settings={config.gameSettings}
          onSettingChange={onSettingChange}
          disabled={isConfigDisabled}
          currentValues={settingValues}
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
