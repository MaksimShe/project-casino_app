'use client';

import { Leaderboard } from '@/components/Leaderboard';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { isAuthenticated } from '@/utils/token';

export default function MainPage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/homepage');
    }
  }, [router]);

  return (
    <div className="mt-20 ml-20">
      <Leaderboard />
    </div>
  );
}
