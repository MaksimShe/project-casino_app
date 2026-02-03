import { memo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import cn from 'classnames';
import { useCaseStore } from '@/stores/useCaseStore';
import { CaseContent } from './components/CaseContent';
import type { CaseDetailsResponse } from '@/types/case';
import caseImg from '@/../public/cases-game/case-img.png';
import arrowBackIcon from '@/../public/cases-game/arrow-back.svg';
import Image from 'next/image';
import { ROUTES } from '@/constants/routes';

interface CaseDetailsProps {
  caseData: CaseDetailsResponse;
  onOpenCase: () => void;
}

export const CaseDetails = memo(
  ({ caseData, onOpenCase }: CaseDetailsProps) => {
    const router = useRouter();
    const store = useCaseStore();

    const handleToggleSkipAnimation = useCallback(() => {
      store.setSkipAnimation(!store.skipAnimation);
    }, [store]);

    const isOpening = store.isOpening;

    return (
      <div className="w-full lg:px-8">
        {/* Case Details */}
        <div className="pt-4 max-lg:px-6">
          {/* Case Main */}
          <div className="flex justify-between max-lg:flex-col max-lg:justify-center">
            <div className="flex max-sm:flex-col">
              <div className="mr-8 mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-600/30 hover:scale-105 max-sm:w-full">
                <button
                  onClick={() => router.push(ROUTES.CASEGAME)}
                  className="flex h-full w-full items-center justify-center"
                >
                  <Image
                    src={arrowBackIcon}
                    alt="back"
                    width={16}
                    height={16}
                  />
                </button>
              </div>
              <div className="mb-12 flex w-full flex-col gap-6 max-lg:items-center">
                <h1 className="mb-4 w-full text-5xl font-bold text-white max-sm:text-center">
                  {caseData.name}
                </h1>
                <Image src={caseImg} alt="case" width={450} height={200} />
              </div>
            </div>
            {/* Open button and settings */}
            <div className="flex flex-col items-center justify-center gap-4">
              <button
                onClick={onOpenCase}
                disabled={isOpening}
                className={cn(
                  'h-12 w-7/12 min-w-64 rounded-full px-12 font-bold text-white transition-all',
                  'bg-gradient-to-t from-[#BA0034] to-[#FF185F]',
                  {
                    'cursor-not-allowed opacity-50': isOpening,
                    'hover:shadow-lg hover:shadow-purple-500/50': !isOpening,
                  }
                )}
              >
                {isOpening ? 'Opening...' : `Open case $${caseData.price}`}
              </button>

              {/* Skip animation toggle */}
              <div className="mb-10 flex items-center gap-3">
                <span className="text-sm text-white/70">Skip Animation</span>
                <button
                  onClick={handleToggleSkipAnimation}
                  className={`h-5 w-10 rounded-full transition-colors ${
                    store.skipAnimation
                      ? 'bg-[var(--system-success-color)]'
                      : 'bg-[var(--system-error-color)]'
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded-full bg-white transition-transform ${
                      store.skipAnimation
                        ? 'translate-x-5.5'
                        : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Case Contents */}
          <div className="mb-12">
            <h2 className="text-3xl font-semibold text-white">Case Contents</h2>
            <p className="mb-6">ⓘ Click on item for detail information</p>
            <CaseContent items={caseData.items} />
          </div>
        </div>
      </div>
    );
  }
);
