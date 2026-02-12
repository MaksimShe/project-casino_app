import { getServerAccessToken } from '@/utils/serverAuth';
import { plinkoService } from '@/services/PlinkoService.class';
import PlinkoGameClient from '@/components/PlinkoGame/PlinkoGameClient';

const DEFAULT_RISK = 'low' as const;
const DEFAULT_LINES = 8 as const;

export default async function PlinkoGamePage() {
  const token = await getServerAccessToken();
  let multipliers = null;

  if (token) {
    try {
      const data = await plinkoService.getMultipliers(
        DEFAULT_RISK,
        DEFAULT_LINES,
        token
      );
      multipliers = data.multipliers;
    } catch (error) {
      console.error('Failed to fetch plinko multipliers:', error);
    }
  }

  return <PlinkoGameClient initialMultipliers={multipliers} />;
}
