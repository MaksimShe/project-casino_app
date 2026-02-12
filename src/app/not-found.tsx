'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { isAuthenticated } from '@/utils/token';
import { ROUTES } from '@/constants/routes';

export default function NotFound() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsAuth(isAuthenticated());
    setIsLoading(false);
  }, []);

  return (
    <div className="-mt-[140px] flex h-[100vh] w-full flex-col items-center justify-center bg-gradient-to-b from-[#0F0C29] via-[#302B63] to-[#24243E]">
      <div className="flex flex-col items-center gap-6 text-center">
        <Image src="/logo/logo.svg" alt="logo" width={96} height={96} />
        <h1 className="text-8xl font-bold text-[var(--main-text-color)]">
          404
        </h1>
        <h2 className="text-2xl text-[var(--main-text-color)]">
          Page Not Found
        </h2>
        <p className="max-w-md text-[var(--second-text-color)]">
          The page you are looking for does not exist or has been moved.
        </p>
        {!isLoading && (
          <Link
            href={isAuth ? ROUTES.HOMEPAGE : ROUTES.REGISTRATION}
            className="mt-4 rounded-3xl bg-gradient-to-t from-[#FF0047] to-[#FF417B] px-8 py-3 font-bold text-[var(--main-text-color)] transition-shadow duration-300 hover:shadow-[0_0_18px_0_#FF5A8C]"
          >
            {isAuth ? 'Go to Homepage' : 'Register Now'}
          </Link>
        )}
      </div>
    </div>
  );
}
