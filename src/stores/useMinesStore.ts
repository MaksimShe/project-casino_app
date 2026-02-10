import { create } from 'zustand';
import {
  MinesGameStatus,
  MinesCellState,
  type GridSize,
  type MinesActiveGameData,
} from '@/types/mines';

interface MinesModalData {
  amount: number;
  multiplier: number;
  tilesRevealed: number;
}

interface MinesStore {
  amount: number;
  minesCount: number;
  gridSize: GridSize;

  gameId: string | null;
  gameStatus: MinesGameStatus;
  cells: Map<number, MinesCellState>;
  multiplier: number;
  currentWinnings: number;
  revealedCells: number[];
  multipliers: number[];

  isStartingGame: boolean;
  isRevealingCell: boolean;
  isCashingOut: boolean;
  isLoadingActiveGame: boolean;

  showWinModal: boolean;
  showLoseModal: boolean;
  modalData: MinesModalData | null;

  setBetAmount: (amount: number) => void;
  setMineCount: (count: number) => void;
  setGridSize: (size: GridSize) => void;

  startNewGame: (
    gameId: string,
    gridSize: GridSize,
    multipliers: number[]
  ) => void;
  revealCell: (
    cellIndex: number,
    isMine: boolean,
    revealedTiles: number[],
    multiplier?: number,
    currentWinnings?: number,
    minesLocations?: number[]
  ) => void;
  endGame: (
    status: MinesGameStatus,
    finalData: {
      amount: number;
      multiplier: number;
      tilesRevealed: number;
    }
  ) => void;
  resetGame: () => void;
  restoreActiveGame: (gameData: MinesActiveGameData) => void;

  setIsStartingGame: (loading: boolean) => void;
  setIsRevealingCell: (loading: boolean) => void;
  setIsCashingOut: (loading: boolean) => void;
  setIsLoadingActiveGame: (loading: boolean) => void;

  setShowWinModal: (show: boolean) => void;
  setShowLoseModal: (show: boolean) => void;
  hideModals: () => void;

  // Computed values
  isDisabled: () => boolean;
}

export const useMinesStore = create<MinesStore>((set, get) => ({
  amount: 1,
  minesCount: 1,
  gridSize: 5,

  gameId: null,
  gameStatus: MinesGameStatus.IDLE,
  cells: new Map(),
  multiplier: 0,
  currentWinnings: 0,
  revealedCells: [],
  multipliers: [],

  isStartingGame: false,
  isRevealingCell: false,
  isCashingOut: false,
  isLoadingActiveGame: false,

  showWinModal: false,
  showLoseModal: false,
  modalData: null,

  setBetAmount: amount => set({ amount: amount }),
  setMineCount: count => set({ minesCount: count }),
  setGridSize: size =>
    set(state => ({
      gridSize: size,
      cells:
        state.gameStatus === MinesGameStatus.IDLE ? new Map() : state.cells,
    })),

  startNewGame: (gameId, gridSize, multipliers) =>
    set({
      gameId,
      gridSize,
      gameStatus: MinesGameStatus.ACTIVE,
      revealedCells: [],
      cells: new Map(),
      multiplier: 0,
      currentWinnings: 0,
      multipliers,
      isStartingGame: false,
    }),

  revealCell: (
    cellIndex,
    isMine,
    revealedTiles,
    multiplier,
    currentWinnings,
    minesLocations
  ) =>
    set(state => {
      const newCells = new Map(state.cells);

      if (isMine) {
        newCells.set(cellIndex, MinesCellState.MINE);

        if (minesLocations) {
          minesLocations.forEach(index => {
            if (index !== cellIndex) {
              newCells.set(index, MinesCellState.MINE);
            }
          });
        }

        return {
          cells: newCells,
          revealedCells: revealedTiles,
          gameStatus: MinesGameStatus.LOST,
          isRevealingCell: false,
        };
      } else {
        newCells.set(cellIndex, MinesCellState.SAFE);

        return {
          cells: newCells,
          revealedCells: revealedTiles,
          multiplier: multiplier !== undefined ? multiplier : state.multiplier,
          currentWinnings:
            currentWinnings !== undefined
              ? currentWinnings
              : state.currentWinnings,
          isRevealingCell: false,
        };
      }
    }),

  endGame: (status, finalData) =>
    set({
      gameStatus: status,
      modalData: finalData,
      showWinModal: status === MinesGameStatus.WON,
      showLoseModal: status === MinesGameStatus.LOST,
      isCashingOut: false,
    }),

  resetGame: () =>
    set({
      gameId: null,
      gameStatus: MinesGameStatus.IDLE,
      cells: new Map(),
      multiplier: 0,
      currentWinnings: 0,
      revealedCells: [],
      multipliers: [],
      isStartingGame: false,
      isRevealingCell: false,
      isCashingOut: false,
      showWinModal: false,
      showLoseModal: false,
      modalData: null,
    }),

  restoreActiveGame: gameData =>
    set({
      gameId: gameData._id,
      amount: gameData.betAmount,
      minesCount: gameData.minesCount,
      gridSize: gameData.gridSize as GridSize,
      gameStatus: MinesGameStatus.ACTIVE,
      revealedCells: gameData.revealedPositions || [],
      cells: new Map(
        (gameData.revealedPositions || []).map((index: number) => [
          index,
          MinesCellState.SAFE,
        ])
      ),
      multiplier: gameData.currentMultiplier || 0,
      currentWinnings: gameData.currentValue || 0,
      multipliers: gameData.multipliers || [],
      isLoadingActiveGame: false,
    }),

  setIsStartingGame: loading => set({ isStartingGame: loading }),
  setIsRevealingCell: loading => set({ isRevealingCell: loading }),
  setIsCashingOut: loading => set({ isCashingOut: loading }),
  setIsLoadingActiveGame: loading => set({ isLoadingActiveGame: loading }),

  setShowWinModal: show => set({ showWinModal: show }),
  setShowLoseModal: show => set({ showLoseModal: show }),
  hideModals: () =>
    set({
      showWinModal: false,
      showLoseModal: false,
      modalData: null,
    }),

  // Computed values
  isDisabled: () => {
    const state = get();
    return (
      (state.gameStatus !== MinesGameStatus.ACTIVE &&
        state.gameStatus !== MinesGameStatus.IDLE) ||
      state.isRevealingCell ||
      state.isStartingGame
    );
  },
}));
