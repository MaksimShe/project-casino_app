import crashImg from '@/../public/game_select/crash.jpg';
import caseImg from '@/../public/game_select/case.png';
import minesImg from '@/../public/game_select/mines.png';
import plinkoImg from '@/../public/game_select/plinko.png';
import { GameSelectorItem } from '@/components/Dashboard/GameSelector/components/GameSelectorItem';
import { type StaticImageData } from 'next/image';

export interface Game {
  name: string;
  description: string;
  link: string;
  image: StaticImageData;
  badge: {
    color: string;
    text: string;
  };
}

const gamesSelect: Game[] = [
  {
    name: 'Crash',
    description: "Watch the multiplier rise and cash out before it's gone",
    link: 'dd',
    image: crashImg,
    badge: {
      text: 'New',
      color: '#539f00',
    },
  },
  {
    name: 'Case',
    description: 'Open cases and win random rewards',
    link: 'dd',
    image: caseImg,
    badge: {
      text: 'Hot',
      color: '#9f190a',
    },
  },
  {
    name: 'Mines',
    description: 'Avoid the mines and collect bigger rewards',
    link: 'dd',
    image: minesImg,
    badge: {
      text: 'New',
      color: '#539f00',
    },
  },
  {
    name: 'Plinko',
    description: 'Drop the ball, watch it bounce, and win prizes',
    link: 'dd',
    image: plinkoImg,
    badge: {
      text: 'Popular',
      color: '#009999',
    },
  },
];

export const GameSelector = () => {
  return (
    <div className="grid grid-cols-2 gap-8 max-lg:w-full max-lg:gap-3">
      {gamesSelect.map((game, index) => (
        <GameSelectorItem game={game} key={game.name} priority={index < 4} />
      ))}
    </div>
  );
};
