'use client';

import { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { usePlinkoStore } from '@/stores/usePlinkoStore';
import { PlinkoPeg } from './PlinkoPeg';
import { PlinkoBall } from './PlinkoBall';
import { PlinkoSlot } from './PlinkoSlot';
import { generatePegs } from './helpers';
import { usePlinkoBallAnimation, usePlinkoHighlights } from './hooks';
import { PLINKO_BOARD } from './constants';

export function PlinkoBoard() {
  const {
    lines,
    multipliers,
    activeBalls,
    lastDropResults,
    highlightedPegs,
    highlightedSlots,
  } = usePlinkoStore();

  // Generate pegs based on lines
  const pegs = useMemo(() => generatePegs(lines), [lines]);

  // Calculate board height based on lines
  const boardHeight = useMemo(() => {
    const { ROW_SPACING, PADDING_TOP, PADDING_BOTTOM } =
      PLINKO_BOARD;
    return PADDING_TOP + lines * ROW_SPACING + PADDING_BOTTOM;
  }, [lines]);

  // Use hooks for animation and highlights
  usePlinkoBallAnimation({
    dropResults: lastDropResults,
    pegs,
    lines,
  });

  usePlinkoHighlights();

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Main Board */}
      <div
        className="relative rounded-2xl bg-[#423E6980]"
        style={{
          width: PLINKO_BOARD.WIDTH,
          height: boardHeight,
        }}
      >
        {/* Pegs */}
          {pegs.map(peg => (
            <PlinkoPeg
              key={peg.id}
              peg={peg}
              isHighlighted={highlightedPegs.has(peg.id)}
            />
          ))}

        {/* Balls */}
        <AnimatePresence>
          {activeBalls.map(ball => (
            <PlinkoBall key={ball.id} ball={ball} />
          ))}
        </AnimatePresence>

        {/* Slots */}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
          {multipliers.map((multiplier, index) => (
            <PlinkoSlot
              key={index}
              multiplier={multiplier}
              isHighlighted={highlightedSlots.has(index)}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Info */}
      {multipliers.length === 0 && (
        <div className="text-sm text-slate-400">
          Select risk and lines to see multipliers
        </div>
      )}
    </div>
  );
}
