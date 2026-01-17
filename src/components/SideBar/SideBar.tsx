'use client';

import Image from 'next/image';
import logoIcon from '@/../public/logo/logo-header.svg';
import settingIcon from '@/../public/logo/setting.svg';
import logoutIcon from '@/../public/logo/login.svg';
import inventoryIcon from '@/../public/logo/invertory.svg';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

interface SideBarProps {
  isOpen: boolean;
  isClosing: boolean;
  onClose: () => void;
  onSettingsClick: () => void;
  onLogout: () => void;
}

export const SideBar = ({
  isOpen,
  isClosing,
  onClose,
  onSettingsClick,
  onLogout,
}: SideBarProps) => {
  useLockBodyScroll(isOpen);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 hidden max-lg:block ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div
        className={`absolute top-0 left-0 flex h-full w-72 flex-col bg-[#0F0C29] p-6 ${isClosing ? 'animate-slide-left' : 'animate-slide-right'}`}
      >
        <div className="mb-8 flex items-center gap-2">
          <p className="text-2xl font-bold text-white">Blaze</p>
          <Image src={logoIcon} alt="logo" height={48} width={48} />
          <p className="text-2xl font-bold text-white">Casino</p>
        </div>

        <div className="flex flex-col gap-4">
          <button className="flex items-center gap-3 rounded-xl bg-[#423E6980] p-3 text-white hover:bg-[#24243F]">
            <Image src={inventoryIcon} alt="inventory" height={24} width={18} />
            <span>Inventory</span>
          </button>
          <button
            onClick={onSettingsClick}
            className="flex items-center gap-3 rounded-xl bg-[#423E6980] p-3 text-white hover:bg-[#24243F]"
          >
            <Image src={settingIcon} alt="setting" height={24} width={24} />
            <span>Settings</span>
          </button>
        </div>

        <div className="mt-auto">
          <button
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-0.5 rounded-xl bg-gradient-to-b from-[#FFCD71] to-[#E59603] p-3 font-bold text-white"
          >
            <span>Log out</span>
            <Image src={logoutIcon} alt="logout" height={24} width={24} />
          </button>
        </div>
      </div>
    </div>
  );
};
