import React from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  id,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={id} className="mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        className={twMerge(
          'rounded-xl bg-white px-4 py-2 text-black placeholder:text-[#ADB5BD]',
          className
        )}
        {...props}
      />
    </div>
  );
};
