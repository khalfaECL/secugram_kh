import React, { createContext, useContext, useState } from 'react';
import { DarkColors, LightColors } from '../theme';

const ThemeCtx = createContext(null);

const COOLDOWN_MIN = 1;   // minutes
const COOLDOWN_MAX = 60;  // minutes

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [viewCooldown, setViewCooldownRaw] = useState(10); // minutes

  const colors = isDark ? DarkColors : LightColors;
  const toggleTheme = () => setIsDark(d => !d);

  const setViewCooldown = (val) => {
    const clamped = Math.max(COOLDOWN_MIN, Math.min(COOLDOWN_MAX, Math.round(val)));
    setViewCooldownRaw(clamped);
  };

  return (
    <ThemeCtx.Provider value={{
      colors, isDark, toggleTheme,
      viewCooldown, setViewCooldown,
      COOLDOWN_MIN, COOLDOWN_MAX,
    }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
