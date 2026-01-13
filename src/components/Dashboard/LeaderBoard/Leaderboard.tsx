'use client';

import Image from 'next/image';
import coin from '@/../public/leaderboard_icons/dollar.svg';
import cup from '@/../public/leaderboard_icons/gold cup.svg';
import firstPlace from '@/../public/leaderboard_icons/1st-place.svg';
import secondPlace from '@/../public/leaderboard_icons/2nd-place.svg';
import thirdPlace from '@/../public/leaderboard_icons/3rd-place.svg';

const tepmLead = [
  {
    name: 'Slavic',
    games: 124,
    coins: 5000,
    winrate: 55,
  },
  {
    name: 'Vanya',
    games: 122,
    coins: 3000,
    winrate: 44,
  },
  {
    name: 'Dina',
    games: 154,
    coins: 1230,
    winrate: 33,
  },
  {
    name: 'Stas',
    games: 532,
    coins: 11422,
    winrate: 66,
  },
  {
    name: 'Tuz',
    games: 733,
    coins: 4314,
    winrate: 95,
  },
  {
    name: 'Sanya',
    games: 6,
    coins: 1600,
    winrate: 35,
  },
  {
    name: 'Dimooon',
    games: 333,
    coins: 3333,
    winrate: 33,
  },
  {
    name: 'Hookah',
    games: 95,
    coins: 4252,
    winrate: 60,
  },
];

export const Leaderboard = () => {
  const topImage = (place: number) => {
    switch (place) {
      case 1:
        return (
          <Image
            src={firstPlace}
            alt="1"
            height={50}
            width={50}
            className="mx-4"
          />
        );
      case 2:
        return (
          <Image
            src={secondPlace}
            alt="2"
            height={50}
            width={50}
            className="mx-4"
          />
        );
      case 3:
        return (
          <Image
            src={thirdPlace}
            alt="3"
            height={50}
            width={50}
            className="mx-4"
          />
        );
      default:
        return (
          <span className="flex w-20 items-center justify-center text-2xl font-semibold text-white">
            {place}
          </span>
        );
    }
  };
  return (
    <div className="relative box-border flex w-72 flex-col rounded-2xl bg-[#423E69] p-4 max-lg:w-full">
      <Image
        src={cup}
        alt="Cup"
        width={122}
        height={122}
        className="absolute -top-12 -left-12"
      />

      <div className="mb-6 flex flex-col items-center">
        <p className="text-2xl font-bold text-white">Leaderboard</p>
        <p className="text-[16px]">Top players</p>
      </div>
      <div className="flex flex-col gap-4">
        {tepmLead.map((player, index) => (
          <div
            key={player.name}
            className="flex rounded-xl bg-[#24243F] shadow-[0px_2px_10px_0px_#BFD8FF33]"
          >
            {topImage(index + 1)}
            <div className="box-border flex h-[73px] w-full flex-col p-4 pl-0">
              <div className="flex justify-between">
                <h3>{player.name}</h3>
                <div className="flex gap-2">
                  <Image src={coin} alt="coin" width={16} height={16} />
                  <h3>{player.coins}</h3>
                </div>
              </div>
              <div className="flex justify-between">
                <h4>{player.games} games</h4>
                <p className="text-sm text-[var(--system-success-color)]">
                  {player.winrate}% win
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
