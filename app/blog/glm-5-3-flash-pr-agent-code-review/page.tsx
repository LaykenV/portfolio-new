import Link from 'next/link'
import {
  ArrowLeft,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  GitMerge,
  GitPullRequest,
  ShieldCheck,
  Zap,
} from 'lucide-react'

import type { Metadata } from 'next'

const postTitle = 'Code review for less than a cent'
const postDescription =
  'How I wired GLM 5.3 Flash, open-source PR-Agent, GitHub Actions, and two repository-local Codex skills into a review loop that still asks me before merge.'
const postUrl = '/blog/glm-5-3-flash-pr-agent-code-review'
const postPath = 'https://www.laykenvarholdt.com' + postUrl
const publishedISO = '2026-08-28T00:00:00.000Z'
const publishedReadable = 'August 28, 2026'
const modifiedISO = '2026-08-29T00:00:00.000Z'
const modifiedReadable = 'August 29, 2026'

export const metadata: Metadata = {
  title: postTitle,
  description: postDescription,
  alternates: { canonical: postUrl },
  openGraph: {
    title: postTitle + ' | Layken Varholdt',
    description: postDescription,
    url: postUrl,
    siteName: 'Layken Varholdt',
    locale: 'en_US',
    type: 'article',
    publishedTime: publishedISO,
    modifiedTime: modifiedISO,
    authors: ['Layken Varholdt'],
    images: [
      {
        url: 'https://www.laykenvarholdt.com/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'A sub-cent pull request review loop using GLM 5.3 Flash',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: postTitle + ' | Layken Varholdt',
    description: postDescription,
    creator: '@LLVarholdt',
    images: ['https://www.laykenvarholdt.com/twitter-image'],
  },
}

const systemParts = [
  {
    name: 'GitHub Actions CI',
    role: 'Runs typechecking, tests, the production build, and lint',
    icon: CheckCircle2,
  },
  {
    name: 'PR-Agent',
    role: 'Reads the diff and posts a description and review',
    icon: Bot,
  },
  {
    name: 'GLM 5.3 Flash',
    role: 'Supplies the model reasoning through OpenRouter',
    icon: Zap,
  },
  {
    name: 'Codex skills',
    role: 'File the PR, inspect feedback, and enforce the human merge gate',
    icon: ShieldCheck,
  },
]

export default function GlmFlashPrAgentCodeReviewPost() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: postTitle,
    description: postDescription,
    image: ['https://www.laykenvarholdt.com/opengraph-image'],
    datePublished: publishedISO,
    dateModified: modifiedISO,
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
      'GLM 5.3 Flash',
      'PR-Agent',
      'code review',
      'GitHub Actions',
      'Codex skills',
      'OpenRouter',
      'CI',
    ].join(', '),
  }

  return (
    <article className="font-sans mx-auto max-w-3xl min-h-dvh px-6 py-14 md:py-20 flex flex-col gap-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

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

      <header className="flex flex-col gap-4">
        <div className="section-eyebrow">
          Engineering notes &middot; {publishedReadable}
        </div>
        <h1 className="hero-title">
          Code review for <em>less than a cent.</em>
        </h1>
        <p className="hero-sub">
          How I wired GLM 5.3 Flash, open-source PR-Agent, GitHub Actions,
          and two repository-local Codex skills into a review loop that still
          asks me before merge.
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs opacity-65">
          <span className="mono-accent">By Layken Varholdt</span>
          <span aria-hidden="true">&middot;</span>
          <span className="mono-accent">~9 min read</span>
        </div>
      </header>

      <section className="prose-block">
        <h2 className="post-h2">Review should be cheap enough to repeat</h2>
        <p>
          I want an automated review when a pull request opens. I want another
          review after every fix. I also want the reviewer to read the entire
          change instead of clipping a normal diff because its model has a
          small context window.
        </p>
        <p>
          That sounds expensive if every pass uses a frontier coding model. It
          does not have to. I set up the original open-source PR-Agent with GLM
          5.3 Flash and ran a small test through the complete pull request loop.
          Three model calls cost less than half a cent on the OpenRouter
          dashboard. The model caught the planted bug, ignored a planted false
          positive, and updated its review after the fix without a manual
          prompt.
        </p>
        <p>
          The model is only one part of the result. Deterministic CI catches
          failures a reviewer should never guess about. Two local Codex skills
          control how the pull request gets filed and what happens after the
          bot comments. I still decide whether anything merges.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">Four jobs, not one agent</h2>
        <p>
          Calling the whole setup an AI reviewer hides the useful part. Each
          piece has a narrow job.
        </p>

        <ul className="stack-grid">
          {systemParts.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.name} className="stack-item">
                <span className="stack-icon" aria-hidden="true">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="stack-name">{item.name}</p>
                  <p className="stack-role">{item.role}</p>
                </div>
              </li>
            )
          })}
        </ul>

        <p>
          PR-Agent does not write my fixes. It does not merge. It reviews the
          diff and leaves evidence for the next decision. The surrounding
          workflow determines whether that review becomes useful or becomes
          another bot comment nobody reads.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">What PR-Agent is</h2>
        <p>
          <a
            href="https://github.com/The-PR-Agent/pr-agent"
            target="_blank"
            rel="noreferrer"
            className="post-link"
          >
            PR-Agent
          </a>{' '}
          is the original open-source pull request reviewer. The community
          project is separate from Qodo&apos;s hosted product. I run release
          <code className="post-code-inline">v0.43.0</code> inside my own
          GitHub Actions workflow, then choose the model and provider myself.
        </p>
        <p>
          A pull request open event runs <code className="post-code-inline">/describe</code>{' '}
          and <code className="post-code-inline">/review</code>. A new push
          runs only <code className="post-code-inline">/review</code>. Comments
          can invoke <code className="post-code-inline">/review</code>,{' '}
          <code className="post-code-inline">/describe</code>, or{' '}
          <code className="post-code-inline">/ask</code> on demand.
        </p>
        <p>
          The action has read-only access to repository contents and write
          access to pull request comments. Restricted mode prevents operations
          that need repository write permission. This is still an external
          model call. OpenRouter and the provider that serves the request see
          the diff. Running an open-source GitHub Action does not make the
          review private.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">Why GLM 5.3 Flash</h2>
        <p>
          The model choice came down to cost, context, and the job. Pull request
          review is asynchronous. I do not need chat latency. I need enough
          context for the diff and enough judgment to identify a concrete
          defect without turning every preference into a finding.
        </p>
        <p>
          On August 28, 2026,{' '}
          <a
            href="https://openrouter.ai/z-ai/glm-5.3-flash"
            target="_blank"
            rel="noreferrer"
            className="post-link"
          >
            OpenRouter listed GLM 5.3 Flash
          </a>{' '}
          at $0.075 per million input tokens and $0.25 per million output
          tokens, with a one-million-token context window. Those prices include
          a limited Z.ai discount through September 9. The same page lists the
          normal Z.ai rate at $0.15 input and $0.50 output per million tokens.
        </p>
        <p>
          My three-call test stayed below half a cent at the discounted rate.
          Doubling that measured cost still leaves the same test below one
          cent. That is cheap enough to review the first pull request and then
          review the corrected commit instead of treating the first bot pass as
          final.
        </p>
        <p>
          This is a useful result, not a benchmark. I tested one planted case
          and then used the setup on real work. I have not compared GLM 5.3
          Flash against every budget model or measured recall across a labeled
          defect set.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">The small configuration that matters</h2>
        <p>
          PR-Agent reads a <code className="post-code-inline">.pr_agent.toml</code>{' '}
          file from the repository root. These are the settings doing the real
          work in my setup.
        </p>
        <pre className="post-code-block">
          <code>{`[config]
model = "openrouter/z-ai/glm-5.3-flash"
fallback_models = ["openrouter/z-ai/glm-5.3-flash"]
custom_model_max_tokens = 1000000
max_model_tokens = 1000000
persistent_inline_comments = true
restricted_mode = true

[github_action_config]
auto_review = true
auto_describe = true
auto_improve = false
handle_push_trigger = true
push_commands = ["/review"]

[pr_reviewer]
require_score_review = true
persistent_comment = true`}</code>
        </pre>
        <p>
          These two token settings do different jobs.{' '}
          <code className="post-code-inline">custom_model_max_tokens</code>{' '}
          tells PR-Agent how much context an unknown model supports.{' '}
          <code className="post-code-inline">max_model_tokens</code> replaces
          PR-Agent&apos;s separate 32,000-token quality cap. Without the second
          setting, PR-Agent can prune a diff even when the model has room for
          it.
        </p>
        <p>
          I missed that distinction in the first version of this article. The
          production logs made it plain. Reviews with 41,590, 43,233, and 63,145
          input tokens all reported{' '}
          <code className="post-code-inline">pruning diff</code> at the
          32,000-token limit. The setup now gives both settings a
          one-million-token ceiling, below GLM&apos;s 1,310,720-token context
          window. Those three diff sizes now fit without token-budget pruning.
          Huge one-shot reviews can still lose focus, so deterministic CI and
          the human pass remain mandatory.
        </p>
        <p>
          Persistent inline comments prevent the same finding from appearing
          again after every push. The persistent review setting edits the main
          score and summary in place. The review follows the latest commit
          instead of leaving a stack of obsolete verdicts.
        </p>
        <p>
          I currently let OpenRouter choose the provider. The test logs showed
          that Z.ai served all three calls. PR-Agent can pin OpenRouter routing
          to Z.ai, but I have left that option off until I have a reason to give
          up provider failover.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">What happens when a pull request opens</h2>
        <ol className="post-steps">
          <li>
            <span className="post-step-icon" aria-hidden="true">
              <GitPullRequest className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="post-step-title">File a reviewable pull request</p>
              <p>
                A repository-local Codex skill runs the local checks, reads the
                diff, enforces one concern, writes a problem-first description,
                and opens a real pull request.
              </p>
            </div>
          </li>
          <li>
            <span className="post-step-icon" aria-hidden="true">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="post-step-title">Run deterministic CI</p>
              <p>
                GitHub Actions installs from the lockfile, then runs TypeScript,
                tests, the production build, and lint. These checks do not need
                model judgment.
              </p>
            </div>
          </li>
          <li>
            <span className="post-step-icon" aria-hidden="true">
              <Bot className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="post-step-title">Describe and review</p>
              <p>
                PR-Agent reads the diff with the repository&apos;s{' '}
                <code className="post-code-inline">AGENTS.md</code> rules and
                posts its summary, score, and findings. A push cancels any stale
                run and starts a review of the new head commit.
              </p>
            </div>
          </li>
          <li>
            <span className="post-step-icon" aria-hidden="true">
              <ShieldCheck className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="post-step-title">Verify every bot claim</p>
              <p>
                A second Codex skill checks the cited code before changing
                anything. Real defect, false positive, infrastructure failure,
                and scope request have different responses.
              </p>
            </div>
          </li>
          <li>
            <span className="post-step-icon" aria-hidden="true">
              <GitMerge className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="post-step-title">Ask before merge</p>
              <p>
                Green checks are not merge authority. The skill asks me for a
                clear yes. After approval, it watches the deployment for the
                exact merge commit and runs an independent production smoke.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">The first test</h2>
        <p>
          I opened a throwaway{' '}
          <a
            href="https://github.com/LaykenV/public-parish/pull/1"
            target="_blank"
            rel="noreferrer"
            className="post-link"
          >
            pull request in Public Parish
          </a>{' '}
          with two planted review targets. One was the impossible date{' '}
          <code className="post-code-inline">2026-02-30</code>. The other tried
          to bait the model into claiming a referenced variable was missing
          even though the prose defined it.
        </p>
        <p>
          The bot caught the date and declined the bait. Its first pass scored
          the change at 85. I pushed the date fix without commenting a command.
          The push triggered another review, the same persistent comment moved
          to 92, and the resolved finding disappeared. The first end-to-end run
          took 2 minutes and 25 seconds.
        </p>
        <p>
          The more useful test came on{' '}
          <a
            href="https://github.com/LaykenV/public-parish/pull/5"
            target="_blank"
            rel="noreferrer"
            className="post-link"
          >
            the first production evidence release
          </a>
          . PR-Agent noticed Lafayette-specific fallback queries inside a
          generic action and warned that future parishes would fail. The code
          looked suspicious. The finding still did not apply to that pull
          request because Slice 1 created only the Lafayette registry. Adding
          the next parish belonged in a separate change.
        </p>
        <p>
          The babysitting skill checked the product scope and source code, left
          a written reason, and kept the code unchanged. That is exactly why I
          do not let the reviewer drive. A plausible bot finding can still be
          wrong for the change being shipped.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">The two skills around the reviewer</h2>
        <p>
          OpenAI describes a{' '}
          <a
            href="https://developers.openai.com/codex/skills"
            target="_blank"
            rel="noreferrer"
            className="post-link"
          >
            Codex skill
          </a>{' '}
          as a reusable workflow built from instructions, resources, and
          optional scripts. Repository skills live under{' '}
          <code className="post-code-inline">.agents/skills</code>. I checked
          two into Public Parish so the project carries its own release rules.
        </p>

        <h3 className="post-h3">file-pr</h3>
        <p>
          The filing skill refuses to start from a dirty tree or open a second
          pull request for the same branch. It runs the full local verification
          command and reads the actual diff. The title uses a conventional
          prefix and the body explains the problem before the fix. It opens a
          real pull request, never a draft, because the work should be ready for
          review before the model sees it.
        </p>

        <h3 className="post-h3">babysit-pr</h3>
        <p>
          The babysitting skill polls CI, the persistent review, inline threads,
          and labels. It acts only on feedback newer than the last push. Every
          finding is a hypothesis until the cited behavior is reproduced in
          source.
        </p>
        <p>
          A real issue gets the smallest fix. A false positive gets a written
          reason and a resolved thread. An infrastructure failure gets a retry
          only after it is identified as a failure outside the code. A style
          request or an idea outside the pull request goal does not get built.
        </p>
        <p>
          After three fix cycles or about thirty minutes without convergence,
          the skill stops and gives the remaining problem back to a person. A
          green result reaches the merge gate, not an automatic merge.
        </p>
      </section>

      <aside className="post-callout">
        <p className="post-callout-eyebrow">The actual merge rule</p>
        <h3 className="post-h3 post-callout-title">
          The bot can recommend. It cannot authorize.
        </h3>
        <p>
          Public Parish deploys production when code lands on{' '}
          <code className="post-code-inline">main</code>. The babysitting skill
          must ask a direct question before merging: All passing. Merging
          deploys production, then I will smoke-test it. Good to merge?
        </p>
        <p>
          Anything short of a clear yes merges nothing. After approval, the
          skill watches the deployment tied to that merge commit, then runs the
          production smoke again from the local checkout.
        </p>
      </aside>

      <section className="prose-block">
        <h2 className="post-h2">What I would change next</h2>
        <p>
          The setup has a few honest rough edges. Persistent reviews update the
          main comment, but each push still leaves a small update stub. The
          fallback model currently repeats the primary, so it retries the same
          model instead of moving to another one. OpenRouter routing is not
          pinned to Z.ai. The cost test is too small to support a model-quality
          claim.
        </p>
        <p>
          I would add a small labeled review set before declaring any budget
          model the best. Seed it with real TypeScript defects, scope-sensitive
          false positives, security findings, and large diffs. Measure what the
          reviewer catches, what it invents, how long it takes, and the billed
          cost. Then compare models without changing the rest of the loop.
        </p>
        <p>
          For now, GLM 5.3 Flash has cleared the more practical gate. It is
          inexpensive enough to run repeatedly, it handled the first test, and
          it has already participated in a real production pull request. The
          tests and the human gate remain in charge.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">Read the setup</h2>
        <p>
          The complete configuration, workflow notes, test record, and skill
          behavior are in the{' '}
          <a
            href="https://github.com/LaykenV/public-parish"
            target="_blank"
            rel="noreferrer"
            className="post-link"
          >
            Public Parish repository
          </a>
          . Start with{' '}
          <a
            href="https://github.com/LaykenV/public-parish/blob/main/pr-agent.md"
            target="_blank"
            rel="noreferrer"
            className="post-link"
          >
            pr-agent.md
          </a>
          , then inspect <code className="post-code-inline">.pr_agent.toml</code>{' '}
          and <code className="post-code-inline">.agents/skills</code>.
        </p>
        <p>
          The cheap model is worth using. The surrounding rules are what make
          it safe to trust as one input into a release.
        </p>
      </section>

      <footer className="border-t border-black/10 dark:border-white/10 pt-8 flex flex-col gap-4">
        <p className="text-sm opacity-70">
          Published {publishedReadable}. Updated {modifiedReadable}.
        </p>
        <div className="flex items-center justify-between gap-4">
          <Link href="/blog" className="nav-link self-start">
            <ArrowLeft className="h-3.5 w-3.5" />
            All posts
          </Link>
          <a
            href="https://github.com/LaykenV/public-parish"
            target="_blank"
            rel="noreferrer"
            className="nav-link"
          >
            View the repository
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </footer>
    </article>
  )
}
