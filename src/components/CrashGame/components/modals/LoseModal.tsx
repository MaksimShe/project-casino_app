import { formatNumber } from '@/utils/format';
import { useTranslation } from '@/i18n/useTranslation';

interface LoseModalProps {
  betAmount: number;
  crashPoint: number;
}

export const LoseModal = ({ betAmount, crashPoint }: LoseModalProps) => {
  const { t } = useTranslation();
  return (
    <div className="absolute top-1/2 left-1/2 z-50 flex h-full w-full -translate-1/2 items-center justify-center rounded-xl bg-black/50 backdrop-blur-xs">
      <div className="rounded-xl border border-[var(--modal-lose-border)] bg-[var(--modal-lose-bg)] p-6 backdrop-blur-none">
        <h2 className="mb-2 text-2xl font-bold text-[var(--modal-lose-text)]">
          {t.modalWindows.titleLose}
        </h2>
        <p className="text-white">
          {t.modalWindows.lose} ${formatNumber(betAmount)} (
          {t.modalWindows.crashedAt}
          {formatNumber(crashPoint)}x)
        </p>
      </div>
    </div>
  );
};
