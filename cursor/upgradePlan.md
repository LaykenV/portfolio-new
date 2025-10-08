## Mobile layout upgrade plan

### Goals
- Improve vertical fit on mobile so project media isn’t cropped and content feels intentional.
- Preserve current desktop/tablet layout.
- Keep primary CTAs visible: “Schedule call” and “Chat” stay as-is in the header area.
- Replace theme toggle button with a burger menu; the menu uses glassmorphism and matches the color scheme in both themes.

### Constraints (per request)
- Keep the “Schedule call” and “Chat” buttons as they are (visible and in the header area on mobile).
- Burger menu must be glassmorphic and themed for both light and dark.

---

## Recommended approach (mobile-first)
- Adopt a docked bottom index tracker that visually attaches to the bottom edge (fixed, with safe-area support). Extend cards down toward it so the page reads as “header → cards → dock”, with the cards floating just above the dock.
- Rework the top header into a compact horizontal layout: larger avatar on the left, name/title on the right, and a burger in the top-right. Primary CTAs remain directly below the header text as they are now.
- Ensure the projects scroller occupies precise remaining vertical space using dynamic viewport units and safe-area insets. Adjust card media aspect/height so media is fully visible.

Why docked bottom? It saves vertical space inside each card, provides a consistent thumb-reachable target, and avoids layout shift across devices with differing safe-area insets.

---

## Information architecture (mobile)
1) Header: avatar (left) + name/title (right), burger top-right; keep CTAs under the header text.
2) Projects scroller: fills the remaining space between header and dock.
3) Bottom dock: fixed tracker with safe-area padding; visually “grows out” of the bottom edge.

---

## Header (mobile)
- Layout
  - Avatar 64–72px; larger but compact.
  - Name/title stacked to the right, 1–2 lines max.
  - Burger button replaces the theme toggle. Theme toggle moves into the burger menu.
  - Header height target: clamp(64px–88px).

- Primary CTAs
  - Keep “Schedule call” and “Chat” exactly as they are today (same placement, style, and visibility). If vertical space is tight on the smallest devices, allow a 2-line wrap instead of moving these into the menu.

- Burger menu (glassmorphism)
  - Slide-over from right; focus-trapped; `aria-expanded`/`aria-controls`; closes on overlay tap and Esc.
  - Contents: Theme toggle, social links (X/Twitter, GitHub, LinkedIn), plus redundant access to “Schedule call” and “Chat” is optional (but not required, since CTAs remain visible).
  - Visuals: blurred/translucent panel, soft gradient that matches light/dark palettes, warm 1px border, subtle shadow/glow consistent with existing tokens.

Example style tokens (reference only; implement in globals when coding):

```css
:root {
  /* New sizing tokens */
  --header-h: clamp(64px, 10svh, 88px);
  --dock-h: clamp(48px, 8svh, 64px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
}

.mobile-menu-panel {
  /* Glassmorphism */
  background:
    radial-gradient(120% 120% at 0% 0%, hsl(var(--blue-strong) / 0.14), transparent 62%),
    radial-gradient(120% 120% at 100% 0%, hsl(var(--peach-strong) / 0.12), transparent 62%),
    hsl(var(--card));
  border: 1px solid hsl(var(--blue-strong) / 0.22);
  backdrop-filter: saturate(140%) blur(12px);
  box-shadow:
    0 28px 72px -24px hsl(var(--blue-strong) / 0.30),
    0 14px 36px -16px hsl(var(--peach-strong) / 0.22),
    inset 0 1px 0 hsl(var(--foreground-hsl) / 0.06);
}
html.dark .mobile-menu-panel {
  background:
    radial-gradient(120% 120% at 0% 0%, hsl(var(--blue-soft) / 0.12), transparent 62%),
    radial-gradient(120% 120% at 100% 0%, hsl(var(--peach-soft) / 0.10), transparent 62%),
    hsl(var(--card));
  border-color: hsl(var(--blue-soft) / 0.18);
  box-shadow:
    0 28px 72px -24px hsl(var(--blue-soft) / 0.22),
    0 14px 36px -16px hsl(var(--peach-soft) / 0.18),
    inset 0 1px 0 hsl(var(--foreground-hsl) / 0.05);
}
```

Accessibility: large tap targets (≥44px), focus-visible ring, semantic labeling.

---

## Projects scroller and cards (mobile)
- Scroller height
  - Compute available height as `100dvh - var(--header-h) - var(--dock-h) - var(--safe-bottom)`.
  - Apply this as the scroller container height (not the whole page), and add bottom padding equal to `var(--dock-h) + var(--safe-bottom)` so the dock never covers content.

- Card height
  - Each card should have `min-height` that fits the scroller area; avoid parent `overflow-hidden` clipping the card.
  - Preserve horizontal scroll on mobile; vertical scroll on desktop remains unchanged.

- Media sizing (prevent cropping)
  - Replace strict `aspect-[16/9]` on mobile with a friendlier mobile ratio or flexible media region height:
    - Option A: `aspect-[4/3]` + `object-contain` (simple, consistent).
    - Option B: fixed media frame height like `min(48svh, 360px)` with `object-contain`.
  - Provide a subtle gradient backdrop in the media frame so letterboxing looks intentional.

- Content stack
  - Title → tagline → short description (1–2 lines on small screens) → actions → overlay trigger.
  - “Learn More” retains the current overlay behavior but must open above the dock without obstruction.

---

## Bottom index tracker (docked, recommended)
- Behavior
  - Fixed at bottom; respects `env(safe-area-inset-bottom)`; non-overlapping with content (scroller adds matching bottom padding).
  - Accurate index reflection during horizontal scrolling.

- Visuals
  - Rounded top corners, 1px warm border, dual-gradient background, light inner glow to “grow out of the screen”.
  - Active dot expands into a pill with gradient and glow; inactive dots remain small with lower opacity.

Example style tokens (reference only; implement in globals when coding):

```css
.mobile-dock {
  position: fixed;
  left: 0; right: 0; bottom: 0;
  height: calc(var(--dock-h) + var(--safe-bottom));
  padding-bottom: var(--safe-bottom);
  border-top: 1px solid hsl(var(--blue-strong) / 0.22);
  background:
    linear-gradient(180deg, hsl(var(--blue-strong) / 0.12), hsl(var(--peach-strong) / 0.10)),
    hsl(var(--sidebar));
  box-shadow:
    0 -10px 24px -18px hsl(var(--blue-strong) / 0.26),
    inset 0 1px 0 hsl(var(--foreground-hsl) / 0.06);
}
html.dark .mobile-dock {
  border-top-color: hsl(var(--blue-soft) / 0.18);
  background:
    linear-gradient(180deg, hsl(var(--blue-soft) / 0.10), hsl(var(--peach-soft) / 0.08)),
    hsl(var(--card));
  box-shadow:
    0 -10px 24px -18px hsl(var(--blue-soft) / 0.24),
    inset 0 1px 0 hsl(var(--foreground-hsl) / 0.05);
}
```

Alternative (inline in card): reserve a bottom section in each card for the tracker. Pros: per-card context; Cons: uses more vertical space and repeats UI. Keep as fallback only.

---

## Responsive rules
- ≤375px: Avatar 64px; description 1 line; CTAs wrap if needed; dock height on the lower end of clamp.
- 376–430px: Avatar 72px; description up to 2 lines; dock height mid clamp.
- ≥md: Unchanged desktop/tablet layout (current implementation preserved).

---

## Implementation outline (no code changes yet)
1) Header updates (`app/page.tsx`)
   - Convert mobile header to a horizontal stack: avatar left, name/title right; keep the “Schedule call” and “Chat” buttons where they are now (below the header text).
   - Replace the theme toggle with a burger button (top-right). Burger opens a slide-over menu.

2) Burger menu component (new or integrated in header)
   - Build an accessible slide-over with the glassmorphic panel. Include: theme toggle and social links.
   - Use focus trap, `aria` attributes, and Esc/overlay close.

3) Scroller sizing (`components/projects-scroller.tsx`)
   - Apply scroller height: `calc(100dvh - var(--header-h) - var(--dock-h) - var(--safe-bottom))`.
   - Add bottom padding to the scroller equal to `var(--dock-h) + var(--safe-bottom)`.
   - Ensure the section that wraps the scroller doesn’t clip content on mobile.

4) Media frame adjustments (`components/projects-scroller.tsx`)
   - Swap mobile `aspect-[16/9]` for `aspect-[4/3]` or fixed svh-based height.
   - Keep `object-contain`; add a subtle gradient background behind the image.

5) Bottom dock (`app/page.tsx` and `app/globals.css`)
   - Create the fixed dock container. Move/duplicate the existing index tracker into this dock for mobile.
   - Add safe-area padding. Style to match the app’s current gradient and shadow language.

6) Tokens and styles (`app/globals.css`)
   - Add `--header-h`, `--dock-h`, `--safe-bottom` and the `.mobile-menu-panel` and `.mobile-dock` classes (and any helpers like `.media-frame`).
   - Respect `prefers-reduced-motion` (fall back to fades instead of slides/zooms).

7) QA pass
   - Test on iOS Safari (with/without URL bar), iPhone SE/mini/Plus/Max, Android Chrome, and desktop devtools.
   - Verify: no content hidden by the dock, overlay above dock, menu focus trap works, and index dots are tappable.

---

## Acceptance criteria
- No visible image cropping on mobile; hero media is fully visible within its frame.
- Header fits comfortably; avatar larger with name/title to its right; burger present top-right.
- “Schedule call” and “Chat” remain visible and unchanged in look/placement.
- Burger menu uses glassmorphism, matches both themes, and includes theme toggle + socials.
- Cards extend toward a docked bottom index; dock respects safe-area and appears attached to the bottom edge.
- Smooth scrolling and index tracking remain accurate; overlay and menu interactions are accessible.


