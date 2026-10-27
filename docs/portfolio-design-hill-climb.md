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

A 10 means the judge cannot justify a concrete improvement in that category from the evidence. Do not round a 9.x up, lower the bar, reward promises, or invent findings to avoid a high score. The requested target is 10.0 in every category from all three visual judges on the same candidate. An unavailable grade cannot satisfy it.

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

## Round protocol

1. Review every finding against the code and actual render. Record accepted and declined findings with reasons.
2. Apply the smallest coherent set of design changes. Run lint and the production build.
3. Check navigation, themes, screenshot switching, mobile deep dives, short viewports and keyboard focus. Measure contrast for changed labels and focus treatments.
4. Capture fresh images after fonts settle, including the same surfaces as the baseline.
5. Commit the round, publish a Vercel preview, and start fresh independent reviews with the fixed rubric.
6. Record the actual scores and continue. Do not claim the requested target while a grade or visual seat is missing.

Working artifacts live under `/tmp/portfolio-hill-climb-20261026/`: the frozen brief, per-round reports and plans, capture scripts, screenshot manifests, and state ledger. Keep that evidence out of the product interface. Put the score history, preview and declined asks in the final PR. Design rounds are preview work until Layken approves a release.
