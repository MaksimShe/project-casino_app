import { formatNumber } from '@/utils/format';
import { useTranslation } from '@/i18n/useTranslation';

interface WinModalProps {
  winAmount: number;
  multiplier: number;
}

export const WinModal = ({ winAmount, multiplier }: WinModalProps) => {
  const { t } = useTranslation();
  return (
    <div className="absolute top-1/2 left-1/2 z-50 flex h-full w-full -translate-1/2 items-center justify-center rounded-xl bg-green-400/20 backdrop-blur-lg">
      <div className="rounded-xl border border-[var(--modal-win-border)] bg-[var(--modal-win-bg)] p-6 backdrop-blur-xl">
        <h2 className="mb-2 text-2xl font-bold text-[var(--modal-win-text)]">
          {t.modalWindows.titleWin}
        </h2>
        <p className="text-white">
          {t.modalWindows.win} ${formatNumber(winAmount)} (
          {formatNumber(multiplier)}x)
        </p>
      </div>
    </div>
  );
};
