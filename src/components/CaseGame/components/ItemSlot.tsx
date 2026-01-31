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
        'relative flex flex-shrink-0 flex-col items-center justify-center overflow-hidden rounded-lg p-0.5 transition-all',
        {
          'scale-110': isWinning,
        }
      )}
      style={{
        width: `${CASE_VISUAL.ITEM_SLOT_WIDTH}px`,
        height: `${CASE_VISUAL.ITEM_SLOT_HEIGHT}px`,
        background: `linear-gradient(to top, ${rarityColors.hex}, ${rarityColors.hex}20)`,
      }}
    >
      <div
        className="absolute bottom-3 left-3 z-20 h-2 w-2 rounded-full"
        style={{ backgroundColor: rarityColors.hex }}
      />

      <div className="relative z-10 flex h-full w-full flex-col justify-between rounded-lg bg-[#211F35]">
        <p className="mt-2 px-2 text-sm text-white">{item.name}</p>
        <div className="mb-8 text-center text-5xl">{item.imageUrl}</div>
      </div>
    </div>
  );
});

ItemSlot.displayName = 'ItemSlot';
