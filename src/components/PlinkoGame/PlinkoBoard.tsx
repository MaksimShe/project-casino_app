'use client';

import { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { usePlinkoStore } from '@/stores/usePlinkoStore';
import { PlinkoPeg } from './PlinkoPeg';
import { PlinkoBall } from './PlinkoBall';
import { PlinkoSlot } from './PlinkoSlot';
import { generatePegs } from './helpers';
import {
  usePlinkoBallAnimation,
  usePlinkoHighlights,
  usePlinkoNotification,
} from './hooks';
import { useIsMobile } from './hooks/useIsMobile';
import { PLINKO_BOARD, PLINKO_BOARD_MOBILE } from './constants';

export function PlinkoBoard() {
  const { lines, multipliers, activeBalls, lastDropResults, dropSessionId } =
    usePlinkoStore();

  const isMobile = useIsMobile();
  const BOARD = isMobile ? PLINKO_BOARD_MOBILE : PLINKO_BOARD;

  // Generate pegs based on lines and mobile state
  const pegs = useMemo(() => generatePegs(lines, isMobile), [lines, isMobile]);

  // Calculate board height based on lines and mobile state
  const boardHeight = useMemo(() => {
    const { ROW_SPACING, PADDING_TOP, PADDING_BOTTOM } = BOARD;
    return PADDING_TOP + lines * ROW_SPACING + PADDING_BOTTOM;
  }, [lines, BOARD]);

  // Use hooks for animation, highlights, and notifications
  usePlinkoBallAnimation({
    dropResults: lastDropResults,
    pegs,
    lines,
    dropSessionId,
    isMobile,
  });

  usePlinkoHighlights();
  usePlinkoNotification();

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Main Board */}
      <div
        className="relative w-[380px] rounded-2xl bg-[#423E6980] md:w-[830px]"
        style={{
          height: boardHeight,
        }}
      >
        {/* Pegs */}
        {pegs.map(peg => (
          <PlinkoPeg key={peg.id} peg={peg} />
        ))}

        {/* Balls */}
        <AnimatePresence>
          {activeBalls.map(ball => (
            <PlinkoBall key={ball.id} ball={ball} />
          ))}
        </AnimatePresence>

        {/* Slots */}
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-[2px] md:bottom-3 md:gap-1">
          {multipliers.map((multiplier, index) => (
            <PlinkoSlot key={index} multiplier={multiplier} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
