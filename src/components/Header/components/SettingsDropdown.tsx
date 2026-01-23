'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import settingIcon from '@/../public/logo/setting.svg';
import soundOnIcon from '@/../public/logo/sound-on.svg';
import soundOffIcon from '@/../public/logo/sound-off.svg';
import notificationOnIcon from '@/../public/logo/notification-on.svg';
import notificationOffIcon from '@/../public/logo/notification-off.svg';
import darkModeIcon from '@/../public/logo/dark-mode.svg';
import dayModeIcon from '@/../public/logo/day-mode.svg';
import gbIcon from '@/../public/logo/gb.svg';
import uaIcon from '@/../public/logo/ua.svg';
import { useGameStore } from '@/stores/useGameStore';
import { ToggleSwitch } from './ToggleSwitch';

export const SettingsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    isAudioOn,
    toggleAudio,
    isNotificationsOn,
    toggleNotifications,
    isDarkMode,
    toggleDarkMode,
    language,
    toggleLanguage,
  } = useGameStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative flex items-center">
      <button onClick={() => setIsOpen(!isOpen)}>
        <Image src={settingIcon} alt="setting" height={26} width={26} />
      </button>

      {isOpen && (
        <div className="animate-dropdown-slide absolute top-full right-0 z-50 mt-2 w-14 origin-top rounded-xl bg-[#1a1730] p-2 shadow-lg">
          <div className="flex flex-col gap-3">
            <ToggleSwitch
              isOn={isAudioOn}
              onToggle={toggleAudio}
              imgOn={soundOnIcon}
              imgOff={soundOffIcon}
            />
            <ToggleSwitch
              isOn={isNotificationsOn}
              onToggle={toggleNotifications}
              imgOn={notificationOnIcon}
              imgOff={notificationOffIcon}
            />
            <ToggleSwitch
              isOn={isDarkMode}
              onToggle={toggleDarkMode}
              imgOn={darkModeIcon}
              imgOff={dayModeIcon}
            />
            <ToggleSwitch
              isOn={language === 'eng'}
              onToggle={toggleLanguage}
              imgOn={gbIcon}
              imgOff={uaIcon}
            />
          </div>
        </div>
      )}
    </div>
  );
};
