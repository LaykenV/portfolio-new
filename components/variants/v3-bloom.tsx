'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import { AnimatedThemeToggler } from '@/components/animated-theme-toggler'
import { IDENTITY, ELSEWHERE, liveHost, pad } from '@/components/variants/identity'
import { fraunces } from '@/components/variants/fonts'
import type { Project } from '@/types/project'

import '@/components/variants/tokens.css'
import '@/components/variants/v3.css'

/** Each build owns a hue; reading down the page walks violet toward amber. */
const HUE_START = 300
const HUE_STEP = 30
/** Must match --reel-step in v3.css. */
const REEL_STEP_REM = 3.25
/** Where down the viewport a panel counts as "the one being read". */
const READING_LINE = 0.45

/**
 * A sticky reading rail against a scrolling column of work. The rail never
 * moves — it holds who I am, which build you're on, and how to reach me — while
 * the right side advances one project at a time. The background is the third
 * participant: every project owns a hue, and the ambient bloom crossfades
 * toward it as its panel takes the viewport, so the page changes temperature as
 * you read down it.
 */
export function V3Bloom({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const panelRefs = useRef<Array<HTMLElement | null>>([])

  /*
   * Active panel and scroll progress come from one rAF-throttled read of
   * geometry rather than from an IntersectionObserver. Thresholded observers
   * only report the entries that *changed*, so picking a winner by comparing
   * ratios across a callback flickers whenever two panels cross a threshold in
   * the same frame. Measuring every panel against a fixed reading line is
   * deterministic: the same scroll position always yields the same answer.
   */
  useEffect(() => {
    let frame = 0

    const read = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)

      const line = window.innerHeight * READING_LINE
      let best = 0
      let bestDistance = Infinity
      panelRefs.current.forEach((el, i) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        const distance = Math.abs((rect.top + rect.bottom) / 2 - line)
        if (distance < bestDistance) {
          bestDistance = distance
          best = i
        }
      })
      // React bails out when the value is unchanged, so this is a no-op on
      // the vast majority of frames.
      setActive(best)
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }

    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [projects.length])

  /* One-shot reveal. An observer is the right tool here precisely because the
     result is latched — once a panel has been seen it stays seen. */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-seen', '')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '-8% 0px -8% 0px' }
    )
    panelRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [projects.length])

  const jump = useCallback((i: number) => {
    panelRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  /** Cursor parallax on the plate under the pointer — read, never stored. */
  const tilt = (e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--tx', `${((e.clientX - rect.left) / rect.width - 0.5) * 2}`)
    el.style.setProperty('--ty', `${((e.clientY - rect.top) / rect.height - 0.5) * 2}`)
  }

  const untilt = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty('--tx', '0')
    e.currentTarget.style.setProperty('--ty', '0')
  }

  const current = projects[active]

  return (
    <div
      className={`v3-root hidden md:block ${fraunces.variable}`}
      style={{ '--bloom-hue': HUE_START - active * HUE_STEP } as React.CSSProperties}
    >
      <div className="v3-aurora" aria-hidden="true">
        <span className="v3-blob v3-blob-a" />
        <span className="v3-blob v3-blob-b" />
        <span className="v3-blob v3-blob-c" />
        <span className="v3-grain" />
      </div>

      <AnimatedThemeToggler className="v3-toggle" />

      {/* ---------- Opening ---------- */}
      <section className="v3-open" aria-labelledby="v3-open-h">
        <div>
          <div className="v3-open-portrait">
            <span className="v3-open-halo" aria-hidden="true" />
            <Image
              src={IDENTITY.portrait}
              alt="Layken Varholdt"
              width={640}
              height={640}
              priority
            />
          </div>
          <p className="v3-open-status">Open to new roles</p>
        </div>

        <div className="v3-open-body">
          <p className="v3-open-eyebrow">
            {IDENTITY.role} <span aria-hidden="true">·</span> {IDENTITY.employer}
          </p>

          <h2 id="v3-open-h" className="v3-open-title">
            I&rsquo;m Layken. I build the <em>unglamorous middle</em>.
          </h2>

          <p className="v3-open-stand">
            The pipelines, state machines and billing edges that decide whether a
            product survives contact with real users.
          </p>

          <div className="v3-open-prose">
            <p>
              I write React, TypeScript and Java for a living, and spend the rest
              of my time shipping my own products — mostly applied AI wired into
              workflows people actually have to get through.
            </p>
            <p>
              Two of those products are real businesses rather than side
              projects: a web platform with paying customers, and an automation
              practice for document-heavy local firms. The {projects.length}{' '}
              builds below are the ones I&rsquo;d defend line by line in a code
              review.
            </p>
          </div>

          <dl className="v3-open-facts">
            <div>
              <dt>Now</dt>
              <dd>{IDENTITY.employer}</dd>
            </div>
            <div>
              <dt>Running</dt>
              <dd>Acadiana Web Design, a WaaS platform with paying customers</dd>
            </div>
            <div>
              <dt>Recent</dt>
              <dd>1st place, Convex Modern Stack Hackathon</dd>
            </div>
          </dl>

          <div className="v3-open-cta">
            <a className="v3-btn v3-btn-primary" href={IDENTITY.email}>
              {IDENTITY.emailLabel}
            </a>
            <a className="v3-btn" href={IDENTITY.resume} target="_blank" rel="noreferrer">
              Résumé
            </a>
            <a className="v3-btn" href={IDENTITY.cal} target="_blank" rel="noreferrer">
              Book a call
            </a>
          </div>
        </div>
      </section>

      {/* ---------- Work ---------- */}
      <div className="v3-stage">
        <aside className="v3-rail">
          <header className="v3-rail-head">
            <p className="v3-rail-name">{IDENTITY.name}</p>
            <p className="v3-rail-role">{IDENTITY.role}</p>
            <span className="v3-meter" aria-hidden="true">
              <span className="v3-meter-fill" style={{ transform: `scaleX(${progress})` }} />
            </span>
          </header>

          <nav className="v3-reel" aria-label="Projects">
            <ol
              className="v3-reel-list"
              style={{ transform: `translateY(${-active * REEL_STEP_REM}rem)` }}
            >
              {projects.map((project, i) => (
                <li key={project.slug} className="v3-reel-item">
                  <button
                    type="button"
                    className="v3-reel-btn"
                    data-active={i === active || undefined}
                    aria-current={i === active ? 'true' : undefined}
                    tabIndex={Math.abs(i - active) > 2 ? -1 : 0}
                    onClick={() => jump(i)}
                  >
                    {project.title}
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          {current && (
            <div className="v3-rail-meta" key={current.slug}>
              <p className="v3-rail-tag">{current.tagline}</p>
              {current.award && (
                <p className="v3-rail-award">
                  <span aria-hidden="true">{current.award.icon ?? '🏅'}</span>
                  {current.award.label}
                </p>
              )}
              <ul className="v3-rail-stack">
                {current.techStack.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
              <div className="v3-rail-links">
                {current.links.live && (
                  <a
                    href={current.links.live}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="v3-rail-link"
                  >
                    {liveHost(current)}
                  </a>
                )}
                {current.links.github && (
                  <a
                    href={current.links.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="v3-rail-link"
                  >
                    Source
                  </a>
                )}
              </div>
            </div>
          )}

          <footer className="v3-rail-foot">
            <a className="v3-btn v3-btn-primary v3-btn-block" href={IDENTITY.email}>
              Hire me
            </a>
            <p className="v3-rail-count">
              {pad(active + 1)} <span aria-hidden="true">/</span> {pad(projects.length)}
            </p>
          </footer>
        </aside>

        <div className="v3-panels">
          {projects.map((project, i) => (
            <section
              key={project.slug}
              ref={(el) => {
                panelRefs.current[i] = el
              }}
              className="v3-panel"
              style={{ '--panel-hue': HUE_START - i * HUE_STEP } as React.CSSProperties}
              aria-labelledby={`v3-h-${project.slug}`}
            >
              <div className="v3-plate" onPointerMove={tilt} onPointerLeave={untilt}>
                <span className="v3-plate-glow" aria-hidden="true" />
                <figure className="v3-figure v3-figure-back">
                  <Image
                    src={project.secondaryImage}
                    alt={`${project.title} application interface`}
                    width={1280}
                    height={720}
                    sizes="26vw"
                  />
                </figure>
                <figure className="v3-figure v3-figure-front">
                  <Image
                    src={project.image}
                    alt={`${project.title} landing page`}
                    width={1440}
                    height={810}
                    sizes="46vw"
                  />
                </figure>
              </div>

              <div className="v3-copy">
                <div className="v3-copy-head">
                  <h3 id={`v3-h-${project.slug}`} className="v3-copy-title">
                    {project.title}
                  </h3>
                  <span className="v3-copy-num" aria-hidden="true">
                    {pad(i + 1)} / {pad(projects.length)}
                  </span>
                </div>
                <p className="v3-copy-body">{project.longDescription}</p>
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* ---------- Sign-off ---------- */}
      <section className="v3-outro" aria-labelledby="v3-outro-h">
        <h3 id="v3-outro-h" className="v3-outro-title">
          Let&rsquo;s <em>talk</em>.
        </h3>
        <p className="v3-outro-sub">{IDENTITY.headline}.</p>
        <a className="v3-btn v3-btn-primary v3-btn-lg" href={IDENTITY.email}>
          {IDENTITY.emailLabel}
        </a>
        <nav className="v3-outro-links" aria-label="Profiles">
          {ELSEWHERE.map((row) =>
            row.href.startsWith('/') ? (
              <Link key={row.key} href={row.href} className="v3-outro-link">
                {row.label}
              </Link>
            ) : (
              <a
                key={row.key}
                href={row.href}
                target="_blank"
                rel="noreferrer noopener"
                className="v3-outro-link"
              >
                {row.label}
              </a>
            )
          )}
        </nav>
      </section>
    </div>
  )
}
