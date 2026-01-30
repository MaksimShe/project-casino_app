import { memo } from 'react';
import cn from 'classnames';
import { formatNumber } from '@/utils/format';
import { useCaseStore } from '@/stores/useCaseStore';
import { useCaseGame } from './hooks/useCaseGame';
import { CaseItem } from './components/CaseItem';
import { CaseContent } from './components/CaseContent';

export const CaseSelection = memo(() => {
  const { selectedCase, setSelectedCase } = useCaseStore();
  const { cases, caseDetails, isLoading, handleOpenCase, isOpening } =
    useCaseGame();

  if (isLoading && cases.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl text-gray-400">Loading cases...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Left sidebar - Case list */}
      <div className="w-80 overflow-y-auto border-r border-gray-700 bg-gray-900/40 p-4">
        <h2 className="mb-4 text-2xl font-bold text-white">Cases</h2>
        <div className="flex flex-col gap-3">
          {cases.map(caseItem => (
            <CaseItem
              key={caseItem.id}
              caseItem={caseItem}
              isSelected={selectedCase?.id === caseItem.id}
              onClick={() => setSelectedCase(caseItem)}
            />
          ))}
        </div>
      </div>

      {/* Right panel - Case details */}
      <div className="flex flex-1 flex-col overflow-y-auto p-8">
        {selectedCase && caseDetails ? (
          <>
            {/* Header */}
            <div className="mb-8">
              <h1 className="mb-2 text-4xl font-bold text-white">
                {selectedCase.name}
              </h1>
              <p className="text-xl text-gray-400">
                Price: ${formatNumber(selectedCase.price)}
              </p>
            </div>

            {/* Case contents */}
            <div className="mb-8">
              <h3 className="mb-4 text-2xl font-semibold text-white">
                Contents
              </h3>
              <CaseContent items={caseDetails.items} />
            </div>

            {/* Open button */}
            <div className="mt-auto pt-4">
              <button
                onClick={handleOpenCase}
                disabled={isOpening}
                className={cn(
                  'w-full rounded-lg py-4 text-xl font-bold text-white transition-all',
                  'bg-gradient-to-r from-purple-600 to-pink-600',
                  {
                    'cursor-not-allowed opacity-50': isOpening,
                    'hover:from-purple-500 hover:to-pink-500': !isOpening,
                  }
                )}
              >
                {isOpening
                  ? 'OPENING...'
                  : `OPEN FOR $${formatNumber(selectedCase.price)}`}
              </button>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-xl text-gray-400">
              Select a case to view details
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

CaseSelection.displayName = 'CaseSelection';
