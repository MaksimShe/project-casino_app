import { memo, useState, useCallback } from 'react';
import { formatNumber } from '@/utils/format';
import { getRarityColor } from '../helpers/getRarityColor';
import type { CaseItem } from '@/types/case';

interface CaseContentProps {
  items: CaseItem[];
}

export const CaseContent = memo<CaseContentProps>(({ items }) => {
  const [flippedItems, setFlippedItems] = useState<Set<string>>(new Set());

  const handleFlip = useCallback((itemId: string, isFlipped: boolean) => {
    setFlippedItems(prev => {
      const newSet = new Set(prev);
      if (isFlipped) {
        newSet.add(itemId);
      } else {
        newSet.delete(itemId);
      }
      return newSet;
    });
  }, []);

  return (
    <div className="grid grid-cols-3 gap-6 max-sm:gap-4 md:grid-cols-4 lg:grid-cols-8">
      {items.map(item => {
        const rarityColors = getRarityColor(item.rarity);
        const isFlipped = flippedItems.has(item.id);

        return (
          <div key={item.id} className="perspective-1000 h-36 hover:scale-103">
            {/* Flip card container */}
            <div
              className={`preserve-3d group relative h-full w-full cursor-pointer transition-transform duration-500 ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              onClick={() => handleFlip(item.id, !isFlipped)}
            >
              {/* Front side */}
              <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-lg backface-hidden">
                {/* Gradient background */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, ${rarityColors.hex}, ${rarityColors.hex}20)`,
                  }}
                />

                {/* Small dot in left bottom corner */}
                <div
                  className="absolute bottom-3 left-3 z-20 h-2 w-2 rounded-full"
                  style={{ backgroundColor: rarityColors.hex }}
                />

                <div className="relative z-10 flex h-[98%] w-[98%] flex-col justify-between rounded-lg bg-[#423E69]">
                  {/* Item name */}
                  <p className="mt-2 px-2 text-sm text-white">{item.name}</p>
                  {/* Emoji */}
                  <div className="mb-8 text-center text-5xl">
                    {item.imageUrl}
                  </div>
                </div>
              </div>

              {/* Back side */}
              <div
                className="absolute inset-0 flex rotate-y-180 flex-col items-center justify-center rounded-lg backface-hidden"
                style={{ backgroundColor: rarityColors.hex }}
              >
                <div className="px-4 text-center">
                  {/* Rarity name */}
                  <div className="mb-3 text-xs font-bold tracking-wider text-white/80 uppercase">
                    {item.rarity}
                  </div>

                  {/* Price */}
                  <p className="mb-2 text-2xl font-bold text-white">
                    ${formatNumber(item.value)}
                  </p>

                  {/* Chance */}
                  <p className="text-sm text-white/70">
                    {formatNumber(item.chance, 1)}% chance
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});

CaseContent.displayName = 'CaseContent';
