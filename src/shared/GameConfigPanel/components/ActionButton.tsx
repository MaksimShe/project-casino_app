'use client';

import { type FC, useState, useEffect } from 'react';

export interface ButtonState {
  label: string;
  className?: string;
  onClick?: () => void;
}

interface ActionButtonProps {
  primaryState: ButtonState;
  secondaryState?: ButtonState;
  isSecondary?: boolean;
  onToggle?: (isSecondary: boolean) => void;
  disabled?: boolean;
}

export const ActionButton: FC<ActionButtonProps> = ({
  primaryState,
  secondaryState,
  isSecondary: controlledIsSecondary,
  onToggle,
  disabled = false,
}) => {
  const [internalIsSecondary, setInternalIsSecondary] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const hasSecondary = !!secondaryState;
  const isControlled = controlledIsSecondary !== undefined;
  const isSecondary =
    hasSecondary &&
    (isControlled ? controlledIsSecondary : internalIsSecondary);

  useEffect(() => {
    if (isControlled && hasSecondary) {
      if (controlledIsSecondary !== internalIsSecondary) {
        setIsAnimating(true);
        const timeout = setTimeout(() => {
          setInternalIsSecondary(controlledIsSecondary);
          setIsAnimating(false);
        }, 150);
        return () => clearTimeout(timeout);
      }
    }
  }, [controlledIsSecondary, isControlled, hasSecondary, internalIsSecondary]);

  const currentState = isSecondary ? secondaryState! : primaryState;

  const handleClick = () => {
    if (disabled) return;

    currentState.onClick?.();

    if (!hasSecondary) return;

    setIsAnimating(true);

    setTimeout(() => {
      const newIsSecondary = !isSecondary;

      if (!isControlled) {
        setInternalIsSecondary(newIsSecondary);
      }

      onToggle?.(newIsSecondary);
      setIsAnimating(false);
    }, 150);
  };

  const defaultPrimaryClass = 'bg-red-500 hover:bg-red-600';
  const defaultSecondaryClass = 'bg-yellow-500 hover:bg-yellow-600 text-black';

  const buttonClass =
    currentState.className ||
    (isSecondary ? defaultSecondaryClass : defaultPrimaryClass);

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isAnimating}
      className={`w-full rounded-lg py-2 text-sm font-semibold transition-all duration-150 ${buttonClass} ${
        disabled ? 'cursor-not-allowed opacity-50' : ''
      } ${isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}
    >
      <span
        className={`inline-block transition-all duration-150 ${
          isAnimating ? 'translate-y-1 opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        {currentState.label}
      </span>
    </button>
  );
};
