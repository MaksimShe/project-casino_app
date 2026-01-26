'use client';

import { type FC } from 'react';
import { QuickButton } from './QuickButton';
import { formatNumber } from '@/utils/format';
import Image from 'next/image';
import coinImg from '@/../public/leaderboard_icons/dollar.svg';

interface BetInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  maxValue?: number;
  placeholder?: string;
  balance?: number;
  disabled?: boolean;
}

export const BetInput: FC<BetInputProps> = ({
  label,
  value,
  onChange,
  maxValue = 1000,
  placeholder = '10.00',
  balance,
  disabled = false,
}) => {
  const effectiveMax =
    balance !== undefined ? Math.min(maxValue, balance) : maxValue;
  const isDisabled = disabled || (balance !== undefined && balance < 1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow empty input for user to delete
    if (inputValue === '' || inputValue === '0') {
      onChange(0);
      return;
    }

    const newValue = +formatNumber(parseFloat(inputValue)) || 0;
    onChange(Math.min(newValue, effectiveMax));
  };

  const handleBlur = () => {
    // Ensure minimum value of 1 when user leaves the input
    if (value < 1) {
      onChange(1);
    }
  };

  const quickButtons = [
    { label: '1/2', onClick: () => onChange(Math.max(1, value / 2)) },
    { label: 'x2', onClick: () => onChange(Math.min(value * 2, effectiveMax)) },
    { label: 'max', onClick: () => onChange(effectiveMax) },
  ];

  return (
    <div>
      <label className="mb-1 block text-sm opacity-80">{label}</label>
      <div className="flex items-center gap-2 rounded-lg bg-[var(--panel-input-bg)] px-2.5 py-0.5">
        <Image src={coinImg} alt="$" height={24} width={24} />
        <input
          type="number"
          value={value || ''}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className="flex-1 rounded-md bg-transparent px-1 py-2 text-sm font-medium text-white outline-none disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={placeholder}
          min={0}
          max={effectiveMax}
          step="0.01"
          disabled={isDisabled}
        />
        <div className="flex gap-1">
          {quickButtons.map(btn => (
            <QuickButton
              key={btn.label}
              label={btn.label}
              onClick={btn.onClick}
              disabled={isDisabled}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
