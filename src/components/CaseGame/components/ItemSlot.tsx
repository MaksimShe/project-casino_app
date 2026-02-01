import { memo } from 'react';
import { getRarityColor } from '../helpers/getRarityColor';
import type { AnimationItem } from '@/types/case';

interface ItemSlotProps {
  item: AnimationItem;
}

export const ItemSlot = memo<ItemSlotProps>(({ item }) => {
  const rarityColors = getRarityColor(item.rarity);

  return (
    <div
      className="relative flex h-48 w-40 flex-shrink-0 flex-col items-center justify-center overflow-hidden rounded-lg p-0.5 transition-all max-sm:h-32 max-sm:w-[100px]"
      style={{
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
