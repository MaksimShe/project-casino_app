'use client';

import { useCallback, useMemo } from 'react';
import { usePlinkoStore } from '@/stores/usePlinkoStore';
import { usePlinkoGame } from '@/components/PlinkoGame/hooks';
import { PlinkoBoard } from '@/components/PlinkoGame';
import GameConfigPanel from '@/shared/GameConfigPanel/GameConfigPanel';
import { GameType } from '@/components/Dashboard/GameSelector/constants';

export default function PlinkoGamePage() {
  const {
    betAmount,
    isDropping,
    isAnimating,
    setBetAmount,
    setRisk,
    setLines,
  } = usePlinkoStore();

  const { handleDrop } = usePlinkoGame();

  // Handle settings changes (Risk, Rows)
  const onSettingChange = useCallback(
    (title: string, value: string) => {
      if (title === 'Risk') {
        const riskValue = value.toLowerCase() as 'low' | 'medium' | 'high';
        setRisk(riskValue);
      } else if (title === 'Rows') {
        const linesValue = parseInt(value, 10) as 8 | 10 | 12 | 14 | 16;
        setLines(linesValue);
      }
    },
    [setRisk, setLines]
  );

  // Memoize callback for drop action
  const onDrop = useCallback(async () => {
    await handleDrop();
  }, [handleDrop]);

  // Memoize primary button config
  const primaryButton = useMemo(
    () => ({
      label: isDropping ? 'Dropping...' : 'Drop',
      onClick: onDrop,
    }),
    [isDropping, onDrop]
  );
  return (
    <div className="flex gap-4 px-6 pt-4 max-lg:flex-col max-lg:items-center">
      {/* Plinko Board */}
      <PlinkoBoard />

      {/* Game Config Panel */}
      <GameConfigPanel
        game={GameType.PLINKO}
        betAmount={betAmount}
        onBetChange={setBetAmount}
        onSettingChange={onSettingChange}
        primaryButton={primaryButton}
      />
    </div>
  );
}
