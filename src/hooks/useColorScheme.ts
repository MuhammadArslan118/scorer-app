import { useThemeStore } from '../store/themeStore';

export function useColors() {
  const colors = useThemeStore((s) => s.colors);
  return colors;
}

export function useTheme() {
  const mode = useThemeStore((s) => s.mode);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const colors = useThemeStore((s) => s.colors);
  return { mode, toggleTheme, colors };
}
