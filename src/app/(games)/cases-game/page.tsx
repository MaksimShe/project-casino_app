import { caseService } from '@/services/CaseService.class';
import { getServerAccessToken } from '@/utils/serverAuth';
import { CasesGameClient } from '../../../components/CaseGame/CasesGameClient';

export default async function CasesGamePage() {
  const token = await getServerAccessToken();

  if (!token) {
    return <CasesGameClient initialCases={[]} />;
  }

  try {
    const casesData = await caseService.getAllCases(token);
    const cases = casesData?.cases.sort((a, b) => a.price - b.price) || [];
    return <CasesGameClient initialCases={cases} />;
  } catch (error) {
    console.error('Failed to fetch cases server-side:', error);
    return <CasesGameClient initialCases={[]} />;
  }
}
