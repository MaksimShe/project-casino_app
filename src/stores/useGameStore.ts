import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameStore {
  isAudioOn: boolean;
  toggleAudio: () => void;
  isNotificationsOn: boolean;
  toggleNotifications: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  language: 'eng' | 'ua';
  toggleLanguage: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    set => ({
      isAudioOn: true,
      toggleAudio: () => set(state => ({ isAudioOn: !state.isAudioOn })),
      isNotificationsOn: true,
      toggleNotifications: () =>
        set(state => ({ isNotificationsOn: !state.isNotificationsOn })),
      isDarkMode: true,
      toggleDarkMode: () => set(state => ({ isDarkMode: !state.isDarkMode })),
      language: 'eng',
      toggleLanguage: () =>
        set(state => ({ language: state.language === 'eng' ? 'ua' : 'eng' })),
    }),
    {
      name: 'game-settings',
    }
  )
);
