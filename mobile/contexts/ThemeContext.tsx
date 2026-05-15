import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface ThemeCtx {
  dark: boolean;
  toggle: () => void;
  setDark: (v: boolean) => void;
}

const Ctx = createContext<ThemeCtx | null>(null);
const KEY = 'ct-dark';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDarkState] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(KEY);
      const systemDark = Appearance.getColorScheme() === 'dark';
      const isDark = stored === '1' || (!stored && systemDark);
      setDarkState(isDark);
    })();
  }, []);

  const setDark = (v: boolean) => {
    setDarkState(v);
    AsyncStorage.setItem(KEY, v ? '1' : '0').catch(() => {});
  };

  return <Ctx.Provider value={{ dark, toggle: () => setDark(!dark), setDark }}>{children}</Ctx.Provider>;
}

export function useTheme(): ThemeCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useTheme must be used within ThemeProvider');
  return c;
}
