import type { TranslationKeys } from '@/i18n/translations/en';

export const getCaseName = (name: string, t: TranslationKeys): string => {
  switch (name.toLowerCase()) {
    case 'food case':
      return t.casesGame.caseNames.foodCase;
    case 'animal case':
      return t.casesGame.caseNames.animalCase;
    case 'sports case':
      return t.casesGame.caseNames.sportsCase;
    case 'space case':
      return t.casesGame.caseNames.spaceCase;
    default:
      return name; // Return original name if not found
  }
};
