'use client';

import { useState, useEffect, memo } from 'react';
import { useBonusStatus, useBonus } from '@/hooks/useBonus';
import { useTranslation } from '@/i18n/useTranslation';
import { formatNumber } from '@/utils/format';
import type { BonusStatusResponse } from '@/types/bonus';

interface BonusProps {
  initialBonusStatus: BonusStatusResponse | null;
}

export const Bonus = memo(({ initialBonusStatus }: BonusProps) => {
  const { t } = useTranslation();
  const { data: bonusStatus } = useBonusStatus();
  const { claimBonus, isClaimingBonus, claimData } = useBonus();
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [canClaim, setCanClaim] = useState(false);

  // Use live data from React Query, fallback to SSR initial data
  const status = bonusStatus || initialBonusStatus;
  const bonusAmount = status?.amount || 0;
  const nextClaimAt = claimData?.nextClaimAt || status?.nextClaimAt;

  useEffect(() => {
    if (!nextClaimAt) return;

    const nextClaimTime = new Date(nextClaimAt).getTime();

    const updateTimer = () => {
      const diff = nextClaimTime - Date.now();
      if (diff <= 0) {
        setTimeRemaining('00:00');
        setCanClaim(true);
        return true;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeRemaining(
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
      setCanClaim(false);
      return false;
    };

    if (updateTimer()) return;
    const interval = setInterval(() => {
      if (updateTimer()) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [nextClaimAt]);

  const handleClaimBonus = () => {
    if (canClaim && !isClaimingBonus) {
      claimBonus();
    }
  };

  return (
    <div className="group relative w-80 overflow-hidden rounded-2xl bg-gradient-to-br from-[#FFCD71]/20 via-[#F5B461]/15 to-[#E59603]/20 p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
      {/* Animated background glow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#FFCD71]/10 via-transparent to-[#E59603]/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Header */}
      <div className="relative mb-6 flex items-center justify-between">
        <h2 className="bg-gradient-to-r from-[#FFCD71] to-[#E59603] bg-clip-text text-2xl font-extrabold text-transparent">
          {t.userProfile.bonus}
        </h2>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#FFCD71]/30 to-[#E59603]/30 shadow-inner transition-transform duration-300 group-hover:scale-110">
          <span className="text-3xl drop-shadow-lg">🎁</span>
        </div>
      </div>

      {/* Bonus Amount */}
      {bonusAmount > 0 && (
        <div className="relative mb-8 text-center">
          <div className="inline-block">
            <p className="relative text-6xl font-black tracking-tight">
              <span className="bg-gradient-to-br from-[#FFD98E] via-[#FFCD71] to-[#E59603] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(255,205,113,0.3)]">
                ${formatNumber(bonusAmount)}
              </span>
            </p>
            <div className="mt-2 h-1 w-full rounded-full bg-gradient-to-r from-transparent via-[#FFCD71]/50 to-transparent" />
          </div>
        </div>
      )}

      {/* Action Area */}
      <div className="relative">
        {canClaim && !isClaimingBonus ? (
          <button
            onClick={handleClaimBonus}
            className="group/btn relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#FFCD71] via-[#F5B461] to-[#E59603] p-[2px] shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]"
          >
            <div className="relative rounded-[10px] bg-gradient-to-br from-[#FFCD71] to-[#E59603] px-8 py-5">
              {/* Button shine effect */}
              <div className="absolute inset-0 -translate-x-full rounded-[10px] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />

              <span className="relative text-xl font-bold text-[#1a1a1a] drop-shadow-sm">
                {t.userProfile.claimBonus}
              </span>
            </div>
          </button>
        ) : (
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[var(--bg-gradient-start)]/60 to-[var(--bg-gradient-end)]/40 p-8 shadow-inner backdrop-blur-sm">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FFCD71]/20 via-[#E59603]/20 to-[#FFCD71]/20 opacity-50" />

            <div className="relative text-center">
              <p className="mb-3 text-sm font-semibold tracking-wider text-[var(--secondary-text-color)] uppercase opacity-80">
                {isClaimingBonus
                  ? t.userProfile.claiming
                  : t.userProfile.nextBonusIn}
              </p>

              <div className="inline-flex items-center justify-center rounded-lg bg-[var(--bg-gradient-start)]/40 px-6 py-3 shadow-inner">
                <p className="font-mono text-5xl font-extrabold text-[var(--main-text-color)] tabular-nums drop-shadow-md">
                  {isClaimingBonus ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    timeRemaining
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
