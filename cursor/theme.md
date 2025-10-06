## Theme toggling plan (next-themes + Tailwind v4) for portfolio-new

Goals
- Add a minimal light/dark mode toggle as a placeholder until the full palette is designed.
- Preserve SSG and keep client JS minimal; avoid converting the app to a full Client tree.
- Avoid FOUC and hydration warnings; keep UX smooth during theme changes.

Stack and constraints
- Next.js 15 (App Router), React 19, TypeScript.
- Tailwind CSS v4 with `@theme inline` (no tailwind.config needed).
- next-themes is installed (`next-themes`), which handles persistence and pre-render script injection.

Key decisions
- Use next-themes `ThemeProvider` with `attribute="class"`, so Tailwind `dark:` utilities are controlled by a `.dark` class on `<html>`.
- Keep `app/layout.tsx` as a Server Component to preserve SSG/static optimization. Introduce a tiny Client Component provider.
- Switch CSS variables via a `.dark` class instead of `@media (prefers-color-scheme: dark)` so UI follows the selected theme, not only system preference.
- Gate the toggle UI behind a mounted state to avoid hydration mismatches; optionally lazy-load the toggle if desired.
- Keep colors pure black/white for now; easy to replace later with a tokenized palette.

File-by-file edits
1) app/theme-provider.tsx (new)
   - Purpose: Client-only wrapper for next-themes.
   - Implementation:
```tsx
'use client';

import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

export function AppThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
```

2) app/layout.tsx (update)
   - Keep this file as a Server Component. Add `suppressHydrationWarning` on `<html>` and wrap `children` with `AppThemeProvider`.
   - Minimal edits (preserve existing fonts/classes exactly as-is):
```tsx
import { AppThemeProvider } from './theme-provider';

// inside RootLayout return
return (
  <html lang="en" suppressHydrationWarning>
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <AppThemeProvider>{children}</AppThemeProvider>
    </body>
  </html>
);
```

3) app/globals.css (update)
   - Keep the first line `@import "tailwindcss";`.
   - Replace the current `@media (prefers-color-scheme: dark)` variable overrides with a `.dark` block, so the selected theme controls variables.
   - Keep `@theme inline` mapping so Tailwind tokens track the variables.
   - Add View Transitions CSS to avoid default animations and ensure normal blending.
```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

body {
  background: var(--background);
  color: var(--foreground);
}

/* View Transitions reset for theme animations */
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}
```

4) components/ui/animated-theme-toggler.tsx (new)
   - Animated toggle using the View Transitions API. Includes:
     - Fallback for browsers without `document.startViewTransition`.
     - Respect for `prefers-reduced-motion: reduce` (skips animation).
     - Sync with next-themes context so other components using `useTheme()` stay accurate.
   - Icons from `lucide-react` (already installed). Uses a tiny `cn` util (see step 6).
```tsx
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { flushSync } from 'react-dom'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<'button'> {
  duration?: number
}

export const AnimatedThemeToggler = ({ className, duration = 400, ...props }: AnimatedThemeTogglerProps) => {
  const { setTheme } = useTheme()
  const [isDark, setIsDark] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Keep local state in sync with actual class on <html>
  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    updateTheme()
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const applyTheme = useCallback((nextIsDark: boolean) => {
    const newTheme = nextIsDark ? 'dark' : 'light'
    setIsDark(nextIsDark)
    // Change DOM now so the transition captures the frame
    document.documentElement.classList.toggle('dark', nextIsDark)
    localStorage.setItem('theme', newTheme)
    // Keep next-themes context in sync for other components
    queueMicrotask(() => setTheme(newTheme))
  }, [setTheme])

  const toggleTheme = useCallback(async () => {
    const btn = buttonRef.current
    if (!btn) return

    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const supportsVT = 'startViewTransition' in document
    const nextIsDark = !isDark

    if (!supportsVT || prefersReduce) {
      applyTheme(nextIsDark)
      return
    }

    // @ts-expect-error: startViewTransition is not in all TS lib.dom versions yet
    await document.startViewTransition(() => {
      flushSync(() => applyTheme(nextIsDark))
    }).ready

    const { top, left, width, height } = btn.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    )

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      }
    )
  }, [isDark, applyTheme, duration])

  return (
    <button ref={buttonRef} onClick={toggleTheme} className={cn(className)} aria-label="Toggle theme" {...props}>
      {isDark ? <Sun /> : <Moon />}
    </button>
  )
}
```

5) app/page.tsx (update)
   - Import the animated toggle and render it near the top of `<main>`; keep the existing layout and classes intact.
```tsx
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'

// inside Home component JSX near the top of <main>
<div className="w-full flex justify-end">
  <AnimatedThemeToggler />
  {/* rest of existing content follows */}
</div>
```

6) lib/utils.ts (new)
   - Minimal `cn` helper (no extra deps) used by the animated toggle.
```ts
export function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(' ')
}
```

Performance and SSG considerations
- Keep `app/layout.tsx` as a Server Component. Only the small provider and the toggle are client-hydrated.
- next-themes injects a tiny inline script to set the theme class before paint, preventing FOUC.
- Adding `suppressHydrationWarning` on `<html>` avoids benign warnings when the class is set early.
- The animated toggle runs only on user interaction; runtime overhead is negligible. Add fallbacks (as above) so unsupported browsers and reduced-motion users skip the animation.
- Optionally lazy-load the toggle via `next/dynamic` with `{ ssr: false }` if you want to defer its hydration further.

Accessibility
- Ensure the button has an `aria-label` and visible focus styles (add Tailwind ring utilities if desired).
- Keyboard operable by default; verify tabbability and contrast in both themes.

Testing checklist
1) Start dev server: `npm run dev`.
2) Verify default behavior follows system preference on first visit.
3) Click toggle; UI should switch immediately (variables + `dark:` utilities) with a circular transition when supported.
4) Reload; chosen theme should persist (localStorage `theme`).
5) Inspect `<html>` element; it should get `.dark` when dark is active.
6) Verify no hydration warnings and no visible FOUC.
7) Test in a browser without View Transitions (e.g., Firefox) and with `prefers-reduced-motion: reduce`; ensure fallback (instant toggle) works.

Future enhancements (when defining full palette)
- Replace pure black/white with semantic tokens (e.g., `--background`, `--foreground`, `--muted`, `--accent`, etc.).
- Add a 3-way switch (Light / Dark / System) UI.
- Consider disabling transitions only for color properties; currently we use `disableTransitionOnChange` for safety.
- If you use a strict CSP, pass `nonce` via `ThemeProvider`'s `nonce` prop.

References (key doc points)
- next-themes ThemeProvider and class strategy: [attribute="class"](https://github.com/pacocoursey/next-themes/blob/main/README.md)
- Safe toggle with mounted gating using `useTheme()`: [mounted switch example](https://github.com/pacocoursey/next-themes/blob/main/README.md)
- App Router integration with provider in `app/layout`: [App Router layout example](https://github.com/pacocoursey/next-themes/blob/main/README.md)
- View Transitions API: [MDN](https://developer.mozilla.org/docs/Web/API/Document/startViewTransition)

Notes
- No Tailwind config changes are required with v4 + `@theme inline`. Using `attribute="class"` keeps `dark:` utilities working automatically when `.dark` is present on `<html>`.
- Existing `dark:` styles in `app/page.tsx` (e.g., `dark:invert`) will start responding to the chosen theme once the provider is wired in.

