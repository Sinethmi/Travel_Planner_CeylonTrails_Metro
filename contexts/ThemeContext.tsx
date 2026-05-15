'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ThemeCtx {
  dark: boolean;
  toggle: () => void;
  setDark: (v: boolean) => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('ct-dark');
    const isDark = stored === '1' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDark(isDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('ct-dark', dark ? '1' : '0');
  }, [dark]);

  return (
    <Ctx.Provider value={{ dark, toggle: () => setDark(v => !v), setDark }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTheme(): ThemeCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useTheme must be used within ThemeProvider');
  return c;
}
