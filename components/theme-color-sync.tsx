'use client';

import { useEffect } from 'react';

const THEME_COLORS = {
  light: '#E7ECF5',
  dark: '#161B26',
} as const;

function apply(isDark: boolean) {
  const color = isDark ? THEME_COLORS.dark : THEME_COLORS.light;
  document.head
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((el) => el.remove());
  const meta = document.createElement('meta');
  meta.setAttribute('name', 'theme-color');
  meta.setAttribute('content', color);
  document.head.appendChild(meta);
}

export function ThemeColorSync() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    apply(root.classList.contains('dark'));

    const observer = new MutationObserver(() => {
      apply(root.classList.contains('dark'));
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return null;
}
