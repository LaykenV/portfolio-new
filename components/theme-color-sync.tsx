'use client';

import { useEffect } from 'react';

const FALLBACK_CHROME_COLORS = {
  light: '#E7ECF5',
  dark: '#161B26',
} as const;

function readChromeColor(root: HTMLElement) {
  const cssColor = getComputedStyle(root).getPropertyValue('--chrome-bg').trim();
  if (cssColor) return cssColor;
  return root.classList.contains('dark')
    ? FALLBACK_CHROME_COLORS.dark
    : FALLBACK_CHROME_COLORS.light;
}

function syncThemeColorMeta(color: string) {
  const metas = Array.from(document.head.querySelectorAll('meta[name="theme-color"]'));

  if (metas.length === 0) {
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    meta.setAttribute('content', color);
    document.head.appendChild(meta);
    return;
  }

  for (const meta of metas) {
    meta.setAttribute('content', color);
    meta.removeAttribute('media');
  }
}

function apply(root: HTMLElement) {
  const color = readChromeColor(root);
  const isMobile = window.matchMedia('(max-width: 767px)').matches;

  syncThemeColorMeta(color);

  if (isMobile) {
    root.style.backgroundColor = color;
    if (document.body) {
      document.body.style.backgroundColor = color;
    }
    return;
  }

  root.style.removeProperty('background-color');
  if (document.body) {
    document.body.style.removeProperty('background-color');
  }
}

export function ThemeColorSync() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const sync = () => apply(root);

    sync();

    const observer = new MutationObserver(() => {
      sync();
      requestAnimationFrame(sync);
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return null;
}
