import { redirect } from 'next/navigation';
import { getServerAccessToken } from '@/utils/serverAuth';
import { ROUTES } from '@/constants/routes';
import LoginClient from '@/components/Auth/LoginClient';

export default async function LoginPage() {
  const token = await getServerAccessToken();

  // Server-side redirect for authenticated users
  if (token) {
    redirect(ROUTES.HOMEPAGE);
  }

  return <LoginClient />;
}
