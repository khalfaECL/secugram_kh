import React, { createContext, useContext, useState } from 'react';
import { DarkColors, LightColors } from '../theme';

const ThemeCtx = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false); // default: light mode
  const colors = isDark ? DarkColors : LightColors;
  const toggleTheme = () => setIsDark(d => !d);
  return (
    <ThemeCtx.Provider value={{ colors, isDark, toggleTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
