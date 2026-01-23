'use client';

import { type FC, useState, useEffect } from 'react';
import dollarIcon from '@/../public/leaderboard_icons/dollar-icon.svg';
import walletIcon from '@/../public/leaderboard_icons/wallet.svg';
import Image from 'next/image';

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

  const defaultPrimaryClass =
    'bg-gradient-to-t from-[#BA0034] to-[#FF185F] hover:shadow-[0_0_10px_#FF185F]';
  const defaultSecondaryClass =
    'bg-gradient-to-b from-[#FFCD71] to-[#E59603] hover:shadow-[0_0_10px_#E59603]';

  const buttonClass =
    currentState.className ||
    (isSecondary ? defaultSecondaryClass : defaultPrimaryClass);

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isAnimating}
      className={`relative w-full rounded-full py-2 text-[16px] font-semibold text-white transition-all duration-150 ${buttonClass} ${
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
      <Image
        src={isSecondary ? dollarIcon : walletIcon}
        alt="wallet"
        width={20}
        height={20}
        className={`absolute top-1/2 right-3 -translate-y-1/2 transition-all duration-150 ${
          isAnimating
            ? 'translate-y-[-calc(50%-0.25rem)] opacity-0'
            : 'opacity-100'
        }`}
      />
    </button>
  );
};
