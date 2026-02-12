'use client';

import { useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import logoutIcon from '@/../public/logo/login.svg';
import sideMenuIcon from '@/../public/logo/side-menu.svg';

import { ROUTES } from '@/constants/routes';
import { authService } from '@/services/AuthService.class';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { SideBar } from '@/components/SideBar/SideBar';
import {
  Logo,
  BalanceDisplay,
  UserAvatar,
  SettingsDropdown,
} from './components';
import { useTranslation } from '@/i18n/useTranslation';

const HIDDEN_HEADER_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTRATION];

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { data: user } = useCurrentUser();
  const { t } = useTranslation();

  const handleCloseSidebar = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsSidebarOpen(false);
      setIsClosing(false);
    }, 300);
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
      <header className="fixed top-0 z-50 flex h-24 w-full items-center justify-between bg-gradient-to-b from-[var(--bg-gradient-start)] via-[var(--bg-gradient-mid)] to-[var(--bg-gradient-end)] px-16 max-lg:h-16 max-lg:bg-none max-lg:px-4">
        <div className="max-lg:hidden">
          <Logo />
        </div>

        <button
          onClick={() => setIsSidebarOpen(true)}
          className="hidden h-10 w-10 items-center justify-center rounded-lg max-lg:flex"
        >
          <Image src={sideMenuIcon} alt="menu" height={32} width={32} />
        </button>

        <div className="hidden flex-1 items-center justify-center max-lg:flex">
          <BalanceDisplay balance={user?.balance} variant="mobile" />
        </div>

        <div className="flex items-center gap-14 max-lg:hidden">
          <div className="flex items-center gap-4">
            <BalanceDisplay balance={user?.balance} variant="desktop" />
            <UserAvatar
              avatarURL={user?.avatarURL}
              username={user?.username}
              onClick={() => router.push('/profile')}
            />
          </div>
          <div className="flex gap-4">
            <SettingsDropdown />
            <button
              onClick={handleLogout}
              className="inline-flex h-10 w-28 items-center rounded-2xl bg-gradient-to-b from-[#FFCD71] to-[#E59603] pr-1 pl-3 font-bold text-[var(--main-text-color)]"
            >
              {t.header.logout}
              <Image src={logoutIcon} alt="logout" height={32} width={32} />
            </button>
          </div>
        </div>

        <div className="hidden max-lg:flex">
          <UserAvatar
            avatarURL={user?.avatarURL}
            username={user?.username}
            onClick={() => router.push('/profile')}
          />
        </div>
      </header>

      <SideBar
        isOpen={isSidebarOpen}
        isClosing={isClosing}
        onClose={handleCloseSidebar}
        onSettingsClick={() => {}}
        onLogout={handleLogout}
      />
    </>
  );
};
