//cuz we do not receive this from backend
import type { TranslationKeys } from '@/i18n/translations/en';

export const mockDescription = (name: string, t: TranslationKeys) => {
  switch (name.toLowerCase()) {
    case 'food case':
      return t.casesGame.descriptions.foodCase;
    case 'animal case':
      return t.casesGame.descriptions.animalCase;
    case 'sports case':
      return t.casesGame.descriptions.sportsCase;
    case 'space case':
      return t.casesGame.descriptions.spaceCase;
    default:
      return t.casesGame.descriptions.default;
  }
};
