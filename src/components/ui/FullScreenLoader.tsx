'use client';

import { type FC } from 'react';

interface Props {
  message?: string;
}

export const FullScreenLoader: FC<Props> = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-[#0F0C29] via-[#302B63] to-[#24243E]">
      {/* Animated casino chips */}
      <div className="relative mb-8 h-24 w-24">
        {/* Outer spinning ring */}
        <div
          className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#FFCD71] border-r-[#E59603]"
          style={{ animationDuration: '1.5s' }}
        />

        {/* Middle pulsing ring */}
        <div className="absolute inset-2 animate-pulse rounded-full border-4 border-[#FF417B]/30" />

        {/* Inner spinning ring (reverse) */}
        <div
          className="absolute inset-4 animate-spin rounded-full border-4 border-transparent border-b-[#FF417B] border-l-[#FF0047]"
          style={{ animationDuration: '1s', animationDirection: 'reverse' }}
        />

        {/* Center coin */}
        <div className="absolute inset-6 flex items-center justify-center rounded-full bg-gradient-to-br from-[#FFCD71] to-[#E59603] shadow-lg">
          <span className="text-2xl font-black text-[#0F0C29]">$</span>
        </div>
      </div>

      {/* Animated dots loader */}
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-white">{message}</span>
        <div className="flex gap-1">
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-[#FFCD71]"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-[#FFCD71]"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-[#FFCD71]"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>

      {/* Decorative floating elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top left glow */}
        <div className="absolute -top-20 -left-20 h-40 w-40 animate-pulse rounded-full bg-[#FF417B]/20 blur-3xl" />
        {/* Bottom right glow */}
        <div
          className="absolute -right-20 -bottom-20 h-40 w-40 animate-pulse rounded-full bg-[#FFCD71]/20 blur-3xl"
          style={{ animationDelay: '500ms' }}
        />
        {/* Center glow */}
        <div
          className="absolute top-1/2 left-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-[#302B63]/50 blur-3xl"
          style={{ animationDuration: '3s' }}
        />
      </div>
    </div>
  );
};
