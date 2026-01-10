'use client';

import React, { useState } from 'react';
import closedEye from '@/../public/logo/closed-eye.svg';
import openedEye from '@/../public/logo/opened-eye.svg';
import Image from 'next/image';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const PasswordInput: React.FC<InputProps> = ({
  label,
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor="password" className="mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          {...props}
          id="password"
          name="password"
          type={isVisible ? 'text' : 'password'}
          value={props.value ?? ''}
          placeholder="Enter password"
          className={`w-full rounded-xl bg-white px-4 py-2 pr-12 text-black placeholder:text-[#ADB5BD] ${className}`}
        />

        <button
          type="button"
          onClick={() => setIsVisible(prev => !prev)}
          className="absolute top-1/2 right-3 -translate-y-1/2"
        >
          <Image
            src={isVisible ? openedEye : closedEye}
            alt="Toggle password visibility"
            width={20}
            height={20}
          />
        </button>
      </div>
    </div>
  );
};
