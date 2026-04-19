'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';

const THEME_COLORS = {
  light: '#E7ECF5',
  dark: '#161B26',
} as const;

export function ThemeColorSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const color =
      resolvedTheme === 'dark' ? THEME_COLORS.dark : THEME_COLORS.light;

    document
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((el) => el.remove());

    const meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    meta.setAttribute('content', color);
    document.head.appendChild(meta);
  }, [resolvedTheme]);

  return null;
}
