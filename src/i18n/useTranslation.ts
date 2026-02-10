import { useGameStore } from '@/stores/useGameStore';
import { translations } from './translations';

export const useTranslation = () => {
  const language = useGameStore(state => state.language);
  const t = translations[language];

  return { t, language };
};
