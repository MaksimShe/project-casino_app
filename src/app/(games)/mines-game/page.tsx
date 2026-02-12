import { minesService } from '@/services/MinesService.class';
import { getServerAccessToken } from '@/utils/serverAuth';
import { MinesGameClient } from '@/components/MinesGame/MinesGameClient';

export default async function MinesGamePage() {
  const token = await getServerAccessToken();
  let activeGame = null;

  if (token) {
    try {
      activeGame = await minesService.getActiveGame(token);
    } catch (error) {
      console.error('Failed to fetch active game:', error);
    }
  }

  return <MinesGameClient activeGameData={activeGame} />;
}
