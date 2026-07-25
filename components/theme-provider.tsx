'use client';

import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import type { ReactNode } from 'react';

/** Must track --background in globals.css for each theme. */
const THEME_COLORS: Record<string, string> = {
  light: '#FAF9F6',
  dark: '#0A0A0A',
};

/**
 * Keeps the browser chrome in step with the in-page theme. The static meta tag
 * in the layout covers the default; this corrects it once the stored
 * preference is known, and on every toggle.
 */
function ThemeColorSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!resolvedTheme) return;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) meta.content = THEME_COLORS[resolvedTheme] ?? THEME_COLORS.dark;
  }, [resolvedTheme]);

  return null;
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  return (
    // The toggle is strictly two-state, so "system" is unreachable in the UI —
    // enabling it would only add a media listener that can never win. The
    // view transition in AnimatedThemeToggler covers the swap, so
    // disableTransitionOnChange (which injects a global transition kill and
    // forces a reflow mid-transition) would only fight it.
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <ThemeColorSync />
      {children}
    </ThemeProvider>
  );
}
