export const getRarityColor = (rarity: string) => {
  const rarityLower = rarity.toLowerCase();

  switch (rarityLower) {
    case 'common':
      return {
        bg: 'bg-[var(--rarity-common-bg)]',
        border: 'border-[var(--rarity-common-border)]',
        glow: 'shadow-[0_0_20px_var(--rarity-common-glow)]',
        hex: '#6b7280',
      };
    case 'uncommon':
      return {
        bg: 'bg-[var(--rarity-uncommon-bg)]',
        border: 'border-[var(--rarity-uncommon-border)]',
        glow: 'shadow-[0_0_20px_var(--rarity-uncommon-glow)]',
        hex: '#10b981',
      };
    case 'rare':
      return {
        bg: 'bg-[var(--rarity-rare-bg)]',
        border: 'border-[var(--rarity-rare-border)]',
        glow: 'shadow-[0_0_20px_var(--rarity-rare-glow)]',
        hex: '#3b82f6',
      };
    case 'epic':
      return {
        bg: 'bg-[var(--rarity-epic-bg)]',
        border: 'border-[var(--rarity-epic-border)]',
        glow: 'shadow-[0_0_20px_var(--rarity-epic-glow)]',
        hex: '#8b5cf6',
      };
    case 'legendary':
      return {
        bg: 'bg-[var(--rarity-legendary-bg)]',
        border: 'border-[var(--rarity-legendary-border)]',
        glow: 'shadow-[0_0_20px_var(--rarity-legendary-glow)]',
        hex: '#f59e0b',
      };
    case 'gold':
      return {
        bg: 'bg-gradient-to-r from-yellow-400 to-amber-500',
        border: 'border-yellow-400',
        glow: 'shadow-[0_0_30px_rgba(251,191,36,0.8)]',
        hex: '#fbbf24',
      };
    default:
      return {
        bg: 'bg-[var(--rarity-common-bg)]',
        border: 'border-[var(--rarity-common-border)]',
        glow: 'shadow-[0_0_20px_var(--rarity-common-glow)]',
        hex: '#6b7280',
      };
  }
};
