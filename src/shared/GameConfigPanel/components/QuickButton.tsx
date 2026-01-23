'use client';

import { type FC } from 'react';

interface QuickButtonProps {
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

export const QuickButton: FC<QuickButtonProps> = ({
  label,
  onClick,
  isActive = false,
}) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-2 py-1 text-xs transition-colors ${
        isActive
          ? 'bg-[#6A5CA8] text-white'
          : 'bg-[#302C55] hover:bg-[#301C55] active:bg-[#220C30]'
      }`}
    >
      {label}
    </button>
  );
};
