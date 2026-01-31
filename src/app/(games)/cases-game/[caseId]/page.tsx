'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { caseService } from '@/services/CaseService.class';
import { useCaseStore } from '@/stores/useCaseStore';
import { CaseOpening, WinModal } from '@/components/CaseGame';
import { CaseDetails } from '@/components/CaseGame/CaseDetails';

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.caseId as string;
  const { viewState, setSelectedCase, resetGame } = useCaseStore();

  // Fetch case data
  const { data: caseData, isLoading: caseLoading } = useQuery({
    queryKey: ['case', caseId],
    queryFn: () => caseService.getCaseDetails(caseId),
    enabled: !!caseId,
  });

  // Fetch all cases to get basic info (for the selected case store)
  const { data: casesData } = useQuery({
    queryKey: ['cases'],
    queryFn: () => caseService.getAllCases(),
  });

  // Set selected case when data loads
  useEffect(() => {
    if (caseData && casesData) {
      const caseInfo = casesData.cases.find(c => c.id === caseId);
      if (caseInfo) {
        setSelectedCase(caseInfo);
      }
    }
  }, [caseData, casesData, caseId, setSelectedCase]);

  // Reset game state when leaving page
  useEffect(() => {
    return () => {
      resetGame();
      setSelectedCase(null);
    };
  }, [resetGame, setSelectedCase]);

  // Handle case not found
  if (!caseLoading && !caseData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
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

  if (caseLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl text-gray-400">Loading case...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen justify-center">
      {viewState === 'selection' && caseData && (
        <CaseDetails caseData={caseData} />
      )}
      {viewState === 'opening' && <CaseOpening />}
      <WinModal />
    </div>
  );
}
