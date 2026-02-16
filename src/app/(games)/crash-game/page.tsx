import { getServerAccessToken } from '@/utils/serverAuth';
import { crashService } from '@/services/CrashService.class';
import CrashGameClient from '@/components/CrashGame/CrashGameClient';

export default async function CrashGamePage() {
  const token = await getServerAccessToken();
  let currentGame = null;
  let allGames = null;

  if (token) {
    try {
      const [gameData, historyData] = await Promise.all([
        crashService.getCurrentGame(token),
        crashService.getAllGamesHistory(token, { limit: 10 }),
      ]);
      currentGame = gameData;
      allGames = historyData;
    } catch (error) {
      console.error('Failed to fetch crash game data:', error);
    }
  }

  return (
    <CrashGameClient initialGameState={currentGame} initialHistory={allGames} />
  );
}
