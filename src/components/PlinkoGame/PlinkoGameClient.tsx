'use client';

import { useCallback, useMemo, useEffect } from 'react';
import { usePlinkoStore } from '@/stores/usePlinkoStore';
import { usePlinkoGame } from '@/components/PlinkoGame/hooks';
import { PlinkoBoard } from '@/components/PlinkoGame';
import GameConfigPanel from '@/shared/GameConfigPanel/GameConfigPanel';
import { GameType } from '@/components/Dashboard/GameSelector/constants';
import {
  PLINKO_CONFIG,
  RISK_LEVEL,
  type RiskLevel,
} from '@/components/PlinkoGame/constants';
import { type ButtonState } from '@/shared/GameConfigPanel/components';
import { useTranslation } from '@/i18n/useTranslation';

interface PlinkoGameClientProps {
  initialMultipliers: number[] | null;
}

export default function PlinkoGameClient({
  initialMultipliers,
}: PlinkoGameClientProps) {
  const { t } = useTranslation();
  const {
    betAmount,
    risk,
    lines,
    isActiveGame,
    setBetAmount,
    setRisk,
    setLines,
    resetGame,
    setMultipliers,
  } = usePlinkoStore();

  const { handleDrop } = usePlinkoGame();

  useEffect(() => {
    if (initialMultipliers) {
      setMultipliers(initialMultipliers);
    }
  }, [initialMultipliers, setMultipliers]);

  const onSettingChange = useCallback(
    (title: string, value: string) => {
      if (isActiveGame) {
        return;
      }

      if (title === t.configPanel.risk) {
        let riskValue: RiskLevel;
        if (value === t.configPanel.riskLow) {
          riskValue = 'low';
        } else if (value === t.configPanel.riskMedium) {
          riskValue = 'medium';
        } else if (value === t.configPanel.riskHigh) {
          riskValue = 'high';
        } else {
          riskValue = value.toLowerCase() as RiskLevel;
        }
        setRisk(riskValue);
        resetGame();
      } else if (title === t.configPanel.rows) {
        const linesValue = parseInt(value, 10) as 8 | 10 | 12 | 14 | 16;
        setLines(linesValue);
        resetGame();
      }
    },
    [isActiveGame, setRisk, setLines, resetGame, t]
  );

  const onDrop = useCallback(async () => {
    await handleDrop();
  }, [handleDrop]);

  const primaryButton: ButtonState = useMemo(
    () => ({
      label: t.configPanel.dropButton,
      onClick: onDrop,
      clickCooldown: 400,
    }),
    [onDrop, t]
  );

  const settingValues = useMemo(() => {
    let riskDisplayValue: string;
    if (risk === RISK_LEVEL.LOW) {
      riskDisplayValue = t.configPanel.riskLow;
    } else if (risk === RISK_LEVEL.MEDIUM) {
      riskDisplayValue = t.configPanel.riskMedium;
    } else {
      riskDisplayValue = t.configPanel.riskHigh;
    }

    return {
      [t.configPanel.risk]: riskDisplayValue,
      [t.configPanel.rows]: lines.toString(),
    };
  }, [risk, lines, t]);

  return (
    <div className="flex justify-center gap-4 px-6 pt-4 max-lg:flex-col max-lg:items-center">
      <PlinkoBoard />

      <GameConfigPanel
        game={GameType.PLINKO}
        betAmount={betAmount}
        onBetChange={setBetAmount}
        onSettingChange={onSettingChange}
        primaryButton={primaryButton}
        maxBetCanBe={PLINKO_CONFIG.MAX_BET}
        isGameActive={isActiveGame}
        settingValues={settingValues}
      />
    </div>
  );
}
