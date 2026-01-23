'use client';

import { type FC, useState } from 'react';
import { QuickButton } from './QuickButton';

interface OptionInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options?: string[];
  hasToggle?: boolean;
  toggleEnabled?: boolean;
  onToggleChange?: (enabled: boolean) => void;
  placeholder?: string;
}

export const OptionInput: FC<OptionInputProps> = ({
  label,
  value,
  onChange,
  options = [],
  hasToggle = false,
  toggleEnabled: controlledToggle,
  onToggleChange,
  placeholder = 'e.g 2.00',
}) => {
  const [internalToggle, setInternalToggle] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(
    options.length > 0 ? options[0] : null
  );

  const isToggleControlled = controlledToggle !== undefined;
  const toggleEnabled = isToggleControlled ? controlledToggle : internalToggle;

  const handleToggle = () => {
    const newValue = !toggleEnabled;
    if (!isToggleControlled) {
      setInternalToggle(newValue);
    }
    onToggleChange?.(newValue);
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    onChange(option);
  };

  return (
    <div>
      <label className="mb-1 block text-sm opacity-80">{label}</label>
      <div className="flex items-center gap-2 rounded-lg bg-[#7C7CE854] px-2.5 py-0.5">
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-10 flex-1 rounded-md bg-transparent px-3 py-2 text-sm font-medium text-white outline-none"
          placeholder={placeholder}
        />

        {options.length > 0 && (
          <div className="flex gap-1">
            {options.map(option => (
              <QuickButton
                key={option}
                label={option}
                onClick={() => handleOptionClick(option)}
                isActive={selectedOption === option}
              />
            ))}
          </div>
        )}

        {hasToggle && (
          <button
            onClick={handleToggle}
            className={`h-5 w-10 rounded-full transition-colors ${
              toggleEnabled ? 'bg-green-500' : 'bg-gray-500'
            }`}
          >
            <div
              className={`h-4 w-4 rounded-full bg-white transition-transform ${
                toggleEnabled ? 'translate-x-5.5' : 'translate-x-0.5'
              }`}
            />
          </button>
        )}
      </div>
    </div>
  );
};
