'use client';

import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/** Fallback for routes without a portfolio or writing surface. */
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
  const pathname = usePathname();

  useEffect(() => {
    if (!resolvedTheme) return;
    // next-themes applies the html class in its own effect. Read the surface
    // on the next frame so its computed color belongs to the selected theme.
    const frame = requestAnimationFrame(() => {
      const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
      const surface = Array.from(
        document.querySelectorAll<HTMLElement>('.dp-root, .mobile-portfolio, .writing-theme')
      ).find((element) => element.getClientRects().length > 0);
      if (meta) {
        // The token is the target color. backgroundColor can still report the
        // previous color while a CSS transition is starting.
        meta.content = surface
          ? getComputedStyle(surface).getPropertyValue('--background').trim()
          : THEME_COLORS[resolvedTheme] ?? THEME_COLORS.dark;
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [resolvedTheme, pathname]);

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
