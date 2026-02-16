'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/AuthService.class';
import { ROUTES } from '@/constants/routes';
import { FullScreenLoader } from '@/components/ui/FullScreenLoader';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.push(ROUTES.HOMEPAGE);
    } else {
      router.push(ROUTES.REGISTRATION);
    }
  }, [router]);

  return (
    <div className="-mt-[130px] h-[100vh] w-full bg-gradient-to-b from-[#0F0C29] via-[#302B63] to-[#24243E]">
      <FullScreenLoader />
    </div>
  );
}

//SheFing0@i.ua lg and pw
