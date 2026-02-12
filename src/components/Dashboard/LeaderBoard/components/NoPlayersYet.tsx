import { useTranslation } from '@/i18n/useTranslation';

export const NoPlayersYet = () => {
  const { t } = useTranslation();
  return (
    <p className="text-center text-[var(--main-text-color)]">
      {t.leaderboard.noPlayers}
    </p>
  );
};
