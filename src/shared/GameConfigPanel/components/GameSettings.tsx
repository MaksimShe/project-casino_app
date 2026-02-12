'use client';

import { type FC, useState, useEffect } from 'react';
import { type GameSettingConfig } from '../constants';

interface GameSettingsProps {
  settings: GameSettingConfig[];
  onSettingChange?: (title: string, value: string) => void;
  disabled?: boolean;
  currentValues?: Record<string, string>;
}

export const GameSettings: FC<GameSettingsProps> = ({
  settings,
  onSettingChange,
  disabled = false,
  currentValues,
}) => {
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>(
    () => {
      const initial: Record<string, string> = {};
      settings.forEach(setting => {
        if (setting.smallButtons.length > 0) {
          initial[setting.title] = setting.smallButtons[0];
        }
      });
      return initial;
    }
  );

  // Sync with external values when provided
  useEffect(() => {
    if (currentValues) {
      setSelectedValues(prev => ({ ...prev, ...currentValues }));
    }
  }, [currentValues]);

  const handleSelect = (title: string, value: string) => {
    if (disabled) return;
    setSelectedValues(prev => ({ ...prev, [title]: value }));
    onSettingChange?.(title, value);
  };

  if (!settings.length) return null;

  return (
    <div className="-mt-5 space-y-3">
      {settings.map(setting => (
        <div key={setting.title}>
          <div className="mb-1 text-sm opacity-80">{setting.title}</div>
          <div className="flex flex-wrap gap-2">
            {setting.smallButtons.map(btn => (
              <button
                key={btn}
                onClick={() => handleSelect(setting.title, btn)}
                disabled={disabled}
                className={`rounded-md px-3.5 py-1.5 text-sm transition-colors ${
                  selectedValues[setting.title] === btn
                    ? 'bg-[#7F76CD] text-[var(--main-text-color)]'
                    : 'bg-[#302C55] hover:bg-[#5A4C98]'
                } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
