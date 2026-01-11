'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import logoIcon from '@/../public/logo/logo-header.svg';
import coinIcon from '@/../public/leaderboard_icons/dollar.svg';
import settingIcon from '@/../public/logo/setting.svg';
import logoutIcon from '@/../public/logo/login.svg';
import { ROUTES } from '@/constants/routes';

const balance = 10000;

const HIDDEN_HEADER_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTRATION];

export const Header = () => {
  const pathname = usePathname();

  if (HIDDEN_HEADER_ROUTES.includes(pathname as typeof ROUTES.LOGIN)) {
    return null;
  }

  return (
    <header className="fixed top-0 z-50 flex h-24 w-full items-center justify-between bg-gradient-to-b from-[#0F0C29] via-[#312C5F] to-[#24243E]">
      <div className="ml-16 inline-flex h-full items-center gap-2">
        <h1>Blaze</h1>
        <Image src={logoIcon} alt="logo" height={64} width={64} />
        <h1>Casino</h1>
      </div>
      <div className="mr-16 flex items-center justify-center gap-20">
        <div className="flex gap-4">
          <div className="flex gap-2 rounded-4xl border px-6 py-3">
            <Image src={coinIcon} alt="dollar" height={32} width={32} />
            <span className="text-xl text-white">{balance}</span>
          </div>
          <div className="flex items-center">ava</div>
        </div>
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
    </header>
  );
};
