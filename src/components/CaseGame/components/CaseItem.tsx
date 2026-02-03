import { memo } from 'react';
import cn from 'classnames';
import { formatNumber } from '@/utils/format';
import type { Case } from '@/types/case';

interface CaseItemProps {
  caseItem: Case;
  isSelected: boolean;
  onClick: () => void;
}

export const CaseItem = memo<CaseItemProps>(
  ({ caseItem, isSelected, onClick }) => {
    return (
      <button
        onClick={onClick}
        className={cn(
          'w-full rounded-lg border-2 px-4 py-3 text-left transition-all duration-200',
          'hover:border-purple-500 hover:bg-purple-900/20',
          {
            'border-purple-500 bg-purple-900/30': isSelected,
            'border-gray-700 bg-gray-800/40': !isSelected,
          }
        )}
      >
        <h3 className="mb-1 font-semibold text-white">{caseItem.name}</h3>
        <p className="text-sm text-gray-400">${formatNumber(caseItem.price)}</p>
      </button>
    );
  }
);
