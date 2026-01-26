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
          ? 'bg-[var(--quick-btn-active)] text-white'
          : 'bg-[var(--quick-btn-default)] hover:bg-[var(--quick-btn-hover)] active:bg-[var(--quick-btn-pressed)]'
      }`}
    >
      {label}
    </button>
  );
};
