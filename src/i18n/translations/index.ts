import { en } from './en';
import { ua } from './ua';

export const translations = {
  eng: en,
  ua: ua,
} as const;

export type Language = keyof typeof translations;
