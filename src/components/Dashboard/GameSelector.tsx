import crashImg from '@/../public/game_select/crash.jpg';
import caseImg from '@/../public/game_select/case.png';
import minesImg from '@/../public/game_select/mines.png';
import plinkoImg from '@/../public/game_select/plinko.png';
import Image from 'next/image';

const gamesSelect = [
  {
    name: 'Crash',
    description: 'Watch the multiplier rise and cash out before it’s gone',
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
    <div className="grid grid-cols-2 gap-8">
      {gamesSelect.map(game => (
        <div
          key={game.name}
          className="relative transition-transform duration-300 hover:scale-[102%]"
        >
          <div
            className="absolute top-6 left-8 rounded-3xl px-6 py-1"
            style={{
              backgroundColor: game.badge.color,
              boxShadow: `0px 0px 16px 0px ${game.badge.color}`,
            }}
          >
            <p className="font-bold text-white">{game.badge.text}</p>
          </div>
          <div className="relative -z-50 h-[370px] w-[300px] overflow-hidden rounded-2xl shadow-[0px_0px_100px_1px_#FFFFFF4D]">
            <Image src={game.image} alt="Game" fill className="object-cover" />
          </div>
          <div className="absolute top-2/5 right-1/2 translate-x-1/2 rounded-xl bg-[#28252832] p-4 backdrop-blur-sm">
            <p className="text-center text-3xl font-black text-white">
              {game.name}
            </p>
            <p className="w-52 text-white">{game.description}</p>
          </div>
          <div className="absolute top-9/12 right-1/2 translate-x-1/2">
            <button className="w-44 rounded-4xl bg-gradient-to-t from-[#FF0047] to-[#FF417B] px-12 py-3 font-bold text-white transition-shadow duration-300 hover:shadow-[0_0_18px_0_#FF5A8C]">
              Free play
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
