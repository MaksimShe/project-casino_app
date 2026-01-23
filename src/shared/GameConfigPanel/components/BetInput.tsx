'use client';

import { type FC } from 'react';
import { QuickButton } from './QuickButton';
import { formatNumber } from '@/utils/format';

interface BetInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  maxValue?: number;
  placeholder?: string;
}

export const BetInput: FC<BetInputProps> = ({
  label,
  value,
  onChange,
  maxValue = 1000,
  placeholder = '10.00',
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = +formatNumber(parseFloat(e.target.value)) || 0;
    onChange(Math.max(1, Math.min(newValue, maxValue)));
  };

  const quickButtons = [
    { label: '1/2', onClick: () => onChange(Math.max(1, value / 2)) },
    { label: 'x2', onClick: () => onChange(Math.min(value * 2, maxValue)) },
    { label: 'max', onClick: () => onChange(maxValue) },
  ];

  return (
    <div>
      <label className="mb-1 block text-sm opacity-80">{label}</label>
      <div className="flex items-center gap-2 rounded-lg bg-[#7C7CE854] px-2.5 py-0.5">
        <input
          type="number"
          value={value || ''}
          onChange={handleInputChange}
          className="flex-1 rounded-md bg-transparent px-3 py-2 text-sm font-medium text-white outline-none"
          placeholder={placeholder}
          min={0}
          max={maxValue}
          step="0.01"
        />
        <div className="flex gap-1">
          {quickButtons.map(btn => (
            <QuickButton
              key={btn.label}
              label={btn.label}
              onClick={btn.onClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
