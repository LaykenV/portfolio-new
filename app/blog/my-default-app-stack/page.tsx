import Link from 'next/link'
import {
  ArrowLeft,
  ArrowUpRight,
  Layers,
  Database,
  ShieldCheck,
  Palette,
  Package,
  Rocket,
  Wand2,
} from 'lucide-react'

import type { Metadata } from 'next'

const postTitle = 'The stack I’m building everything on now'
const postDescription =
  'TanStack Start, Convex, and Clerk — and the specific architectural patterns from Theo Browne’s open-source Lawn repo that make them work together.'
const postUrl = '/blog/my-default-app-stack'
const postPath = 'https://www.laykenvarholdt.com' + postUrl
const publishedISO = '2026-04-17T00:00:00.000Z'
const publishedReadable = 'April 17, 2026'

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
        url: 'https://www.laykenvarholdt.com/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'A modern web app stack: TanStack Start, Convex, and Clerk',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: postTitle + ' — Layken Varholdt',
    description: postDescription,
    creator: '@LLVarholdt',
    images: ['https://www.laykenvarholdt.com/twitter-image'],
  },
}

const stackItems = [
  {
    name: 'TanStack Start',
    role: 'App framework + file-based router on Vite',
    icon: Layers,
  },
  {
    name: 'Convex',
    role: 'Schema, auth-aware queries, actions, realtime, webhooks',
    icon: Database,
  },
  {
    name: 'Clerk',
    role: 'Identity, sessions, auth UI',
    icon: ShieldCheck,
  },
  {
    name: 'Tailwind v4 + Radix',
    role: 'Styling and low-level UI primitives',
    icon: Palette,
  },
  {
    name: 'Bun',
    role: 'Package manager + local task runner',
    icon: Package,
  },
  {
    name: 'Vercel',
    role: 'Static hosting for the SPA + prerendered marketing pages',
    icon: Rocket,
  },
]

export default function DefaultStackPost() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: postTitle,
    description: postDescription,
    image: ['https://www.laykenvarholdt.com/opengraph-image'],
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
      'TanStack Start',
      'Convex',
      'Clerk',
      'Lawn',
      'Theo Browne',
      'AI engineering',
      'modern web stack',
      'SPA',
      'prerendering',
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
          The stack I&rsquo;m building <em>everything</em> on now.
        </h1>
        <p className="hero-sub">
          TanStack Start, Convex, and Clerk &mdash; plus the specific
          architectural patterns from Theo Browne&rsquo;s open-source Lawn repo
          that make them work together.
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs opacity-65">
          <span className="mono-accent">By Layken Varholdt</span>
          <span aria-hidden="true">·</span>
          <span className="mono-accent">~10 min read</span>
        </div>
      </header>

      <section className="prose-block">
        <h2 className="post-h2">Picking a default</h2>
        <p>
          I&rsquo;ve shipped enough side projects on enough different stacks at
          this point to have an opinion. Every new app starts with the same
          setup tax: routing decisions, auth wiring, data layer, deployment
          shape, where the design system lives. By the time the actual product
          logic shows up, I&rsquo;ve already burned half a weekend on plumbing.
        </p>
        <p>
          So I&rsquo;m committing. Going forward, every new app I build starts
          on the same stack: <strong>TanStack Start + Convex + Clerk</strong>,
          deployed on Vercel, with the architectural patterns lifted almost
          wholesale from{' '}
          <a
            href="https://github.com/pingdotgg/lawn"
            target="_blank"
            rel="noreferrer"
            className="post-link"
          >
            Theo Browne&rsquo;s open-source Lawn repo
          </a>
          .
        </p>
        <p>
          This post is half &ldquo;here&rsquo;s the stack&rdquo; and half
          &ldquo;here are the specific patterns worth copying.&rdquo; If you
          want a working reference instead of a starter template, Lawn is the
          best one I&rsquo;ve read in a while.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">The stack at a glance</h2>
        <ul className="stack-grid">
          {stackItems.map((item) => {
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
          Why this combination works: every layer has a clear job. Convex
          isn&rsquo;t trying to be a frontend framework. TanStack Start
          isn&rsquo;t trying to be a backend. Clerk isn&rsquo;t trying to be an
          authorization layer. When the boundaries are clean, the integration
          stays clean too.
        </p>
        <p>
          TanStack Start gives me file-based routing and Vite-based prerendering
          without dragging along a Next-sized framework. Convex gives me the
          entire backend in one place: schema, auth-aware queries, mutations,
          actions for external side effects, HTTP routes for webhooks,
          scheduled functions, and realtime subscriptions all behind the same
          client. Clerk handles identity well so I never need to build a
          sign-in page from scratch.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">Where the credit goes</h2>
        <p>
          Most of what I&rsquo;m describing here isn&rsquo;t original. The
          architectural patterns are from{' '}
          <a
            href="https://github.com/pingdotgg/lawn"
            target="_blank"
            rel="noreferrer"
            className="post-link"
          >
            Lawn
          </a>
          , a fully working TanStack Start + Convex + Clerk app that{' '}
          <a
            href="https://x.com/theo"
            target="_blank"
            rel="noreferrer"
            className="post-link"
          >
            Theo Browne
          </a>{' '}
          and the Ping team published as open source. Lawn isn&rsquo;t a
          starter template. It&rsquo;s a real product they open-sourced as a
          reference implementation, and it&rsquo;s rare to get a production app
          published with this much architectural care.
        </p>
        <p>
          I&rsquo;ve been studying it for the last few weeks and pulling the
          patterns I want to keep into a personal blueprint. This post is my
          notes on what&rsquo;s worth lifting.
        </p>
      </section>

      <aside className="post-callout">
        <p className="post-callout-eyebrow">Architectural thesis</p>
        <h3 className="post-h3 post-callout-title">
          Static where possible. Client-realtime where valuable.
        </h3>
        <p>
          The single biggest decision in the Lawn architecture is how it splits
          the rendering strategy. Public marketing pages get prerendered to
          static HTML at build time &mdash; fast, SEO-friendly, no auth
          complexity to deal with. The authenticated product app runs as a SPA.
          Once you&rsquo;re past sign-in, you&rsquo;re talking directly to
          Convex subscriptions, with no SSR loaders in between.
        </p>
        <p>
          This is the one decision I keep seeing teams get wrong. They reach
          for SSR everywhere because it&rsquo;s the default in modern
          frameworks, then fight it on every dashboard page that needs realtime
          data. Lawn doesn&rsquo;t fight it. The product surface is a SPA on
          purpose.
        </p>
      </aside>

      <section className="prose-block">
        <h2 className="post-h2">Route file conventions</h2>
        <p>
          Lawn enforces a discipline on route files that I&rsquo;ve come around
          on. Each route is three files instead of one:
        </p>
        <ul className="post-list">
          <li>
            The route entry (e.g.{' '}
            <code className="post-code-inline">
              app/routes/dashboard/$teamSlug.index.tsx
            </code>
            ) stays thin. It defines the path, sets head metadata, and hands
            off to an implementation component.
          </li>
          <li>
            A hyphen-prefixed implementation file (e.g.{' '}
            <code className="post-code-inline">-team.tsx</code>) holds the
            actual UI. It lives next to the route but isn&rsquo;t itself a
            route, because TanStack Router ignores hyphen-prefixed siblings.
          </li>
          <li>
            A <code className="post-code-inline">.data.ts</code> file (e.g.{' '}
            <code className="post-code-inline">-team.data.ts</code>) holds the
            route&rsquo;s data contract.
          </li>
        </ul>
        <p>
          Why this is worth doing: route files stop becoming 400-line dumping
          grounds. Big implementation code lives next to the route without
          polluting the file tree. The data contract is its own file, which
          makes prewarming and testing both clean.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">The route data contract</h2>
        <p>
          This is probably the pattern I was most skeptical of going in and
          most converted on coming out.
        </p>
        <p>
          Each major route gets a <code className="post-code-inline">.data.ts</code>{' '}
          file with three exports:
        </p>
        <ul className="post-list">
          <li>
            <code className="post-code-inline">getEssentialSpecs()</code> &mdash;
            the query specs the route needs to render.
          </li>
          <li>
            <code className="post-code-inline">useData()</code> &mdash; the hook
            the component uses to consume those queries.
          </li>
          <li>
            <code className="post-code-inline">prewarm()</code> &mdash; the
            function called when a user signals intent to navigate (hover,
            focus, touch).
          </li>
        </ul>
        <p>
          What this gives you: navigation prewarming and route rendering share
          the same source of truth. You hover a link and the route&rsquo;s data
          starts loading before the click fires. When the page mounts, the
          query is often already in cache, so the page renders instantly.
        </p>
        <p>
          I&rsquo;ve shipped apps before with manual prewarm calls scattered
          across components. It always rotted. The{' '}
          <code className="post-code-inline">.data.ts</code> pattern keeps the
          contract in one file, so the prewarm logic can&rsquo;t drift from
          what the page actually needs.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">Intent-based prewarming</h2>
        <p>
          The prewarm system is more sophisticated than the simple
          &ldquo;prefetch on hover&rdquo; pattern most teams use:
        </p>
        <ul className="post-list">
          <li>
            Intent triggers come from{' '}
            <code className="post-code-inline">onMouseEnter</code>,{' '}
            <code className="post-code-inline">onFocus</code>, and{' '}
            <code className="post-code-inline">onTouchStart</code>, with
            cancelation on <code className="post-code-inline">onMouseLeave</code>{' '}
            and <code className="post-code-inline">onBlur</code>.
          </li>
          <li>
            It&rsquo;s debounced. A pointer brushing across links shouldn&rsquo;t
            fire a query.
          </li>
          <li>
            It&rsquo;s deduped. A short-term memory of recently prewarmed query
            keys prevents the app from resubscribing to the same data over and
            over.
          </li>
          <li>
            It&rsquo;s a navigation primitive, not a card-grid optimization.
            Lawn prewarms breadcrumbs, headers, and shell elements, not just
            content cards.
          </li>
        </ul>
        <p>
          The result is that navigation feels closer to native app speed than
          web app speed. Most clicks don&rsquo;t have a loading state because
          the data was already on its way.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">Convex as the domain boundary</h2>
        <p>
          Lawn doesn&rsquo;t sprinkle business logic across server files.
          Everything authoritative lives in Convex.
        </p>
        <ul className="post-list">
          <li>
            <strong>Authorization</strong> &mdash; reusable helpers like{' '}
            <code className="post-code-inline">requireUser</code>,{' '}
            <code className="post-code-inline">requireTeamAccess</code>,{' '}
            <code className="post-code-inline">requireProjectAccess</code>.
          </li>
          <li>
            <strong>Data access</strong> &mdash; Convex queries with auth checks
            built in.
          </li>
          <li>
            <strong>External integrations</strong> &mdash; Convex actions,
            isolated from queries so external failures don&rsquo;t corrupt
            reads.
          </li>
          <li>
            <strong>Webhooks</strong> &mdash; a tiny{' '}
            <code className="post-code-inline">http.ts</code> adapter layer that
            does signature verification and hands off to internal mutations.
          </li>
        </ul>
        <p>
          Clerk owns identity. Convex owns authorization. The client never
          becomes the source of truth for either.
        </p>
        <p>
          The reason this matters: when you keep authorization in Convex, you
          can&rsquo;t accidentally ship a permission bug because someone forgot
          a check on a new route. The check is on the data, not on the page
          that displays the data.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">Backend organized by domain, not function type</h2>
        <p>Convex modules get grouped by what they own:</p>
        <ul className="post-list">
          <li>
            <strong>Domain modules</strong> &mdash; one file per core entity in
            your product, holding its queries and mutations together.
          </li>
          <li>
            <strong>Cross-cutting helpers</strong> &mdash;{' '}
            <code className="post-code-inline">auth.ts</code>,{' '}
            <code className="post-code-inline">security.ts</code>, anything
            that&rsquo;s shared between domains.
          </li>
          <li>
            <strong>Integration modules</strong> &mdash; one file per external
            system, holding all the actions that talk to it.
          </li>
          <li>
            <code className="post-code-inline">http.ts</code> &mdash; the
            webhook adapter, deliberately small. Verify the signature, hand off
            to an internal mutation, return a 200.
          </li>
        </ul>
        <p>
          This sounds obvious but it&rsquo;s the opposite of what most Convex
          examples do. The examples usually have one big{' '}
          <code className="post-code-inline">functions.ts</code> or split things
          into{' '}
          <code className="post-code-inline">queries.ts</code> /{' '}
          <code className="post-code-inline">mutations.ts</code> /{' '}
          <code className="post-code-inline">actions.ts</code>. That stops
          scaling around the third entity.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">Why the combination, not any one piece</h2>
        <p>
          Take any one of these decisions in isolation and it&rsquo;s
          defensible but not transformative. Static marketing pages are a known
          practice. Convex subscriptions are well-documented. Intent-based
          prewarming exists in plenty of stacks.
        </p>
        <p>
          What makes Lawn (and now my new default) feel different is that all
          of these decisions agree with each other:
        </p>
        <ul className="post-list">
          <li>
            Static marketing pages mean you don&rsquo;t pay for SSR on routes
            that don&rsquo;t benefit.
          </li>
          <li>
            A SPA product surface means Clerk auth and Convex subscriptions are
            first-class, instead of bolted on around an SSR layer.
          </li>
          <li>
            Direct Convex subscriptions mean you don&rsquo;t need a query cache
            between the data and the UI.
          </li>
          <li>
            Route data contracts mean prewarming has somewhere to live that
            won&rsquo;t rot.
          </li>
          <li>
            Domain-first Convex organization means the backend stays legible
            when you have eight tables instead of two.
          </li>
        </ul>
        <p>
          Pick any one and it&rsquo;s fine. Combine them with intent and the
          architecture compounds.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">The blueprint, in one list</h2>
        <p>
          The patterns above are what every new project I start will share, no
          matter what it does:
        </p>
        <ul className="post-list">
          <li>
            <code className="post-code-inline">app/</code> +{' '}
            <code className="post-code-inline">src/</code> +{' '}
            <code className="post-code-inline">convex/</code> repo split.
          </li>
          <li>Prerendered marketing surface, SPA product surface.</li>
          <li>
            Thin route files, hyphen-prefixed implementation files, companion{' '}
            <code className="post-code-inline">.data.ts</code> contracts per
            major route.
          </li>
          <li>Debounced, deduped, intent-based prewarming as a navigation primitive.</li>
          <li>
            Centralized Convex auth helpers; authorization on the data, not on
            the page.
          </li>
          <li>
            Domain-organized Convex modules + a tiny{' '}
            <code className="post-code-inline">http.ts</code> webhook layer.
          </li>
          <li>Plain <code className="post-code-inline">convex/react</code> for reads, no extra cache layer.</li>
        </ul>
        <p>
          Everything else &mdash; the schema, the visual language, the
          integrations &mdash; is per-project. The shape above is what stays
          constant.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">Credit + resources</h2>
        <p>
          Massive credit to{' '}
          <a
            href="https://x.com/theo"
            target="_blank"
            rel="noreferrer"
            className="post-link"
          >
            Theo Browne
          </a>{' '}
          and the Ping team for publishing{' '}
          <a
            href="https://github.com/pingdotgg/lawn"
            target="_blank"
            rel="noreferrer"
            className="post-link"
          >
            Lawn
          </a>{' '}
          as open source. Most starter templates demonstrate one or two
          patterns. Lawn demonstrates a coherent set of decisions that work
          together, on a real product instead of a contrived demo.
        </p>
        <p>
          If you&rsquo;re starting a new app and any of this resonates, clone
          the repo and read it cover to cover. It&rsquo;s the best modern web
          architecture reference I&rsquo;ve found.
        </p>
        <p>
          And if you build something with these patterns, I&rsquo;d genuinely
          love to see it. Send it my way.
        </p>
      </section>

      <footer className="aside-footer mt-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Link href="/blog" className="nav-link self-start">
            <ArrowLeft className="h-3.5 w-3.5" />
            More writing
          </Link>
          <a
            href="mailto:laykenv@gmail.com?subject=Re%3A%20Default%20app%20stack%20post"
            className="nav-link"
          >
            <Wand2 className="h-3.5 w-3.5" />
            Reply by email
          </a>
        </div>
      </footer>
    </article>
  )
}
