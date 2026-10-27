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
| 6 | Terra | 8.0 | 7.5 | 7.5 | 7.8 | 8.5 | 8.0 | 8.0 | 8.2 | 7.5 | 7.9 |
| 6 | DeepSeek, OpenCode | 8.5 | 8.4 | 8.6 | 8.6 | 8.6 | 8.4 | 8.5 | 8.7 | 8.0 | 8.5 |
| 6 | Muse Contributor | 8.0 | 7.8 | 7.8 | 7.5 | 8.3 | 8.2 | 7.6 | 8.5 | 7.8 | 7.9 |
| 6 | Opus 5.5 | 8.3 | 8.2 | 8.3 | 8.2 | 8.5 | 8.3 | 8.1 | 8.9 | 7.4 | 8.2 |
| 7 | Terra | 8.2 | 8.3 | 8.0 | 7.9 | 8.5 | 8.0 | 8.1 | 8.5 | 7.6 | 8.1 |
| 7 | DeepSeek, OpenCode | 8.5 | 8.3 | 8.4 | 8.4 | 8.6 | 8.4 | 8.2 | 8.5 | 8.4 | 8.4 |
| 7 | Muse Contributor, retry | 7.5 | 7.5 | 8.0 | 7.5 | 8.0 | 8.0 | 7.5 | 8.5 | 7.0 | 7.7 |
| 7 | Opus 5.5 | 8.4 | 8.2 | 8.4 | 8.2 | 8.4 | 8.4 | 8.0 | 8.7 | 7.6 | 8.3 |

| 8 | Terra | 8.0 | 8.2 | 7.8 | 7.7 | 8.5 | 8.0 | 7.8 | 8.2 | 7.5 | 8.0 |
| 8 | DeepSeek, OpenCode | 8.6 | 8.8 | 8.7 | 8.6 | 8.4 | 8.7 | 8.5 | 9.0 | 8.8 | 8.7 |
| 8 | Muse Contributor | 8.0 | 8.0 | 8.5 | 7.5 | 8.5 | 8.0 | 8.0 | 9.0 | 7.5 | 8.1 |
| 8 | Opus 5.5 | 8.4 | 8.2 | 8.1 | 8.0 | 8.6 | 8.6 | 8.1 | 8.8 | 7.6 | 8.3 |

| 9 | Terra | 8.3 | 8.5 | 8.2 | 8.1 | 8.8 | 8.5 | 8.3 | 8.7 | 7.9 | 8.4 |
| 9 | DeepSeek, OpenCode | 8.5 | 8.4 | 8.3 | 8.4 | 8.7 | 8.3 | 8.4 | 8.8 | 8.2 | 8.4 |
| 9 | Muse Contributor | 8.5 | 8.0 | 8.5 | 8.0 | 8.5 | 8.5 | 8.0 | 8.5 | 7.5 | 8.2 |
| 9 | Opus 5.5 | 8.4 | 8.3 | 8.2 | 8.1 | 8.6 | 8.4 | 8.2 | 8.8 | 7.6 | 8.3 |

| 10 | Terra | 8.2 | 8.4 | 8.1 | 7.9 | 8.6 | 8.4 | 8.3 | 8.7 | 7.8 | 8.3 |
| 10 | DeepSeek, OpenCode | 8.7 | 8.5 | 8.5 | 8.5 | 8.5 | 8.3 | 8.4 | 8.8 | 8.5 | 8.5 |
| 10 | Muse Contributor | 8.0 | 7.5 | 8.0 | 8.0 | 8.5 | 8.5 | 8.0 | 8.5 | 7.5 | 8.1 |
| 10 | Opus 5.5 | 8.5 | 8.4 | 8.1 | 8.4 | 8.4 | 8.4 | 8.3 | 8.8 | 7.6 | 8.3 |

| 11 | Terra | 8.4 | 8.5 | 8.2 | 8.0 | 8.7 | 8.5 | 8.3 | 8.6 | 8.0 | 8.4 |
| 11 | DeepSeek, OpenCode | 8.8 | 9.0 | 8.9 | 8.8 | 8.5 | 8.9 | 8.7 | 9.0 | 8.5 | 8.8 |
| 11 | Muse Contributor | 8.5 | 8.0 | 8.5 | 8.0 | 8.5 | 8.5 | 8.0 | 8.5 | 8.0 | 8.3 |
| 11 | Opus 5.5 | 8.4 | 8.1 | 8.1 | 8.3 | 8.5 | 8.4 | 8.3 | 8.5 | 7.6 | 8.2 |

| 12 | Terra | 8.4 | 8.7 | 8.4 | 8.3 | 9.0 | 8.5 | 8.6 | 9.0 | 8.3 | 8.6 |
| 12 | DeepSeek, OpenCode | 8.6 | 8.8 | 8.4 | 8.6 | 8.7 | 8.4 | 8.4 | 8.9 | 8.0 | 8.5 |
| 12 | Muse Contributor | 8.5 | 8.5 | 8.5 | 8.5 | 9.0 | 9.0 | 8.5 | 9.0 | 8.0 | 8.6 |
| 12 | Opus 5.5 | 8.4 | 8.3 | 8.2 | 8.4 | 8.2 | 8.8 | 8.3 | 8.8 | 7.8 | 8.4 |
| 13 | Terra | 8.5 | 8.6 | 8.4 | 8.3 | 9.0 | 8.6 | 8.5 | 9.0 | 8.2 | 8.6 |
| 13 | DeepSeek, OpenCode retry | 9.4 | 9.4 | 9.2 | 9.3 | 9.0 | 9.4 | 9.0 | 9.4 | 8.8 | 9.2 |
| 13 | Muse Contributor | 8.5 | 8.5 | 8.0 | 8.0 | 8.5 | 8.5 | 8.0 | 9.0 | 8.0 | 8.3 |
| 13 | Opus 5.5, session limit | no score | no score | no score | no score | no score | no score | no score | no score | no score | no score |
| 14 | Terra | 8.5 | 8.7 | 8.4 | 8.2 | 9.0 | 9.0 | 8.5 | 9.0 | 8.1 | 8.6 |
| 14 | DeepSeek, OpenCode | 9.1 | 9.0 | 8.7 | 8.7 | 9.1 | 8.8 | 8.8 | 9.3 | 8.4 | 8.9 |
| 14 | Muse Contributor | 8.0 | 7.5 | 7.5 | 7.0 | 8.0 | 7.5 | 7.0 | 8.5 | 7.5 | 7.6 |
| 15 | Terra | 8.5 | 8.5 | 8.4 | 8.1 | 9.0 | 8.7 | 8.5 | 9.0 | 8.3 | 8.6 |
| 15 | DeepSeek, OpenCode retry | 9.0 | 9.1 | 8.8 | 8.6 | 9.0 | 9.0 | 8.8 | 9.3 | 8.9 | 8.9 |
| 15 | Muse Contributor | 8.5 | 8.5 | 8.5 | 8.0 | 8.5 | 8.0 | 8.0 | 9.0 | 7.5 | 8.3 |
| 17 | Sol | 9.3 | 9.2 | 9.0 | 9.0 | 10 | 10 | 10 | 9.3 | 10 | 9.5 |
| 17 | DeepSeek, OpenCode | 8.9 | 8.6 | 8.6 | 8.8 | 9.0 | 8.8 | 8.4 | 9.1 | 8.2 | 8.7 |
| 17 | Muse Contributor | 9.0 | 8.5 | 9.0 | 8.5 | 9.0 | 9.0 | 9.0 | 9.0 | 8.5 | 8.8 |
| 18 | Sol | 10 | 9.4 | 9.6 | 9.3 | 10 | 10 | 9.6 | 9.8 | 10 | 9.7 |
| 18 | DeepSeek, OpenCode | 8.8 | 8.9 | 9.0 | 9.0 | 8.6 | 8.9 | 8.5 | 9.0 | 8.7 | 8.8 |
| 18 | Muse Contributor | 8.5 | 9.0 | 9.0 | 8.5 | 9.5 | 9.5 | 9.0 | 9.0 | 8.5 | 9.0 |
| 19 | Sol | 8.9 | 9.0 | 10 | 9.0 | 10 | 10 | 9.2 | 9.0 | 10 | 9.5 |
| 19 | DeepSeek, OpenCode | 9.2 | 9.1 | 8.8 | 8.8 | 8.7 | 9.1 | 8.7 | 9.1 | 8.4 | 8.9 |
| 19 | Muse Contributor | 9.0 | 9.0 | 8.5 | 8.5 | 9.0 | 9.0 | 8.5 | 9.5 | 8.0 | 8.8 |
| 21 | Sol | 10 | 9.0 | 9.3 | 9.0 | 10 | 10 | 9.3 | 9.0 | 10 | 9.5 |
| 21 | DeepSeek, OpenCode | 8.3 | 8.5 | 8.5 | 8.5 | 8.6 | 8.5 | 8.3 | 8.9 | 8.6 | 8.5 |
| 21 | Muse Contributor | 8.5 | 8.5 | 8.5 | 8.0 | 9.0 | 9.0 | 8.5 | 9.0 | 8.0 | 8.6 |
| 22 | Sol | 10 | 9.0 | 9.2 | 10 | 10 | 10 | 9.5 | 9.3 | 10 | 9.7 |
| 22 | DeepSeek, OpenCode | 9.0 | 8.7 | 8.8 | 8.8 | 8.7 | 9.0 | 8.7 | 9.0 | 8.7 | 8.8 |
| 22 | Muse Contributor | 8.5 | 8.5 | 8.5 | 8.5 | 9.0 | 9.0 | 8.0 | 9.0 | 8.5 | 8.6 |

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

## Round 7

Make the personal name clearly larger than the business link at both desktop breakpoints. Use the same sans role style on mobile, circular portrait crops, and a stronger writing wordmark. Move the index position beside its label and remove the isolated footer counter.

Align writing controls to the column's optical edges while preserving their tap targets. Put blog arrows beside their headlines. Use the existing emphasized title phrases in the forest accent. The installed Next font catalog supports only normal Geist, so this pass adds no invalid italic option or dependency upgrade.

Replace the screenshot capsule with plain direct tabs. Keep click, keyboard and shared state; add no reveal motion. Strengthen the full-size-image action, fix the company menu glyph, label Twitter / X, and align menu icons with the email row. Reduce the article list's initial gap and align mobile counters to the first title line.

Declined findings: quick links already have 44px targets, Atlas's seven chips fit in one row, numeric counters are tabular, and the full-size underline offset was already 3px. A 1fr grid with a narrower arrow column would not solve the claimed distance; an inline headline group does. Keep the 1024px reading order instead of reversing it solely for a preference.

Round-7 proof: lint, production build and the browser suites pass. Names measure 26px wide /22px tablet, above the 19px founder link. Phone quick links stay on one line with 44px targets at 320 and 390px. Blog arrows are 8px from their title boxes. All seven project positions, real touch swipes, direct screenshot tabs, themes, menu focus and short-phone fit remain checked. The packet includes actual writing-header hover states in both themes.

## Round 8

Keep the title's final words and arrow together inside the heading, fixing the Safari article's wrapped-title defect. Remove the extra article heading margin that compounded the flex gap. Use one 700-weight writing title with accent color on its emphasized phrase.

Give inactive screenshot tabs the muted color on the chrome surface. Align both mobile bars to the 20px content edge and use one plain 14px/650 name mark with a 28px portrait. Preserve the 44px controls and header clearance. Make metadata rules continuous, raise STACK/LINKS to 12px, strengthen secondary icons and remove the last menu rule.

Disclose the omitted mobile stack with a compact +N count; the complete list remains in Deep dive. Keep desktop chip dimensions, the soft palette, real swipes and direct screenshot switching.

Declined findings: selected navigation and email have different effective backgrounds in both themes. Do not hide the tablet founder story or add chip padding that would undo the measured one-row stack. Keep the inline editorial arrows instead of returning them to a distant desktop column. The desktop remains work-first by design, with grouped identity and contact always visible. Muse's first round-7 run returned progress text only; the fresh retry's actual grades are recorded above.

Round-8 proof: lint, production build and browser suites pass. Wrapped title arrows stay with the final words at 320, 390, 768, 1024 and 1440px. All seven +N counts match project data. The plain mobile mark measures x=20px, 14px type and full opacity after the project snap. All actions remain reachable on short phones, and real swipes still open details. Metadata, position and tab text have at least 4.79:1 light /6.79:1 dark contrast in the measured states.

## Round 9

Name the project before its detail image. The top bar now says Deep dive without repeating or truncating the title. Keep the complete screenshot and full-size action. Make mobile project titles less heavy, and give article list text more width.

Use 20px mobile edges across writing, the hero and the menu. Bring the writing header up to the same top region as the home controls. Cap summaries, excerpts and article deks at 36rem; use 16px/1.65 for index excerpts. Let metadata rules reach the screenshot edge. Move the tablet theme control beside the founder block, near identity, with one visible control at each breakpoint.

Declined findings: the supplied dark rail shows readable near-white More work titles. The saved pixel probe and browser style audit do not reproduce DeepSeek's reported near-black text. Do not claim a fix for that finding. Keep the neutral selection without a colored left bar, the work-first desktop order, the founder message and complete project images. Selected navigation and the email still use different effective fills. Do not add another index eyebrow or change the title palette for its own sake.

Round-9 proof: lint and production build pass. The existing browser suites cover both themes at five widths, all seven project positions and actions, real touch swipes, menu focus and Escape, direct screenshot tabs, theme-color sync and flat article steps. Focused checks cover the detail reading order, short header, mobile writing edges and tablet control placement. Fresh captures include all 30 candidate states.

## Round 10

Give tablet identity, founder, picker, contact and email one inset. Move its theme control to the identity row, preserving the personal name's size. Inset the section rule to match the content. Raise the project title's minimum from 29.6px to 32px; its measured 36.7px at 1440px stays the same.

Reuse the portrait/name component in the phone project bar, menu and writing header. Keep the 28px portrait and 14px/650 name. Center the writing mark on phones. Below 390px, the back control uses its arrow with the same accessible label and a 44px target, keeping the full name and theme control in one row. Use text hover and a visible focus outline instead of a filled header hover.

Let project headings use the full width when needed, with an 8px gap before a wrapped counter. Use natural wrapping for mobile article headings. Give detail titles 24px below the header control, use a bare Back control with its 44px target, and put the full-size arrow beside the label. Keep that image action's 48px full-width target. Match dek leading to excerpts. Menu arrows retain the internal/external distinction.

Declined findings: measured project actions are 48px, not 40px. Their unequal widths allow room for the longer Deep dive label. The disclosure has no open-state underline when the pointer is moved away. Inline code has a 24.6px line box inside the body's 28.9px leading. Labels already use 12px/0.08em. Preserve the email priority, neutral selection and tablet picker. Do not turn Blog into an external arrow, shrink targets, remove founder copy or add a new visual layer.

Round-10 proof: lint and production build pass. Browser checks retain all seven projects, short-phone action fit, real swipes, direct tabs, theme/meta sync, focus, menu Escape and flat article steps. Focused measurements check equal tablet insets, one theme control, identical phone brand coordinates, centered writing headers without overlap, text hover/focus and detail spacing. The capture packet adds light/dark long-title project states.

## Round 11

Give every phone project the same counter-above-title arrangement with an 8px gap. Titles keep the full width and the image follows by 16px. Use 16px summaries and 13px chips with slightly narrower padding. Keep the fourth chip and +N count together so the count does not wrap alone. Keep all three 48px actions. Dark Deep dive uses the existing soft accent, accent border and ink text, reducing the bright repeated fill.

Stack the tablet portrait and theme control above the full-width name and role. Wide desktop also puts the theme control beside personal identity. The phone has a direct header theme control. The menu makes that background control inert and restores it on close. Writing retains its header theme control.

Use a 20px content inset for identity and control-column rules. Give rail rows a 44px minimum while keeping the 48px previews. Strengthen metadata and numbers with 500 weight, and use smaller founder and X marks. The phone hero keeps booking and Telegram as direct contact links; GitHub remains in the menu and desktop Elsewhere.

Declined findings: labels already use 12px, not 10px or 11px. The project summary is 17px at a 36rem cap, not 18px at 688px. The index and article already share the same emphasized title rule. Numbered-list dividers align with their text inside an intentional gutter. Preserve the View projects scroll button, which uses an arrow rather than an accordion chevron. Keep work-first desktop order and the actual seven-name tablet picker.

Round-11 proof: lint and production build pass. Browser suites cover all seven cards and actions, real touch swipes, direct screenshot tabs, both themes, meta colors, keyboard focus and menu state. Focused checks measure all counter/title/image gaps, one active theme control, menu inert restoration, names on one line and shared rail insets. All 32 candidate states are captured again.

## Round 12

Recover 24px from the tall-phone intro's founder and contact margins and bottom padding. Keep the portrait, copy and contact targets intact. Give the image action and The work label another 8px of separation in deep dives.

Separate border jobs. Light structural rules use #93A89A. Outlined buttons and the native picker use #55796C in light and #5D7B6C in dark. Static technology tags use a softer mix of the structural border. This addresses the conflicting requests for clearer controls and quieter metadata without giving every chip a control edge.

Keep labels at 12px and increase weight to 600 with 0.08em tracking. Dark labels use #C2D2C6; body muted text stays unchanged. Use a 28px/650 wide name and a 16px desktop tagline, preserving the larger work title. Bring navigation row edges onto the 20px rail inset and keep the 48px previews. Cap expanded accounts at 36rem and 60ch without changing screenshots.

Declined findings: the article already uses a verified 36rem/17px reading measure, and metadata is already 12px. The screenshot tab's underline is a 2px border, so text-underline-offset would not change it. The +N count already stays with its preceding chip. Keep the one-row centered writing header, centered phone introduction and work-first tablet order. A navigation header can be wider than its prose column. Do not turn structural or static-tag hairlines into mandatory control borders.

Round-12 proof: lint and production build pass. Browser checks retain themes, meta colors, seven project routes, real touch swipes, menu focus/inert state and short-phone action fit. Focused measurements cover control-edge contrast, all rail-title fits, the shared 20px edge, earlier phone work, single-line names and the counter/title/image rhythm. All 32 candidate states are captured again.

## Round 13

Align open-menu controls with the closed toolbar's optical overhang. The portrait/name mark and 44px targets stay in place. Add a neutral theme control to the deep-dive header. Keep its background inert, contain Tab focus in the dialog and restore focus when it closes.

Use 17px/1.65 opaque muted writing deks, a 14px/600 disclosure control and 16px inline blog arrows. Shorten the phone article's header-to-first-section gap by 16px. Darken light muted text to #47554F while keeping label and dark tokens unchanged. Mark the expanded account with spacing and a quiet top rule, preserving its 17px ink text and reading cap.

Enlarge rail previews to 56px. Recover horizontal space through the grid's index width, gaps and inner padding, retaining all seven title fits and the 20px outer inset. Project screenshots and facts stay unchanged.

Declined findings: the summary is already 36rem/17px; a 40rem replacement would widen it. Source uses the same 16px Lucide GitHub icon as the menu. The writing header's visible content is centered, as measured at 320px and 390px. Card titles use 700 weight, menu rows use 52px and have no final rule, and the baseline git object exists. The native picker chevron is already centered in its 48px field. Keep the centered phone identity and responsive tablet order. Do not add another availability line to the compact hero.

Round-13 proof: lint and production build pass. Browser checks cover navigation, themes, meta colors, short phones, all seven card actions, swipes and menu focus. Focused checks compare open/closed menu coordinates, modal Tab/Escape/focus restoration and theme access, centered writing marks, intro type and all rail-title fits at 56px. All 33 candidate states are captured again, including the detail header in both themes.

## Round 14

Remove borders and padding from static technology metadata on project cards, desktop accounts and writing rows. Keep the existing gaps and every technology name. The fourth phone technology and +N count remain together. Buttons keep their 48px targets and stronger control borders.

Give phone article lists a 12px hanging gutter, recovering text width without clipping numbers. Reduce the detail work-label margin to 24px. Keep Back and theme as the detail toolbar controls; the title and dialog name identify the project. Rename the working phone shortcut to Scroll to projects so its action is explicit.

Declined findings: rail labels already use 12px, and project prose already has a 36rem cap. The native picker and full rail are mutually hidden at their breakpoints. Phone actions remain horizontal and 48px tall. The writing mark is centered by measurement. Keep the current 56px previews and their subtle edges, since those edges help dark images separate from the rail. Preserve the work-first desktop and centered phone introduction.

Round-13 review handling: Opus reached its session limit and was skipped under Layken's instruction. The original three seats remain active. DeepSeek's first run returned progress only, with no grades; a fresh same-model retry supplied the recorded review. No score was inferred from either unavailable result.

Round-14 proof: lint, production build and browser suites pass. Checks cover all seven cards and actions, real swipes, direct screenshot tabs, themes and browser colors, menu and detail focus containment/restoration, centered writing marks, rail-title fit and control contrast. Focused checks confirm borderless static metadata, the working scroll shortcut, 24px detail spacing and 12px article gutters at 320px and 390px in both themes. All 33 candidate states are captured again.

## Round 15

Raise static desktop and writing technology labels to 13px and use 10px gaps across technology rows. Preserve plain labels, facts and the fourth-label/+N grouping. Keep all action buttons at 48px. Set the phone article gutter to 16px, giving markers more room than round 14 while retaining some of its wider text measure.

Remove the rules around Scroll to projects. Keep its 48px target, location and working scroll action, with a 14px/600 label and 14px arrow. Show repeated desktop external-link arrows on hover and keyboard focus; keep the email and internal Blog arrows visible.

Declined findings: the metadata already uses a 4rem grid with aligned keys and continuous image-width rules. The first Atlas stack row fits on one line. Phone actions already have an 8px gap and fit at 320px. The writing header already uses three tracks on phones and its visible mark is centered by measurement. Prose and screenshot metadata have different intended widths. Keep the responsive tablet order, 24px work-label margin, screenshot tabs, founder story and current palette. Do not add founder text to every byline or shrink labels for variation.

Round-15 proof: lint and production build pass. Browser checks cover themes and browser colors, all seven actions and real swipes, direct tabs, menu/detail focus and restoration, short viewports and reading overflow. Focused checks confirm 13px static labels with 10px gaps, all seven Atlas labels on one row, hover/focus arrow visibility, a borderless 48px scroll control, 16px phone article gutters, centered writing marks and the unchanged 8px/16px card rhythm. All 33 states are captured again.

## Round 16

Replace the wide rail's miniature screenshots with a numbered text index. Keep every project name, both groups, 44px targets and the shared 20px edge. Use 15px titles and a 12px gap from the number. Give the dark selected row the existing control-border outline. The large project images and direct screenshot tabs stay.

Recover 20px from the phone intro's handoff to work without changing its copy, portrait or contact targets. The scroll shortcut loses its extra top margin, and the intro has 8px bottom padding. Keep the 8px counter/title and 16px title/image gaps.

Raise writing dates, read time and the article byline to 13px with 0.04em tracking. Group the blog intro and post list with a 24px gap while keeping the header's spacing separate. Retain the 36rem excerpt and article measures.

Declined findings: index descriptions already cap at 36rem, not 720px. The visible writing mark is centered and the phone header already has three tracks. The 1024px layout already has two columns. Phone actions fit horizontally at 320px with 48px targets, and Atlas's technology row fits on one line. Do not widen prose, stack buttons, flip the tablet order or add another header link for variation. Keep the current palette, founder message and screenshot frame.

DeepSeek's first round-15 result ended at the table heading and had no grades. A fresh same-model OpenCode retry produced the recorded full review. Opus remains skipped after its usage limit, as authorized.

Round-16 proof: lint and production build pass. Browser suites retain all seven project routes and actions, real touch swipes, direct screenshot tabs, themes and browser colors, menu/detail focus and restoration, short-phone fit and reading overflow. Focused checks confirm seven text-only rail rows with 44px targets, 15px titles and 12px gaps, the earlier phone handoff, 13px writing metadata, the 24px index gap, centered writing marks and unchanged card geometry. All 33 states are captured again.

## Round protocol

1. Review every finding against the code and actual render. Record accepted and declined findings with reasons.
2. Apply the smallest coherent set of design changes. Run lint and the production build.
3. Check navigation, themes, screenshot switching, mobile deep dives, short viewports and keyboard focus. Measure contrast for changed labels and focus treatments.
4. Capture fresh images after fonts settle, including the same surfaces as the baseline.
5. Commit the round, publish a Vercel preview, and start fresh independent reviews with the fixed rubric.
6. Record the actual scores and continue. Do not claim the requested target while a grade or visual seat is missing.

Working artifacts live under `/tmp/portfolio-hill-climb-20261026/`: the frozen brief, per-round reports and plans, capture scripts, screenshot manifests, and state ledger. Keep that evidence out of the product interface. Put the score history, preview and declined asks in the final PR. Design rounds are preview work until Layken approves a release.

From round 17, Claude Opus 5.5 drives the loop and GPT-6.1 Sol through Codex (`reasoningEffort: high`) replaces Terra. DeepSeek and Muse Contributor keep their seats. The target is 9.5 from every judge. The phone header and menu follow varholdt.com and Public Parish at Layken's request. Round 20 was cancelled after Layken's feedback on the phone hero, rail and header. Round 23 was not graded.

DeepSeek and Muse reported several measurable defects that the rendered page did not show, such as 12px labels that measure 13px and contrast below 3:1 that measures 3.55:1. Later briefs list those measurements.
