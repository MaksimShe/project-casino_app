'use client';

import { type FC } from 'react';

interface QuickButtonProps {
  label: string;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  onSound?: () => void;
}

export const QuickButton: FC<QuickButtonProps> = ({
  label,
  onClick,
  isActive = false,
  disabled = false,
  onSound,
}) => {
  const handleClick = () => {
    onSound?.();
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`rounded-md px-2 py-1 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        isActive
          ? 'bg-[var(--quick-btn-active)] text-[var(--main-text-color)]'
          : 'bg-[var(--quick-btn-default)] hover:bg-[var(--quick-btn-hover)] active:bg-[var(--quick-btn-pressed)]'
      }`}
    >
      {label}
    </button>
  );
};
