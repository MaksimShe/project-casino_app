import { create } from 'zustand';
import type {
  CrashGameState,
  CrashBet,
  PlayerBet,
  MultiplierDataPoint,
} from '@/types/crash';

interface CrashStore {
  // Game state
  gameId: string | null;
  gameState: CrashGameState;
  multiplier: number;
  crashPoint: number | null;
  serverSeedHash: string | null;
  serverSeed: string | null;
  startsAt: number | null;

  // Multiplier history for chart
  multiplierHistory: MultiplierDataPoint[];
  gameStartTime: number | null;

  // User bet state
  myBet: CrashBet | null;
  betAmount: number;
  autoCashout: number | null;
  isAutoCashoutEnabled: boolean;

  // Players in current round
  players: PlayerBet[];

  // Loading states
  isPlacingBet: boolean;
  isCashingOut: boolean;

  // Modal state
  showWinModal: boolean;
  showLoseModal: boolean;
  modalWinAmount: number | null;
  modalMultiplier: number | null;
  modalBetAmount: number | null;
  modalCrashPoint: number | null;

  // Actions
  setGameState: (state: CrashGameState) => void;
  setMultiplier: (multiplier: number) => void;
  setCrashPoint: (crashPoint: number | null) => void;
  setStartsAt: (startsAt: number | null) => void;
  setGameId: (gameId: string | null) => void;
  setServerSeedHash: (hash: string | null) => void;
  setServerSeed: (seed: string | null) => void;
  setMyBet: (bet: CrashBet | null) => void;
  setBetAmount: (amount: number) => void;
  setAutoCashout: (value: number | null) => void;
  setIsAutoCashoutEnabled: (enabled: boolean) => void;
  setPlayers: (players: PlayerBet[]) => void;
  addPlayer: (player: PlayerBet) => void;
  updatePlayerCashout: (
    betId: string,
    multiplier: number,
    winAmount: number
  ) => void;
  setIsPlacingBet: (loading: boolean) => void;
  setIsCashingOut: (loading: boolean) => void;
  resetRound: () => void;
  setGameStartTime: (time: number | null) => void;
  addMultiplierDataPoint: (point: MultiplierDataPoint) => void;
  clearMultiplierHistory: () => void;
  showWinModalWithData: (
    winAmount: number,
    multiplier: number,
    betAmount: number
  ) => void;
  showLoseModalWithData: (betAmount: number, crashPoint: number) => void;
  hideModals: () => void;
}

const TIME_WINDOW = 30000; // 30 seconds
const MAX_DATA_POINTS = 60; // Limit to 60 points for performance

export const useCrashStore = create<CrashStore>(set => ({
  // Initial state
  gameId: null,
  gameState: 'waiting',
  multiplier: 1.0,
  crashPoint: null,
  serverSeedHash: null,
  serverSeed: null,
  startsAt: null,
  multiplierHistory: [],
  gameStartTime: null,
  myBet: null,
  betAmount: 1,
  autoCashout: 2,
  isAutoCashoutEnabled: false,
  players: [],
  isPlacingBet: false,
  isCashingOut: false,
  showWinModal: false,
  showLoseModal: false,
  modalWinAmount: null,
  modalMultiplier: null,
  modalBetAmount: null,
  modalCrashPoint: null,

  // Actions
  setGameState: state => set({ gameState: state }),
  setMultiplier: multiplier => set({ multiplier }),
  setCrashPoint: crashPoint => set({ crashPoint }),
  setStartsAt: startsAt => set({ startsAt }),
  setGameId: gameId => set({ gameId }),
  setServerSeedHash: hash => set({ serverSeedHash: hash }),
  setServerSeed: seed => set({ serverSeed: seed }),
  setMyBet: bet => set({ myBet: bet }),
  setBetAmount: amount => set({ betAmount: amount }),
  setAutoCashout: value => set({ autoCashout: value }),
  setIsAutoCashoutEnabled: enabled => set({ isAutoCashoutEnabled: enabled }),
  setPlayers: players => set({ players }),
  addPlayer: player => set(state => ({ players: [...state.players, player] })),
  updatePlayerCashout: (betId, multiplier, winAmount) =>
    set(state => ({
      players: state.players.map(p =>
        p.betId === betId
          ? { ...p, cashedOut: true, cashoutMultiplier: multiplier, winAmount }
          : p
      ),
    })),
  setIsPlacingBet: loading => set({ isPlacingBet: loading }),
  setIsCashingOut: loading => set({ isCashingOut: loading }),
  resetRound: () =>
    set({
      multiplier: 1.0,
      crashPoint: null,
      serverSeed: null,
      players: [],
      myBet: null,
    }),
  setGameStartTime: time => set({ gameStartTime: time }),
  addMultiplierDataPoint: point =>
    set(state => {
      const newHistory = [...state.multiplierHistory, point];

      // Trim old data points beyond time window
      const currentTime = point.time;
      const filtered = newHistory.filter(
        p => currentTime - p.time <= TIME_WINDOW
      );

      // Limit to max data points for performance
      const limited =
        filtered.length > MAX_DATA_POINTS
          ? filtered.slice(-MAX_DATA_POINTS)
          : filtered;

      return { multiplierHistory: limited };
    }),
  clearMultiplierHistory: () =>
    set({ multiplierHistory: [], gameStartTime: null }),
  showWinModalWithData: (winAmount, multiplier, betAmount) =>
    set({
      showWinModal: true,
      showLoseModal: false,
      modalWinAmount: winAmount,
      modalMultiplier: multiplier,
      modalBetAmount: betAmount,
    }),
  showLoseModalWithData: (betAmount, crashPoint) =>
    set({
      showWinModal: false,
      showLoseModal: true,
      modalBetAmount: betAmount,
      modalCrashPoint: crashPoint,
    }),
  hideModals: () =>
    set({
      showWinModal: false,
      showLoseModal: false,
      modalWinAmount: null,
      modalMultiplier: null,
      modalBetAmount: null,
      modalCrashPoint: null,
    }),
}));
