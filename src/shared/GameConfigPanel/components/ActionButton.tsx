'use client';

import { type FC, useState, useEffect, useRef } from 'react';
import dollarIcon from '@/../public/leaderboard_icons/dollar-icon.svg';
import walletIcon from '@/../public/leaderboard_icons/wallet.svg';
import Image from 'next/image';

export interface ButtonState {
  label: string;
  className?: string;
  onClick?: () => void;
  clickCooldown?: number;
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
  const clickCooldownRef = useRef(false);

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
    if (disabled || clickCooldownRef.current) return;

    currentState.onClick?.();

    if (primaryState.clickCooldown && primaryState.clickCooldown > 0) {
      clickCooldownRef.current = true;

      setTimeout(() => {
        clickCooldownRef.current = false;
      }, primaryState.clickCooldown);
    }

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
    'bg-gradient-to-t from-[var(--btn-primary-start)] to-[var(--btn-primary-end)] hover:shadow-[0_0_10px_var(--btn-primary-shadow)]';
  const defaultSecondaryClass =
    'bg-gradient-to-b from-[var(--btn-secondary-start)] to-[var(--btn-secondary-end)] hover:shadow-[0_0_10px_var(--btn-secondary-shadow)]';

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
