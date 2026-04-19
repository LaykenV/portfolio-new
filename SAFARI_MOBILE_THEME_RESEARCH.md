# Safari Mobile Theme / Toolbar Issue Context

## Goal

Find a way to make the mobile portfolio behave correctly in **Safari on iPhone** when switching light/dark themes, while **preserving the existing mobile swipe/snap scrolling UX**.

There are two desired outcomes:

1. The Safari browser UI should update immediately when the theme changes, without requiring a manual refresh.
2. The Safari top/bottom browser UI should ideally look like the working `agency-site` repo: more translucent / "glass bubble" rather than a solid colored bar.

## Current Symptoms

On the mobile portfolio view in Safari on iPhone:

1. Switching themes does not fully update Safari's browser UI immediately.
2. The user reports needing to refresh before Safari's top/bottom UI syncs to the new theme.
3. The user wants the Safari UI treatment to match the behavior seen in this repo:
   - `https://github.com/LaykenV/agency-site`
4. The user does **not** want the mobile scrolling interaction changed or degraded.

## Important Clarification

When discussing "browser chrome" in this context, that means **Safari's own UI**:

- address bar
- bottom toolbar
- back/forward controls
- top status-area treatment

This does **not** refer to Google Chrome.

## Current Repo State

### Theme metadata / root layout

Current root layout file:
- [app/layout.tsx](/Users/laykenvarholdt/projects/portfolio-new/app/layout.tsx:1)

Current state:

- There is **no** `themeColor` metadata.
- There is **no** explicit `viewportFit: 'cover'`.
- The old runtime sync component was removed.

Relevant lines:
- [app/layout.tsx](/Users/laykenvarholdt/projects/portfolio-new/app/layout.tsx:17)
- [app/layout.tsx](/Users/laykenvarholdt/projects/portfolio-new/app/layout.tsx:96)

### Theme provider

Current theme provider:
- [components/theme-provider.tsx](/Users/laykenvarholdt/projects/portfolio-new/components/theme-provider.tsx:1)

Current settings:

- `attribute="class"`
- `defaultTheme="dark"`
- `disableTransitionOnChange`

### Theme toggle implementation

Current theme toggle:
- [components/animated-theme-toggler.tsx](/Users/laykenvarholdt/projects/portfolio-new/components/animated-theme-toggler.tsx:1)

Current behavior:

- Uses `next-themes` directly via `useTheme()`
- Uses `setTheme(nextTheme)`
- Uses View Transitions when supported
- Does **not** manually toggle `document.documentElement.classList`
- Does **not** manually write `localStorage`
- Does **not** inject or update `meta[name="theme-color"]`

Relevant lines:
- [components/animated-theme-toggler.tsx](/Users/laykenvarholdt/projects/portfolio-new/components/animated-theme-toggler.tsx:14)
- [components/animated-theme-toggler.tsx](/Users/laykenvarholdt/projects/portfolio-new/components/animated-theme-toggler.tsx:23)

### Mobile portfolio architecture

Current mobile portfolio component:
- [components/mobile-portfolio.tsx](/Users/laykenvarholdt/projects/portfolio-new/components/mobile-portfolio.tsx:38)

Current architecture:

- The mobile experience is a **fixed full-screen shell**
- Inside it is an **inner scroll container** (`deckRef`)
- That inner container uses:
  - vertical scroll
  - scroll snap
  - intersection observer with `root: deck`
- The outer page/body is **not** the primary scroller for the mobile deck

Relevant lines:
- [components/mobile-portfolio.tsx](/Users/laykenvarholdt/projects/portfolio-new/components/mobile-portfolio.tsx:39)
- [components/mobile-portfolio.tsx](/Users/laykenvarholdt/projects/portfolio-new/components/mobile-portfolio.tsx:47)
- [components/mobile-portfolio.tsx](/Users/laykenvarholdt/projects/portfolio-new/components/mobile-portfolio.tsx:55)
- [components/mobile-portfolio.tsx](/Users/laykenvarholdt/projects/portfolio-new/components/mobile-portfolio.tsx:130)

Current mobile CSS:
- [app/mobile.css](/Users/laykenvarholdt/projects/portfolio-new/app/mobile.css:95)

Current mobile CSS behavior:

- `.mobile-portfolio` is `position: fixed; inset: 0; overflow: hidden;`
- `.mobile-deck` is `position: absolute; inset: 0; overflow-y: auto;`
- `.mobile-deck` uses `scroll-snap-type: y mandatory`
- top bar is absolutely positioned over the fixed shell

Relevant lines:
- [app/mobile.css](/Users/laykenvarholdt/projects/portfolio-new/app/mobile.css:100)
- [app/mobile.css](/Users/laykenvarholdt/projects/portfolio-new/app/mobile.css:121)
- [app/mobile.css](/Users/laykenvarholdt/projects/portfolio-new/app/mobile.css:183)
- [app/mobile.css](/Users/laykenvarholdt/projects/portfolio-new/app/mobile.css:196)

## Comparison Repo: `agency-site`

Reference repo:
- `https://github.com/LaykenV/agency-site`

Observed differences from this repo:

1. `agency-site` does **not** use a custom runtime `theme-color` sync component.
2. `agency-site` does **not** declare `themeColor` metadata in the root layout.
3. `agency-site` uses `next-themes` directly for theme switching.
4. `agency-site` appears to use more conventional page scrolling, not the same fixed full-screen inner-scroll deck architecture as this portfolio.

Important note:

- We already aligned this repo with `agency-site` on the `next-themes` side.
- That did **not** fully solve the Safari behavior.
- That suggests the remaining issue may be architectural, not just metadata/theme API usage.

## What Was Already Tried

### Tried and reverted / removed

1. Adding dynamic `meta[name="theme-color"]` sync at runtime.
   - Result: did not produce the desired Safari behavior.
   - That code has been removed.

2. Adding `viewportFit: 'cover'` and safe-area color blending bands.
   - Result: caused visual side effects and did not solve the core Safari sync issue.
   - That code has been removed.

3. Forcing root/body background color to match a Safari chrome color token.
   - Result: changed desktop visuals unintentionally.
   - Reverted.

4. Refactoring mobile from inner-scroll deck to normal page scrolling.
   - Result: broke the existing mobile scrolling interaction.
   - Reverted.

### Tried and kept

1. Simplifying the theme toggle to use `next-themes` directly.
   - This is still in place.

2. Removing custom `theme-color` metadata/runtime sync logic.
   - This is still in place.

## Constraints

These are important and should be treated as hard constraints unless explicitly changed by the user:

1. **Do not break the current mobile scrolling UX.**
   - The fixed full-screen mobile shell with inner snap scrolling is intentional.

2. **Do not change desktop background / desktop visual treatment.**

3. The user wants Safari-on-iPhone behavior specifically.

4. The user prefers a solution that keeps the current mobile interaction model if possible.

## Core Technical Tension

There seems to be a conflict between:

1. The desired mobile UX:
   - fixed app-like shell
   - nested scroll container
   - scroll snap deck

2. Safari's browser UI behavior:
   - Safari often derives toolbar appearance from the actual rendered page/root scroll surface
   - nested/fixed app-like shells may prevent Safari from behaving like it does on a conventional scrolling page

In other words:

- Removing `theme-color` may be necessary.
- But it may not be sufficient if Safari still treats the page like a fixed app surface.

## Working Hypotheses

These are hypotheses to verify with docs or targeted experiments:

1. **Nested scroll container hypothesis**
   - Safari's toolbar appearance/theme update may be tied to the page/root scrolling surface rather than a nested scroll container.
   - If true, this repo's inner scroll deck is a major reason Safari behaves differently from `agency-site`.

2. **Fixed shell hypothesis**
   - A full-screen fixed container may make Safari sample or cache background/UI appearance differently than a normal document flow page.

3. **View Transition / theme timing hypothesis**
   - The theme may be applying correctly in DOM/CSS, but Safari's toolbar recoloring may lag because the visible page surface Safari samples is not changing in the way it expects.

4. **No full API control hypothesis**
   - Safari may not expose a reliable API to force the exact translucent "bubble" toolbar treatment for this architecture.

## Research Questions

The research agent should focus on these:

1. On modern iPhone Safari, what exactly determines the color / translucency of:
   - the top browser area
   - the bottom toolbar / URL bar area
   - the floating "bubble" look vs solid color look

2. Does Safari sample:
   - `body` background
   - `html` background
   - the topmost visible pixels
   - the bottommost visible pixels
   - fixed-position elements near the edges
   - the main/root scroll container only

3. Does using a **nested scroll container** instead of page/body scrolling prevent Safari from updating or sampling toolbar appearance correctly?

4. Are there WebKit/Safari-documented limitations around:
   - `theme-color`
   - `next-themes` class changes
   - `position: fixed`
   - full-screen app-like layouts
   - scroll-snap containers
   - `100dvh` / dynamic viewport units

5. Is there a way to preserve:
   - fixed outer shell
   - nested scroll-snap deck
   - current swipe UX
   while still getting Safari to:
   - update immediately on theme switch
   - show a more translucent toolbar treatment

6. If exact Safari bubble behavior is impossible with the current architecture, what is the **closest achievable compromise** that preserves the current UX?

## Likely Solution Paths

### Option A: Keep current architecture, stop trying to control Safari directly

What it means:

- Keep fixed shell + nested scroller
- No `theme-color`
- No root background forcing
- No extra chrome-sync JS
- Accept Safari's native behavior as much as possible

Pros:

- Safest for current UX
- Lowest implementation risk

Cons:

- May never fully match `agency-site`
- May still have imperfect Safari toolbar behavior

### Option B: Keep current architecture, tune only edge surfaces

What it means:

- Keep mobile scrolling architecture intact
- Experiment only with:
  - topmost visible layers
  - bottommost visible layers
  - fixed overlays near Safari UI
  - background placement/sampling surfaces

Pros:

- Preserves UX
- Narrower changes

Cons:

- May still not be enough if nested scrolling itself is the blocker

### Option C: Rebuild mobile to use root/page scrolling while preserving snap feel

What it means:

- Keep similar visual interaction
- Re-implement snap/swipe behavior on page/body scroll instead of an inner scroll container

Pros:

- Highest chance of matching Safari's native page-sampling behavior
- Highest chance of matching `agency-site`

Cons:

- Real refactor
- Higher risk
- Previously changing this broadly broke the mobile UX

### Option D: Accept that exact Safari "bubble" behavior may be non-deterministic

What it means:

- Research whether Safari's translucent toolbar treatment is partially heuristic / version-dependent
- Target "good enough and stable" instead of exact parity with `agency-site`

Pros:

- More realistic if WebKit behavior is heuristic

Cons:

- May not satisfy the visual target if exact parity is required

## Known User Preferences

These preferences were stated clearly:

1. Do not change desktop visuals just to solve mobile Safari.
2. Do not break or redesign the mobile scroll interaction.
3. The user wants behavior like `agency-site`.
4. The user is using **Safari on iPhone**.

## Suggested Research Deliverable

The research agent should ideally return:

1. A concise explanation of why Safari behaves differently here vs `agency-site`
2. Evidence from docs / WebKit / credible sources
3. A ranked set of fix options
4. For each option:
   - probability it works
   - impact on current mobile UX
   - implementation complexity
   - specific files likely to change
5. A recommendation for the safest next experiment

## Useful External References To Start From

These are relevant starting points, but should be verified and expanded:

1. MDN `theme-color`
   - https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/theme-color

2. WebKit dark mode / color-scheme background behavior
   - https://webkit.org/blog/8840/dark-mode-support-in-webkit/

3. Recent discussion of Safari toolbar color behavior changes
   - https://nasedk.in/blog/ios-safari-26-toolbar-colors
   - https://nasedk.in/blog/ios26-safari-toolbar-colors/

## Current Ask For The Next Agent

Research and explain:

- Why Safari on iPhone is not updating the toolbar/background treatment immediately on theme switch in this repo
- Why `agency-site` looks different
- Whether the current fixed-shell + nested-scroll architecture can be kept
- The best path to fix or improve this without breaking the mobile swipe/snap UX
