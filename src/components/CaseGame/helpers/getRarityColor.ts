export const getRarityColor = (rarity: string) => {
  const rarityLower = rarity.toLowerCase();

  switch (rarityLower) {
    case 'common':
      return {
        bg: 'bg-[var(--rarity-common-bg)]',
        border: 'border-[var(--rarity-common-border)]',
        glow: 'shadow-[0_0_20px_var(--rarity-common-glow)]',
      };
    case 'uncommon':
      return {
        bg: 'bg-[var(--rarity-uncommon-bg)]',
        border: 'border-[var(--rarity-uncommon-border)]',
        glow: 'shadow-[0_0_20px_var(--rarity-uncommon-glow)]',
      };
    case 'rare':
      return {
        bg: 'bg-[var(--rarity-rare-bg)]',
        border: 'border-[var(--rarity-rare-border)]',
        glow: 'shadow-[0_0_20px_var(--rarity-rare-glow)]',
      };
    case 'epic':
      return {
        bg: 'bg-[var(--rarity-epic-bg)]',
        border: 'border-[var(--rarity-epic-border)]',
        glow: 'shadow-[0_0_20px_var(--rarity-epic-glow)]',
      };
    case 'legendary':
      return {
        bg: 'bg-[var(--rarity-legendary-bg)]',
        border: 'border-[var(--rarity-legendary-border)]',
        glow: 'shadow-[0_0_20px_var(--rarity-legendary-glow)]',
      };
    default:
      return {
        bg: 'bg-[var(--rarity-common-bg)]',
        border: 'border-[var(--rarity-common-border)]',
        glow: 'shadow-[0_0_20px_var(--rarity-common-glow)]',
      };
  }
};
