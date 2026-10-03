'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { flushSync } from 'react-dom'
import { ArrowRight, ArrowUpRight, Calendar, FileText, Github, Linkedin, Mail, MapPin, Moon, Send, Sun } from 'lucide-react'

import { AnimatedThemeToggler } from '@/components/animated-theme-toggler'
import { EXPERIENCE, topStack } from '@/components/designs/aggregate'
import { outfit } from '@/components/designs/bento/fonts'
import { ProjectSheet } from '@/components/designs/bento/project-sheet'
import { DesignLinks } from '@/components/designs/design-links'
import { IDENTITY, pad } from '@/components/variants/identity'
import { posts } from '@/data/posts'
import type { Project } from '@/types/project'

import '@/components/designs/bento/bento.css'

const SHARED_NAME = 'bn-shot'

type Span = { lg: number; md: number; sm: number; rows?: number }

/** Grid placement as custom properties; the stylesheet turns them into spans per breakpoint. */
function place({ lg, md, sm, rows = 1 }: Span, hue?: number, order?: number): CSSProperties {
  return {
    '--lg': lg,
    '--md': md,
    '--sm': sm,
    '--rows': rows,
    ...(hue === undefined ? {} : { '--h': hue }),
    ...(order === undefined ? {} : { '--i': order }),
  } as CSSProperties
}

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
    </svg>
  )
}

/** Lafayette's local time, filled in after mount so the server and client markup agree. */
function useLafayetteTime() {
  const [now, setNow] = useState<{ label: string; hour: number } | null>(null)
  useEffect(() => {
    const tick = () => {
      const d = new Date()
      const label = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Chicago',
        hour: 'numeric',
        minute: '2-digit',
      }).format(d)
      const hour = Number(
        new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', hour: 'numeric', hour12: false }).format(d)
      )
      setNow({ label, hour })
    }
    tick()
    const id = window.setInterval(tick, 20_000)
    return () => window.clearInterval(id)
  }, [])
  return now
}

/**
 * A bento board: every fact about me is a tile, sized by how much it matters.
 * Projects open as a sheet that the tile's screenshot morphs into (View
 * Transitions where supported, a plain fade otherwise).
 */
export function Bento({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<string | null>(null)
  const shots = useRef(new Map<string, HTMLElement>())
  const time = useLafayetteTime()
  const stack = useMemo(() => topStack(projects, 10), [projects])
  const hero = projects.filter((p) => p.tier === 'hero')
  const rest = projects.filter((p) => p.tier !== 'hero')
  const selectedIndex = projects.findIndex((p) => p.slug === selected)

  useEffect(() => {
    const slug = window.location.hash.slice(1)
    if (projects.some((p) => p.slug === slug)) setSelected(slug)
  }, [projects])

  useEffect(() => {
    const hash = selected ? `#${selected}` : ''
    window.history.replaceState(null, '', `${window.location.pathname}${hash}`)
  }, [selected])

  const canMorph = () =>
    typeof document.startViewTransition === 'function' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const openProject = useCallback((slug: string) => {
    const shot = shots.current.get(slug)
    if (!shot || !canMorph()) {
      setSelected(slug)
      return
    }
    shot.style.viewTransitionName = SHARED_NAME
    document.startViewTransition(() => {
      shot.style.viewTransitionName = ''
      flushSync(() => setSelected(slug))
    })
  }, [])

  const closeProject = useCallback(() => {
    const shot = selected ? shots.current.get(selected) : undefined
    if (!shot || !canMorph()) {
      setSelected(null)
      return
    }
    const transition = document.startViewTransition(() => {
      flushSync(() => setSelected(null))
      shot.style.viewTransitionName = SHARED_NAME
    })
    transition.finished.finally(() => {
      shot.style.viewTransitionName = ''
    })
  }, [selected])

  const projectTile = (p: Project, big: boolean, order: number) => {
    const i = projects.indexOf(p)
    return (
      <li
        key={p.slug}
        className="bn-tile bn-project"
        data-big={big}
        style={place(big ? { lg: 6, md: 3, sm: 2 } : { lg: 3, md: 3, sm: 1 }, undefined, order)}
      >
        <button type="button" className="bn-project-btn" onClick={() => openProject(p.slug)}>
          <span
            className="bn-project-shot"
            ref={(el) => {
              if (el) shots.current.set(p.slug, el)
              else shots.current.delete(p.slug)
            }}
          >
            <Image
              src={p.image}
              alt=""
              width={960}
              height={540}
              sizes={big ? '(min-width: 1100px) 600px, 100vw' : '(min-width: 1100px) 300px, 50vw'}
            />
          </span>
          <span className="bn-project-info">
            <span className="bn-project-num">{pad(i + 1)}</span>
            <span className="bn-project-title">{p.title}</span>
            <span className="bn-project-tag">{p.tagline}</span>
            {p.award && (
              <span className="bn-award">
                <span aria-hidden="true">{p.award.icon}</span> {p.award.label}
              </span>
            )}
          </span>
          <span className="bn-project-go" aria-hidden="true">
            <ArrowUpRight size={18} />
          </span>
          <span className="sr-only">Open {p.title} details</span>
        </button>
      </li>
    )
  }

  const night = time ? time.hour < 6 || time.hour >= 20 : false

  return (
    <div className={`bn-root ${outfit.variable}`}>
      <header className="bn-top">
        <a href="#top" className="bn-top-logo" aria-label="Layken Varholdt, top of page">
          LV
        </a>
        <nav aria-label="Sections" className="bn-top-nav">
          <a href="#work">Work</a>
          <a href="#notes">Notes</a>
          <a href="#contact">Contact</a>
        </nav>
        <AnimatedThemeToggler className="bn-theme" />
      </header>

      <main id="top" className="bn-wrap">
        <h2 className="sr-only">About</h2>
        <ul className="bn-grid bn-grid-a">
          <li className="bn-tile bn-identity" style={place({ lg: 5, md: 6, sm: 2, rows: 3 }, 275, 0)}>
            <Image
              src={IDENTITY.portrait}
              alt="Layken Varholdt"
              fill
              sizes="(min-width: 1100px) 480px, 100vw"
              priority
              className="bn-identity-img"
            />
            <div className="bn-identity-body">
              <p className="bn-pill">
                <span className="bn-pulse" aria-hidden="true" /> Open to roles
              </p>
              <p className="bn-name">
                Layken
                <br />
                Varholdt
              </p>
              <p className="bn-role">Software engineer</p>
            </div>
          </li>

          <li className="bn-tile bn-bio" style={place({ lg: 4, md: 6, sm: 2, rows: 2 }, 250, 1)}>
            <p className="bn-eyebrow">Hello</p>
            <p className="bn-bio-text">
              I build production web apps <em>front to back</em>. Federal React and Java by day, my own AI and SaaS
              products by night.
            </p>
          </li>

          <li className="bn-tile bn-award-tile" style={place({ lg: 3, md: 2, sm: 1 }, 80, 2)}>
            <p className="bn-big">
              <span className="bn-trophy" aria-hidden="true">
                🥇
              </span>
              1st
            </p>
            <p className="bn-tile-sub">Convex Modern Stack Hackathon. $10k, built in 12 days.</p>
          </li>

          <li className="bn-tile bn-stat" style={place({ lg: 3, md: 2, sm: 1 }, 160, 3)}>
            <p className="bn-big bn-big-sm">{pad(projects.length)}</p>
            <p className="bn-tile-sub">products shipped</p>
          </li>

          <li className="bn-tile bn-clock" style={place({ lg: 3, md: 2, sm: 2 }, 200, 4)}>
            <p className="bn-eyebrow">
              <MapPin size={13} aria-hidden="true" /> Lafayette, LA
            </p>
            <p className="bn-time" aria-live="off">
              {time ? time.label : '–:––'}
              {night ? <Moon size={20} aria-hidden="true" /> : <Sun size={20} aria-hidden="true" />}
            </p>
          </li>

          <li className="bn-tile bn-links" style={place({ lg: 4, md: 6, sm: 2 }, 300, 5)}>
            <a className="bn-btn bn-btn-solid" href={IDENTITY.email}>
              <Mail size={16} aria-hidden="true" /> Hire me
            </a>
            <ul className="bn-icons" aria-label="Profiles">
              {[
                { href: IDENTITY.resume, label: 'Résumé', icon: <FileText size={18} /> },
                { href: IDENTITY.github, label: 'GitHub', icon: <Github size={18} /> },
                { href: IDENTITY.linkedin, label: 'LinkedIn', icon: <Linkedin size={18} /> },
                { href: IDENTITY.x, label: 'X', icon: <XIcon /> },
                { href: IDENTITY.cal, label: 'Book a call', icon: <Calendar size={18} /> },
                { href: IDENTITY.telegram, label: 'Telegram', icon: <Send size={18} /> },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noreferrer noopener" aria-label={l.label} title={l.label}>
                    {l.icon}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        </ul>

        <section id="work" aria-labelledby="bn-work-h" className="bn-section">
          <div className="bn-section-head">
            <h2 id="bn-work-h">Selected work</h2>
            <p>Tap a tile for the details.</p>
          </div>
          <ul className="bn-grid bn-grid-b">
            {hero.map((p, i) => projectTile(p, true, i))}
            {rest.map((p, i) => projectTile(p, false, i + hero.length))}
          </ul>
        </section>

        <section id="notes" aria-labelledby="bn-notes-h" className="bn-section">
          <div className="bn-section-head">
            <h2 id="bn-notes-h">Background and writing</h2>
            <p>What I do all day, what I use, and what I write about it.</p>
          </div>
          <ul className="bn-grid bn-grid-c">
            <li className="bn-tile bn-exp" style={place({ lg: 5, md: 6, sm: 2 }, 240, 0)}>
              <p className="bn-eyebrow">Now</p>
              <h3 className="bn-tile-title">
                {EXPERIENCE.title}, {EXPERIENCE.company}
              </h3>
              <p className="bn-tile-sub">Client: {EXPERIENCE.client}</p>
              <ul className="bn-ticks">
                {EXPERIENCE.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </li>

            <li className="bn-tile bn-stack" style={place({ lg: 7, md: 6, sm: 2 }, 150, 1)}>
              <p className="bn-eyebrow">Most used</p>
              <h3 className="bn-tile-title">Across {projects.length} products</h3>
              <ul className="bn-cloud">
                {stack.map((s) => (
                  <li key={s.name} style={{ '--w': s.count } as CSSProperties}>
                    {s.name}
                    <span>{s.count}</span>
                  </li>
                ))}
              </ul>
            </li>

            <li className="bn-tile bn-writing" style={place({ lg: 12, md: 6, sm: 2 }, 330, 2)}>
              <div className="bn-writing-head">
                <h3 className="bn-tile-title">Writing</h3>
                <Link href="/blog" className="bn-more">
                  All posts <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
              <ul className="bn-posts">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <Link href={`/blog/${post.slug}`}>
                      <time dateTime={post.date}>{post.dateReadable}</time>
                      <span className="bn-post-title">{post.title}</span>
                      <span className="bn-post-meta">{post.readMinutes} min read</span>
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </section>

        <section id="contact" className="bn-contact" aria-labelledby="bn-contact-h">
          <p className="bn-eyebrow">Contact</p>
          <h2 id="bn-contact-h" className="bn-contact-title">
            Got something worth building?
          </h2>
          <a className="bn-btn bn-btn-light bn-btn-lg" href={IDENTITY.email}>
            {IDENTITY.emailLabel} <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <a className="bn-contact-alt" href={IDENTITY.cal} target="_blank" rel="noreferrer noopener">
            or book a call
          </a>
        </section>
      </main>

      <footer className="bn-foot">
        <span>© {IDENTITY.name}</span>
        <DesignLinks current="/6" className="bn-design-links" linkClassName="bn-design-link" />
      </footer>

      {selected && selectedIndex !== -1 && (
        <ProjectSheet
          project={projects[selectedIndex]}
          index={selectedIndex}
          total={projects.length}
          onRequestClose={closeProject}
          onClosed={() => setSelected(null)}
        />
      )}
    </div>
  )
}
