'use client';

import { type FC, useState } from 'react';
import { type GameSettingConfig } from '../constants';

interface GameSettingsProps {
  settings: GameSettingConfig[];
  onSettingChange?: (title: string, value: string) => void;
}

export const GameSettings: FC<GameSettingsProps> = ({
  settings,
  onSettingChange,
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

  const handleSelect = (title: string, value: string) => {
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
                className={`rounded-md px-3.5 py-1.5 text-sm transition-colors ${
                  selectedValues[setting.title] === btn
                    ? 'bg-[#7F76CD] text-white'
                    : 'bg-[#302C55] hover:bg-[#5A4C98]'
                }`}
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
