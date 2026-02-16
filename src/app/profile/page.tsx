import { getServerAccessToken } from '@/utils/serverAuth';
import { authService } from '@/services/AuthService.class';
import { bonusService } from '@/services/BonusService.class';
import { UserProfileClient } from '@/components/UserProfile';

export default async function ProfilePage() {
  const token = await getServerAccessToken();

  let userData = null;
  let leaderboardData = null;
  let bonusStatus = null;

  if (token) {
    try {
      [userData, leaderboardData, bonusStatus] = await Promise.all([
        authService.getCurrentUser(token),
        authService.getLeaderboard('all', token),
        bonusService.getBonusStatus(token),
      ]);
    } catch (error) {
      console.error('Failed to fetch profile data server-side:', error);
    }
  }

  return (
    <UserProfileClient
      initialUser={userData}
      initialLeaderboard={leaderboardData}
      initialBonusStatus={bonusStatus}
    />
  );
}
