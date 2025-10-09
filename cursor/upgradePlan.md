## Projects Scroller – UI/UX upgrade plan

### Goals
- Deliver a delightful, accessible expanded view for projects across all breakpoints.
- Animate the “Learn More” button so it morphs into the expanded overlay container.
- Ensure SSR safety in Next.js, respect reduced-motion, and maintain performance.

### Files in scope
- `components/projects-scroller.tsx` (primary)
- `app/globals.css` (optional: utilities/tokens if needed)

### Dependencies
- framer-motion (installed)

---

### Expanded state: UI/UX design spec
- Structure
  - On md+ (desktop/tablet): over-card overlay within the card bounds. Sticky overlay header; body scrolls.
  - On mobile: fullscreen modal behavior (overlay still mounted in card for animation, but visually covers viewport). Consider a portal later if clipping becomes an issue.
- Content layout
  - Title (h4), tagline, close button in a compact header row.
  - Secondary 16:9 image block; keep current gradient and spinner.
  - Two-column grid on md+ (content left, tech+links right). Keep your current 3/2 split.
  - Comfortable line-length for long description; adequate spacing for scanning.
- Visual language
  - Subtle elevation and backdrop feel (retain current border radius + gradient overlays).
  - Maintain consistent radii between button, card, and overlay to support the morph.
- Mobile polish
  - Fullscreen overlay feel, sticky CTA region near bottom for Links.
  - Hide the index dots while expanded.

Accessibility and interaction
- Use `role="dialog"` with `aria-modal="true"` (already present).
- Trap focus in overlay; ESC closes; restore focus to the “Learn More” trigger on close.
- Prevent background scroll while open; restore on close.
- Ensure all interactive elements are keyboard reachable with visible focus states.

Performance
- Keep overlay mount conditional; defer heavy content until open (you already preload the secondary image—good).
- Avoid layout thrash; prefer Framer Motion layout transitions.

Acceptance criteria
- Expanded view is readable and responsive across breakpoints.
- No background scroll while open; focus is trapped and restored.
- Reduced motion is respected; SSR hydration is stable.

---

### Animation plan: “Learn More” button → overlay morph (Framer Motion)

Approach (best practices)
- Use `LayoutGroup` to scope shared layout transitions.
- Render the “Learn More” button as `motion.button` with a unique `layoutId`.
- When expanded, render a `motion.div` that fills the card using the same `layoutId` to morph from the button to the overlay container.
- Gate overlay with `AnimatePresence` and `initial={false}` for stable SSR measurements; use `mode="wait"` to avoid enter/exit overlap.
- Stagger-reveal the overlay content after the morph completes.

Motion details
- Morph transition: spring `{ type: 'spring', stiffness: 340, damping: 30 }`.
- Backdrop/overlay fade: quick ease-out `{ duration: 0.2 }`.
- Reduced motion: switch to short linear fades `{ duration: 0.18 }` and skip large-scale layout morph.

SSR and reduced motion
- Next.js SSR: prefer `initial={false}` on `AnimatePresence` containers that depend on layout measurements.
- Use `useReducedMotion()` to tailor transitions.
- Optional: `LazyMotion` with `domAnimation` to reduce bundle.

State and focus management
- Continue using `expandedSlug` and `imageLoaded`.
- Add refs: `overlayRef`, `closeBtnRef`, `lastTriggerRef`.
- On open: focus close button (fallback to first focusable); on close: return focus to triggering button.
- Trap focus with basic keydown handling inside overlay (Tab/Shift+Tab).

Scroll locking
- When expanded: set `document.body.style.overflow = 'hidden'` (and the same for the root element) then restore on cleanup.

Mobile index dots
- Render the index dots only when `expandedSlug === null`.

---

### Step-by-step implementation outline (no code applied yet)

1) Imports
```tsx
// components/projects-scroller.tsx
import { useEffect, useRef, useState, UIEvent } from 'react'
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from 'framer-motion'
```

2) Refs, reduced-motion, and shared transition
```tsx
const overlayRef = useRef<HTMLDivElement>(null)
const closeBtnRef = useRef<HTMLButtonElement>(null)
const lastTriggerRef = useRef<HTMLButtonElement | null>(null)
const prefersReducedMotion = useReducedMotion()

const springTransition = prefersReducedMotion
  ? { duration: 0.18 }
  : { type: 'spring', stiffness: 340, damping: 30 }
```

3) Scroll lock effect
```tsx
useEffect(() => {
  if (!expandedSlug) return
  const { body, documentElement } = document
  const prevBody = body.style.overflow
  const prevHtml = documentElement.style.overflow
  body.style.overflow = 'hidden'
  documentElement.style.overflow = 'hidden'
  return () => {
    body.style.overflow = prevBody
    documentElement.style.overflow = prevHtml
  }
}, [expandedSlug])
```

4) Focus trap + ESC
```tsx
useEffect(() => {
  if (!expandedSlug) return
  const overlayEl = overlayRef.current
  if (!overlayEl) return
  const focusable = overlayEl.querySelectorAll<HTMLElement>(
    'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
  )
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  const closeEl = closeBtnRef.current
  ;(closeEl ?? first ?? overlayEl).focus()

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      setExpandedSlug(null)
      requestAnimationFrame(() => lastTriggerRef.current?.focus())
    }
    if (e.key === 'Tab' && focusable.length > 0) {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); (last as HTMLElement)?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); (first as HTMLElement)?.focus()
      }
    }
  }
  overlayEl.addEventListener('keydown', onKey)
  return () => overlayEl.removeEventListener('keydown', onKey)
}, [expandedSlug])
```

5) Wrap scroller content in `LayoutGroup`
```tsx
return (
  <LayoutGroup>
    {/* existing scroller layout */}
  </LayoutGroup>
)
```

6) Convert “Learn More” to `motion.button` and add `layoutId`
```tsx
<motion.button
  layoutId={`expand-${project.slug}`}
  className={cn('btn-accent-invert btn-compact flex-1 md:flex-none transition-all duration-200')}
  transition={springTransition}
  onClick={(e) => {
    e.stopPropagation()
    lastTriggerRef.current = e.currentTarget
    setExpandedSlug(project.slug)
  }}
  onMouseEnter={() => preloadImage(project.secondaryImage, project.slug)}
  onFocus={() => preloadImage(project.secondaryImage, project.slug)}
  aria-expanded={expandedSlug === project.slug}
>
  Learn More
 </motion.button>
```

7) Replace inline overlay with `AnimatePresence` and shared layout morph layer
```tsx
<AnimatePresence initial={false} mode="wait">
  {expandedSlug === project.slug && (
    <motion.div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} details`}
      tabIndex={-1}
      className="overlay-panel absolute inset-0 z-10 rounded-xl border"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={prefersReducedMotion ? { duration: 0.18 } : { duration: 0.2, ease: 'easeOut' }}
    >
      {/* Morph layer: button → full overlay */}
      <motion.div
        layoutId={`expand-${project.slug}`}
        className="absolute inset-0 rounded-xl"
        transition={springTransition}
      />

      {/* Existing overlay body remains (header, image, grid, links) */}
      {/* Move content inside a positioned container above the morph layer */}
    </motion.div>
  )}
</AnimatePresence>
```

8) Close button behavior (restore focus)
```tsx
<button
  ref={closeBtnRef}
  className="btn-icon"
  aria-label="Close details"
  onClick={() => {
    setExpandedSlug(null)
    requestAnimationFrame(() => lastTriggerRef.current?.focus())
  }}
>
  ×
</button>
```

9) Hide mobile index dots while expanded
```tsx
{expandedSlug === null && (
  <div className="md:hidden mobile-dock-floating">{/* dots... */}</div>
)}
```

---

### Styling notes
- Ensure the morph layer inherits the button’s base background and the overlay’s radius class for a smooth shape transition.
- Keep `z-index` ordering: morph layer below content but above the card media.
- Maintain color contrast and focus outlines.

### QA checklist
- Keyboard-only: open, navigate, and close overlay; focus is trapped and restored.
- Screen reader: dialog announced; `aria-modal` enforced; ESC works.
- Reduced motion: morph replaced by quick fade; no motion sickness.
- Responsiveness: mobile fullscreen feel; tablet/desktop grid reads well.
- No background scroll while open; restored after close.
- Morph is smooth with appropriate border-radius interpolation; no flicker.

### Rollback plan
- Revert changes in `projects-scroller.tsx` to previous overlay implementation if regressions appear.
- Remove new framer-motion imports and hooks if needed.


