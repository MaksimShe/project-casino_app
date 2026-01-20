'use client';

import { useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import logoIcon from '@/../public/logo/logo-header.svg';
import coinIcon from '@/../public/leaderboard_icons/dollar.svg';
import settingIcon from '@/../public/logo/setting.svg';
import logoutIcon from '@/../public/logo/login.svg';
import sideMenuIcon from '@/../public/logo/side-menu.svg';
import { formatNumber } from '@/utils/format';

import { ROUTES } from '@/constants/routes';
import { authService } from '@/services/AuthService.class';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { SideBar } from '@/components/SideBar/SideBar';

const HIDDEN_HEADER_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTRATION];

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { data: user } = useCurrentUser();

  const handleCloseSidebar = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsSidebarOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const handleSettingsClick = () => {
    // TODO: Implement settings functionality
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      authService.removeTokens();
      router.push(ROUTES.LOGIN);
    }
  };

  if (HIDDEN_HEADER_ROUTES.includes(pathname as typeof ROUTES.LOGIN)) {
    return null;
  }

  return (
    <>
      <header className="fixed top-0 z-50 flex h-24 w-full items-center justify-between bg-gradient-to-b from-[#0F0C29] via-[#312C5F] to-[#24243E] px-16 max-lg:h-16 max-lg:bg-none max-lg:px-4">
        <div className="inline-flex h-full items-center gap-2 max-lg:hidden">
          <span className="text-2xl font-black text-white">Blaze</span>
          <Image src={logoIcon} alt="logo" height={48} width={48} />
          <span className="text-2xl font-black text-white">Casino</span>
        </div>

        <button
          onClick={() => setIsSidebarOpen(true)}
          className="hidden h-10 w-10 items-center justify-center rounded-lg max-lg:flex"
        >
          <Image src={sideMenuIcon} alt="menu" height={32} width={32} />
        </button>

        <div className="hidden flex-1 items-center justify-center max-lg:flex">
          <div className="flex gap-2 rounded-4xl border px-4 py-2 backdrop-blur-sm">
            <Image
              src={coinIcon}
              alt="dollar"
              height={24}
              width={24}
              className="h-6 w-6 object-contain"
            />
            <span className="text-base text-white">
              {user?.balance === undefined ? '--' : formatNumber(user?.balance)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-14 max-lg:hidden">
          <div className="flex items-center gap-4">
            <div className="flex gap-2 rounded-4xl border px-6 py-3">
              <Image
                src={coinIcon}
                alt="dollar"
                height={32}
                width={32}
                className="h-8 w-8 object-contain"
              />
              <span className="text-xl text-white">
                {user?.balance?.toFixed(2) ?? '--'}
              </span>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-b from-[#FFCD71] to-[#E59603] p-0.5">
              <div className="relative h-full w-full overflow-hidden rounded-full">
                {user?.avatarURL ? (
                  <Image
                    src={user.avatarURL}
                    alt="avatar"
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-[#0F0C29] text-lg font-bold text-white">
                    {user?.username?.charAt(0).toUpperCase() ?? '?'}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={handleSettingsClick}>
              <Image src={settingIcon} alt="setting" height={26} width={26} />
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex h-10 w-28 items-center rounded-2xl bg-gradient-to-b from-[#FFCD71] to-[#E59603] pr-1 pl-3 font-bold text-white"
            >
              Log out
              <Image src={logoutIcon} alt="logout" height={32} width={32} />
            </button>
          </div>
        </div>

        <div className="hidden h-11 w-11 items-center justify-center rounded-full bg-gradient-to-b from-[#FFCD71] to-[#E59603] p-0.5 max-lg:flex">
          <div className="relative h-full w-full overflow-hidden rounded-full">
            {user?.avatarURL ? (
              <Image
                src={user.avatarURL}
                alt="avatar"
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-[#0F0C29] font-bold text-white">
                {user?.username?.charAt(0).toUpperCase() ?? '?'}
              </span>
            )}
          </div>
        </div>
      </header>

      <SideBar
        isOpen={isSidebarOpen}
        isClosing={isClosing}
        onClose={handleCloseSidebar}
        onSettingsClick={handleSettingsClick}
        onLogout={handleLogout}
      />
    </>
  );
};
