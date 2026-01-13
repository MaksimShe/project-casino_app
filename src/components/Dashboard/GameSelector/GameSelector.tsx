import { GameSelectorItem } from '@/components/Dashboard/GameSelector/components/GameSelectorItem';
import { GAMES } from './constants';

export const GameSelector = () => {
  return (
    <div className="grid grid-cols-2 gap-8 max-lg:w-full max-lg:gap-3">
      {GAMES.map((game, index) => (
        <GameSelectorItem game={game} key={game.name} priority={index < 4} />
      ))}
    </div>
  );
};
