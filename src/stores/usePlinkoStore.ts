import { create } from 'zustand';
import type { PlinkoBall, PlinkoDrop } from '@/types/plinko';
import { PLINKO_ANIMATION } from '@/components/PlinkoGame/constants';

interface PlinkoStore {
  // Game config
  risk: 'low' | 'medium' | 'high';
  lines: 8 | 10 | 12 | 14 | 16;
  betAmount: number;

  // Animation state
  activeBalls: PlinkoBall[];
  isAnimating: boolean;
  isDropping: boolean;

  // Game session state
  isActiveGame: boolean; // True when balls are dropping/animating

  // Results
  lastDropResults: PlinkoDrop[] | null;
  totalWin: number;
  lastDropBet: number; // Store the bet amount for the last drop
  dropSessionId: string | null; // Unique ID for each drop to track notifications

  // Session stats (accumulates during active game)
  sessionTotalBet: number;
  sessionTotalWin: number;

  // Multipliers for current configuration
  multipliers: number[];

  // Collision events with timestamps (for visual feedback)
  pegCollisions: Map<string, number>;
  slotCollisions: Map<number, number>;

  // Actions - Config
  setRisk: (risk: 'low' | 'medium' | 'high') => void;
  setLines: (lines: 8 | 10 | 12 | 14 | 16) => void;
  setBetAmount: (amount: number) => void;

  // Actions - Animation
  addBall: (ball: PlinkoBall) => void;
  updateBall: (id: string, updates: Partial<PlinkoBall>) => void;
  removeBall: (id: string) => void;
  setIsAnimating: (isAnimating: boolean) => void;
  setIsDropping: (isDropping: boolean) => void;

  // Actions - Game session
  setIsActiveGame: (isActive: boolean) => void;
  addToSessionStats: (bet: number, win: number) => void;
  resetSessionStats: () => void;

  // Actions - Results
  setLastDropResults: (results: PlinkoDrop[] | null) => void;
  setTotalWin: (amount: number) => void;
  setLastDropBet: (amount: number) => void;
  setDropSessionId: (id: string | null) => void;

  // Actions - Multipliers
  setMultipliers: (multipliers: number[]) => void;

  // Actions - Collisions
  registerPegCollision: (pegId: string) => void;
  registerSlotCollision: (slotIndex: number) => void;
  cleanupOldCollisions: () => void;

  // Actions - Reset
  resetGame: () => void;
  resetAnimationState: () => void;
}

export const usePlinkoStore = create<PlinkoStore>(set => ({
  // Initial state
  risk: 'low',
  lines: 8,
  betAmount: 1,
  activeBalls: [],
  isAnimating: false,
  isDropping: false,
  isActiveGame: false,
  lastDropResults: null,
  totalWin: 0,
  lastDropBet: 0,
  dropSessionId: null,
  sessionTotalBet: 0,
  sessionTotalWin: 0,
  multipliers: [],
  pegCollisions: new Map(),
  slotCollisions: new Map(),

  // Config actions
  setRisk: risk => set({ risk }),
  setLines: lines => set({ lines }),
  setBetAmount: betAmount => set({ betAmount }),

  // Animation actions
  addBall: ball =>
    set(state => ({
      activeBalls: [...state.activeBalls, ball],
    })),

  updateBall: (id, updates) =>
    set(state => ({
      activeBalls: state.activeBalls.map(ball =>
        ball.id === id ? { ...ball, ...updates } : ball
      ),
    })),

  removeBall: id =>
    set(state => ({
      activeBalls: state.activeBalls.filter(ball => ball.id !== id),
    })),

  setIsAnimating: isAnimating => set({ isAnimating }),
  setIsDropping: isDropping => set({ isDropping }),

  // Game session actions
  setIsActiveGame: isActiveGame => set({ isActiveGame }),
  addToSessionStats: (bet, win) =>
    set(state => ({
      sessionTotalBet: state.sessionTotalBet + bet,
      sessionTotalWin: state.sessionTotalWin + win,
    })),
  resetSessionStats: () => set({ sessionTotalBet: 0, sessionTotalWin: 0 }),

  // Results actions
  setLastDropResults: results => set({ lastDropResults: results }),
  setTotalWin: totalWin => set({ totalWin }),
  setLastDropBet: lastDropBet => set({ lastDropBet }),
  setDropSessionId: dropSessionId => set({ dropSessionId }),

  // Multipliers actions
  setMultipliers: multipliers => set({ multipliers }),

  // Collision actions
  registerPegCollision: pegId =>
    set(state => {
      const newMap = new Map(state.pegCollisions);
      newMap.set(pegId, Date.now());
      return { pegCollisions: newMap };
    }),

  registerSlotCollision: slotIndex =>
    set(state => {
      const newMap = new Map(state.slotCollisions);
      newMap.set(slotIndex, Date.now());
      return { slotCollisions: newMap };
    }),

  cleanupOldCollisions: () =>
    set(state => {
      const now = Date.now();
      const maxAge = PLINKO_ANIMATION.COLLISION_MAX_AGE;

      // Check if any peg collisions need to be removed
      const pegIdsToRemove: string[] = [];
      for (const [pegId, timestamp] of state.pegCollisions) {
        if (now - timestamp > maxAge) {
          pegIdsToRemove.push(pegId);
        }
      }

      // Check if any slot collisions need to be removed
      const slotIndexesToRemove: number[] = [];
      for (const [slotIndex, timestamp] of state.slotCollisions) {
        if (now - timestamp > maxAge) {
          slotIndexesToRemove.push(slotIndex);
        }
      }

      // Only create new Maps if there are changes
      if (pegIdsToRemove.length === 0 && slotIndexesToRemove.length === 0) {
        return state; // No changes, return current state
      }

      const newPegCollisions =
        pegIdsToRemove.length > 0
          ? new Map(state.pegCollisions)
          : state.pegCollisions;
      const newSlotCollisions =
        slotIndexesToRemove.length > 0
          ? new Map(state.slotCollisions)
          : state.slotCollisions;

      // Remove old collisions
      pegIdsToRemove.forEach(pegId => newPegCollisions.delete(pegId));
      slotIndexesToRemove.forEach(slotIndex =>
        newSlotCollisions.delete(slotIndex)
      );

      return {
        pegCollisions: newPegCollisions,
        slotCollisions: newSlotCollisions,
      };
    }),

  // Reset actions
  resetGame: () =>
    set({
      activeBalls: [],
      isAnimating: false,
      isActiveGame: false,
      lastDropResults: null,
      totalWin: 0,
      lastDropBet: 0,
      dropSessionId: null,
      sessionTotalBet: 0,
      sessionTotalWin: 0,
      pegCollisions: new Map(),
      slotCollisions: new Map(),
    }),

  resetAnimationState: () =>
    set({
      activeBalls: [],
      isAnimating: false,
      pegCollisions: new Map(),
      slotCollisions: new Map(),
    }),
}));
