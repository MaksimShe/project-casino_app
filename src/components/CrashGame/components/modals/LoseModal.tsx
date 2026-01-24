import { formatNumber } from '@/utils/format';

interface LoseModalProps {
  betAmount: number;
  crashPoint: number;
}

export const LoseModal = ({ betAmount, crashPoint }: LoseModalProps) => {
  return (
    <div className="absolute top-1/2 left-1/2 z-50 flex h-full w-full -translate-1/2 items-center justify-center rounded-xl bg-black/50 backdrop-blur-xs">
      <div className="rounded-xl border border-red-500 bg-red-700/10 p-6 backdrop-blur-none">
        <h2 className="mb-2 text-2xl font-bold text-red-400">You Lost!</h2>
        <p className="text-white">
          Lost: ${formatNumber(betAmount)} (Crashed at{' '}
          {formatNumber(crashPoint)}x)
        </p>
      </div>
    </div>
  );
};
