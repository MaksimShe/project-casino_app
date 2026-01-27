'use client';

import { useCallback, useMemo } from 'react';
import { usePlinkoStore } from '@/stores/usePlinkoStore';
import { usePlinkoGame } from '@/components/PlinkoGame/hooks';
import { PlinkoBoard } from '@/components/PlinkoGame';
import GameConfigPanel from '@/shared/GameConfigPanel/GameConfigPanel';
import { GameType } from '@/components/Dashboard/GameSelector/constants';
import { PLINKO_CONFIG } from '@/components/PlinkoGame/constants';
import { type ButtonState } from '@/shared/GameConfigPanel/components';

export default function PlinkoGamePage() {
  const {
    betAmount,
    isActiveGame,
    setBetAmount,
    setRisk,
    setLines,
    resetGame,
  } = usePlinkoStore();

  const { handleDrop } = usePlinkoGame();

  // Handle settings changes (Risk, Rows) - disabled during active game
  const onSettingChange = (title: string, value: string) => {
    // Don't allow changing settings during active game
    if (isActiveGame) {
      return;
    }

    if (title === 'Risk') {
      const riskValue = value.toLowerCase() as 'low' | 'medium' | 'high';
      setRisk(riskValue);
      resetGame();
    } else if (title === 'Rows') {
      const linesValue = parseInt(value, 10) as 8 | 10 | 12 | 14 | 16;
      setLines(linesValue);
      resetGame();
    }
  };
  // Memoize callback for drop action
  const onDrop = useCallback(async () => {
    await handleDrop();
  }, [handleDrop]);

  // Memoize primary button config
  const primaryButton: ButtonState = useMemo(
    () => ({
      label: 'Drop',
      onClick: onDrop,
      clickCooldown: 400,
    }),
    [onDrop]
  );
  return (
    <div className="flex justify-center gap-4 px-6 pt-4 max-lg:flex-col max-lg:items-center">
      {/* Plinko Board */}
      <PlinkoBoard />

      {/* Game Config Panel */}
      <GameConfigPanel
        game={GameType.PLINKO}
        betAmount={betAmount}
        onBetChange={setBetAmount}
        onSettingChange={onSettingChange}
        primaryButton={primaryButton}
        maxBetCanBe={PLINKO_CONFIG.MAX_BET}
        isGameActive={isActiveGame}
      />
    </div>
  );
}
