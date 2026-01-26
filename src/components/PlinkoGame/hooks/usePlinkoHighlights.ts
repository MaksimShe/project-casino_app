import { useEffect, useRef } from 'react';
import { usePlinkoStore } from '@/stores/usePlinkoStore';
import { PLINKO_ANIMATION } from '../constants';

/**
 * Hook for managing peg and slot highlights
 * Auto-clears highlights after duration
 */
export function usePlinkoHighlights() {
  const { highlightedPegs, highlightedSlots, clearPegHighlights, clearSlotHighlights } =
    usePlinkoStore();

  const pegTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const slotTimeoutsRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

  // Auto-clear peg highlights
  useEffect(() => {
    highlightedPegs.forEach(pegId => {
      // Skip if already has timeout
      if (pegTimeoutsRef.current.has(pegId)) return;

      const timeout = setTimeout(() => {
        // Remove this specific peg from highlights
        const store = usePlinkoStore.getState();
        const newSet = new Set(store.highlightedPegs);
        newSet.delete(pegId);
        store.clearPegHighlights();
        newSet.forEach(id => store.highlightPeg(id));

        pegTimeoutsRef.current.delete(pegId);
      }, PLINKO_ANIMATION.PEG_HIGHLIGHT_DURATION);

      pegTimeoutsRef.current.set(pegId, timeout);
    });

    return () => {
      pegTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      pegTimeoutsRef.current.clear();
    };
  }, [highlightedPegs]);

  // Auto-clear slot highlights
  useEffect(() => {
    highlightedSlots.forEach(slotIndex => {
      // Skip if already has timeout
      if (slotTimeoutsRef.current.has(slotIndex)) return;

      const timeout = setTimeout(() => {
        // Remove this specific slot from highlights
        const store = usePlinkoStore.getState();
        const newSet = new Set(store.highlightedSlots);
        newSet.delete(slotIndex);
        store.clearSlotHighlights();
        newSet.forEach(idx => store.highlightSlot(idx));

        slotTimeoutsRef.current.delete(slotIndex);
      }, PLINKO_ANIMATION.SLOT_HIGHLIGHT_DURATION);

      slotTimeoutsRef.current.set(slotIndex, timeout);
    });

    return () => {
      slotTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      slotTimeoutsRef.current.clear();
    };
  }, [highlightedSlots]);

  return null;
}
