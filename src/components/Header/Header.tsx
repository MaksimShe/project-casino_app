'use client';

import { useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import logoIcon from '@/../public/logo/logo-header.svg';
import coinIcon from '@/../public/leaderboard_icons/dollar.svg';
import settingIcon from '@/../public/logo/setting.svg';
import logoutIcon from '@/../public/logo/login.svg';
import sideMenuIcon from '@/../public/logo/side-menu.svg';
import inventoryIcon from '@/../public/logo/invertory.svg';

import { ROUTES } from '@/constants/routes';

const balance = 10000;

const HIDDEN_HEADER_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTRATION];

export const Header = () => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleCloseSidebar = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsSidebarOpen(false);
      setIsClosing(false);
    }, 300);
  };

  if (HIDDEN_HEADER_ROUTES.includes(pathname as typeof ROUTES.LOGIN)) {
    return null;
  }

  return (
    <>
      <header className="fixed top-0 z-50 flex h-24 w-full items-center justify-between bg-gradient-to-b from-[#0F0C29] via-[#312C5F] to-[#24243E] px-16 max-lg:h-16 max-lg:px-4">
        <div className="inline-flex h-full items-center gap-2 max-lg:hidden">
          <h1>Blaze</h1>
          <Image src={logoIcon} alt="logo" height={64} width={64} />
          <h1>Casino</h1>
        </div>

        <button
          onClick={() => setIsSidebarOpen(true)}
          className="hidden h-10 w-10 items-center justify-center rounded-lg max-lg:flex"
        >
          <Image src={sideMenuIcon} alt="menu" height={32} width={32} />
        </button>

        <div className="flex gap-2 rounded-4xl border px-6 py-3 max-lg:px-4 max-lg:py-2">
          <Image
            src={coinIcon}
            alt="dollar"
            height={32}
            width={32}
            className="max-lg:h-6 max-lg:w-6"
          />
          <span className="text-xl text-white max-lg:text-base">{balance}</span>
        </div>

        <div className="flex items-center gap-20 max-lg:hidden">
          <div className="flex items-center">ava</div>
          <div className="flex gap-4">
            <button>
              <Image src={settingIcon} alt="setting" height={26} width={26} />
            </button>
            <button className="inline-flex h-10 items-center rounded-2xl bg-gradient-to-b from-[#FFCD71] to-[#E59603] pr-1 pl-3 font-bold text-white">
              Log out
              <Image src={logoutIcon} alt="logout" height={32} width={32} />
            </button>
          </div>
        </div>

        <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-[#24243F] max-lg:flex">
          <span className="text-white">A</span>
        </div>
      </header>

      {isSidebarOpen && (
        <div
          className={`fixed inset-0 z-50 hidden max-lg:block ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleCloseSidebar}
          />

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
                <Image
                  src={inventoryIcon}
                  alt="inventory"
                  height={24}
                  width={18}
                />
                <span>Inventory</span>
              </button>
              <button className="flex items-center gap-3 rounded-xl bg-[#423E6980] p-3 text-white hover:bg-[#24243F]">
                <Image src={settingIcon} alt="setting" height={24} width={24} />
                <span>Settings</span>
              </button>
            </div>

            <div className="mt-auto">
              <button className="flex w-full items-center gap-3 rounded-xl bg-gradient-to-b from-[#FFCD71] to-[#E59603] p-3 font-bold text-white">
                <Image src={logoutIcon} alt="logout" height={24} width={24} />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
