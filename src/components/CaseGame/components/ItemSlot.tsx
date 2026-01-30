import { memo } from 'react';
import cn from 'classnames';
import { getRarityColor } from '../helpers/getRarityColor';
import type { AnimationItem } from '@/types/case';
import { CASE_VISUAL } from '../constants';

interface ItemSlotProps {
  item: AnimationItem;
  isWinning: boolean;
}

export const ItemSlot = memo<ItemSlotProps>(({ item, isWinning }) => {
  const rarityColors = getRarityColor(item.rarity);

  return (
    <div
      className={cn(
        'flex flex-shrink-0 flex-col items-center justify-center rounded-lg border-2 transition-all',
        rarityColors.border,
        rarityColors.bg,
        {
          [rarityColors.glow]: isWinning,
          'scale-110': isWinning,
        }
      )}
      style={{
        width: `${CASE_VISUAL.ITEM_SLOT_WIDTH}px`,
        height: `${CASE_VISUAL.ITEM_SLOT_HEIGHT}px`,
      }}
    >
      <div className="mb-2 text-5xl">{item.emoji}</div>
      <p className="px-2 text-center text-xs font-semibold text-white">
        {item.name}
      </p>
    </div>
  );
});

ItemSlot.displayName = 'ItemSlot';
