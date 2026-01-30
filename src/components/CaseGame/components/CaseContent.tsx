import { memo } from 'react';
import cn from 'classnames';
import { formatNumber } from '@/utils/format';
import { getRarityColor } from '../helpers/getRarityColor';
import type { CaseItem } from '@/types/case';

interface CaseContentProps {
  items: CaseItem[];
}

export const CaseContent = memo<CaseContentProps>(({ items }) => {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {items.map(item => {
        const rarityColors = getRarityColor(item.rarity);

        return (
          <div
            key={item.id}
            className={cn(
              'flex flex-col items-center rounded-lg border-2 p-4',
              'bg-gray-800/40 transition-all duration-200',
              rarityColors.border
            )}
          >
            {/* Emoji placeholder (will be provided by backend later) */}
            <div className="mb-2 text-4xl">❓</div>

            {/* Item name */}
            <h4 className="mb-1 text-center text-sm font-semibold text-white">
              {item.name}
            </h4>

            {/* Rarity badge */}
            <div
              className={cn(
                'mb-2 rounded px-2 py-1 text-xs font-bold text-white',
                rarityColors.bg
              )}
            >
              {item.rarity}
            </div>

            {/* Value */}
            <p className="text-sm font-semibold text-green-400">
              ${formatNumber(item.value)}
            </p>

            {/* Chance */}
            <p className="text-xs text-gray-400">
              {formatNumber(item.chance, 2)}%
            </p>
          </div>
        );
      })}
    </div>
  );
});

CaseContent.displayName = 'CaseContent';
