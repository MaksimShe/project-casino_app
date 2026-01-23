import crashImg from '@/../public/game_select/crash.jpg';
import caseImg from '@/../public/game_select/case.png';
import minesImg from '@/../public/game_select/mines.png';
import plinkoImg from '@/../public/game_select/plinko.png';
import { type StaticImageData } from 'next/image';
import { ROUTES } from '@/constants/routes';

export enum GameType {
  CRASH = 'crash',
  CASE = 'case',
  MINES = 'mines',
  PLINKO = 'plinko',
}

export interface GameBadge {
  text: string;
  gradient: string;
  shadowColor: string;
}

export interface Game {
  name: string;
  description: string;
  link: string;
  image: StaticImageData;
  badge: GameBadge;
}

export const BADGE_STYLES = {
  new: {
    gradient: 'linear-gradient(116.24deg, #B9FF58 -6.88%, #69B400 83.61%)',
    shadowColor: '#69B400',
  },
  hot: {
    gradient: 'linear-gradient(116.24deg, #FF6B5B -6.88%, #9f190a 83.61%)',
    shadowColor: '#9f190a',
  },
  popular: {
    gradient: 'linear-gradient(116.24deg, #5BE0E0 -6.88%, #009999 83.61%)',
    shadowColor: '#009999',
  },
} as const;

export const GAMES: Game[] = [
  {
    name: 'Crash',
    description: "Watch the multiplier rise and cash out before it's gone",
    link: ROUTES.CRASHGAME,
    image: crashImg,
    badge: {
      text: 'New',
      gradient: BADGE_STYLES.new.gradient,
      shadowColor: BADGE_STYLES.new.shadowColor,
    },
  },
  {
    name: 'Case',
    description: 'Open cases and win random rewards',
    link: ROUTES.CASEGAME,
    image: caseImg,
    badge: {
      text: 'Hot',
      gradient: BADGE_STYLES.hot.gradient,
      shadowColor: BADGE_STYLES.hot.shadowColor,
    },
  },
  {
    name: 'Mines',
    description: 'Avoid the mines and collect bigger rewards',
    link: ROUTES.MINESGAME,
    image: minesImg,
    badge: {
      text: 'New',
      gradient: BADGE_STYLES.new.gradient,
      shadowColor: BADGE_STYLES.new.shadowColor,
    },
  },
  {
    name: 'Plinko',
    description: 'Drop the ball, watch it bounce, and win prizes',
    link: ROUTES.PLINKOGAME,
    image: plinkoImg,
    badge: {
      text: 'Popular',
      gradient: BADGE_STYLES.popular.gradient,
      shadowColor: BADGE_STYLES.popular.shadowColor,
    },
  },
];
