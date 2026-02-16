import type { TranslationKeys } from '@/i18n/translations/en';

export const getRarityName = (rarity: string, t: TranslationKeys): string => {
  const key = rarity.toLowerCase();

  // Check if translation exists
  if (key in t.casesGame.rarities) {
    return t.casesGame.rarities[key as keyof typeof t.casesGame.rarities];
  }

  // Return original rarity if no translation found
  return rarity;
};
