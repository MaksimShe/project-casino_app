import { formatNumber } from '@/utils/format';
import { useMinesModalAutoClose } from '@/hooks/useMinesModalAutoClose';

interface LoseModalProps {
  amount: number;
  tilesRevealed: number;
  onNewGame: () => void;
}

export const LoseModal = ({
  amount,
  tilesRevealed,
  onNewGame,
}: LoseModalProps) => {
  useMinesModalAutoClose(onNewGame);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center rounded-xl bg-black/50 backdrop-blur-xs">
      <div className="rounded-xl border border-[var(--modal-lose-border)] bg-[var(--modal-lose-bg)] p-6">
        <h2 className="mb-2 text-2xl font-bold text-[var(--modal-lose-text)]">
          You Lost!
        </h2>
        <div className="space-y-1 text-white">
          <p>Lost: ${formatNumber(amount)}</p>
          <p>Tiles Revealed: {tilesRevealed}</p>
        </div>
      </div>
    </div>
  );
};
