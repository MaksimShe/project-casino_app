import Image from 'next/image';
import { type FC } from 'react';
import { type Game } from '../constants';
import { useTranslation } from '@/i18n/useTranslation';

interface Props {
  game: Game;
  priority?: boolean;
}

export const GameSelectorItem: FC<Props> = ({ game, priority = false }) => {
  const { t } = useTranslation();
  return (
    <div className="relative aspect-[300/370] w-[clamp(160px,20vw,300px)] transition-transform duration-300 hover:scale-[102%] max-lg:w-full">
      <div
        className="absolute top-6 left-6 z-10 rounded-3xl px-6 py-1 max-lg:top-3 max-lg:left-3 max-lg:px-3 max-lg:text-xs"
        style={{
          background: game.badge.gradient,
          boxShadow: `0px 0px 16px 0px ${game.badge.shadowColor}`,
        }}
      >
        <p className="font-bold text-[var(--main-text-color)]">
          {game.badge.text}
        </p>
      </div>

      <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-[0px_0px_100px_1px_#FFFFFF4D]">
        <Image
          src={game.image}
          alt="Game"
          fill
          sizes="(max-width: 1024px) 100vw, clamp(160px, 20vw, 300px)"
          className="object-cover"
          priority={priority}
        />
      </div>

      <div className="absolute top-1/3 left-1/2 w-10/12 -translate-x-1/2 rounded-xl bg-[#28252832] p-4 backdrop-blur-sm max-lg:p-2">
        <p className="text-center text-3xl font-black text-white max-xl:text-base">
          {game.name}
        </p>
        <p className="text-white max-xl:text-xs max-lg:w-32">
          {game.description}
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 w-10/12 -translate-x-1/2 max-lg:bottom-4">
        <a href={game.link}>
          <button className="w-full rounded-4xl bg-gradient-to-t from-[#FF0047] to-[#FF417B] px-8 py-3 font-bold text-[var(--main-text-color)] transition-shadow duration-300 hover:shadow-[0_0_18px_0_#FF5A8C] max-lg:px-4 max-lg:py-2 max-lg:text-xs">
            {t.games.startGame}
          </button>
        </a>
      </div>
    </div>
  );
};
