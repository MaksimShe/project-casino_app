import { cookies } from 'next/headers';

/**
 * Server-side auth utilities for Next.js server components
 */
export async function getServerAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken');
  return token?.value || null;
}

export async function getServerRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('refreshToken');
  return token?.value || null;
}
