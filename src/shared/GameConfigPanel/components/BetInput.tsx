'use client';

import React, {
  type FC,
  useRef,
  useState,
  useEffect,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
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
  onSound?: () => void;
}

export const BetInput: FC<BetInputProps> = ({
  label,
  value,
  onChange,
  maxValue = 10000,
  placeholder = '10.00',
  balance,
  disabled = false,
  onSound,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [displayValue, setDisplayValue] = useState(value.toString());

  const effectiveMax =
    balance !== undefined ? Math.min(maxValue, balance) : maxValue;
  const isDisabled = disabled || (balance !== undefined && balance < 1);

  // Sync display value when prop value changes externally
  useEffect(() => {
    setDisplayValue(value.toString());
  }, [value]);

  const commitValue = (inputValue: string) => {
    if (inputValue === '' || inputValue === '0') {
      onChange(1);
      setDisplayValue('1');
      return;
    }

    const numValue = parseFloat(inputValue);
    if (isNaN(numValue)) {
      onChange(1);
      setDisplayValue('1');
      return;
    }

    const newValue = Math.min(
      Math.max(1, +formatNumber(numValue)),
      effectiveMax
    );
    onChange(newValue);
    setDisplayValue(newValue.toString());
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Block negative values
    if (inputValue.startsWith('-')) {
      return;
    }

    // Allow empty or partial numbers being typed
    if (inputValue === '' || inputValue === '0') {
      setDisplayValue(inputValue);
      return;
    }

    const numValue = parseFloat(inputValue);

    // Block values exceeding max while typing
    if (!isNaN(numValue) && numValue > effectiveMax) {
      return;
    }

    // Allow typing (including decimals)
    setDisplayValue(inputValue);
  };

  const handleBlur = () => {
    commitValue(displayValue);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      commitValue(displayValue);
      inputRef.current?.blur();
    }
  };

  const quickButtons = [
    {
      label: '1/2',
      onClick: () => {
        const newValue = Math.max(1, value / 2);
        onChange(newValue);
        setDisplayValue(newValue.toString());
      },
    },
    {
      label: 'x2',
      onClick: () => {
        const newValue = Math.min(value * 2, effectiveMax);
        onChange(newValue);
        setDisplayValue(newValue.toString());
      },
    },
    {
      label: 'max',
      onClick: () => {
        onChange(effectiveMax);
        setDisplayValue(effectiveMax.toString());
      },
    },
  ];

  return (
    <div>
      <label className="mb-1 block text-sm opacity-80">{label}</label>
      <div className="flex items-center gap-2 rounded-lg bg-[var(--panel-input-bg)] px-2.5 py-0.5">
        <Image src={coinImg} alt="$" height={24} width={24} />
        <input
          ref={inputRef}
          type="number"
          value={displayValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="flex-1 rounded-md bg-transparent px-1 py-2 text-sm font-medium text-[var(--main-text-color)] outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
              onSound={onSound}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
