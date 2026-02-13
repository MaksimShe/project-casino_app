'use client';

import { useState, useEffect } from 'react';
import { UserAvatar } from './UserAvatar';
import { useBonusStatus } from '@/hooks/useBonus';

interface UserAvatarWithIndicatorProps {
  avatarURL?: string;
  username?: string;
  size?: 'sm' | 'md';
  onClick?: () => void;
}

export const UserAvatarWithIndicator = (
  props: UserAvatarWithIndicatorProps
) => {
  const { data: bonusStatus } = useBonusStatus();
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    if (!bonusStatus?.nextClaimAt) {
      setShowIndicator(false);
      return;
    }

    const checkBonusAvailability = () => {
      const nextClaimTime = new Date(bonusStatus.nextClaimAt).getTime();
      const isAvailable = nextClaimTime <= Date.now();
      setShowIndicator(isAvailable);
      return isAvailable;
    };

    // Check immediately
    if (checkBonusAvailability()) {
      return; // Already available, no need for interval
    }

    // Check every second until bonus becomes available
    const interval = setInterval(() => {
      if (checkBonusAvailability()) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [bonusStatus?.nextClaimAt]);

  return (
    <div className="relative">
      <UserAvatar {...props} />
      {showIndicator && (
        <div className="pointer-events-none absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center">
          {/* Pulsing ring animation */}
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF417B] opacity-75" />
          {/* Solid red dot */}
          <span className="relative inline-flex h-3 w-3 rounded-full bg-[#FF0047] ring-2 ring-[var(--bg-gradient-start)]" />
        </div>
      )}
    </div>
  );
};
