import { caseService } from '@/services/CaseService.class';
import { getServerAccessToken } from '@/utils/serverAuth';
import { CaseDetailClient } from '../../../../components/CaseGame/CaseDetailClient';

interface PageProps {
  params: Promise<{ caseId: string }>;
}

export default async function CaseDetailPage({ params }: PageProps) {
  const { caseId } = await params;
  const token = await getServerAccessToken();

  let caseData;
  let casesData;

  if (token) {
    try {
      [caseData, casesData] = await Promise.all([
        caseService.getCaseDetails(caseId, token),
        caseService.getAllCases(token),
      ]);
    } catch (error) {
      console.error('Failed to fetch case details server-side:', error);
    }
  }

  return (
    <CaseDetailClient
      caseId={caseId}
      initialCaseData={caseData}
      initialAllCases={casesData?.cases}
    />
  );
}
