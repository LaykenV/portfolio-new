import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import {
  ArrowLeft,
  ArrowUpRight,
  Workflow,
  Network,
  Layers,
  GitBranch,
  Cpu,
  CheckCircle2,
} from 'lucide-react'

import type { Metadata } from 'next'

const postTitle = 'Three models, one answer'
const postDescription =
  'How I rebuilt the MIT and Google Brain multi-agent debate paper as a chat product, end to end on Convex — sub-threads per model, two parallel rounds, a hidden synthesis prompt, and a Zod-validated summary.'
const postUrl = '/blog/mesh-mind-debate-workflow'
const postPath = 'https://www.laykenvarholdt.com' + postUrl
const publishedISO = '2026-04-16T00:00:00.000Z'
const publishedReadable = 'April 16, 2026'

export const metadata: Metadata = {
  title: postTitle,
  description: postDescription,
  alternates: { canonical: postUrl },
  openGraph: {
    title: postTitle + ' — Layken Varholdt',
    description: postDescription,
    url: postUrl,
    siteName: 'Layken Varholdt',
    locale: 'en_US',
    type: 'article',
    publishedTime: publishedISO,
    authors: ['Layken Varholdt'],
    images: [
      {
        url: 'https://www.laykenvarholdt.com/MeshMind.png',
        width: 1200,
        height: 630,
        alt: 'Mesh Mind multi-model debate UI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: postTitle + ' — Layken Varholdt',
    description: postDescription,
    creator: '@LLVarholdt',
    images: ['https://www.laykenvarholdt.com/MeshMind.png'],
  },
}

export default function MeshMindDebatePost() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: postTitle,
    description: postDescription,
    image: ['https://www.laykenvarholdt.com/MeshMind.png'],
    datePublished: publishedISO,
    dateModified: publishedISO,
    author: {
      '@type': 'Person',
      name: 'Layken Varholdt',
      url: 'https://www.laykenvarholdt.com',
    },
    publisher: {
      '@type': 'Person',
      name: 'Layken Varholdt',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postPath,
    },
    keywords: [
      'multi-agent debate',
      'multi-model orchestration',
      'Convex',
      'Next.js',
      'AI engineering',
      'Mesh Mind',
      'Du et al.',
    ].join(', '),
  }

  return (
    <article className="font-sans mx-auto max-w-3xl min-h-dvh px-6 py-14 md:py-20 flex flex-col gap-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Top nav */}
      <div className="flex items-center justify-between">
        <Link href="/blog" className="nav-link">
          <ArrowLeft className="h-3.5 w-3.5" />
          All posts
        </Link>
        <Link href="/" className="nav-link">
          Home
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Hero */}
      <header className="flex flex-col gap-4">
        <div className="section-eyebrow">
          Engineering notes · {publishedReadable}
        </div>
        <h1 className="hero-title">
          Three models, <em>one answer.</em>
        </h1>
        <p className="hero-sub">
          How I rebuilt MIT and Google Brain&rsquo;s multi-agent debate paper as
          a chat product, end to end on Convex.
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs opacity-65">
          <span className="mono-accent">By Layken Varholdt</span>
          <span aria-hidden="true">·</span>
          <span className="mono-accent">~12 min read</span>
        </div>
      </header>

      {/* Twitter embed */}
      <figure className="post-embed">
        <blockquote
          className="twitter-tweet"
          data-conversation="none"
          data-dnt="true"
        >
          <a href="https://twitter.com/LLVarholdt/status/1966616437654442141">
            View the Mesh Mind demo on X
          </a>
        </blockquote>
        <Script
          src="https://platform.twitter.com/widgets.js"
          strategy="lazyOnload"
        />
      </figure>

      <section className="prose-block">
        <h2 className="post-h2">The single-model ceiling</h2>
        <p>
          Every consumer chat interface is one model talking to you. You ask, it
          answers, you decide whether to trust it. There&rsquo;s no second voice
          in the room to push back, and the model itself has no real incentive
          to disagree with its own first attempt.
        </p>
        <p>
          In 2023, a group at MIT and Google Brain published a paper called{' '}
          <em>
            <a
              href="https://composable-models.github.io/llm_debate/"
              target="_blank"
              rel="noreferrer"
              className="post-link"
            >
              Improving Factuality and Reasoning in Language Models through
              Multiagent Debate
            </a>
          </em>
          . The thesis is small and obvious in hindsight: if you have multiple
          model instances, you can make them critique each other, and the answer
          that survives a round of debate is meaningfully better than the answer
          any single instance produced alone.
        </p>
        <p>
          I wanted to know what happens when you take that protocol off the lab
          benchmark and put it inside a chat app a real person can use. So I
          built{' '}
          <a
            href="https://meshmind.chat"
            target="_blank"
            rel="noreferrer"
            className="post-link"
          >
            Mesh Mind
          </a>
          .
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">The research in one minute</h2>
        <p>
          Du et al. set up N agents (model instances), give them all the same
          question, and run the protocol in rounds. Round one: every agent
          answers independently. Round two onward: each agent sees its peers&rsquo;
          answers and is asked to critique and revise. After a few rounds, the
          answers converge.
        </p>
        <p>
          Their reference setup was 3 agents over 2 rounds, the
          diminishing-returns frontier within their compute budget. Accuracy
          keeps climbing past that, but you pay for it. They tested on
          arithmetic, GSM8K grade-school math, chess move optimization, and
          factual validity benchmarks, and saw consistent improvements over
          single-agent baselines. They also showed it works across model
          boundaries: ChatGPT and Bard could debate productively.
        </p>
        <p>Two things made the protocol attractive to me as a product:</p>
        <ul className="post-list">
          <li>
            It&rsquo;s model-agnostic. The structure has nothing to do with
            which model is on the other end.
          </li>
          <li>
            The state machine is small. Initial &rarr; critique-with-peers
            &rarr; final. That maps cleanly onto a workflow primitive.
          </li>
        </ul>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">What Mesh Mind is</h2>
        <figure className="post-figure">
          <Image
            src="/MeshMind.png"
            alt="Mesh Mind chat UI showing three model cards mid-debate"
            width={2400}
            height={1500}
            className="post-image"
            sizes="(min-width: 768px) 720px, 100vw"
          />
          <figcaption>
            The model picker on the left, three per-model status cards across
            the top, and the synthesized answer plus the structured summary
            table below.
          </figcaption>
        </figure>
        <p>
          Mesh Mind is a Next.js + Convex chat app where you pick a{' '}
          <em>master</em> model and up to two <em>secondary</em> models from a
          roster spanning GPT-5, Claude Opus 4.5, Gemini 3 Pro, Grok-4, plus a
          few open-source entries via Groq. When you submit a message, the app
          runs initial answers in parallel, then feeds each model its peers&rsquo;
          answers and asks for a revised response, then has the master model
          synthesize the refined answers into one final reply.
        </p>
        <p>
          A separate, cheaper model writes a structured JSON summary of who
          agreed, who disagreed, and who changed their mind. That renders below
          the answer as a table you can actually inspect.
        </p>
        <p>
          The whole thing streams. Each model has its own status card that walks
          through <code className="post-code-inline">initial</code> &rarr;{' '}
          <code className="post-code-inline">debate</code> &rarr;{' '}
          <code className="post-code-inline">complete</code>, line-chunked with
          a 500ms throttle. Cost is tracked per request, including reasoning
          tokens, against a weekly budget.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">Mapping the paper to the product</h2>
        <p>Here&rsquo;s how each piece of the paper landed in the codebase:</p>
        <div className="post-table-wrap">
          <table className="post-table">
            <thead>
              <tr>
                <th>Paper concept</th>
                <th>Mesh Mind implementation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>N agents</td>
                <td>1 master + up to 2 secondaries (N = 2 or 3)</td>
              </tr>
              <tr>
                <td>Identical agents</td>
                <td>
                  Heterogeneous: pick from OpenAI, Anthropic, Google, xAI, or
                  Groq-hosted OSS
                </td>
              </tr>
              <tr>
                <td>Round 1: initial answers</td>
                <td>
                  <code className="post-code-inline">generateModelResponse</code>{' '}
                  runs in parallel per model, each on its own sub-thread
                </td>
              </tr>
              <tr>
                <td>Round 2: see peers and revise</td>
                <td>
                  <code className="post-code-inline">generateDebateResponse</code>{' '}
                  builds a peer-aware prompt and asks for a revised final answer
                </td>
              </tr>
              <tr>
                <td>Convergence / final</td>
                <td>
                  <code className="post-code-inline">
                    generateSynthesisResponse
                  </code>{' '}
                  runs on the master thread and merges the refined answers
                </td>
              </tr>
              <tr>
                <td>Evaluation / analysis</td>
                <td>
                  <code className="post-code-inline">generateRunSummary</code>{' '}
                  uses a cheap summary agent + Zod schema to render a structured
                  table
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="post-h3">Where I extended the paper</h3>
        <p>
          <strong>Cross-lab debate.</strong> The paper debated identical models,
          or pairs like ChatGPT and Bard. Mesh Mind lets you put GPT-5, Claude
          Opus 4.5, and Gemini 3 Pro in the same conversation. The diversity of
          training data is itself a signal. When three models trained on
          different corpora converge on the same answer, that means something.
        </p>
        <p>
          <strong>An explicit synthesis step.</strong> The paper lets answers
          converge through repeated rounds. Mesh Mind adds a final synthesis
          pass on the master model so the user gets one clean answer instead of
          three competing ones to interpret.
        </p>
        <p>
          <strong>Structured summary for auditability.</strong> A separate
          summary agent emits a Zod-validated JSON object so the UI can show
          agreements, disagreements, and changed positions as a table. It turns
          &ldquo;the models debated&rdquo; from a vibe into something you can
          actually inspect.
        </p>
        <p>
          <strong>Real-time streaming.</strong> Every stage streams via Convex
          Agent stream deltas. Per-model status cards update live. The user is
          never staring at a spinner wondering what&rsquo;s happening.
        </p>
        <p>
          <strong>Cost is first-class.</strong> A{' '}
          <code className="post-code-inline">usageHandler</code> records tokens
          and estimates USD against a weekly budget on every request. Debate is
          roughly three times the cost of single-model inference. If you
          don&rsquo;t make that visible, you&rsquo;ll find out the hard way.
        </p>

        <h3 className="post-h3">Where I stayed close</h3>
        <p>
          The two-round protocol is the same. Du et al. landed on 2 rounds for
          compute reasons and noted that gains continue past that. The same
          tradeoff fits chat latency, so I left it alone.
        </p>
        <p>
          The debate prompt wording quotes the paper&rsquo;s framing almost
          verbatim. Models are asked to critically re-evaluate their initial
          answer in light of the peer responses, defend it if they hold their
          position, and explain why if they change their mind.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">The workflow, step by step</h2>
        <p>
          All orchestration lives in{' '}
          <code className="post-code-inline">convex/workflows.ts</code>, defined
          with{' '}
          <code className="post-code-inline">@convex-dev/workflow</code>&rsquo;s{' '}
          <code className="post-code-inline">WorkflowManager</code>. The entry
          point from the UI is{' '}
          <code className="post-code-inline">startMultiModelGeneration</code>{' '}
          in <code className="post-code-inline">convex/chat.ts</code>.
        </p>

        <ol className="post-steps">
          <li>
            <span className="post-step-icon" aria-hidden="true">
              <GitBranch className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="post-step-title">Kickoff</p>
              <p>
                The client creates a thread, navigates immediately to{' '}
                <code className="post-code-inline">/chat/[threadId]</code>{' '}
                (optimistic), and calls the entry point with the thread ID,
                prompt, master model, secondaries, and any file IDs. The server
                checks auth, rate limits, weekly budget, and whether the master
                model can handle the attached files.
              </p>
            </div>
          </li>
          <li>
            <span className="post-step-icon" aria-hidden="true">
              <Layers className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="post-step-title">Sub-threads per model</p>
              <p>
                Each model gets its own ephemeral Convex Agent thread. This is
                one of the design decisions I&rsquo;m happiest with. Keeping
                each model&rsquo;s conversation isolated means the master thread
                stays a clean user-facing conversation, and you can deep-link
                into &ldquo;what did Claude say on round 1?&rdquo; from the
                per-model cards.
              </p>
            </div>
          </li>
          <li>
            <span className="post-step-icon" aria-hidden="true">
              <Network className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="post-step-title">Record the run</p>
              <p>
                A <code className="post-code-inline">multiModelRuns</code> doc
                is inserted, indexed by{' '}
                <code className="post-code-inline">masterMessageId</code> and{' '}
                <code className="post-code-inline">masterThreadId</code>. Every
                model&rsquo;s state starts at{' '}
                <code className="post-code-inline">status: &quot;initial&quot;</code>.
              </p>
            </div>
          </li>
          <li>
            <span className="post-step-icon" aria-hidden="true">
              <Workflow className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="post-step-title">
                Round 1 &mdash; initial responses in parallel
              </p>
              <p>
                <code className="post-code-inline">generateModelResponse</code>{' '}
                fires once per model (master included), all in{' '}
                <code className="post-code-inline">Promise.all</code>. Each one
                streams via{' '}
                <code className="post-code-inline">thread.streamText</code>,
                line-chunked with a 500ms throttle, then awaits the stream to
                flush. Status flips to{' '}
                <code className="post-code-inline">debate</code>.
              </p>
            </div>
          </li>
          <li>
            <span className="post-step-icon" aria-hidden="true">
              <Workflow className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="post-step-title">Round 2 &mdash; the debate</p>
              <p>
                <code className="post-code-inline">generateDebateResponse</code>{' '}
                fires once per model, again in parallel. Each model receives a
                prompt with the <em>other</em> models&rsquo; initial answers,
                never its own. The prompt is roughly:
              </p>
              <pre className="post-code-block">
                <code>{`Here are the solutions to the problem from other agents.
Your task is to critically re-evaluate your own initial answer
in light of these other perspectives.

Response from {OtherModel1}: ...
Response from {OtherModel2}: ...

Using the reasoning from these other agents as additional advice,
provide an updated and improved final response to the original
question. If the other agents' reasoning has convinced you to
change your mind, explain why. If you maintain your original
position, justify it against the alternatives.`}</code>
              </pre>
              <p>
                The debate prompt is saved as a real user message on each
                model&rsquo;s sub-thread, so the whole exchange is replayable
                and auditable. Status moves{' '}
                <code className="post-code-inline">debate</code> &rarr;{' '}
                <code className="post-code-inline">complete</code>.
              </p>
            </div>
          </li>
          <li>
            <span className="post-step-icon" aria-hidden="true">
              <Cpu className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="post-step-title">Finalization in parallel</p>
              <p>
                Two things kick off as soon as the refined answers are in. The
                first is{' '}
                <code className="post-code-inline">
                  generateSynthesisResponse
                </code>
                , running on the <em>master thread</em> with the master model.
                It builds a synthesis prompt that includes all three refined
                answers, tagged with model name and which one was Primary, and
                asks the master to produce one definitive reply.
              </p>
              <p>
                The second is{' '}
                <code className="post-code-inline">generateRunSummary</code>,
                running on a throwaway thread with a cheap OSS summary model. It
                calls{' '}
                <code className="post-code-inline">thread.generateObject</code>{' '}
                with a Zod schema enforcing the shape:{' '}
                <code className="post-code-inline">originalPrompt</code>,{' '}
                <code className="post-code-inline">overview</code>,{' '}
                <code className="post-code-inline">crossModel</code> (agreements,
                disagreements, convergence summary), and a{' '}
                <code className="post-code-inline">perModel[]</code> array. The
                JSON gets persisted and the UI renders it as the summary table.
                The ephemeral thread is deleted in a{' '}
                <code className="post-code-inline">finally</code> block.
              </p>
            </div>
          </li>
          <li>
            <span className="post-step-icon" aria-hidden="true">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="post-step-title">Activity tracking</p>
              <p>
                A <code className="post-code-inline">threadActivities</code>{' '}
                table tracks{' '}
                <code className="post-code-inline">activeCount</code> and{' '}
                <code className="post-code-inline">isGenerating</code> per
                thread/user. It&rsquo;s incremented on kickoff and decremented
                in the synthesis{' '}
                <code className="post-code-inline">finally</code>, which means
                the global &ldquo;currently generating&rdquo; indicators in the
                sidebar don&rsquo;t get stuck if something throws halfway
                through.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <aside className="post-callout">
        <p className="post-callout-eyebrow">Design decision</p>
        <h3 className="post-h3 post-callout-title">
          The hidden synthesis prompt
        </h3>
        <p>This one took a few iterations.</p>
        <p>
          The naive approaches both fail. If you run synthesis on a fresh
          ephemeral thread, you lose conversational continuity, the assistant
          reply isn&rsquo;t attached to the user&rsquo;s thread, and follow-up
          messages have no context. If you run synthesis on the master thread
          without filtering, the user sees an instructional prompt
          (&ldquo;here are three refined answers, synthesize them&hellip;&rdquo;)
          sitting in their conversation history, which looks broken.
        </p>
        <p>
          The fix is to write the synthesis prompt to the master thread but
          prefix it with a sentinel string:{' '}
          <code className="post-code-inline">
            [HIDDEN_SYNTHESIS_PROMPT]::
          </code>
          . The server function that serves messages to the UI strips out
          anything starting with that prefix. The thread sees the full synthesis
          chain (good for follow-ups, good for auditing); the UI sees a clean
          conversation. Same data, two views.
        </p>
      </aside>

      <section className="prose-block">
        <h2 className="post-h2">Why Convex</h2>
        <p>
          This stack works because of three things Convex gives you for free.
        </p>
        <p>
          <code className="post-code-inline">@convex-dev/workflow</code> makes
          the multi-step orchestration a first-class primitive. You define
          steps, fan out with{' '}
          <code className="post-code-inline">Promise.all</code>, and the runtime
          handles step boundaries and retries. I don&rsquo;t have to write any
          of the bookkeeping that usually fills 60% of a workflow file.
        </p>
        <p>
          <code className="post-code-inline">@convex-dev/agent</code> handles
          streaming. Stream deltas are line-chunked and throttled. The client
          subscribes to the thread and the deltas appear. I never had to build a
          streaming protocol or a websocket layer.
        </p>
        <p>
          <code className="post-code-inline">generateObject</code> plus Zod
          gives me structured outputs the frontend can trust. The summary table
          can&rsquo;t render junk because the backend won&rsquo;t accept junk:
          the schema validates before the function returns.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">The hard parts</h2>
        <p>The architecture wasn&rsquo;t the hard part. The seams were.</p>
        <p>
          Making three streams feel like one UI took real care. Each model card
          has its own status, but they all need to render in sync, animate
          cleanly, and not lock the layout when one finishes early. The fix was
          to render the cards from a single subscription on the run document and
          let the per-model status drive each card independently, with no shared
          state at the parent level.
        </p>
        <p>
          Sub-thread auth was tricky. Each model&rsquo;s ephemeral thread is
          owned by the same user, but it&rsquo;s not directly visible in their
          sidebar. Auth checks needed to walk from the sub-thread back up to the
          master run, and from the master run back up to the user. I ended up
          centralizing that in a single{' '}
          <code className="post-code-inline">authorizeThreadAccess</code>{' '}
          helper that every action calls before doing anything.
        </p>
        <p>
          Cost legibility is harder than you&rsquo;d expect. Token counts come
          back in different shapes from different providers. Some return{' '}
          <code className="post-code-inline">reasoningTokens</code> separately,
          some don&rsquo;t return them at all. The pricing table is hardcoded
          and refreshed when models change. The week-rolling budget is enforced
          both at request time (cheap check) and after the fact (real spend
          reconciliation against{' '}
          <code className="post-code-inline">usageEvents</code>).
        </p>
        <p>
          Errors are first-class for a good reason: when one model fails
          mid-debate, the user needs to see <em>which</em> model failed and what
          it said about why. Every generation action has a try/catch that flips
          status to <code className="post-code-inline">error</code> and captures{' '}
          <code className="post-code-inline">errorMessage</code>, which the UI
          renders inline on the per-model card. Nothing is hidden in a server
          log somewhere.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">See it run</h2>
        <p>
          A short walkthrough of the app, including the per-model cards updating
          live and the structured summary table populating after the synthesis
          step:
        </p>
        <figure className="post-embed">
          <div className="post-video">
            <iframe
              src="https://www.youtube.com/embed/2vJvb5-o8-Q?start=1"
              title="Mesh Mind walkthrough"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </figure>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">What&rsquo;s next</h2>
        <p>A few things I want to try.</p>
        <p>
          More rounds. The paper noted accuracy keeps climbing past 2 rounds.
          The latency cost is real, but for non-chat use cases (research
          questions, document synthesis) it might be worth it.
        </p>
        <p>
          Per-stage metrics in the summary. Right now the structured summary
          captures <em>what</em> changed; I want it to also capture{' '}
          <em>how much</em>: semantic distance between initial and refined
          answers per model, time-to-converge, that kind of thing.
        </p>
        <p>
          User-pickable debate prompt styles. The current prompt is the
          paper&rsquo;s framing. I&rsquo;m curious whether something more
          adversarial (&ldquo;steelman the strongest counterargument to your
          initial answer&rdquo;) would change the convergence behavior.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">Credit</h2>
        <p>
          Massive credit to the authors of the original paper: Yilun Du, Shuang
          Li, Antonio Torralba, Joshua B. Tenenbaum, and Igor Mordatch.{' '}
          <em>
            Improving Factuality and Reasoning in Language Models through
            Multiagent Debate
          </em>{' '}
          is the entire intellectual frame for Mesh Mind. The landing page is at{' '}
          <a
            href="https://composable-models.github.io/llm_debate/"
            target="_blank"
            rel="noreferrer"
            className="post-link"
          >
            composable-models.github.io/llm_debate
          </a>{' '}
          and worth your time.
        </p>
        <p>
          Mesh Mind is live at{' '}
          <a
            href="https://meshmind.chat"
            target="_blank"
            rel="noreferrer"
            className="post-link"
          >
            meshmind.chat
          </a>
          . Source is at{' '}
          <a
            href="https://github.com/LaykenV/master-prompt"
            target="_blank"
            rel="noreferrer"
            className="post-link"
          >
            github.com/LaykenV/master-prompt
          </a>
          .
        </p>
      </section>

      <footer className="aside-footer mt-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Link href="/blog" className="nav-link self-start">
            <ArrowLeft className="h-3.5 w-3.5" />
            More writing
          </Link>
          <a
            href="mailto:laykenv@gmail.com?subject=Re%3A%20Mesh%20Mind%20debate%20workflow%20post"
            className="nav-link"
          >
            Reply by email
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </footer>
    </article>
  )
}
