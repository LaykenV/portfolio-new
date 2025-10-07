## Portfolio performance upgrade plan (Next.js 15 / React 19, App Router)

### Objectives
- Maximize static generation (SSG) for the `/` route.
- Minimize shipped client JavaScript (hydrate only what’s interactive, lazy-load the rest).
- Optimize Largest Contentful Paint (LCP) and interactivity (TTI/TBT) on mobile and desktop.
- Keep UI/UX identical, keeping globe and theme transitions, while gating heavy widgets.

### Current snapshot (as of today)
- `app/page.tsx`: Server Component page reading static data from `data/projects.json`. SSG-ready. Imports `AnimatedThemeToggler` (client), `ProjectsScroller` (client), and `Globe` (client) for md+ only.
- `components/projects-scroller.tsx`: Client Component rendering all cards, overlay details, and mobile scroll snapping behavior via JS + inline styles.
- `components/globe.tsx`: Client Component using `cobe` and `motion/react`, created lazily via `ResizeObserver` and destroyed when hidden; md+ only in UI.
- `components/animated-theme-toggler.tsx` + `components/theme-provider.tsx`: Client; theme transitions implemented via `document.startViewTransition` where available.
- `next.config.ts`: Minimal; no image format config or import optimizations.

### Quick wins (do now: ~30–60 min)
1) Enforce static generation on the home route
   - In `app/page.tsx`, uncomment or add:
```tsx
export const dynamic = 'force-static' as const
```
   - Rationale: Locks the page to SSG and prevents accidental dynamic rendering.

2) Make the first visible project image a priority (improves LCP)
   - In `components/projects-scroller.tsx`, when mapping projects, set `priority` on the first image only:
```tsx
{items.map((project, i) => (
  // ...
  <Image
    src={project.image}
    alt={project.title}
    fill
    className="object-contain select-none"
    draggable={false}
    sizes={isMobile ? '92vw' : '(min-width: 768px) 100vw, 0vw'}
    priority={i === 0}
  />
))}
```
   - Rationale: Prioritizes the top hero media for faster LCP.

3) Replace JS-driven scroll snapping with CSS snapping (cuts client JS work)
   - Container: add classes and remove render-time `window.matchMedia` checks and inline `style.scrollSnapType`:
```tsx
<div
  ref={containerRef}
  onScroll={handleMobileScroll}
  className="flex flex-row md:flex-col gap-6 md:gap-8 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto h-full no-scrollbar md:p-6 md:pt-6 snap-x snap-mandatory md:snap-none"
  style={{ WebkitOverflowScrolling: 'touch' }}
>
```
   - Each card/article: add `snap-center` and drop conditional inline snap props:
```tsx
<article className="shrink-0 w-[92vw] md:w-full md:max-w-none card relative overflow-hidden flex flex-col ml-4 first:ml-4 md:ml-0 md:first:ml-0 snap-center">
```
   - Rationale: Lets the browser handle snapping declaratively; avoids access to `window` during render.

4) Remove trivial `useMemo`
   - Replace `const items = useMemo(() => projects, [projects])` with `const items = projects`.
   - Rationale: Saves bytes and avoids unnecessary indirection.

5) Switch `h-screen` to `min-h-dvh` on the root page container
   - In `app/page.tsx`, change the outer wrapper class from `h-screen` to `min-h-dvh`.
   - Rationale: Avoids mobile 100vh chrome jank for better CLS and smoother layout on iOS/Android.

### Medium changes (half day)
6) Split `ProjectsScroller` into server-rendered markup + tiny client controller
   - Goal: Ship static markup and images as Server Components; isolate client state and overlay into minimal client code.
   - Proposed structure:
     - `components/projects/projects-list.server.tsx` (Server): Maps `projects` to static card markup and images.
     - `components/projects/scroller.client.tsx` (Client): Handles `activeIndex`, mobile scroll tracking, and toggling `expandedSlug`.
     - `components/projects/project-details.client.tsx` (Client, lazy): The expanding overlay content.
   - Usage: The page renders the server list and wraps it in the small client scroller for interactions.
   - Lazy-load the details overlay:
```tsx
'use client'
import dynamic from 'next/dynamic'
const ProjectDetails = dynamic(() => import('./project-details.client'), { ssr: false })
// Render only when expandedSlug is set
{expandedSlug && <ProjectDetails project={project} onClose={() => setExpandedSlug(null)} />}
```
   - Rationale: Keeps most UI server-rendered, defers heavy interactive UI until needed.

7) Lazy-load the globe client-only
   - In `app/page.tsx`, dynamically import the globe and disable SSR:
```tsx
import dynamic from 'next/dynamic'
const GlobeViz = dynamic(() => import('@/components/globe'), { ssr: false, loading: () => null })
```
   - Keep md+ visibility in layout as is; this keeps `cobe` and `motion` out of the initial client bundle.

8) Respect `prefers-reduced-motion` for globe rotation
   - In `components/globe.tsx`, skip incrementing `phiRef` when reduced motion is requested:
```tsx
const prefersReduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
// inside onRender
if (!prefersReduce && !pointerInteracting.current) phiRef.current += 0.005
```
   - Rationale: Accessibility + marginal CPU savings.

### Config improvements (low risk)
9) Optimize images and imports in `next.config.ts`
```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { formats: ['image/avif', 'image/webp'] },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}
export default nextConfig
```
   - Rationale: Smaller images (AVIF/WebP) where supported; smaller icon imports; drop stray console calls in prod.

10) Optional: static import for key images to enable blur placeholders
   - If you want blur-up placeholders for the top hero image, statically import it instead of using public path strings:
```tsx
import HeroImage from '@/public/MeshMind.png'
<Image src={HeroImage} alt="Mesh Mind" placeholder="blur" priority />
```
   - Rationale: Next can auto-generate `blurDataURL` for statically imported images.

### Verification checklist
- Build remains SSG: `next build` shows the `/` route as static, no dynamic functions.
- Lighthouse Mobile Performance ≥ 95, LCP < 1.8s on 4G simulated, CLS ≈ 0, TBT low.
- Initial JS bundle shrinks after lazy-loading globe/details; confirm via bundle analyzer.
- No hydration warnings in console; theme toggle still transitions correctly.
- Globe loads only on md+ after hydration; no CPU spikes when hidden.

### Rollout order
1) Quick wins (1–5 above).
2) Globe dynamic import (7) + reduced motion (8).
3) Config changes (9) and rebuild.
4) Scroller split and overlay lazy-load (6).
5) Optional static image imports with blur (10).

### Risks / trade-offs
- Over-aggressive lazy-loading could delay overlay content; ensure `loading` placeholders are acceptable.
- Static image imports add import lines; keep only for top LCP media to avoid churn.
- CSS snapping may behave differently across browsers; verify touch UX on iOS/Android.

### References (Next.js official guidance)
- Server vs Client Components and composing for smaller bundles: [Next.js Docs – Server and Client Components](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)
- Lazy-loading Client Components: [Next.js Docs – Lazy Loading](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)
- Data caching and SSG in App Router: [Next.js Docs – Data Fetching and Caching](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)
- Image optimization and static imports: [Next.js Docs – Images](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- Turbopack and performance instrumentation (for dev/build): [Next.js Docs – Turbopack](https://nextjs.org/docs/app/building-your-application/optimizing/turbopack)


