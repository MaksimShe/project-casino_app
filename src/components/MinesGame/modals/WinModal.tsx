import { formatNumber } from '@/utils/format';
import { useMinesModalAutoClose } from '@/hooks/useMinesModalAutoClose';

interface WinModalProps {
  amount: number;
  multiplier: number;
  tilesRevealed: number;
  onNewGame: () => void;
}

export const WinModal = ({
  amount,
  multiplier,
  tilesRevealed,
  onNewGame,
}: WinModalProps) => {
  useMinesModalAutoClose(onNewGame);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center rounded-xl backdrop-blur-lg">
      <div className="rounded-xl border border-[var(--modal-win-border)] bg-[var(--modal-win-bg)] p-6">
        <h2 className="mb-2 text-2xl font-bold text-[var(--modal-win-text)]">
          You Won!
        </h2>
        <div className="space-y-1 text-white">
          <p>Win: ${formatNumber(amount)}</p>
          <p>Multiplier: {formatNumber(multiplier)}x</p>
          <p>Tiles Revealed: {tilesRevealed}</p>
        </div>
      </div>
    </div>
  );
};
