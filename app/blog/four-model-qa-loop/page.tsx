import Link from 'next/link'
import { WritingHeader } from '@/components/writing-header'
import {
  ArrowLeft,
  ArrowUpRight,
  Code2,
  ListChecks,
  MousePointer2,
  ShieldCheck,
} from 'lucide-react'

import type { Metadata } from 'next'
import { posts, postMetadata, postSchema } from '@/lib/posts'

const post = posts['four-model-qa-loop']

export const metadata: Metadata = postMetadata(post)

const stats = [
  { value: '18', label: 'Bugs found' },
  { value: '18', label: 'Fixes shipped' },
  { value: '13', label: 'Computer-use runs' },
  { value: '10', label: 'Messages from me' },
]

const roles = [
  {
    job: 'Orchestrator',
    model: 'Claude Fable 5.2',
    where: 'MacBook · one thread',
    does: 'Plans the passes, writes every brief, confirms each finding in the code, and decides what gets fixed.',
    icon: ListChecks,
  },
  {
    job: 'Tester',
    model: 'GPT Terra 6.1, high',
    where: 'MacBook · one at a time',
    does: 'Drives my signed-in Chrome through Codex computer use and fills in a results table.',
    icon: MousePointer2,
  },
  {
    job: 'Fixer',
    model: 'Claude Opus 5.5, high',
    where: 'Dell · one worktree per bug',
    does: 'Writes the fix, proves it, gets a Sol review, opens the pull request and stops.',
    icon: Code2,
  },
  {
    job: 'Reviewer',
    model: 'GPT Sol 6.1, high',
    where: 'Both · read only',
    does: 'Reviews each diff before it is filed. Fable and Terra join it for the final three-way review.',
    icon: ShieldCheck,
  },
]

const loopSteps = [
  ['Plan', 'Fable writes a numbered list of checks for one part of the app.'],
  ['Test', 'Terra works through the list in Chrome and reports pass, fail or blocked.'],
  ['Fix', 'Fable finds the bug in the code. Then an Opus thread on the Dell fixes it in its own worktree.'],
  ['Review', 'Sol reviews before the pull request. Fable, Sol and Terra all approve the final diff.'],
  ['Ship', 'Merge, back up production, deploy from the Dell.'],
  ['Re-test', 'Terra repeats the checks on the live app. A failure goes around again.'],
]

const ringNodes = [
  { x: 180, y: 54 },
  { x: 263, y: 102 },
  { x: 263, y: 198 },
  { x: 180, y: 246 },
  { x: 97, y: 198 },
  { x: 97, y: 102 },
]

const retestRows = [
  ['Send with the browser still reporting offline', 'Pass. The report got its number at once and the office listed the draft'],
  ['RFI with no due date', 'Pass. The form stays open and asks for a date. Nothing is sent'],
  ['Remove a safety meeting sign-in', 'Pass. Both rows removed with a confirm, none after the meeting finished'],
  ['PDF note with a 300-letter word', 'Pass. Wraps across three lines inside the page'],
  ['Customer copy of the PDF', 'Pass. Version 2 shows the addendum and no crew hours'],
  ['Empty Survey table in the PDF', 'Blocked. The test job had a question in that group, so it went to a fourth run'],
]

export default function FourModelQaLoopPost() {
  const articleSchema = postSchema(post)

  return (
    <article className="font-sans mx-auto max-w-3xl min-h-dvh px-5 pb-14 pt-5 md:px-6 md:py-20 flex flex-col gap-6 md:gap-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <WritingHeader />

      <header className="flex flex-col gap-4">
        <div className="section-eyebrow">
          Engineering notes &middot; {post.publishedReadable}
        </div>
        <h1 className="hero-title">
          A QA loop <em>run by four models.</em>
        </h1>
        <p className="hero-sub">
          One orchestrator, one computer-use tester, a fixer per bug and three
          reviewers, split across a MacBook and a headless Dell. It found,
          fixed, shipped and re-tested eighteen bugs in one evening.
        </p>
        <div className="writing-meta flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="mono-accent">By Layken Varholdt</span>
          <span aria-hidden="true">&middot;</span>
          <span className="mono-accent">~{post.readMinutes} min read</span>
        </div>
      </header>

      <section className="prose-block">
        <h2 className="post-h2">One prompt at 5:52 p.m.</h2>
        <p>
          I had a fresh production deployment of{' '}
          <a
            href="https://www.varholdt.com/field/"
            target="_blank"
            rel="noreferrer"
            className="post-link"
          >
            Varholdt Field
          </a>
          , my field reporting app: an office web app and a crew app on
          Convex. One admin account, no data. I wanted a full QA pass before
          anyone else got a login.
        </p>
        <p>
          So I opened one thread and asked Claude Fable to run it. Break the
          app down flow by flow. Use GPT Terra with computer use to test each
          one in my Chrome. Send every finding to Claude Opus for a fix. Have
          GPT Sol review the fix. Stop at open pull requests.
        </p>
        <p>
          The final report landed at 10:25. This post covers the setup, what
          it caught, and the five ways it fell over on the way.
        </p>

        <dl className="qa-stats">
          {stats.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">One job per model</h2>
        <p>
          The rule I care about most: nothing reviews its own work, and the
          reviewer comes from a different lab than the author. Opus writes,
          Sol reviews. Terra tests what neither of them can see, which is the
          running app.
        </p>

        <ul className="qa-roles">
          {roles.map((r) => {
            const Icon = r.icon
            return (
              <li key={r.job}>
                <Icon className="h-4 w-4" aria-hidden="true" />
                <p className="qa-eyebrow">{r.job}</p>
                <p className="qa-role-model">{r.model}</p>
                <p className="qa-role-does">{r.does}</p>
                <p className="qa-role-where">{r.where}</p>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">Two machines</h2>
        <p>
          I drive everything from{' '}
          <a
            href="https://github.com/pingdotgg/t3code"
            target="_blank"
            rel="noreferrer"
            className="post-link"
          >
            T3 Code
          </a>
          . It runs Claude Code and Codex threads from one window, a thread
          can start child threads, and a thread on one machine can launch
          work on another linked machine.
        </p>
        <p>
          The MacBook is an M3 with 16 GB. The Dell is a 12-core Linux box
          with 15 GB of RAM and no monitor. T3 runs there as a user service
          with lingering on, so it survives a reboot without a login. Code
          moves between them through GitHub, one branch and one worktree per
          task.
        </p>

        <figure className="qa-machines">
          <div className="qa-machine">
            <svg viewBox="0 0 64 44" width="64" height="44" aria-hidden="true">
              <rect x="12" y="4" width="40" height="27" rx="3" />
              <path d="M4 38h56M26 34.5h12" />
            </svg>
            <p className="qa-eyebrow">MacBook, M3</p>
            <p className="qa-role-model">Needs a screen</p>
            <ul>
              <li>Fable, the orchestrator</li>
              <li>Terra, in my Chrome</li>
              <li>Read-only reviewers</li>
            </ul>
          </div>
          <span className="qa-wire">T3 Code</span>
          <div className="qa-machine">
            <svg viewBox="0 0 64 44" width="64" height="44" aria-hidden="true">
              <rect x="20" y="3" width="24" height="38" rx="3" />
              <path d="M26 10h12M26 15h12" />
              <circle cx="32" cy="32" r="2.4" />
            </svg>
            <p className="qa-eyebrow">Dell, headless Linux</p>
            <p className="qa-role-model">Needs cores and RAM</p>
            <ul>
              <li>Opus fixers, three at most</li>
              <li>Dev servers and test runs</li>
              <li>Backups and deploys</li>
            </ul>
          </div>
        </figure>

        <p>
          The split is forced. Codex computer use only runs on the Mac, and
          every tester shares the one screen, so QA steps run one at a time.
          A fix thread is the opposite kind of load. Each one starts an Expo
          dev server, Vite, a local Convex backend and headless Chrome to
          prove its change.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">The loop</h2>
        <p>
          Fable never polls. It starts a child, ends its turn, and the child
          finishing wakes it up. The orchestrator thread ran more than forty
          short turns over the evening.
        </p>

        <figure className="qa-loop">
          <svg
            className="qa-ring"
            viewBox="0 0 360 300"
            role="img"
            aria-label="A ring of six steps: plan, test, fix, review, ship, re-test, then back to plan."
          >
            <circle className="qa-ring-track" cx="180" cy="150" r="96" />
            <g className="qa-runner">
              <circle cx="180" cy="54" r="5" />
            </g>
            {ringNodes.map((n, i) => (
              <g className="qa-node" key={i}>
                <circle cx={n.x} cy={n.y} r="17" />
                <text x={n.x} y={n.y + 5}>
                  {i + 1}
                </text>
              </g>
            ))}
            <text className="qa-ring-label" x="180" y="24">Plan</text>
            <text className="qa-ring-label qa-start" x="290" y="107">Test</text>
            <text className="qa-ring-label qa-start" x="290" y="203">Fix</text>
            <text className="qa-ring-label" x="180" y="286">Review</text>
            <text className="qa-ring-label qa-end" x="70" y="203">Ship</text>
            <text className="qa-ring-label qa-end" x="70" y="107">Re-test</text>
            <text className="qa-ring-core" x="180" y="146">until every</text>
            <text className="qa-ring-core" x="180" y="163">check passes</text>
          </svg>
          <ol className="qa-steps">
            {loopSteps.map(([name, text]) => (
              <li key={name}>
                <strong>{name}.</strong> {text}
              </li>
            ))}
          </ol>
        </figure>

        <p>
          Two details did a lot of work. Fable read the code behind every
          finding before it started a fix thread, and that read turned up two
          bugs Terra never reported. And before merging anything, it merged
          the approved branches together in a scratch checkout and ran the
          full checks there: typecheck, lint, format and 338 tests. One
          two-line conflict showed up early that way, not at merge time.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">The brief decides what gets tested</h2>
        <p>
          Terra&apos;s first pass was shallow. The brief was broad, and it
          skipped most of the edits and bad-input checks. Fable ran the step again as a numbered list of 23
          checks, and that version finished.
        </p>
        <p>
          The briefs that worked had the same three parts: about ten to
          twenty concrete checks, a results table the tester had to fill in,
          and a rule that a check it didn&apos;t perform is never a pass.
          These rows are from the last re-test on production.
        </p>

        <div className="post-table-wrap">
          <table className="post-table">
            <thead>
              <tr>
                <th>Check</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {retestRows.map(([check, result]) => (
                <tr key={check}>
                  <td>{check}</td>
                  <td>{result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          &quot;Blocked&quot; is the useful word. It kept an unrun check from
          hiding inside a green report.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">The bug nobody planned to find</h2>
        <p>
          Partway through the crew app, the tester hit a &quot;No signal&quot;
          banner. The office tab in the same browser worked. Fable traced the
          banner to one condition: it shows when{' '}
          <code className="post-code-inline">navigator.onLine</code> is
          false. My Chrome was reporting false on a working network.
        </p>
        <p>
          The crew app trusted that flag over its own open connection to the
          server. It held 14 changes in the browser for over half an hour.
          Forcing the flag true sent all of them at once. That is a real
          bug. A phone that misreports its connection would keep a crew&apos;s
          reports on the device with no way to push them.
        </p>
        <p>
          The re-test for that fix was the best one of the night. The flag
          was still false, the banner was gone, and the report got its number
          immediately. I still don&apos;t know why my Chrome says it is
          offline.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">What three reviewers bought</h2>
        <p>
          Sol reviewed every fix before its pull request opened. Then I asked
          for a second gate: Fable, Sol and Terra each had to approve the
          final diff of all eighteen before anything merged. Fifteen passed
          on the first round. Three didn&apos;t, and those three are the
          argument for doing it.
        </p>
        <ul className="post-list">
          <li>
            <strong>Delivery checklists.</strong> Sol and Fable approved.
            Terra saw that removing a checklist item would make the server
            reject an inspection a crew had queued offline. The next round it
            found the neighbor: rewording an item saves the crew&apos;s answer
            against a question they never saw. Three rounds.
          </li>
          <li>
            <strong>Any city on a job.</strong> The form guessed county and
            state from a sample list as you typed. It drew a finding three
            rounds in a row, each a new way to leave the wrong county on a
            job. Fable had Opus delete the guessing. Four rounds.
          </li>
          <li>
            <strong>A &quot;this record doesn&apos;t exist&quot; message.</strong>{' '}
            Sol and Terra found the same two holes separately. Then a third.
            The app was deciding from the newest 60 records it held, so an
            older real record would be called missing. Fable cut the feature
            and kept the two empty states nobody objected to.
          </li>
        </ul>
        <p>
          Two of those ended by removing something. I didn&apos;t expect
          review rounds to work as a signal that a feature is wrong, but that
          is what happened.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">Five ways it fell over</h2>
        <ol className="post-list qa-numbered">
          <li>
            <strong>The Mac ran out of room.</strong> Four Opus threads plus
            the tester took the load average to 12. I asked for the fix
            threads to move to the Dell.
          </li>
          <li>
            <strong>Then the Dell did.</strong> Six fix threads at once took
            a 12-core machine to a load average of 56 with swap full, and two
            threads failed to start. Three at once was fine. The fix rules
            now say to check <code className="post-code-inline">uptime</code>{' '}
            first and stop the dev server right after the screenshots.
          </li>
          <li>
            <strong>The screen locked.</strong> Computer use can&apos;t see a
            locked Mac, so one re-test ran zero checks. Unlocking wasn&apos;t
            enough. I had to restart the ChatGPT app, which also hosts every
            Codex thread on that machine, so it had to wait for two reviews
            to finish. Fable now keeps the display awake with{' '}
            <code className="post-code-inline">caffeinate</code> while a
            tester runs.
          </li>
          <li>
            <strong>Children can&apos;t cross projects.</strong> A delegated
            child runs in the parent&apos;s project, and the fixes belonged in
            a different repository. Fable launched them as their own threads
            and waited on those.
          </li>
          <li>
            <strong>The orchestrator made a mess of git.</strong> It set a
            throwaway identity in what it thought was a scratch checkout. The
            checkout shared its config with the real repository, and two
            revisions were committed under that name. It caught this itself,
            removed the setting and wrote the squash messages by hand.
            Nothing on <code className="post-code-inline">main</code> carried
            the fake name.
          </li>
        </ol>
      </section>

      <aside className="post-callout">
        <p className="post-callout-eyebrow">What it did not cover</p>
        <h3 className="post-h3 post-callout-title">
          Passing QA is a claim about what was tested.
        </h3>
        <p>
          Everything ran as the admin in desktop Chrome. Nobody clicked
          through as a foreman. Nobody carried a report into a second day.
          The native build has never run on a phone. Fable listed all of that
          in its report without being asked and said plainly that the phone
          app was not proven.
        </p>
        <p>
          It also left two decisions with me. It did not merge until I told
          it to, and it did not restore production to the pre-QA snapshot
          until I told it to, because that changes production data.
        </p>
      </aside>

      <section className="prose-block">
        <h2 className="post-h2">What I&apos;m keeping</h2>
        <ul className="post-list">
          <li>One model per job, and a reviewer from a different lab than the author.</li>
          <li>Numbered checks, a table to fill in, and &quot;blocked&quot; as a valid answer.</li>
          <li>Read the code before starting a fix. A tester&apos;s report is a lead.</li>
          <li>Merge every branch together in a scratch checkout before merging one.</li>
          <li>Three heavy threads on the Dell, and nothing heavy on the Mac.</li>
          <li>A backup before each deploy, and a person for anything that changes production data.</li>
        </ul>
        <p>
          I sent ten messages that evening, one of them from my phone. One
          was me reporting a bug that turned out to be the tester pasting a
          script tag into a form on purpose. The app printed it back as plain
          text, which was the test passing.
        </p>
      </section>

      <footer className="border-t border-black/10 dark:border-white/10 pt-8 flex flex-col gap-4">
        <p className="text-sm opacity-70">Published {post.publishedReadable}.</p>
        <div className="flex items-center justify-between gap-4">
          <Link href="/blog" className="nav-link self-start">
            <ArrowLeft className="h-3.5 w-3.5" />
            All posts
          </Link>
          <a
            href="https://www.varholdt.com/field/"
            target="_blank"
            rel="noreferrer"
            className="nav-link"
          >
            See Varholdt Field
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </footer>
    </article>
  )
}
