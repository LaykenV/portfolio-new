'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import { ArrowDownRight, ArrowUpRight, Moon, Sun } from 'lucide-react'

import { topStack } from '@/components/designs/aggregate'
import { DesignLinks } from '@/components/designs/design-links'
import { CaseStudy } from '@/components/designs/index/case-study'
import { bricolage } from '@/components/designs/index/fonts'
import { ELSEWHERE, IDENTITY, pad } from '@/components/variants/identity'
import { posts } from '@/data/posts'
import type { Project } from '@/types/project'

import '@/components/designs/index/index.css'

/** How quickly the preview chases the pointer; 1 would be a hard snap. */
const FOLLOW = 0.16

/**
 * An editorial index. The work is a typographic table of contents: hover a row
 * and a preview trails the cursor, click and the project opens as a full-screen
 * case study you can page through. Techs along the top filter the list.
 * It owns its own paper/ink toggle so it opens on paper regardless of the
 * site-wide theme.
 */
export function IndexDesign({ projects }: { projects: Project[] }) {
  const [tone, setTone] = useState<'paper' | 'ink'>('paper')
  const [filter, setFilter] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  const peekRef = useRef<HTMLDivElement>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0 })
  const frame = useRef(0)

  const filters = useMemo(() => topStack(projects, 6).map((s) => s.name), [projects])
  const visible = useMemo(
    () => projects.map((p, i) => ({ p, i })).filter(({ p }) => !filter || p.techStack.includes(filter)),
    [projects, filter]
  )
  const selectedIndex = projects.findIndex((p) => p.slug === selected)

  useEffect(() => {
    const slug = window.location.hash.slice(1)
    if (projects.some((p) => p.slug === slug)) setSelected(slug)
  }, [projects])

  useEffect(() => {
    const hash = selected ? `#${selected}` : ''
    window.history.replaceState(null, '', `${window.location.pathname}${hash}`)
  }, [selected])

  const step = useCallback(
    (delta: 1 | -1) => {
      setSelected((cur) => {
        const i = projects.findIndex((p) => p.slug === cur)
        if (i === -1) return cur
        return projects[(i + delta + projects.length) % projects.length].slug
      })
    },
    [projects]
  )

  const animate = useCallback(() => {
    const el = peekRef.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dx = pointer.current.x - pos.current.x
    const dy = pointer.current.y - pos.current.y
    pos.current.x += reduce ? dx : dx * FOLLOW
    pos.current.y += reduce ? dy : dy * FOLLOW
    const tilt = reduce ? 0 : Math.max(-6, Math.min(6, dx * 0.03))
    el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%) rotate(${tilt}deg)`
    frame.current =
      Math.abs(dx) > 0.3 || Math.abs(dy) > 0.3 ? requestAnimationFrame(animate) : 0
  }, [])

  const track = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    pointer.current = { x: e.clientX, y: e.clientY }
    if (!frame.current) frame.current = requestAnimationFrame(animate)
  }

  useEffect(
    () => () => {
      if (frame.current) cancelAnimationFrame(frame.current)
    },
    []
  )

  return (
    <div className={`ix-root ${bricolage.variable}`} data-tone={tone}>
      <header className="ix-nav">
        <a href="#top" className="ix-nav-name">
          <span className="ix-nav-mark" aria-hidden="true">
            LV
          </span>
          {IDENTITY.name}
        </a>
        <nav aria-label="Sections" className="ix-nav-links">
          <a href="#work">Work</a>
          <a href="#writing">Writing</a>
          <a href="#contact">Contact</a>
        </nav>
        <button
          type="button"
          className="ix-tone"
          onClick={() => setTone((t) => (t === 'paper' ? 'ink' : 'paper'))}
          aria-label={tone === 'paper' ? 'Switch to dark colours' : 'Switch to light colours'}
        >
          {tone === 'paper' ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
        </button>
      </header>

      <main id="top">
        <section className="ix-hero" aria-label="Introduction">
          <p className="ix-mono ix-hero-meta">
            <span className="ix-live" aria-hidden="true" />
            Open to software engineering roles <span aria-hidden="true">·</span> Lafayette, Louisiana
          </p>
          <p className="ix-hero-line">
            I&rsquo;m Layken, a software engineer who builds{' '}
            <span className="ix-hero-pill" aria-hidden="true">
              <Image src={IDENTITY.portrait} alt="" width={240} height={240} priority />
            </span>{' '}
            whole products, <em>front to back</em>, and ships them.
          </p>
          <dl className="ix-facts">
            <div>
              <dt className="ix-mono">Award</dt>
              <dd>
                1st place, Convex Modern Stack Hackathon. <span>$10k, built in 12 days.</span>
              </dd>
            </div>
            <div>
              <dt className="ix-mono">Day job</dt>
              <dd>
                {IDENTITY.role} on U.S. Department of Labor systems. <span>React, Redux, Java.</span>
              </dd>
            </div>
            <div>
              <dt className="ix-mono">On the side</dt>
              <dd>
                {projects.length} products of my own. <span>Some with paying customers.</span>
              </dd>
            </div>
          </dl>
          <a href="#work" className="ix-scroll">
            See the work <ArrowDownRight size={18} aria-hidden="true" />
          </a>
        </section>

        <section id="work" className="ix-section" aria-labelledby="ix-work-h">
          <div className="ix-section-head">
            <h2 id="ix-work-h" className="ix-h2">
              Work <sup>({pad(projects.length)})</sup>
            </h2>
            <div className="ix-filters" role="group" aria-label="Filter by technology">
              <button type="button" aria-pressed={filter === null} onClick={() => setFilter(null)}>
                All
              </button>
              {filters.map((f) => (
                <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(filter === f ? null : f)}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <p className="sr-only" aria-live="polite">
            Showing {visible.length} of {projects.length} projects
          </p>

          <ol className="ix-rows" onPointerMove={track} onPointerLeave={() => setHovered(null)}>
            {visible.map(({ p, i }) => (
              <li key={p.slug}>
                <button
                  type="button"
                  className="ix-row"
                  onClick={() => setSelected(p.slug)}
                  onPointerEnter={(e) => {
                    if (e.pointerType !== 'mouse') return
                    setHovered(p.slug)
                    // Jump to the pointer on first entry so the preview does not fly in from a corner.
                    if (!frame.current && pos.current.x === 0 && pos.current.y === 0) {
                      pos.current = { x: e.clientX, y: e.clientY }
                      pointer.current = pos.current
                    }
                  }}
                  onFocus={() => setHovered(null)}
                >
                  <span className="ix-row-num ix-mono">{pad(i + 1)}</span>
                  <span className="ix-row-title">{p.title}</span>
                  <span className="ix-row-tag">{p.tagline}</span>
                  <span className="ix-row-stack ix-mono">{p.techStack.slice(0, 2).join(' · ')}</span>
                  <span className="ix-row-thumb" aria-hidden="true">
                    <Image src={p.image} alt="" width={160} height={90} sizes="96px" />
                  </span>
                  <ArrowUpRight className="ix-row-arrow" size={28} aria-hidden="true" />
                  {p.award && <span className="ix-row-award">{p.award.icon} {p.award.label}</span>}
                </button>
              </li>
            ))}
          </ol>
          {visible.length === 0 && <p className="ix-empty">Nothing with that tag yet.</p>}

          <div className="ix-peek" ref={peekRef} aria-hidden="true">
            {projects.map((p) => (
              <Image
                key={p.slug}
                src={p.image}
                alt=""
                width={480}
                height={270}
                sizes="360px"
                data-on={hovered === p.slug}
              />
            ))}
          </div>
        </section>

        <section id="writing" className="ix-section" aria-labelledby="ix-writing-h">
          <div className="ix-section-head">
            <h2 id="ix-writing-h" className="ix-h2">
              Writing <sup>({pad(posts.length)})</sup>
            </h2>
            <Link href="/blog" className="ix-more">
              All posts <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <ul className="ix-posts">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="ix-post">
                  <time className="ix-mono" dateTime={post.date}>
                    {post.dateReadable}
                  </time>
                  <span className="ix-post-title">{post.title}</span>
                  <span className="ix-post-meta ix-mono">{post.readMinutes} min</span>
                  <ArrowUpRight className="ix-row-arrow" size={22} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer id="contact" className="ix-foot">
        <p className="ix-mono">Contact</p>
        <h2 className="ix-foot-title">
          Let&rsquo;s build something <em>real.</em>
        </h2>
        <a className="ix-foot-mail" href={IDENTITY.email}>
          {IDENTITY.emailLabel}
          <ArrowUpRight aria-hidden="true" />
        </a>
        <ul className="ix-foot-links">
          {ELSEWHERE.map((row) => (
            <li key={row.key}>
              {row.href.startsWith('/') ? (
                <Link href={row.href}>{row.label}</Link>
              ) : (
                <a href={row.href} target="_blank" rel="noreferrer noopener">
                  {row.label}
                </a>
              )}
            </li>
          ))}
        </ul>
        <div className="ix-foot-base">
          <span className="ix-mono">© {IDENTITY.name}</span>
          <DesignLinks current="/5" className="ix-design-links" linkClassName="ix-design-link" />
        </div>
      </footer>

      {selected && selectedIndex !== -1 && (
        <CaseStudy
          project={projects[selectedIndex]}
          index={selectedIndex}
          total={projects.length}
          onClose={() => setSelected(null)}
          onStep={step}
        />
      )}
    </div>
  )
}
