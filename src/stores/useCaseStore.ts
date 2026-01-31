import { create } from 'zustand';
import type { Case, OpeningResult, AnimationItem } from '@/types/case';

interface CaseStore {
  // Available cases
  availableCases: Case[] | null;
  selectedCase: Case | null;

  // UI state
  viewState: 'selection' | 'opening' | 'result';

  // Opening state
  isOpening: boolean;
  openingResult: OpeningResult | null;

  // Animation state
  animationItems: AnimationItem[];
  animationProgress: number; // 0-1
  isAnimating: boolean;
  skipAnimation: boolean;

  // Session stats
  sessionOpenings: number;
  sessionSpent: number;
  sessionWon: number;

  // Actions
  setAvailableCases: (cases: Case[]) => void;
  setSelectedCase: (caseItem: Case | null) => void;
  setViewState: (state: 'selection' | 'opening' | 'result') => void;
  setIsOpening: (isOpening: boolean) => void;
  setOpeningResult: (result: OpeningResult | null) => void;
  setAnimationItems: (items: AnimationItem[]) => void;
  setAnimationProgress: (progress: number) => void;
  setIsAnimating: (isAnimating: boolean) => void;
  setSkipAnimation: (skip: boolean) => void;
  addToSessionStats: (spent: number, won: number) => void;
  resetSessionStats: () => void;
  resetGame: () => void;
}

export const useCaseStore = create<CaseStore>(set => ({
  // Initial state
  availableCases: null,
  selectedCase: null,
  viewState: 'selection',
  isOpening: false,
  openingResult: null,
  animationItems: [],
  animationProgress: 0,
  isAnimating: false,
  skipAnimation: false,
  sessionOpenings: 0,
  sessionSpent: 0,
  sessionWon: 0,

  // Actions
  setAvailableCases: cases => set({ availableCases: cases }),
  setSelectedCase: caseItem => set({ selectedCase: caseItem }),
  setViewState: state => set({ viewState: state }),
  setIsOpening: isOpening => set({ isOpening }),
  setOpeningResult: result => set({ openingResult: result }),
  setAnimationItems: items => set({ animationItems: items }),
  setAnimationProgress: progress => set({ animationProgress: progress }),
  setIsAnimating: isAnimating => set({ isAnimating }),
  setSkipAnimation: skip => set({ skipAnimation: skip }),

  addToSessionStats: (spent, won) =>
    set(state => ({
      sessionOpenings: state.sessionOpenings + 1,
      sessionSpent: state.sessionSpent + spent,
      sessionWon: state.sessionWon + won,
    })),

  resetSessionStats: () =>
    set({ sessionOpenings: 0, sessionSpent: 0, sessionWon: 0 }),

  resetGame: () =>
    set({
      viewState: 'selection',
      isOpening: false,
      openingResult: null,
      animationItems: [],
      animationProgress: 0,
      isAnimating: false,
    }),
}));
