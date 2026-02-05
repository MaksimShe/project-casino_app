import { type Rarity } from '../constants';

export const getRarityColor = (rarity: Rarity | string): string => {
  const rarityLower = rarity.toLowerCase();

  switch (rarityLower) {
    case 'common':
      return 'var(--rarity-common)';
    case 'uncommon':
      return 'var(--rarity-uncommon)';
    case 'rare':
      return 'var(--rarity-rare)';
    case 'epic':
      return 'var(--rarity-epic)';
    case 'legendary':
      return 'var(--rarity-legendary)';
    case 'gold':
      return 'var(--rarity-gold)';
    default:
      return 'var(--rarity-default)';
  }
};
