'use client';

import { useState } from 'react';
import Image, { type StaticImageData } from 'next/image';

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
  imgOn: StaticImageData;
  imgOff: StaticImageData;
}

export const ToggleSwitch = ({
  isOn,
  onToggle,
  imgOn,
  imgOff,
}: ToggleSwitchProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onToggle();
      setTimeout(() => setIsAnimating(false), 150);
    }, 150);
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <Image
        src={isOn ? imgOn : imgOff}
        alt="toggle"
        height={40}
        width={40}
        onClick={handleClick}
        className={`cursor-pointer drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-200 hover:scale-110 hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] ${
          isAnimating ? 'scale-90 opacity-0' : 'scale-100 opacity-100'
        }`}
      />
    </div>
  );
};
