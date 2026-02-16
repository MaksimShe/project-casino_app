import { redirect } from 'next/navigation';
import { getServerAccessToken } from '@/utils/serverAuth';
import { ROUTES } from '@/constants/routes';
import RegistrationClient from '@/components/Auth/RegistrationClient';

export default async function RegistrationPage() {
  const token = await getServerAccessToken();

  if (token) {
    redirect(ROUTES.HOMEPAGE);
  }

  return <RegistrationClient />;
}
