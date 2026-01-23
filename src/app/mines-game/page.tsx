'use client';

import { GameType } from '@/components/Dashboard/GameSelector/constants';
import GameConfigPanel from '@/shared/GameConfigPanel/GameConfigPanel';
import { useState } from 'react';

export default function MinesGame() {
  const [selectedGame, setSelectedGame] = useState<GameType>(GameType.PLINKO);

  return (
    <div className="flex h-[100vh] items-center justify-center">
      <div>
        <button
          className="h-10 w-60 bg-blue-200 text-black"
          onClick={() => setSelectedGame(GameType.CRASH)}
        >
          Crash
        </button>
        <button
          className="h-10 w-60 bg-blue-200 text-black"
          onClick={() => setSelectedGame(GameType.PLINKO)}
        >
          Pinko
        </button>
        <button
          className="h-10 w-60 bg-blue-200 text-black"
          onClick={() => setSelectedGame(GameType.MINES)}
        >
          Mines
        </button>
      </div>
      <GameConfigPanel game={selectedGame} />
    </div>
  );
}
