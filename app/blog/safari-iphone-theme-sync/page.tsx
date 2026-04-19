import Link from 'next/link'
import {
  ArrowLeft,
  ArrowUpRight,
  Smartphone,
  Eye,
  Palette,
  Layers,
  Wand2,
} from 'lucide-react'

import type { Metadata } from 'next'

const postTitle = 'The Safari theme-sync quirk no AI could fix'
const postDescription =
  'How a fixed-shell mobile portfolio stopped fighting iPhone Safari\u2019s toolbar and learned to feed it instead, without giving up the swipe/snap deck UX.'
const postUrl = '/blog/safari-iphone-theme-sync'
const postPath = 'https://www.laykenvarholdt.com' + postUrl
const publishedISO = '2026-04-19T00:00:00.000Z'
const publishedReadable = 'April 19, 2026'

export const metadata: Metadata = {
  title: postTitle,
  description: postDescription,
  alternates: { canonical: postUrl },
  openGraph: {
    title: postTitle + ' \u2014 Layken Varholdt',
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
        alt: 'Theme-syncing iPhone Safari on a fixed-shell mobile portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: postTitle + ' \u2014 Layken Varholdt',
    description: postDescription,
    creator: '@LLVarholdt',
    images: ['https://www.laykenvarholdt.com/twitter-image'],
  },
}

const fixLayers = [
  {
    name: 'viewport-fit=cover',
    role: 'Let the document actually extend under Safari\u2019s toolbars',
    icon: Smartphone,
  },
  {
    name: '<meta name="color-scheme">',
    role: 'Tell the standards stack which schemes the page supports, early',
    icon: Eye,
  },
  {
    name: ':root color-scheme + html.dark rules',
    role: 'Make the active scheme explicit at the document root, not just inside components',
    icon: Palette,
  },
  {
    name: 'Top + bottom mobile edge strips',
    role: 'Two fixed, theme-driven surfaces behind the deck for Safari to sample',
    icon: Layers,
  },
]

export default function SafariIPhoneThemeSyncPost() {
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
      'iOS Safari',
      'theme-color',
      'color-scheme',
      'mobile UX',
      'CSS',
      'Next.js',
      'fixed shell',
      'scroll snap',
      'next-themes',
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
          Engineering notes &middot; {publishedReadable}
        </div>
        <h1 className="hero-title">
          The Safari theme-sync quirk <em>no AI could fix.</em>
        </h1>
        <p className="hero-sub">
          How a fixed-shell mobile portfolio stopped fighting iPhone
          Safari&rsquo;s toolbar and learned to feed it instead, without giving
          up the swipe/snap deck UX.
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs opacity-65">
          <span className="mono-accent">By Layken Varholdt</span>
          <span aria-hidden="true">&middot;</span>
          <span className="mono-accent">~7 min read</span>
        </div>
      </header>

      <section className="prose-block">
        <h2 className="post-h2">Try it on your phone</h2>
        <p>
          If you have an iPhone handy, open this site in Safari, scroll to the
          top, and tap the theme toggle in the menu. The status area at the top
          and the toolbar at the bottom should change color along with the page.
          On most sites that just works. On this one, for a while, it didn&rsquo;t.
        </p>
        <p>
          The page would switch themes immediately. Safari&rsquo;s chrome
          would lag a beat behind, sometimes a full beat, sometimes forever
          until the user pulled down to refresh. Same story at the bottom
          toolbar. It looked like a bug in the toggle, but the toggle was fine.
          Safari was looking at something the page wasn&rsquo;t giving it.
        </p>
        <p>
          I threw this at every coding agent I had access to over the course
          of a few weeks. Multiple frontier models, multiple sessions, every
          time with a fresh handoff doc summarizing what had already failed.
          None of them landed the fix. The actual workaround turned out to be
          small enough that I&rsquo;m not sure it was anywhere in their
          training data.
        </p>
        <p>
          This is a short post about what Safari is actually sampling on
          iPhone, why the obvious fixes (<code className="post-code-inline">theme-color</code>,
          painting the body) didn&rsquo;t help in this layout, and the small
          workaround that did.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">Why this site is weird</h2>
        <p>
          The mobile portfolio isn&rsquo;t a normal scrolling page. It&rsquo;s
          a fixed full-screen shell with an inner scroller that snaps between
          the about slide and each project card.
        </p>
        <p>
          In CSS terms: the outer container is{' '}
          <code className="post-code-inline">
            position: fixed; inset: 0; overflow: hidden;
          </code>{' '}
          and the deck inside it is{' '}
          <code className="post-code-inline">
            position: absolute; inset: 0; overflow-y: auto;
          </code>{' '}
          with{' '}
          <code className="post-code-inline">scroll-snap-type: y mandatory</code>.
          The body never actually scrolls. The intersection observer that
          drives the right-rail page indicator runs against the inner deck, not
          the document.
        </p>
        <p>
          I like that architecture for what this site does. Each card gets its
          own viewport-sized canvas, swipes feel deliberate, the rail dots are
          honest. But it isn&rsquo;t how most sites are built, and as I learned,
          it isn&rsquo;t how Safari assumes a page is built either.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">The first thing you reach for</h2>
        <p>
          The standards-friendly answer is{' '}
          <code className="post-code-inline">
            &lt;meta name=&quot;theme-color&quot;&gt;
          </code>
          . You can ship a static one, or you can update it at runtime when the
          theme changes by patching the meta tag in place. I tried both. A
          static pair with{' '}
          <code className="post-code-inline">
            media=&quot;(prefers-color-scheme: dark)&quot;
          </code>{' '}
          variants, then a small client component that watched{' '}
          <code className="post-code-inline">next-themes</code> and rewrote the
          tag.
        </p>
        <p>
          Neither moved Safari reliably on this layout. The toolbar would
          sometimes update, sometimes not, and &ldquo;sometimes not&rdquo; is a
          worse experience than &ldquo;consistently wrong,&rdquo; because the
          user starts wondering what they did differently between attempts.
        </p>
        <p>
          So I deleted the runtime sync. It was earning its rent in
          nobody&rsquo;s apartment.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">The next instinct, which broke desktop</h2>
        <p>
          The next thing you try is forcing background colors at the root.
          Paint <code className="post-code-inline">html</code> and{' '}
          <code className="post-code-inline">body</code> to match the theme. If
          Safari is sampling the document&rsquo;s actual surface, that should
          give it something obvious to work with.
        </p>
        <p>
          It does. It also instantly changes desktop, because{' '}
          <code className="post-code-inline">html</code> and{' '}
          <code className="post-code-inline">body</code> aren&rsquo;t
          mobile-only. The portfolio&rsquo;s desktop background is a layered
          radial-gradient composition that reads correctly because nothing is
          fighting it from below. Drop a flat fill behind it and the whole
          composition flattens.
        </p>
        <p>
          Reverted. Whatever the mobile fix was, it had to live behind a media
          query.
        </p>
      </section>

      <aside className="post-callout">
        <p className="post-callout-eyebrow">Working hypothesis</p>
        <h3 className="post-h3 post-callout-title">
          Safari samples what&rsquo;s painted near the edges
        </h3>
        <p>
          After enough days of poking at this, the model that fit the behavior
          I kept seeing on iPhone Safari was something like:{' '}
          <code className="post-code-inline">theme-color</code> is one input,
          but it isn&rsquo;t the only one. On layouts that don&rsquo;t have a
          normal scrolling document, Safari leans on what&rsquo;s actually
          painted near the top and bottom edges of the viewport.
        </p>
        <p>
          On a normal page, that&rsquo;s whatever pixels are scrolled into view
          at those edges. On a fixed-shell page like this one, it&rsquo;s
          whatever sits at{' '}
          <code className="post-code-inline">inset-block-start: 0</code> and{' '}
          <code className="post-code-inline">inset-block-end: 0</code> in the
          painted layer order.
        </p>
        <p>
          In this layout, the visible color near the edges lived inside an
          inner scroller. From the outer layout&rsquo;s perspective, those
          edges had nothing meaningful to read. They were transparent surfaces
          over the body background, and the body background hadn&rsquo;t moved
          when the theme changed. So the toolbar stayed on whatever color it
          had cached from the first paint, and a refresh would re-sample.
        </p>
      </aside>

      <section className="prose-block">
        <h2 className="post-h2">The fix, in two layers</h2>
        <p>
          Two responsibilities. First, tell the standards stack what&rsquo;s
          happening so Safari&rsquo;s defaults play nice. Second, give it
          something to actually look at.
        </p>

        <ul className="stack-grid">
          {fixLayers.map((item) => {
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

        <h3 className="post-h3">Layer one: the standards signals</h3>
        <p>
          The first three bullets are housekeeping. In{' '}
          <code className="post-code-inline">app/layout.tsx</code>:
        </p>
        <pre className="post-code-block">
          <code>{`export const viewport: Viewport = {
  viewportFit: 'cover',
}

// in the document head:
<meta name="color-scheme" content="dark light" />`}</code>
        </pre>
        <p>
          And in <code className="post-code-inline">app/globals.css</code>:
        </p>
        <pre className="post-code-block">
          <code>{`:root { color-scheme: light dark; }

html.dark         { color-scheme: dark; }
html:not(.dark)   { color-scheme: light; }`}</code>
        </pre>
        <p>
          None of this is exotic. The point is that all three signals agree.
          Safari sees a viewport that extends under the toolbars, an early
          declaration of supported color schemes, and an explicit
          per-theme-class rule that resolves whichever one is active. That
          alone didn&rsquo;t fix sync, but it stopped giving Safari conflicting
          hints about what to render.
        </p>

        <h3 className="post-h3">Layer two: the edge strips</h3>
        <p>
          The piece that actually moved the toolbar was two fixed strips, one
          at each edge of the viewport, behind the rest of the mobile content.
          The markup lives in{' '}
          <code className="post-code-inline">components/mobile-portfolio.tsx</code>{' '}
          right next to the deck container:
        </p>
        <pre className="post-code-block">
          <code>{`<div className="mobile-portfolio">
  <div className="m-browser-edge m-browser-edge-top" aria-hidden="true" />
  <div className="m-browser-edge m-browser-edge-bottom" aria-hidden="true" />
  {/* deck and content sit at z-index: 1 above */}
</div>`}</code>
        </pre>
        <p>
          The styling lives in{' '}
          <code className="post-code-inline">app/mobile.css</code>:
        </p>
        <pre className="post-code-block">
          <code>{`.m-browser-edge        { position: fixed; left: 0; right: 0; pointer-events: none; }
.m-browser-edge-top    {
  top: 0; z-index: 0;
  height: calc(env(safe-area-inset-top, 0px) + 64px);
  background: var(--mobile-edge-top);
}
.m-browser-edge-bottom {
  bottom: 0; z-index: 0;
  height: calc(env(safe-area-inset-bottom, 0px) + 72px);
  background: var(--mobile-edge-bottom);
}`}</code>
        </pre>
        <p>
          The two colors are CSS variables defined in{' '}
          <code className="post-code-inline">:root</code> and overridden under{' '}
          <code className="post-code-inline">.dark</code>:
        </p>
        <pre className="post-code-block">
          <code>{`:root {
  --mobile-edge-top:    #e7ecf5;
  --mobile-edge-bottom: #f1e6df;
}
.dark {
  --mobile-edge-top:    #161b26;
  --mobile-edge-bottom: #120f10;
}`}</code>
        </pre>
        <p>
          The strips sit at <code className="post-code-inline">z-index: 0</code>{' '}
          beneath the deck (which sits at{' '}
          <code className="post-code-inline">z-index: 1</code>), so they
          don&rsquo;t block taps and don&rsquo;t draw over the cards. They
          aren&rsquo;t there for the user. They&rsquo;re there so Safari has a
          stable, theme-synced surface to read at the top and bottom of the
          viewport. About 30 lines total, and that&rsquo;s the part that made
          theme switches sync without a refresh.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">Hiding the seam</h2>
        <p>
          The first version of those strips looked terrible.
        </p>
        <p>
          The top edge sat at one solid color. The about slide started at a
          different color underneath it. The seam between them read as a hard
          band across the screen. It synced Safari, sure, but it looked like
          I&rsquo;d left an unfinished placeholder at the top of the page.
        </p>
        <p>
          The fix was the inverse of the original instinct. Instead of trying
          to make Safari ignore the strip, I made the about slide blend into
          it. The first 188px of the about slide background is a linear
          gradient from the top-edge color down to the page background:
        </p>
        <pre className="post-code-block">
          <code>{`.m-about-bg {
  background:
    linear-gradient(180deg, var(--mobile-edge-top) 0%, var(--background) 188px),
    /* the rest of the about-slide gradients sit below this */
    radial-gradient(120% 90% at 50% 0%, hsl(var(--blue-strong) / 0.26), transparent 60%),
    radial-gradient(90% 60% at 0% 100%, hsl(var(--peach-strong) / 0.24), transparent 60%);
}`}</code>
        </pre>
        <p>
          Safari samples one consistent color near the top of the viewport. The
          user reads it as &ldquo;the top of the about screen fades into the
          toolbar,&rdquo; which is the look I actually wanted in the first
          place. Same color, two consumers.
        </p>
        <p>
          The bottom edge didn&rsquo;t need the same treatment. The deck cards
          already extend to the bottom of the viewport with their own dark
          gradient, so the bottom strip just fills the safe-area bezel and
          that&rsquo;s all it needs to do.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">Sizing the dial</h2>
        <p>Two sliders matter, and they push in opposite directions.</p>
        <p>
          If the strips are too short, Safari ignores them. I tried 8px and got
          nothing. 16px gave me partial behavior. 32px was intermittent. The
          current heights are 64px at the top and 72px at the bottom, plus the
          safe-area inset on each. That&rsquo;s enough that Safari treats the
          strip as the relevant edge surface instead of treating it as
          decoration.
        </p>
        <p>
          If they&rsquo;re too tall (or just too opaque without the about-slide
          blend), you can see them. Even with the right color, a flat slab
          across the top of a swipe deck breaks the &ldquo;this is one
          continuous canvas&rdquo; feeling I want from the deck. The about-slide
          blend is what lets the strip be tall enough to influence Safari
          without showing up as its own element.
        </p>
        <p>
          Once both numbers were dialed in, the page felt like it had a
          translucent toolbar treatment, even though the toolbar is just Safari
          rendering on top of a solid color. The user can&rsquo;t tell.
        </p>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">Things I sank time into that didn&rsquo;t help</h2>
        <ul className="post-list">
          <li>
            Runtime sync of{' '}
            <code className="post-code-inline">meta[name=&quot;theme-color&quot;]</code>.
            Did less than I hoped, and the React effect that ran on every theme
            change wasn&rsquo;t free either.
          </li>
          <li>
            Painting <code className="post-code-inline">html</code> or{' '}
            <code className="post-code-inline">body</code> directly. Worked for
            Safari, broke desktop. Mobile-only or nothing.
          </li>
          <li>
            Tiny, near-invisible samplers. Looked clean. Did nothing for the
            toolbar.
          </li>
          <li>
            Large visible overlays at the top of the page. Worked. Looked
            broken.
          </li>
          <li>
            Refactoring the deck to use page scrolling. Safari behavior would
            have followed the rest of the web&rsquo;s defaults, but the snap
            UX I wanted is an inner-scroller pattern. Reverted within an hour.
          </li>
        </ul>
      </section>

      <section className="prose-block">
        <h2 className="post-h2">If this regresses</h2>
        <p>
          Note to future me. If iPhone Safari starts lagging on theme switches
          again, don&rsquo;t start by adding{' '}
          <code className="post-code-inline">theme-color</code> back. Check
          these in order:
        </p>
        <ul className="post-list">
          <li>
            <code className="post-code-inline">viewportFit: &apos;cover&apos;</code>{' '}
            is still set in{' '}
            <code className="post-code-inline">app/layout.tsx</code>.
          </li>
          <li>
            <code className="post-code-inline">
              &lt;meta name=&quot;color-scheme&quot; content=&quot;dark light&quot;&gt;
            </code>{' '}
            is still in the document head.
          </li>
          <li>
            <code className="post-code-inline">:root</code> still has{' '}
            <code className="post-code-inline">color-scheme: light dark</code>,
            and the explicit{' '}
            <code className="post-code-inline">html.dark</code> /{' '}
            <code className="post-code-inline">html:not(.dark)</code> rules are
            still in <code className="post-code-inline">globals.css</code>.
          </li>
          <li>
            The two mobile-edge variables are still defined, and overridden
            per-theme.
          </li>
          <li>
            The{' '}
            <code className="post-code-inline">m-browser-edge-top</code> and{' '}
            <code className="post-code-inline">m-browser-edge-bottom</code>{' '}
            divs are still rendered inside{' '}
            <code className="post-code-inline">mobile-portfolio.tsx</code>, and
            still sized large enough to influence Safari.
          </li>
          <li>
            The about slide&rsquo;s top blend still uses the same{' '}
            <code className="post-code-inline">--mobile-edge-top</code> color.
          </li>
        </ul>
        <p>
          That&rsquo;s the whole fix. No magic component, no listener, no
          animation frame. Markup, a couple of CSS variables, and a layout
          decision about who&rsquo;s allowed to know what color goes near the
          edges of the screen.
        </p>
        <p>
          The honest takeaway is that Safari on iPhone isn&rsquo;t fully
          controlled by{' '}
          <code className="post-code-inline">theme-color</code> when your page
          isn&rsquo;t the thing scrolling. Once I stopped trying to push the
          toolbar around with metadata and started feeding Safari the right
          pixels at the right z-index, it behaved.
        </p>
      </section>

      <footer className="aside-footer mt-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Link href="/blog" className="nav-link self-start">
            <ArrowLeft className="h-3.5 w-3.5" />
            More writing
          </Link>
          <a
            href="mailto:Laykenv@gmail.com?subject=Re%3A%20The%20Safari%20theme-sync%20quirk%20post"
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
