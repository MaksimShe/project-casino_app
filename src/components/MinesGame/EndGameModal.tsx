import { formatNumber } from '@/utils/format';
import { useMinesModalAutoClose } from '@/hooks/useMinesModalAutoClose';
import cn from 'classnames';
import { useTranslation } from '@/i18n/useTranslation';

interface EndGameModalProps {
  isWin: boolean;
  amount: number;
  multiplier?: number;
  tilesRevealed: number;
  onNewGame: () => void;
}

export const EndGameModal = ({
  isWin,
  amount,
  multiplier,
  tilesRevealed,
  onNewGame,
}: EndGameModalProps) => {
  useMinesModalAutoClose(onNewGame);
  const { t } = useTranslation();

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center rounded-xl bg-black/50 backdrop-blur-xs">
      <div
        className={cn(
          'rounded-xl border p-6',
          isWin
            ? 'border-[var(--modal-win-border)] bg-[var(--modal-win-bg)]'
            : 'border-[var(--modal-lose-border)] bg-[var(--modal-lose-bg)]'
        )}
      >
        <h2
          className={cn(
            'mb-2 text-2xl font-bold',
            isWin
              ? 'text-[var(--modal-win-text)]'
              : 'text-[var(--modal-lose-text)]'
          )}
        >
          {isWin ? t.modalWindows.titleWin : t.modalWindows.titleLose}
        </h2>
        <div className="space-y-1 text-white">
          <p>
            {isWin ? t.modalWindows.win : t.modalWindows.lose} $
            {formatNumber(amount)}
          </p>
          {isWin && multiplier && (
            <p>
              {t.modalWindows.multiplier} {formatNumber(multiplier)}x
            </p>
          )}
          <p>
            {t.modalWindows.tilesRevealed} {tilesRevealed}
          </p>
        </div>
      </div>
    </div>
  );
};
