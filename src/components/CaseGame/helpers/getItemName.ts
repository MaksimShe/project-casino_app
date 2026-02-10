import type { TranslationKeys } from '@/i18n/translations/en';

// Convert item name to camelCase key
const toCamelCase = (str: string): string => {
  return str
    .split(' ')
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
};

export const getItemName = (name: string, t: TranslationKeys): string => {
  const key = toCamelCase(name);

  // Check if translation exists
  if (key in t.casesGame.items) {
    return t.casesGame.items[key as keyof typeof t.casesGame.items];
  }

  // Return original name if no translation found
  return name;
};
