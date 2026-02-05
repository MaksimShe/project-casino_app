'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCaseStore } from '@/stores/useCaseStore';
import { CaseOpening, WinModal } from '@/components/CaseGame/index';
import { CaseDetails } from '@/components/CaseGame/CaseDetails';
import { CaseViewState } from '@/components/CaseGame/constants';
import { useOpenCase } from '@/components/CaseGame/hooks/useOpenCase';
import type { CaseDetailsResponse, Case } from '@/types/case';

interface CaseDetailClientProps {
  caseId: string;
  initialCaseData?: CaseDetailsResponse;
  initialAllCases?: Case[];
}

export function CaseDetailClient({
  caseId,
  initialCaseData,
  initialAllCases,
}: CaseDetailClientProps) {
  const router = useRouter();
  const store = useCaseStore();
  const { viewState, setSelectedCase, resetGame } = store;

  const caseData = initialCaseData;
  const allCases = useMemo(() => initialAllCases || [], [initialAllCases]);

  const openMutation = useOpenCase({
    casePrice: caseData?.price ?? 0,
    caseItems: caseData?.items ?? [],
  });

  const handleOpenCase = useCallback(() => {
    if (!caseData || store.isOpening || store.isAnimating) {
      return;
    }

    store.setIsOpening(true);
    openMutation.mutate(caseId);
  }, [store, openMutation, caseId, caseData]);

  useEffect(() => {
    if (caseData && allCases.length > 0) {
      const caseInfo = allCases.find(c => c.id === caseId);
      if (caseInfo) {
        setSelectedCase(caseInfo);
      }
    }
  }, [caseData, allCases, caseId, setSelectedCase]);

  useEffect(() => {
    return () => {
      resetGame();
      setSelectedCase(null);
    };
  }, [resetGame, setSelectedCase]);

  if (!caseData) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-400">Case not found</p>
          <button
            onClick={() => router.push('/cases-game')}
            className="mt-4 rounded-lg bg-purple-600 px-6 py-2 text-white hover:bg-purple-700"
          >
            Back to Cases
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      {viewState === CaseViewState.SELECTION && (
        <CaseDetails caseData={caseData} onOpenCase={handleOpenCase} />
      )}
      {viewState === CaseViewState.OPENING && <CaseOpening />}
      <WinModal onOpenAgain={handleOpenCase} />
    </div>
  );
}
