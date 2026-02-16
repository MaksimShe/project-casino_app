'use client';

import { CaseCard } from '@/components/CaseGame/components/CaseCard';
import type { Case } from '@/types/case';
import { useTranslation } from '@/i18n/useTranslation';

interface CasesGameClientProps {
  initialCases: Case[];
}

export function CasesGameClient({ initialCases }: CasesGameClientProps) {
  const { t } = useTranslation();
  const cases = initialCases.sort((a, b) => a.price - b.price);

  return (
    <div className="flex items-center justify-center">
      <div className="mx-auto max-w-7xl">
        {/* Cases Grid */}
        <div className="grid grid-cols-2 gap-4 px-6 pt-3 lg:grid-cols-3 lg:gap-6 lg:p-6 xl:grid-cols-4">
          {cases.map((caseItem, index) => (
            <CaseCard key={caseItem.id} caseItem={caseItem} index={index} />
          ))}
        </div>

        {/* Empty State */}
        {cases.length === 0 && (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <p className="text-xl text-[var(--second-text-color)]">
                {t.casesGame.noCasesAvailable}
              </p>
              <p className="mt-2 text-sm text-[var(--second-text-color)]">
                {t.casesGame.checkBackLater}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
