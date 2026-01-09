'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/utils/token';
import { useLogout } from '@/hooks/useAuth';

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { mutate: logout, isPending } = useLogout();

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated()) {
      router.push('/registration');
    }
  }, [router]);

  if (!mounted || !isAuthenticated()) {
    return null;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <div className="flex h-[100vh] w-full items-center justify-center">
        <div className="box-border flex w-[600px] flex-col items-center gap-8 rounded-[var(--main-radius)] bg-[#100F22] p-10">
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <h1>Blaze Casino</h1>
            <h2>Welcome back!</h2>
            <p className="text-center text-[var(--second-text-color)]">
              You are successfully logged in
            </p>
          </div>

          <div className="flex w-full flex-col gap-4">
            <button
              onClick={handleLogout}
              disabled={isPending}
              className="h-12 w-full rounded-3xl bg-gradient-to-t from-[#FF0047] to-[#FF417B] font-bold text-white transition-shadow duration-300 hover:shadow-[0_0_18px_0_#FF5A8C] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? 'Logging out...' : 'Logout'}
            </button>
          </div>

          <div className="w-full border-t pt-4">
            <p className="text-center text-xs text-[var(--second-text-color)]">
              Your session is active
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
