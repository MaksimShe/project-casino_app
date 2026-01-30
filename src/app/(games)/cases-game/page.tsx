'use client';

import { useCaseStore } from '@/stores/useCaseStore';
import { CaseSelection, CaseOpening, WinModal } from '@/components/CaseGame';

export default function CasesGamePage() {
  const { viewState } = useCaseStore();

  return (
    <div className="min-h-screen">
      {viewState === 'selection' && <CaseSelection />}
      {viewState === 'opening' && <CaseOpening />}
      <WinModal />
    </div>
  );
}
