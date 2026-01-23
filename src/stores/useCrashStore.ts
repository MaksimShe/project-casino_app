import { create } from 'zustand';
import type { CrashGameState, CrashBet, PlayerBet } from '@/types/crash';

interface CrashStore {
  // Game state
  gameId: string | null;
  gameState: CrashGameState;
  multiplier: number;
  crashPoint: number | null;
  serverSeedHash: string | null;
  serverSeed: string | null;
  startsAt: number | null;

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
}

export const useCrashStore = create<CrashStore>(set => ({
  // Initial state
  gameId: null,
  gameState: 'waiting',
  multiplier: 1.0,
  crashPoint: null,
  serverSeedHash: null,
  serverSeed: null,
  startsAt: null,
  myBet: null,
  betAmount: 1,
  autoCashout: 2,
  isAutoCashoutEnabled: false,
  players: [],
  isPlacingBet: false,
  isCashingOut: false,

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
}));
