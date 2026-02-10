import crashImg from '@/../public/game_select/crash.jpg';
import caseImg from '@/../public/game_select/case.png';
import minesImg from '@/../public/game_select/mines.png';
import plinkoImg from '@/../public/game_select/plinko.png';
import { type StaticImageData } from 'next/image';
import { ROUTES } from '@/constants/routes';
import type { TranslationKeys } from '@/i18n/translations/en';

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

export const getGames = (t: TranslationKeys): Game[] => [
  {
    name: t.games.crash.name,
    description: t.games.crash.description,
    link: ROUTES.CRASHGAME,
    image: crashImg,
    badge: {
      text: t.badges.new,
      gradient: BADGE_STYLES.new.gradient,
      shadowColor: BADGE_STYLES.new.shadowColor,
    },
  },
  {
    name: t.games.case.name,
    description: t.games.case.description,
    link: ROUTES.CASEGAME,
    image: caseImg,
    badge: {
      text: t.badges.hot,
      gradient: BADGE_STYLES.hot.gradient,
      shadowColor: BADGE_STYLES.hot.shadowColor,
    },
  },
  {
    name: t.games.mines.name,
    description: t.games.mines.description,
    link: ROUTES.MINESGAME,
    image: minesImg,
    badge: {
      text: t.badges.new,
      gradient: BADGE_STYLES.new.gradient,
      shadowColor: BADGE_STYLES.new.shadowColor,
    },
  },
  {
    name: t.games.plinko.name,
    description: t.games.plinko.description,
    link: ROUTES.PLINKOGAME,
    image: plinkoImg,
    badge: {
      text: t.badges.popular,
      gradient: BADGE_STYLES.popular.gradient,
      shadowColor: BADGE_STYLES.popular.shadowColor,
    },
  },
];
