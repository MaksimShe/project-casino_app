import { GameSelectorItem } from '@/components/Dashboard/GameSelector/components/GameSelectorItem';
import { getGames } from './constants';
import { useTranslation } from '@/i18n/useTranslation';

export const GameSelector = () => {
  const { t } = useTranslation();
  const games = getGames(t);

  return (
    <div className="grid grid-cols-2 gap-8 max-lg:w-full max-lg:gap-3">
      {games.map((game, index) => (
        <GameSelectorItem game={game} key={game.name} priority={index < 4} />
      ))}
    </div>
  );
};
