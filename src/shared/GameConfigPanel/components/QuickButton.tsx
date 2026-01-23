'use client';

import { type FC } from 'react';

interface QuickButtonProps {
  label: string;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
}

export const QuickButton: FC<QuickButtonProps> = ({
  label,
  onClick,
  isActive = false,
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md px-2 py-1 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        isActive
          ? 'bg-[#6A5CA8] text-white'
          : 'bg-[#302C55] hover:bg-[#301C55] active:bg-[#220C30]'
      }`}
    >
      {label}
    </button>
  );
};
