'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { useMinesStore } from '@/stores/useMinesStore';
import { minesService } from '@/services/MinesService.class';
import { MinesBoard } from './MinesBoard';
import GameConfigPanel from '@/shared/GameConfigPanel/GameConfigPanel';
import { GameType } from '@/components/Dashboard/GameSelector/constants';
import { type ButtonState } from '@/shared/GameConfigPanel/components';
import {
  MinesGameStatus,
  MinesErrorMessage,
  GRID_SIZE_DISPLAY_MAP,
  type MinesActiveGameResponse,
} from '@/types/mines';
import { useQueryClient } from '@tanstack/react-query';
import { formatNumber } from '@/utils/format';
import { handleMinesError, updateUserBalance } from '@/utils/minesUtils';
import { MINES_IMAGES } from '@/components/MinesGame/constants';

interface MinesGameClientProps {
  activeGameData: MinesActiveGameResponse | null;
}

export function MinesGameClient({ activeGameData }: MinesGameClientProps) {
  const {
    amount,
    minesCount,
    gridSize,
    gameId,
    gameStatus,
    multiplier,
    currentWinnings,
    revealedCells,
    multipliers,
    isCashingOut,
    showWinModal,
    showLoseModal,
    setBetAmount,
    setMineCount,
    setGridSize,
    startNewGame,
    revealCell,
    endGame,
    resetGame,
    restoreActiveGame,
    setIsStartingGame,
    setIsRevealingCell,
    setIsCashingOut,
    hideModals,
  } = useMinesStore();

  const queryClient = useQueryClient();

  // Restore active game on mount
  useEffect(() => {
    if (activeGameData?.game) {
      restoreActiveGame(activeGameData.game);
    }
  }, [activeGameData, restoreActiveGame]);

  // Preload images for better performance
  useEffect(() => {
    const images = [MINES_IMAGES.COIN, MINES_IMAGES.BOMB];

    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Handle starting a new game
  const handleStartGame = useCallback(async () => {
    try {
      setIsStartingGame(true);

      const response = await minesService.startGame({
        amount: amount,
        minesCount,
        gridSize,
      });

      startNewGame(response.gameId, response.gridSize, response.multipliers);

      updateUserBalance(queryClient);
    } catch (error) {
      handleMinesError(error, MinesErrorMessage.START_GAME);
      setIsStartingGame(false);
    }
  }, [
    amount,
    minesCount,
    gridSize,
    startNewGame,
    setIsStartingGame,
    queryClient,
  ]);

  // Handle revealing a cell
  const handleRevealCell = useCallback(
    async (position: number) => {
      // If game is idle, start the game first
      if (gameStatus === MinesGameStatus.IDLE) {
        try {
          setIsStartingGame(true);

          const startResponse = await minesService.startGame({
            amount: amount,
            minesCount,
            gridSize,
          });

          startNewGame(
            startResponse.gameId,
            startResponse.gridSize,
            startResponse.multipliers
          );

          updateUserBalance(queryClient);

          // Now reveal the cell
          setIsRevealingCell(true);
          const response = await minesService.revealCell({
            gameId: startResponse.gameId,
            position,
          });

          revealCell(
            response.position,
            response.isMine,
            response.revealedTiles || [],
            response.currentMultiplier,
            response.currentValue,
            undefined
          );

          // If hit a mine, show lose modal
          if (response.isMine) {
            endGame(MinesGameStatus.LOST, {
              amount: amount,
              multiplier: 0,
              tilesRevealed: (response.revealedTiles || []).length,
            });
          }

          updateUserBalance(queryClient);
        } catch (error) {
          handleMinesError(error, MinesErrorMessage.START_GAME);
          setIsStartingGame(false);
          setIsRevealingCell(false);
        }
        return;
      }

      if (!gameId || gameStatus !== MinesGameStatus.ACTIVE) return;

      try {
        setIsRevealingCell(true);

        const response = await minesService.revealCell({
          gameId,
          position,
        });

        revealCell(
          response.position,
          response.isMine,
          response.revealedTiles || [],
          response.currentMultiplier,
          response.currentValue,
          undefined
        );

        // If hit a mine, show lose modal
        if (response.isMine) {
          endGame(MinesGameStatus.LOST, {
            amount: amount,
            multiplier: 0,
            tilesRevealed: (response.revealedTiles || []).length,
          });
        }

        updateUserBalance(queryClient);
      } catch (error) {
        handleMinesError(error, MinesErrorMessage.REVEAL_CELL);
        setIsRevealingCell(false);
      }
    },
    [
      gameId,
      gameStatus,
      amount,
      minesCount,
      gridSize,
      revealCell,
      endGame,
      startNewGame,
      setIsStartingGame,
      setIsRevealingCell,
      queryClient,
    ]
  );

  const handleCashout = useCallback(async () => {
    if (!gameId || gameStatus !== MinesGameStatus.ACTIVE) return;

    try {
      setIsCashingOut(true);

      const response = await minesService.cashout({ gameId });

      endGame(MinesGameStatus.WON, {
        amount: response.winAmount,
        multiplier: response.multiplier,
        tilesRevealed: revealedCells.length,
      });

      updateUserBalance(queryClient);
    } catch (error) {
      handleMinesError(error, MinesErrorMessage.CASHOUT);
      setIsCashingOut(false);
    }
  }, [
    gameId,
    gameStatus,
    revealedCells,
    endGame,
    setIsCashingOut,
    queryClient,
  ]);

  const handleNewGame = useCallback(() => {
    hideModals();
    resetGame();
  }, [hideModals, resetGame]);

  const onOptionChange = useCallback(
    (name: string, value: string) => {
      if (gameStatus === MinesGameStatus.ACTIVE) {
        return;
      }

      if (name === 'Mines Amount') {
        const count = parseInt(value, 10);
        setMineCount(count);
      }
    },
    [gameStatus, setMineCount]
  );

  const onSettingChange = useCallback(
    (title: string, value: string) => {
      if (gameStatus === MinesGameStatus.ACTIVE) {
        return;
      }

      if (title === 'Grid size:') {
        const size = GRID_SIZE_DISPLAY_MAP[value];
        if (size) {
          setGridSize(size);
        }
      }
    },
    [gameStatus, setGridSize]
  );

  const primaryButton: ButtonState = useMemo(
    () => ({
      label: 'Place Bet',
      onClick: handleStartGame,
    }),
    [handleStartGame]
  );

  const secondaryButton: ButtonState = useMemo(
    () => ({
      label: 'Cashout',
      onClick: handleCashout,
      disabled: isCashingOut,
    }),
    [handleCashout, isCashingOut]
  );

  const infoValues = useMemo(() => {
    const nextMultiplier =
      multipliers.length > 0 && revealedCells.length < multipliers.length
        ? multipliers[revealedCells.length]
        : null;

    return {
      'Current multiplayer:': formatNumber(multiplier) + 'x',
      'Win amount:': '$' + formatNumber(currentWinnings),
      ...(nextMultiplier !== null && {
        'Next multiplier:': formatNumber(nextMultiplier) + 'x',
      }),
    };
  }, [multiplier, currentWinnings, multipliers, revealedCells]);

  const optionValues = useMemo(() => {
    return {
      'Mines Amount': minesCount.toString(),
    };
  }, [minesCount]);

  const settingValues = useMemo(() => {
    return {
      'Grid size:': `${gridSize}x${gridSize}`,
    };
  }, [gridSize]);

  return (
    <div className="flex items-start justify-center gap-4 px-6 pt-4 max-lg:flex-col max-lg:items-center">
      <MinesBoard onCellClick={handleRevealCell} onNewGame={handleNewGame} />

      <GameConfigPanel
        game={GameType.MINES}
        betAmount={amount}
        onBetChange={setBetAmount}
        onOptionChange={onOptionChange}
        onSettingChange={onSettingChange}
        primaryButton={primaryButton}
        secondaryButton={secondaryButton}
        maxBetCanBe={10000}
        isGameActive={gameStatus === MinesGameStatus.ACTIVE}
        buttonDisabled={showWinModal || showLoseModal}
        infoValues={infoValues}
        optionValues={optionValues}
        settingValues={settingValues}
      />
    </div>
  );
}
