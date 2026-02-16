import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export enum AudioSound {
  BEEP = 'beep',
  NOTIFY = 'notify',
  GAME_CONFIG_CLICK = 'game-config-click',
  GAME_START = 'game-start',
  BOOM_MINES = 'boom-mines',
  DEFUSE_MINES = 'defuse-mines',
  ROULETTE_TICK = 'roulette_tick',
}

interface GameStore {
  isAudioOn: boolean;
  toggleAudio: () => void;
  isNotificationsOn: boolean;
  toggleNotifications: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  language: 'eng' | 'ua';
  toggleLanguage: () => void;
  playAudio: (soundName: AudioSound) => Promise<void>;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
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
      playAudio: async (soundName: AudioSound) => {
        if (get().isAudioOn) {
          try {
            const audio = new Audio(`/sounds/${soundName}.mp3`);
            await audio.play();
          } catch (error) {
            console.error('Error playing sound:', error);
          }
        }
      },
    }),
    {
      name: 'game-settings',
    }
  )
);
