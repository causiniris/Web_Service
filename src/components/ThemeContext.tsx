import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type ThemeMode = 'dark' | 'light' | 'auto';

interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  isDark: true,
  setMode: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function getSystemDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function resolveDark(mode: ThemeMode): boolean {
  if (mode === 'auto') return getSystemDark();
  return mode === 'dark';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('theme-mode') as ThemeMode) || 'dark';
  });
  const [isDark, setIsDark] = useState(() => resolveDark(mode));

  useEffect(() => {
    const dark = resolveDark(mode);
    setIsDark(dark);
    localStorage.setItem('theme-mode', mode);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [mode]);

  useEffect(() => {
    if (mode !== 'auto') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setIsDark(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, isDark, setMode: setModeState }}>
      {children}
    </ThemeContext.Provider>
  );
}
