# Portfolio design hill climb

This branch refines the portfolio through fresh screenshots and independent reviews. It starts at `a08badf06087f25ae0f0c92fcf6b27baa322ee57`, after the neutral project selection shipped in PR #4.

The method follows pingdotgg/t3code#24837: score the current page and reference sites, fix concrete findings, capture the changed page, and ask fresh judges to score again.

## Scope

Review `/`, `/blog`, and `/blog/glm-5-3-flash-pr-agent-code-review`. Capture the home page at 1440 × 900 and 390 × 844, in light and dark mode. Include project, detail, rail and panel views. Capture the writing pages in light mode at both widths. Use detail crops to check small text before reporting a rendering defect.

Keep Layken's portrait, seven projects, project URLs, blog facts, founder identity and `layken@varholdt.com`. Varholdt AI belongs in the identity, not the project list. Do not invent client claims or results. The alternate desktop design at `/3` is outside the work; it already shares the production mobile component.

## Judges and evidence

- GPT-6.1 Terra through Codex, `reasoningEffort: high`.
- DeepSeek V4.1 Flash 1017 through OpenRouter/OpenCode, `variant: high`, read-only plan agent.
- Muse Spark 1.3 Contributor through OpenRouter/OpenCode, `variant: high`, read-only plan agent. Layken requested the Contributor variant and then asked to keep all three judges.
- Claude Opus 5.5 through Claude, `effort: high`. Layken added it after the round-4 preview and authorized continuing without it if usage runs out.

Each round uses fresh, read-only delegates. They do not see other answers or earlier scores. They inspect every listed image, then read source to give exact fixes. A missing image or unavailable vision is reported, never replaced with an invented observation or grade.

DeepSeek's round-0 Cursor image tool returned generated captions rather than pixels. It declined to issue visual grades. Layken requested an OpenCode retry, and that run confirmed actual pixel access and produced a valid visual grade. The three judges evaluated the same round-1 candidate. The initial Muse run had already received a cancellation request when Layken asked to retain it, so a fresh Contributor review replaced that run.

## Fixed rubric

Score each category from 0 to 10 to one decimal. Overall is their arithmetic mean. Mobile and desktop count equally.

| Category | What the judge checks |
| --- | --- |
| Typography | Readability, families, scale, weight and tracking |
| Hierarchy | Identity, work and contact priority; restrained emphasis |
| Layout | Structure, reading order, useful space, desktop and mobile fit |
| Spacing | Rhythm, alignment, density and reading measure |
| Color | A coherent palette, contrast and purposeful gradients |
| Icons | Meaning, consistency and restrained presentation |
| Polish | Shared visual rules, precise details and visible defects |
| Clarity | Who Layken is, what he builds and how to reach him |
| Distinctiveness | An identity grounded in his work rather than a template |

A 10 means the judge cannot justify a concrete improvement in that category from the evidence. Do not round a 9.x up, lower the bar, reward promises, or invent findings to avoid a high score. The requested target is 10.0 in every category from the active council on the same candidate. Layken permits skipping Opus when its usage runs out; other missing grades remain unresolved.

References: Brittany Chiang, Lee Robinson and Rauno Freiberg. Their screenshots calibrate craft; their identities and layouts are not templates to copy.

## Scores

| Round | Judge | Type | Hierarchy | Layout | Spacing | Color | Icons | Polish | Clarity | Distinct | Overall |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | Terra | 6.5 | 6.5 | 6.0 | 6.0 | 6.5 | 6.5 | 6.0 | 7.0 | 6.0 | 6.3 |
| 0 | DeepSeek | no score | no score | no score | no score | no score | no score | no score | no score | no score | no score |
| 1 | Terra | 7.5 | 7.2 | 6.8 | 6.7 | 7.8 | 7.2 | 7.2 | 7.5 | 6.6 | 7.2 |
| 1 | DeepSeek, OpenCode | 7.4 | 7.4 | 7.6 | 7.5 | 7.6 | 7.4 | 7.3 | 8.0 | 7.6 | 7.5 |
| 1 | Muse Contributor | 7.5 | 6.5 | 7.0 | 6.5 | 7.5 | 7.0 | 6.5 | 7.5 | 6.0 | 6.9 |
| 2 | Terra | 7.7 | 7.5 | 7.1 | 7.0 | 8.2 | 7.6 | 7.5 | 7.8 | 6.8 | 7.5 |
| 2 | DeepSeek, OpenCode | 8.7 | 8.8 | 8.5 | 8.5 | 9.1 | 8.9 | 8.6 | 9.2 | 8.4 | 8.7 |
| 2 | Muse Contributor | 8.0 | 8.5 | 8.0 | 7.5 | 8.5 | 8.5 | 7.5 | 8.5 | 7.0 | 8.0* |
| 3 | Terra | 7.5 | 7.5 | 7.0 | 7.0 | 8.5 | 8.0 | 7.5 | 8.0 | 7.0 | 7.6 |
| 3 | DeepSeek, OpenCode | 8.8 | 8.7 | 8.5 | 8.4 | 9.0 | 8.8 | 8.5 | 8.8 | 8.2 | 8.6 |
| 3 | Muse Contributor | 8.5 | 8.0 | 8.0 | 8.5 | 8.5 | 8.5 | 8.0 | 8.5 | 7.5 | 8.2 |
| 4 | Terra | 7.7 | 7.5 | 7.3 | 7.3 | 8.0 | 7.8 | 7.1 | 8.0 | 6.8 | 7.5 |
| 4 | DeepSeek, OpenCode | 8.5 | 8.6 | 8.6 | 8.4 | 8.2 | 8.7 | 8.0 | 9.0 | 7.7 | 8.4 |
| 4 | Muse Contributor | 8.2 | 7.8 | 8.3 | 8.0 | 8.1 | 8.5 | 7.6 | 8.2 | 7.3 | 8.0 |
| 4 | Opus 5.5 | 8.0 | 7.8 | 8.0 | 7.8 | 7.0 | 8.4 | 7.7 | 8.4 | 6.6 | 7.7 |
| 5 | Terra | 7.8 | 7.6 | 7.5 | 7.5 | 8.3 | 8.0 | 7.8 | 8.1 | 7.2 | 7.8 |
| 5 | DeepSeek, OpenCode | 8.6 | 8.5 | 8.4 | 8.4 | 8.8 | 8.2 | 8.3 | 8.8 | 8.4 | 8.5 |
| 5 | Muse Contributor, retry | 8.5 | 8.0 | 8.5 | 8.5 | 8.5 | 8.5 | 8.0 | 9.0 | 7.5 | 8.3 |
| 5 | Opus 5.5 | 8.4 | 8.2 | 8.3 | 8.2 | 8.1 | 8.5 | 8.2 | 8.6 | 7.6 | 8.2 |

Muse reported 7.8 overall for round 2. Its nine displayed category scores sum to 72, so the rubric's arithmetic mean is 8.0. Preserve both figures in the evidence ledger.

## Round 1

Remove decorative glows and competing surfaces. Give the homepage the same font as mobile and writing, improve small-label contrast and the project reading measure, bring mobile tags and actions next to their text, and move recognition off the screenshot. Use a quiet email row and full-width blog titles with plain arrows. Keep the existing layout and interactions for this pass.

Do not assume that every border needs 3:1 contrast; distinguish hairlines from a control's identifying information. Verify focus rings and actual text contrast in the browser. Do not replace the blog type with a serif or move the desktop panel merely to fill unused column space without visual evidence.

Round-1 proof: lint and the production build pass. Browser checks cover light/dark at widths 1440, 1024, 768, 390 and 320, changed-label contrast, theme-color synchronization, project navigation, screenshot switching, focus, mobile project actions/deep dives and blog navigation. All three visual reviews are recorded above.

## Round 2

Improve reading order and identity. Remove the decorative numeral and faux browser dots, show the short project description first with the full account in a native disclosure, use consistent recognition and internal-link arrows, and flatten article steps into a numbered sequence. Give writing pages a plain name in the header. Shorten the intro on taller phones so work begins in the first viewport, and make the in-page project detail action primary.

Keep the cool neutral palette. Do not restore old global colors based on source citations that ignore the scoped route tokens. Do not turn the mobile text links into tiles; Layken rejected those. The 390 × 844 round-1 project actions had 146.8px clearance, so there is no bottom collision to fix by squeezing all spacing. The measured 238.5px below the intro's work cue is real and is addressed by shortening that slide.

Round-2 proof: lint, production build and browser checks pass. The native project disclosure opens and preserves the full account; all mobile project actions remain reachable at 320px. The menu opens from the keyboard and closes on Escape. Theme-color uses the target CSS token, avoiding an intermediate transition color. Fresh captures include the screenshot reveal, expanded account, menu states and the original review surfaces.

## Round 3

Let the mobile intro take the space its content needs. Move project titles ahead of their screenshots so the first project identifies itself as it enters. Use complete, short summaries from existing project facts instead of clamping the full description. Keep the full account and tagline in Deep dive, increase its body to 16px, and give Back a 44px target.

Carry the portrait into writing headers. Widen the mobile menu, use matching outline icons, simplify the desktop founder panel boundary, and align position formatting and Résumé labels. Wrap long rail titles at narrow desktop widths and reduce the mobile article list gutter.

Declined findings: the mobile tagline and action borders were already neutral in round 2. Earlier blue rules were overridden; round 3 consolidates those rules. Rail text fits at 1440px but Acadiana's 132px title had 120px available at 1024px, so wrapping addresses the measured case. A full-viewport minimum intro would hide work again. A 40px project inset would overlap the fixed menu. Use content-driven height and a 64px inset instead.

Round-3 proof: lint, production build and the browser suite pass at five widths in both themes. At 390 × 844 the first project title starts at 643px and its image starts at 690px, compared with 774px for the previous image. The 320px view keeps its work control visible and every project action reachable by scrolling. Fresh captures include both themes at 1024px to show the rail wrapping.

## Round 4

Use two desktop columns below 1280px, with a native project picker beside the identity. The seven-item rail remains on wider screens. Give mobile project slides their natural height and determine the active item from its leading position. Keep the last project tall enough to reach its snap position. Label Source alongside Live and Deep dive.

Replace the mobile dropdown with an opaque navigation surface. It has one email action, a close control, focus containment and an inert background. Keep the portrait and name visible in the menu. Split full accounts into paragraphs in both project detail views without changing their words. Use 12px mobile crumbs and counters, and an arrow for the scroll action.

Remove the duplicate desktop role heading. Recognition follows the project title and tagline; its redundant rail glyph is removed. Tighten desktop project separation and the mobile blog introduction. Give writing pages a direct email footer. Include dark writing views in the screenshot packet.

Declined findings: a wider rail at 1024px would take more width from the already compressed work. The selected rail has a visible rule and heavier title, so it does not rely on the fill alone. Increasing chip padding would make wrapping worse. The expanded desktop account already uses 17px, above the requested 16px floor. DeepSeek's round-3 report contains its full score table and candidate deductions but ends midway through a reference discussion; no ranked-fix section was returned.

Round-4 proof: lint, production build and the browser suite pass. The 1024px image is 640px wide. The native picker and rail switch at 1280px. All seven mobile positions and action labels work at 320, 390 and 430px; touch swipes still open details. Menu focus stays inside, Escape restores the trigger, the background is inert, and theme switching works while the menu is open. The seven project accounts preserve every original word, with paragraph boundaries added. Fresh captures include dark writing pages.

## Round 5

Layken said the neutral previews were bland and light mode was too bright. He authorized removing excess motion and said he likes mobile swipes. That feedback supersedes earlier recommendations to keep the monochrome palette. Opus joined round 4 on the same screenshots with this newer feedback; the other three had already received their original brief.

Use a sage canvas and forest accents. Light canvas is #D7DFD6, ink #202C2A, muted #52615B, surface #E6ECE3 and accent #315D50. Dark canvas is #141C1A, ink #E6ECE6, muted #ACBDB0, surface #1C2823 and accent #9BC5AE. Contact and primary detail actions carry the accent; selected project navigation stays neutral. Remove the left selection bar. The new light canvas has 23.2% less relative luminance than #F7F8FA. Muted text contrast is 4.79:1 in light and 8.80:1 in dark.

Remove screenshot hover reveals and the seam, the circular theme wipe, the animated menu icon and the swipe teach-in that hid actions. Keep the direct screenshot switch, its keyboard controls, actual mobile swipes, drag preview and sheet motion. Use scroll padding and an opaque header surface to give snapped project titles clearance while shortening the gap between cards.

Fix dark article step fills with a properly scoped override. Raise small labels, give rail text more edge room, align mobile blog arrows to titles, and place the tablet picker after the founder block. Use Software engineer on both role lines, with the full employment details still available in the resume. Menu email aligns with the link list.

Round-5 proof: lint, production build and browser checks pass. Normal-motion checks cover all seven positions and immediate actions at 320, 390 and 430px, plus real touch swipes, click/keyboard screenshot switching, no hover reveal, no theme view transition and plain article steps in both themes. The existing suite also checks contrast, browser chrome, menu focus and navigation.

## Round 6

Put the desktop name, role and founder story together in the index rail. Contact keeps its own region. The tablet layout retains the same story above its project picker. Only one founder block is visible at each width.

Use full muted color on the rail counter and strengthen neutral selection without a left bar. Enlarge screenshot thumbnails to 48px and give the stack column enough room for Atlas's seven chips in one row. Remove the redundant mobile dot rail, keeping counts, swipe gestures and position tracking.

Use a shared writing header with portrait, name and theme control. Keep code chips in the route palette, align article rules with text, and match the tablet picker inset to its section. Add the existing booking, Telegram and Varholdt AI links to the mobile menu. Match its email row and name styling to the other mobile views.

Add a full-size image link to deep dives. Original screenshots are 2200–2816px wide and open in the browser for zoom; the card keeps the complete image. This preserves evidence that a fixed crop would hide.

Declined findings: availability was already ink, not a warm accent. Altering the surface token alone would not change the selected fill. More chip padding would worsen wrapping. The requested deep-dive title selector did not exist and the actual title already had a 22px margin. Muse's first round-5 attempt returned only progress text, so it has no grade; the fresh retry is recorded above.

Round-6 proof: lint and production build pass. Browser checks cover all seven positions and real touch swipes, menu focus, screenshot switching, one visible founder block at each width, the full-resolution image link, theme switching on writing pages and 320px header fit. At 1440px all seven Atlas stack chips fit in one row.

The final counter, position-number and screenshot-control text audit is at least 4.79:1 in light and 6.79:1 in dark. Inline code uses the actual route surface in both themes, including the stronger dark selector. All 28 candidate screenshots were captured again after these styles settled.

## Round protocol

1. Review every finding against the code and actual render. Record accepted and declined findings with reasons.
2. Apply the smallest coherent set of design changes. Run lint and the production build.
3. Check navigation, themes, screenshot switching, mobile deep dives, short viewports and keyboard focus. Measure contrast for changed labels and focus treatments.
4. Capture fresh images after fonts settle, including the same surfaces as the baseline.
5. Commit the round, publish a Vercel preview, and start fresh independent reviews with the fixed rubric.
6. Record the actual scores and continue. Do not claim the requested target while a grade or visual seat is missing.

Working artifacts live under `/tmp/portfolio-hill-climb-20261026/`: the frozen brief, per-round reports and plans, capture scripts, screenshot manifests, and state ledger. Keep that evidence out of the product interface. Put the score history, preview and declined asks in the final PR. Design rounds are preview work until Layken approves a release.
