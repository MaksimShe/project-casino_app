import Image from 'next/image';
import coinIcon from '@/../public/leaderboard_icons/dollar.svg';
import { formatNumber } from '@/utils/format';

interface BalanceDisplayProps {
  balance?: number;
  variant?: 'desktop' | 'mobile';
}

export const BalanceDisplay = ({
  balance,
  variant = 'desktop',
}: BalanceDisplayProps) => {
  if (variant === 'mobile') {
    return (
      <div className="flex gap-2 rounded-4xl border px-4 py-2 backdrop-blur-sm">
        <Image
          src={coinIcon}
          alt="dollar"
          height={24}
          width={24}
          className="h-6 w-6 object-contain"
        />
        <span className="text-base text-white">
          {balance === undefined ? '--' : formatNumber(balance)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex gap-2 rounded-4xl border px-6 py-3">
      <Image
        src={coinIcon}
        alt="dollar"
        height={32}
        width={32}
        className="h-8 w-8 object-contain"
      />
      <span className="text-xl text-white">{balance?.toFixed(2) ?? '--'}</span>
    </div>
  );
};
