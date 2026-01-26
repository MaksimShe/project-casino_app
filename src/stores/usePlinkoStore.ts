import { create } from 'zustand';
import type { PlinkoBall, PlinkoDrop } from '@/types/plinko';

interface PlinkoStore {
  // Game config
  risk: 'low' | 'medium' | 'high';
  lines: 8 | 10 | 12 | 14 | 16;
  ballsCount: 1 | 2 | 5 | 10;
  betAmount: number;

  // Animation state
  activeBalls: PlinkoBall[];
  isAnimating: boolean;
  isDropping: boolean;

  // Results
  lastDropResults: PlinkoDrop[] | null;
  totalWin: number;

  // Multipliers for current configuration
  multipliers: number[];

  // Highlights (for visual feedback)
  highlightedPegs: Set<string>;
  highlightedSlots: Set<number>;

  // Actions - Config
  setRisk: (risk: 'low' | 'medium' | 'high') => void;
  setLines: (lines: 8 | 10 | 12 | 14 | 16) => void;
  setBallsCount: (count: 1 | 2 | 5 | 10) => void;
  setBetAmount: (amount: number) => void;

  // Actions - Animation
  addBall: (ball: PlinkoBall) => void;
  updateBall: (id: string, updates: Partial<PlinkoBall>) => void;
  removeBall: (id: string) => void;
  setIsAnimating: (isAnimating: boolean) => void;
  setIsDropping: (isDropping: boolean) => void;

  // Actions - Results
  setLastDropResults: (results: PlinkoDrop[] | null) => void;
  setTotalWin: (amount: number) => void;

  // Actions - Multipliers
  setMultipliers: (multipliers: number[]) => void;

  // Actions - Highlights
  highlightPeg: (pegId: string) => void;
  highlightSlot: (slotIndex: number) => void;
  clearPegHighlights: () => void;
  clearSlotHighlights: () => void;
  clearHighlights: () => void;

  // Actions - Reset
  resetGame: () => void;
  resetAnimationState: () => void;
}

export const usePlinkoStore = create<PlinkoStore>((set, get) => ({
  // Initial state
  risk: 'medium',
  lines: 16,
  ballsCount: 1,
  betAmount: 1,
  activeBalls: [],
  isAnimating: false,
  isDropping: false,
  lastDropResults: null,
  totalWin: 0,
  multipliers: [],
  highlightedPegs: new Set(),
  highlightedSlots: new Set(),

  // Config actions
  setRisk: risk => set({ risk }),
  setLines: lines => set({ lines }),
  setBallsCount: ballsCount => set({ ballsCount }),
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

  // Results actions
  setLastDropResults: results => set({ lastDropResults: results }),
  setTotalWin: totalWin => set({ totalWin }),

  // Multipliers actions
  setMultipliers: multipliers => set({ multipliers }),

  // Highlights actions
  highlightPeg: pegId =>
    set(state => {
      const newSet = new Set(state.highlightedPegs);
      newSet.add(pegId);
      return { highlightedPegs: newSet };
    }),

  highlightSlot: slotIndex =>
    set(state => {
      const newSet = new Set(state.highlightedSlots);
      newSet.add(slotIndex);
      return { highlightedSlots: newSet };
    }),

  clearPegHighlights: () => set({ highlightedPegs: new Set() }),
  clearSlotHighlights: () => set({ highlightedSlots: new Set() }),
  clearHighlights: () =>
    set({ highlightedPegs: new Set(), highlightedSlots: new Set() }),

  // Reset actions
  resetGame: () =>
    set({
      activeBalls: [],
      isAnimating: false,
      lastDropResults: null,
      totalWin: 0,
      highlightedPegs: new Set(),
      highlightedSlots: new Set(),
    }),

  resetAnimationState: () =>
    set({
      activeBalls: [],
      isAnimating: false,
      highlightedPegs: new Set(),
      highlightedSlots: new Set(),
    }),
}));
