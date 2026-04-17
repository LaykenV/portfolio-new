# Blog Handoff: Building Mesh Mind's Multi-Model Debate Workflow

This is a context pack for the blog agent. **Do not publish this file.** Use it as the source material for a first-person blog post by Layken Varholdt about how Mesh Mind's multi-model "debate → synthesize" workflow was built, and how it maps onto the MIT/Google Brain research that inspired it.

---

## 1. Inspiration: the research paper

**Paper:** *Improving Factuality and Reasoning in Language Models through Multiagent Debate*
**Authors:** Yilun Du, Shuang Li, Antonio Torralba, Joshua B. Tenenbaum, Igor Mordatch (MIT + Google Brain)
**Landing page:** https://composable-models.github.io/llm_debate/

### Core idea of the paper
- Treat multiple instances of a language model as a "multiagent society."
- Each agent produces an initial answer, then sees its peers' answers and is asked to critique and revise.
- After a few rounds, answers converge on a better final response.
- Authors report improvements on arithmetic, chess move optimization, GSM8K grade-school math, and factual validity benchmarks.
- They also show that different models (ChatGPT and Bard in the paper) can debate with each other productively.
- Their reference setup uses **3 agents × 2 rounds** due to compute cost; accuracy keeps climbing with more agents and more rounds.
- Key observed effect: debate reduces hallucinations and forces agents to "show their work" against peer pressure.

### Why this was the right starting point for Mesh Mind
- Consumer chat UIs are a single model talking to you. The research shows that isn't the ceiling.
- The paper's protocol is model-agnostic, which lines up perfectly with the idea of letting a user pick *different* frontier models from different labs and make them reason together.
- The structure (initial → critique-with-peers → final) is a clean state machine — a natural fit for a Convex workflow.

---

## 2. What Mesh Mind is (one paragraph for the post)

Mesh Mind is a multi-model chat app built on Next.js + Convex where you pick a **master model** plus up to two **secondary models**, and the system runs a structured debate across them before handing you a final answer. Initial answers happen in parallel. Then each model sees the other models' answers and writes a revised response. Finally, the master model synthesizes all of the refined answers into one authoritative reply, while a lightweight summary agent emits a structured JSON report (agreements, disagreements, per-model key points) that renders as a table in the UI.

---

## 3. Demo links to embed in the post

- X / Twitter demo: https://x.com/LLVarholdt/status/1966616437654442141
- YouTube walkthrough: https://www.youtube.com/watch?v=2vJvb5-o8-Q&t=1s

Suggested placement: embed the Twitter clip near the top (the 30-second elevator pitch) and the YouTube video in the "See it run" section after the architecture explainer.

---

## 4. How the paper's protocol maps to the Mesh Mind workflow

| Paper concept | Mesh Mind implementation |
| --- | --- |
| N agents | 1 master model + up to 2 secondary models (so N = 2 or 3), chosen by the user per message |
| Identical agents | **Heterogeneous** agents — one each from OpenAI, Anthropic, Google, xAI, or OSS (Llama, GPT-OSS) |
| Round 1: initial answers | `generateModelResponse` runs in parallel per model (including master) on its own sub-thread |
| Round 2: see peers and revise | `generateDebateResponse` builds a prompt with every *other* model's answer and asks for a revised final answer |
| Convergence / final | `generateSynthesisResponse` runs on the master thread and merges the refined answers into one definitive reply |
| Evaluation / analysis | `generateRunSummary` uses a cheap summary agent + Zod schema to produce a structured "who agreed, who changed their mind, key points per model" object rendered as a UI table |

### Places where Mesh Mind extends the paper
1. **Cross-lab debate.** The paper debates identical models or pairs like ChatGPT+Bard. Mesh Mind lets a user put, e.g., GPT-5, Claude Opus 4.5, and Gemini 3 Pro into the same debate. The diversity of training data and alignment is itself a signal.
2. **Explicit synthesis step.** The paper lets answers converge. Mesh Mind adds a dedicated synthesis pass on the master model so the user always gets one clean answer rather than three-way convergence they have to interpret.
3. **Structured output for auditability.** A separate summary agent emits a Zod-validated JSON object so the UI can show agreements / disagreements / changed positions as a table — turning "model debate" from a vibe into something inspectable.
4. **Real-time streaming UX.** Each stage streams line-by-line via Convex Agent stream deltas, and per-model status cards (`initial → debate → complete → error`) update live.
5. **Cost awareness.** Every agent runs through a `usageHandler` that records tokens (including provider `reasoningTokens`) and estimates USD cost against a weekly budget — debate is expensive, so this had to be first-class.

### Places where Mesh Mind intentionally stays close to the paper
- **Two-round protocol.** The paper settled on 2 rounds for compute reasons and found gains continue past that. Mesh Mind keeps 2 rounds — same tradeoff, same sweet spot for chat latency.
- **Debate prompt wording.** The actual debate prompt in `convex/workflows.ts` (`generateDebateResponse`) quotes the paper's framing almost verbatim: "Here are the solutions to the problem from other agents. Your task is to critically re-evaluate your own initial answer in light of these other perspectives... Using the reasoning from these other agents as additional advice, provide an updated and improved final response to the original question." If they change their mind they must say why; if they hold their position they must defend it.

---

## 5. The workflow, step by step (source of truth for the "how it works" section)

All orchestration lives in `convex/workflows.ts`, defined with `@convex-dev/workflow`'s `WorkflowManager`. Entry point from the UI is `startMultiModelGeneration` in `convex/chat.ts`.

### Step 0 — User kicks it off
- `app/(app-shell)/page.tsx` handles the new-chat landing. `components/ModelPicker.tsx` is the drag-and-drop picker for master + secondaries.
- On submit, the client creates a thread, navigates immediately to `/chat/[threadId]` (optimistic), and calls `startMultiModelGeneration(threadId, prompt, masterModelId, secondaryModelIds, fileIds?)`.
- Server-side guards: auth (`authorizeThreadAccess`), rate limit (`globalLLMRequests`), weekly budget check (`getBudgetStatusInternal`), file-support check against the master model.

### Step 1 — Spin up one sub-thread per model
- `createSecondaryThread` runs in parallel for the master + each secondary via `components.agent.threads.createThread`.
- Each model gets its own ephemeral Convex Agent thread so its conversation doesn't pollute the main user-visible thread.

### Step 2 — Record the run
- `recordMultiModelRun` inserts a `multiModelRuns` doc indexed by `masterMessageId` and `masterThreadId`. Per-model state starts as `status: "initial"`.

### Step 3 — Round 1: initial responses in parallel
- `generateModelResponse` fires once per model (including master), all in `Promise.all`.
- For each model:
  - Rate-limit check.
  - File-support check (throw early if files were attached and the model can't handle them).
  - `saveMessage` writes the user prompt (with file/image parts assembled via `getFile` when attachments exist) to that model's sub-thread.
  - `updateRunStatus → "initial"` with the saved `initialPromptMessageId`.
  - `createAgentWithModel(modelId).continueThread(...)` → `thread.streamText({ promptMessageId }, { saveStreamDeltas: { chunking: "line", throttleMs: 500 } })`.
  - `await result.consumeStream()` flushes all deltas.
  - `updateRunStatus → "debate"` (the model is now ready to debate).
  - Returns the final text for the next stage.

### Step 4 — Round 2: the debate prompt
- `generateDebateResponse` fires once per model, again in parallel.
- Each model receives a prompt that contains the **other** models' initial answers — never its own. Verbatim prompt template (paraphrased from the paper):

  > Here are the solutions to the problem from other agents. Your task is to critically re-evaluate your own initial answer in light of these other perspectives.
  >
  > **Response from {OtherModel1}:** …
  > **Response from {OtherModel2}:** …
  >
  > Using the reasoning from these other agents as additional advice, provide an updated and improved final response to the original question. If the other agents' reasoning has convinced you to change your mind, explain why. If you maintain your original position, justify it against the alternatives.

- The debate prompt is saved as a real user message on that model's sub-thread (so it's replayable/auditable).
- Status moves `debate` → streams → `complete`.

### Step 5 — Finalization (runs in parallel)
Two independent actions kick off simultaneously once all refined answers are in:

1. **`generateSynthesisResponse`** — runs on the **master thread** with the **master model**.
   - Builds a synthesis prompt that contains all three refined answers tagged with model name + which one was the Primary.
   - The synthesis prompt is saved with a sentinel prefix: `"[HIDDEN_SYNTHESIS_PROMPT]::"`.
   - `listThreadMessages` filters any message starting with that prefix before returning to the client — so the user sees only the final assistant answer on the master thread, never the internal synthesis instructions.
   - This is the "Hidden Prompt Pattern" — keeps synthesis on the real thread for continuity/provenance, without polluting the user's view.
   - Streams the final answer to the UI.

2. **`generateRunSummary`** — runs on an **ephemeral thread** with the cheap `summaryAgent` (OSS model).
   - `thread.generateObject({ prompt, schema })` with a Zod schema enforcing: `originalPrompt`, `overview`, `crossModel.{agreements, disagreements, convergenceSummary}`, and a `perModel[]` array (one entry per modelId, with `initialSummary`, `refinedSummary`, `changedPosition`, `keyPoints`).
   - Persisted via `setRunSummaryStructured` and rendered by `components/MultiResponseMessage.tsx` as the summary table below the final answer.
   - The ephemeral thread is deleted in `finally`.

### Step 6 — Thread activity / loading indicators
- `threadActivities` table tracks `activeCount` and `isGenerating` per thread/user.
- `startMultiModelGeneration` increments on kickoff; `generateSynthesisResponse` decrements in `finally` so spinners never get stuck.
- `getGeneratingThreadIds` powers global sidebar indicators.

---

## 6. Data model quick reference (for the "under the hood" section)

Declared in `convex/schema.ts`:

- **`multiModelRuns`** — one row per debate run.
  - `masterMessageId`, `masterThreadId`, `masterModelId`
  - `allRuns: Array<{ modelId, threadId, isMaster, status, initialPromptMessageId?, debatePromptMessageId?, errorMessage? }>`
  - `runSummary?`, `runSummaryStructured?`
  - Indexes: `by_master_message`, `by_master_thread`
- **`threadActivities`** — live "is generating" state per thread/user.
- **`usageEvents` / `weeklyUsage` / `usageReups`** — token + USD ledger and weekly budget gating.

Status state machine per model: `initial → debate → complete` (or `error` at any point, with `errorMessage` captured).

---

## 7. Tech stack

- **Frontend:** Next.js (App Router), React 19, Tailwind, Radix primitives, Framer Motion.
- **Backend:** Convex (`@convex-dev/agent`, `@convex-dev/workflow`, `@convex-dev/auth`).
- **Models wired up today** (from `convex/agent.ts`): GPT-5 family (5, 5-mini, 5-nano, 5.1, 5.2), Claude 4 / 4.5 Sonnet / Opus 4.5 / Haiku 4.5, Gemini 2.5 Flash / 2.5 Pro / 3 Pro Preview, Grok-4, plus OSS entries (GPT-OSS 120B/20B, Llama 3.3 70B) via Groq.
- **Auth:** `@convex-dev/auth` with Google OAuth.
- **Streaming:** Convex Agent stream deltas, line-chunked, 500ms throttle.
- **Validation:** Zod for the structured summary schema; Convex validators for every function's args/returns.
- **Rate limiting:** `@convex-dev/rate-limiter` with a global `globalLLMRequests` bucket.

---

## 8. Design decisions worth calling out in the post

1. **Sub-threads per model instead of one shared thread.** Keeps each model's conversation history clean and lets the UI deep-link into "what did Claude say on round 1?" from the per-model cards. Also means the master thread stays a clean user-facing conversation.
2. **Hidden synthesis prompt, not a new thread.** Synthesis lives on the master thread (so provenance is preserved and the assistant reply is attached to the right conversation) but the prompt itself is filtered out of the UI. Prefix sentinel: `[HIDDEN_SYNTHESIS_PROMPT]::`.
3. **Structured summary via a cheap model.** The frontier models do the thinking; a small OSS model does the paperwork. `generateObject` + Zod means the UI table is guaranteed-shape.
4. **Parallelism everywhere safe.** Thread creation, initial responses, debate responses, and finalization (synthesis + summary) all fan out with `Promise.all`. Convex Workflow handles the step boundaries.
5. **One source of truth for status.** All state transitions funnel through `updateRunStatus`, which loads the run, patches the matching `allRuns[...]` entry, and writes back. No direct partial writes from individual actions.
6. **Errors are first-class.** Every generation action has a try/catch that flips status to `error` and captures `errorMessage`, which the UI renders inline on the per-model card — debugging what went wrong is visible to the user.
7. **Cost is visible.** The `usageHandler` on every agent records a per-request usage event (including provider `reasoningTokens` when available) and estimates USD via a pricing table. This is what makes weekly budgets possible.
8. **Model capability enforcement.** File attachments are rejected at the entrypoint if the selected model has `fileSupport: false`, so we fail fast instead of mid-workflow.

---

## 9. Suggested blog post structure

1. **Hook (~100 words)** — The single-model chat ceiling and the MIT/Google Brain paper that points past it. Embed the Twitter clip.
2. **The research in one minute** — Multiagent debate, what Du et al. found, why it generalizes.
3. **What I built** — Mesh Mind in a paragraph + screenshot of the model picker + summary table.
4. **Mapping the paper to the product** — the comparison table in section 4 above, plus the "extends" and "stays close" bullets.
5. **The workflow, end to end** — walk through section 5 with a diagram (master message → 3 sub-threads → round 1 parallel → round 2 parallel with peer answers → synthesis + summary parallel → master thread reply + table). Drop in short snippets of the debate prompt and the Zod schema.
6. **Why Convex** — workflows as a first-class primitive, streaming deltas, DB + functions + storage in one place, `generateObject` for structured outputs.
7. **The hard parts** — hidden prompts on a real thread, sub-thread auth model, making three streams feel like one UI, making cost legible.
8. **See it run** — embed the YouTube walkthrough.
9. **What's next** — more rounds, heavier synthesis, per-stage metrics in the summary, maybe letting users pick the debate prompt style.
10. **Credit** — link the paper, thank the authors.

---

## 10. Quotes / lines the writer can pull verbatim

- From the debate prompt in `convex/workflows.ts`:
  > "Here are the solutions to the problem from other agents. Your task is to critically re-evaluate your own initial answer in light of these other perspectives."
- From the synthesis prompt:
  > "You are a lead AI expert tasked with creating a final, definitive response. Multiple expert AI models have already engaged in a round of debate to refine their initial answers. Your job is to synthesize their refined conclusions."
- Paper title to link: *Improving Factuality and Reasoning in Language Models through Multiagent Debate.*

---

## 11. Tone notes

- First person, builder voice. Show the wiring, don't hide it.
- Credit the paper up front and repeatedly — this post is "I took published research and shipped it as a product."
- No hype words ("revolutionary," "game-changing"). Let the architecture and the demo carry it.
- Keep code snippets short (5–15 lines). File paths with `file_path:line_number` format when pointing to the repo is fine if the repo is public.
