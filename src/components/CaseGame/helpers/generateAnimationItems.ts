import { CASE_VISUAL } from '../constants';
import type { CaseItem, AnimationItem, OpenCaseResponse } from '@/types/case';

const selectWeightedRandom = (items: CaseItem[]): CaseItem => {
  const totalChance = items.reduce((sum, item) => sum + item.chance, 0);
  let random = Math.random() * totalChance;

  for (const item of items) {
    random -= item.chance;
    if (random <= 0) return item;
  }

  return items[0];
};

export const generateAnimationItems = (
  caseItems: CaseItem[],
  wonItem: OpenCaseResponse['item']
): AnimationItem[] => {
  const items: AnimationItem[] = [];

  for (let i = 0; i < CASE_VISUAL.TOTAL_ITEMS_COUNT; i++) {
    if (i === CASE_VISUAL.WINNING_ITEM_INDEX) {
      // Insert winning item - handle both image and imageUrl for compatibility
      const itemImage = wonItem.imageUrl || wonItem.image || '❓';
      items.push({
        id: wonItem.id,
        name: wonItem.name,
        imageUrl: itemImage,
        rarity: wonItem.rarity,
        value: wonItem.value,
        isWinning: true,
      });
    } else {
      // Random item from case pool (weighted by chance)
      const randomItem = selectWeightedRandom(caseItems);
      items.push({
        id: `${randomItem.id}-${i}`,
        name: randomItem.name,
        imageUrl: randomItem.imageUrl,
        rarity: randomItem.rarity,
        value: randomItem.value,
      });
    }
  }

  return items;
};
