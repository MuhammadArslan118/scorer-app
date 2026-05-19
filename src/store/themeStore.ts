import { create } from 'zustand';
import { COLORS } from '../constants/theme';
import { localStorageService } from '../services/localStorage';

type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  colors: typeof COLORS.light;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  loadTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'light',
  colors: COLORS.light,

  toggleTheme: () =>
    set((state) => {
      const newMode = state.mode === 'light' ? 'dark' : 'light';
      localStorageService.saveTheme(newMode);
      return { mode: newMode, colors: COLORS[newMode] };
    }),

  setTheme: (mode) => {
    localStorageService.saveTheme(mode);
    set({ mode, colors: COLORS[mode] });
  },

  loadTheme: async () => {
    const mode = await localStorageService.getTheme();
    set({ mode, colors: COLORS[mode] });
  },
}));
