# Portfolio design hill climb

This branch refines the portfolio through fresh screenshots and independent reviews. It starts at `a08badf06087f25ae0f0c92fcf6b27baa322ee57`, after the neutral project selection shipped in PR #4.

The method follows pingdotgg/t3code#24837: score the current page and reference sites, fix concrete findings, capture the changed page, and ask fresh judges to score again.

## Scope

Review `/`, `/blog`, and `/blog/glm-5-3-flash-pr-agent-code-review`. Capture the home page at 1440 × 900 and 390 × 844, in light and dark mode. Include project, detail, rail and panel views. Capture the writing pages in light mode at both widths. Use detail crops to check small text before reporting a rendering defect.

Keep Layken's portrait, seven projects, project URLs, blog facts, founder identity and `layken@varholdt.com`. Varholdt AI belongs in the identity, not the project list. Do not invent client claims or results. The alternate desktop design at `/3` is outside the work; it already shares the production mobile component.

## Judges and evidence

- GPT-6.1 Terra through Codex, `reasoningEffort: high`.
- Muse Spark 1.3 Contributor through OpenRouter/OpenCode, `variant: high`, read-only plan agent. Layken requested the Contributor variant.
- Round 0 used DeepSeek V4.1 Flash 1017 through Cursor, `reasoning_effort: high`. It is retired from the visual council.

Each round uses fresh, read-only delegates. They do not see the other judge's answer or earlier scores. They inspect every listed image, then read source to give exact fixes. A missing image or unavailable vision is reported, never replaced with an invented observation or grade.

DeepSeek's round-0 image tool returned generated captions rather than pixels. It found false claims in the captions and declined to issue visual grades. Its report contains ungraded source and pixel measurements. Layken replaced that seat with Muse Contributor for round 1. No visual score from DeepSeek counts toward the target.

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

A 10 means the judge cannot justify a concrete improvement in that category from the evidence. Do not round a 9.x up, lower the bar, reward promises, or invent findings to avoid a high score. The requested target is 10.0 in every category from both visual judges on the same candidate. An unavailable grade cannot satisfy it.

References: Brittany Chiang, Lee Robinson and Rauno Freiberg. Their screenshots calibrate craft; their identities and layouts are not templates to copy.

## Scores

| Round | Judge | Type | Hierarchy | Layout | Spacing | Color | Icons | Polish | Clarity | Distinct | Overall |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | Terra | 6.5 | 6.5 | 6.0 | 6.0 | 6.5 | 6.5 | 6.0 | 7.0 | 6.0 | 6.3 |
| 0 | DeepSeek | no score | no score | no score | no score | no score | no score | no score | no score | no score | no score |

## Round 1

Remove decorative glows and competing surfaces. Give the homepage the same font as mobile and writing, improve small-label contrast and the project reading measure, bring mobile tags and actions next to their text, and move recognition off the screenshot. Use a quiet email row and full-width blog titles with plain arrows. Keep the existing layout and interactions for this pass.

Do not assume that every border needs 3:1 contrast; distinguish hairlines from a control's identifying information. Verify focus rings and actual text contrast in the browser. Do not replace the blog type with a serif or move the desktop panel merely to fill unused column space without visual evidence.

Round-1 proof: lint and the production build pass. Browser checks cover light/dark at widths 1440, 1024, 768, 390 and 320, changed-label contrast, theme-color synchronization, project navigation, screenshot switching, focus, mobile project actions/deep dives and blog navigation. Fresh screenshot review is still pending.

## Round protocol

1. Review every finding against the code and actual render. Record accepted and declined findings with reasons.
2. Apply the smallest coherent set of design changes. Run lint and the production build.
3. Check navigation, themes, screenshot switching, mobile deep dives, short viewports and keyboard focus. Measure contrast for changed labels and focus treatments.
4. Capture fresh images after fonts settle, including the same surfaces as the baseline.
5. Commit the round, publish a Vercel preview, and start fresh independent reviews with the fixed rubric.
6. Record the actual scores and continue. Do not claim the requested target while a grade or visual seat is missing.

Working artifacts live under `/tmp/portfolio-hill-climb-20261026/`: the frozen brief, per-round reports and plans, capture scripts, screenshot manifests, and state ledger. Keep that evidence out of the product interface. Put the score history, preview and declined asks in the final PR. Design rounds are preview work until Layken approves a release.
