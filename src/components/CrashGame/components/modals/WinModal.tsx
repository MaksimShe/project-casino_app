import { formatNumber } from '@/utils/format';

interface WinModalProps {
  winAmount: number;
  multiplier: number;
}

export const WinModal = ({ winAmount, multiplier }: WinModalProps) => {
  return (
    <div className="absolute top-1/2 left-1/2 z-50 flex h-full w-full -translate-1/2 items-center justify-center rounded-xl bg-green-400/20 backdrop-blur-sm">
      <div className="rounded-xl border border-green-500 bg-green-700/60 p-6 backdrop-blur-lg">
        <h2 className="mb-2 text-2xl font-bold text-green-400">You Won!</h2>
        <p className="text-white">
          Win: ${formatNumber(winAmount)} ({formatNumber(multiplier)}x)
        </p>
      </div>
    </div>
  );
};
