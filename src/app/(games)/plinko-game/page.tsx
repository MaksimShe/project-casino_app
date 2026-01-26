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
    ballsCount,
    risk,
    lines,
    isDropping,
    isAnimating,
    totalWin,
    multipliers,
    setBetAmount,
    setRisk,
    setLines,
    setBallsCount,
  } = usePlinkoStore();

  const { handleDrop } = usePlinkoGame();

  // Handle settings changes (Risk, Rows, and Balls)
  const onSettingChange = useCallback(
    (title: string, value: string) => {
      if (title === 'Risk') {
        const riskValue = value.toLowerCase() as 'low' | 'medium' | 'high';
        setRisk(riskValue);
      } else if (title === 'Rows') {
        const linesValue = parseInt(value, 10) as 8 | 10 | 12 | 14 | 16;
        setLines(linesValue);
      } else if (title === 'Balls') {
        const ballsValue = parseInt(value, 10) as 1 | 2 | 5 | 10;
        setBallsCount(ballsValue);
      }
    },
    [setRisk, setLines, setBallsCount]
  );

  // Memoize callback for drop action
  const onDrop = useCallback(async () => {
    if (isDropping || isAnimating) return;
    await handleDrop();
  }, [isDropping, isAnimating, handleDrop]);

  // Calculate total bet and potential win
  const totalBet = useMemo(
    () => betAmount * ballsCount,
    [betAmount, ballsCount]
  );

  const potentialWin = useMemo(() => {
    if (multipliers.length === 0) return 0;
    // Use maximum multiplier for potential win display
    const maxMultiplier = Math.max(...multipliers);
    return betAmount * maxMultiplier;
  }, [betAmount, multipliers]);

  // Memoize primary button config
  const primaryButton = useMemo(
    () => ({
      label: isDropping ? 'Dropping...' : 'Drop',
      onClick: onDrop,
    }),
    [isDropping, onDrop]
  );

  // Memoize info values
  const infoValues = useMemo(
    () => ({
      'Total Bet:': `$${totalBet.toFixed(2)}`,
      'Potential Win:':
        potentialWin > 0 ? `$${potentialWin.toFixed(2)}` : '-',
    }),
    [totalBet, potentialWin]
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
        buttonDisabled={isDropping || isAnimating}
        infoValues={infoValues}
      />
    </div>
  );
}
