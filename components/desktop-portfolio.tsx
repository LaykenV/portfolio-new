'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarClock,
  ChevronDown,
  FileText,
  Github,
  Linkedin,
  Mail,
  Send,
  Trophy,
} from 'lucide-react'

import { AnimatedThemeToggler } from '@/components/animated-theme-toggler'
import { FounderIntro } from '@/components/founder-intro'
import type { Project, ProjectTier } from '@/types/project'

/** Rail groupings, in render order. */
const TIER_LABELS: Array<[ProjectTier, string]> = [
  ['hero', 'Selected work'],
  ['featured', 'More work'],
  ['more', 'Also built'],
]

/* Identity content shared by the rail and the control panel. */
const IDENTITY = {
  name: 'Layken Varholdt',
  role: 'Software engineer',
  email: 'mailto:layken@varholdt.com?subject=Software%20Engineering%20role',
  emailLabel: 'layken@varholdt.com',
  resume: '/Layken-Varholdt-Software-Engineer-Resume.pdf',
  x: 'https://x.com/LLVarholdt',
  github: 'https://github.com/laykenV',
  linkedin: 'https://www.linkedin.com/in/layken-varholdt-a78687230/',
  cal: 'https://cal.com/layken-varholdt',
  telegram: 'https://t.me/LLVarholdt',
  blog: '/blog',
} as const

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 16 16"
      className={className}
    >
      <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
    </svg>
  )
}

function Portrait({ size }: { size: number }) {
  return (
    <div className="avatar-ring flex-shrink-0">
      <div className="overflow-hidden" style={{ height: size, width: size }}>
        <Image
          src="/portrait.jpeg"
          alt="Layken Varholdt's profile portrait"
          width={size * 2}
          height={size * 2}
          className="object-cover"
        />
      </div>
    </div>
  )
}

/** Hostname of the live site, used as the faux URL in the browser chrome. */
function shotDomain(project: Project): string {
  const url = project.links.live ?? project.links.github
  if (!url) return 'localhost:3000'
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return 'localhost:3000'
  }
}

type ShotView = 'landing' | 'app'

const SHOT_VIEWS: Array<[ShotView, string]> = [
  ['landing', 'Landing'],
  ['app', 'The app'],
]

/** The selected screenshot view is shared across all seven projects. */
function ProjectShot({
  project,
  view,
  onViewChange,
}: {
  project: Project
  view: ShotView
  onViewChange: (view: ShotView) => void
}) {
  // Sticky: once the interior has been mounted it stays, so flipping back and
  // forth after the first selection costs nothing. Next/Image is lazy by default,
  // so mounting the offscreen bands' interiors does not fetch them until they
  // scroll near the viewport.
  const [appMounted, setAppMounted] = useState(view === 'app')
  const segRefs = useRef<Array<HTMLButtonElement | null>>([])
  const domain = shotDomain(project)

  useEffect(() => {
    if (view === 'app') setAppMounted(true)
  }, [view])

  const select = (next: ShotView) => {
    if (next === 'app') setAppMounted(true)
    onViewChange(next)
  }

  // Left/right walk the switch the way a native radio group does.
  const onKeyDown = (e: KeyboardEvent) => {
    const i = SHOT_VIEWS.findIndex(([v]) => v === view)
    let next = i
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % SHOT_VIEWS.length
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
      next = (i - 1 + SHOT_VIEWS.length) % SHOT_VIEWS.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = SHOT_VIEWS.length - 1
    else return
    e.preventDefault()
    select(SHOT_VIEWS[next][0])
    segRefs.current[next]?.focus()
  }

  return (
    <figure className="dp-shot mt-6 max-w-[50rem]">
      <div className="dp-chrome">
        {/* The hostname follows the selected screenshot. */}
        <span className="dp-chrome-url" aria-hidden="true">
          {domain}
          {view === 'app' && <span className="dp-chrome-path">/app</span>}
        </span>

        <div
          className="dp-shot-switch"
          data-view={view}
          role="group"
          aria-label={`${project.title} screenshot view`}
          onKeyDown={onKeyDown}
          onPointerEnter={() => setAppMounted(true)}
          onFocus={() => setAppMounted(true)}
        >
          {SHOT_VIEWS.map(([v, label], i) => {
            const isActive = v === view
            return (
              <button
                key={v}
                type="button"
                ref={(el) => {
                  segRefs.current[i] = el
                }}
                className="dp-shot-seg"
                aria-pressed={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => select(v)}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="dp-shot-media aspect-[16/9]">
        <Image
          src={project.image}
          alt={`${project.title} landing page`}
          fill
          className="dp-shot-img"
          style={{ opacity: view === 'landing' ? 1 : 0 }}
          aria-hidden={view !== 'landing'}
          sizes="(min-width: 1280px) 800px, 60vw"
        />
        {appMounted && (
          <>
            <Image
              src={project.secondaryImage}
              alt={`${project.title} application interface`}
              fill
              className="dp-shot-img dp-shot-img-top"
              style={{ opacity: view === 'app' ? 1 : 0 }}
              aria-hidden={view !== 'app'}
              sizes="(min-width: 1280px) 800px, 60vw"
            />

          </>
        )}
      </div>
    </figure>
  )
}

export function DesktopPortfolio({ projects }: { projects: Project[] }) {
  const [activeSlug, setActiveSlug] = useState(projects[0]?.slug ?? '')
  // Shared by every band: switching one project switches all of them, so a
  // visitor who wants to see interiors asks once.
  const [shotView, setShotView] = useState<ShotView>('landing')
  const scrollRef = useRef<HTMLDivElement>(null)
  const bandRefs = useRef<Map<string, HTMLElement>>(new Map())

  useEffect(() => {
    const root = scrollRef.current
    if (!root) return

    const observer = new IntersectionObserver(
      (entries) => {
        // The visible band nearest the top of the reading area wins.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        const slug = visible[0]?.target.getAttribute('data-slug')
        if (slug) setActiveSlug(slug)
      },
      { root, rootMargin: '-15% 0px -70% 0px', threshold: 0 }
    )

    bandRefs.current.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [projects])

  const scrollTo = (slug: string) => {
    const el = bandRefs.current.get(slug)
    const root = scrollRef.current
    if (!el || !root) return
    root.scrollTo({ top: el.offsetTop - 24, behavior: 'smooth' })
  }

  const activePosition = projects.findIndex((p) => p.slug === activeSlug) + 1
  // Rail items are grouped by tier but keep their overall position number.
  const position = new Map(projects.map((p, i) => [p.slug, i + 1]))

  return (
    <div className="dp-root dp-grid hidden md:grid mx-auto max-w-[130rem]">
      {/* ---------- Index rail (lg+) ---------- */}
      <aside className="dp-col hidden xl:flex flex-col border-r dp-hairline py-7 overflow-hidden">
        <div className="dp-identity dp-identity-section px-5 pb-6 flex-shrink-0">
          <div className="flex w-full items-center justify-between">
            <Portrait size={64} />
            <AnimatedThemeToggler className="dp-theme-toggle" />
          </div>
          <div className="min-w-0">
            <p className="dp-identity-name">{IDENTITY.name}</p>
            <p className="dp-identity-role mt-1">
              {IDENTITY.role}
            </p>
          </div>
          <FounderIntro />
        </div>

        <nav className="dp-project-index dp-scroll flex-1 min-h-0 pt-5" aria-label="Project index">
          {TIER_LABELS.map(([tier, label]) => {
            const group = projects.filter((p) => p.tier === tier)
            if (group.length === 0) return null
            // The label is deliberately not a heading — the reading column
            // owns the document outline; this just names a nav group.
            return (
              <div key={tier} className="dp-rail-group" role="group" aria-label={label}>
                <div className="dp-rail-heading">
                  <p className="dp-rail-label">{label}</p>
                  {tier === 'hero' && (
                    <span className="dp-mono text-xs text-[var(--muted)] tabular-nums">
                      {pad(activePosition)} / {pad(projects.length)}
                    </span>
                  )}
                </div>
                {group.map((p) => {
                  const isActive = p.slug === activeSlug
                  return (
                    <button
                      key={p.slug}
                      className={`dp-nav-item ${isActive ? 'dp-nav-active' : ''}`}
                      onClick={() => scrollTo(p.slug)}
                      aria-current={isActive}
                    >
                      <span className="dp-nav-num">{pad(position.get(p.slug) ?? 0)}</span>
                      <span className="dp-nav-title">
                        <span>{p.title}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            )
          })}
        </nav>

      </aside>

      {/* ---------- Reading column ---------- */}
      <main ref={scrollRef} className="dp-col dp-scroll px-6 lg:px-10 xl:px-16 py-10 xl:py-12">
        <div className="max-w-[58rem]">
          {projects.map((project) => (
            <section
              key={project.slug}
              data-slug={project.slug}
              ref={(el) => {
                if (el) bandRefs.current.set(project.slug, el)
                else bandRefs.current.delete(project.slug)
              }}
              className="dp-band"
              aria-labelledby={`band-${project.slug}`}
            >
              <div className="flex items-start justify-between gap-8">
                <div className="min-w-0">
                  <h2 id={`band-${project.slug}`} className="dp-display">
                    {project.title}
                  </h2>
                  <p className="dp-tagline mt-2">{project.tagline}</p>
                  {project.award && (
                    <div className="mt-3">
                      <span className="dp-award">
                        <Trophy size={14} aria-hidden="true" />
                        {project.award.label}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <ProjectShot project={project} view={shotView} onViewChange={setShotView} />

              <div className="dp-summary mt-6">
                <p className="dp-body">{project.description}</p>
                <details className="dp-details mt-2">
                  <summary>
                    How it works
                    <ChevronDown size={14} aria-hidden="true" />
                  </summary>
                  <div className="dp-account mt-3">
                    {project.longDescription.split('\n\n').map((paragraph) => (
                      <p key={paragraph} className="dp-body">{paragraph}</p>
                    ))}
                  </div>
                </details>
              </div>

              <dl className="dp-meta mt-6">
                <dt className="dp-meta-k">Stack</dt>
                <dd className="dp-meta-v">
                  <div className="flex flex-wrap gap-2.5">
                    {project.techStack.map((t) => (
                      <span key={t} className="tech-badge-compact">
                        {t}
                      </span>
                    ))}
                  </div>
                </dd>

                <dt className="dp-meta-k">Links</dt>
                <dd className="dp-meta-v">
                  <div className="flex flex-wrap items-center gap-4">
                    {project.links.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="post-link"
                      >
                        {shotDomain(project)}
                      </a>
                    )}
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="post-link"
                      >
                        Source
                      </a>
                    )}
                    {!project.links.live && !project.links.github && (
                      <span className="opacity-50">Private</span>
                    )}
                  </div>
                </dd>
              </dl>
            </section>
          ))}
        </div>
      </main>

      {/* ---------- Floating control panel ---------- */}
      <div className="dp-col dp-control-col dp-scroll relative py-7">
        {/* Below xl the identity and compact project index share this column. */}
        <div className="dp-compact-identity dp-compact-identity-row xl:hidden mb-3">
          <Portrait size={48} />
          <div className="min-w-0">
            <p className="text-[20px] font-bold tracking-tight leading-tight whitespace-nowrap">{IDENTITY.name}</p>
            <p className="dp-identity-role">{IDENTITY.role}</p>
          </div>
          <AnimatedThemeToggler className="dp-theme-toggle" />
        </div>

        <ControlPanel
          projectPicker={
          <label className="dp-project-picker relative block xl:hidden">
            <span className="dp-panel-label dp-picker-label">
              Selected work
              <span>{pad(activePosition)} / {pad(projects.length)}</span>
            </span>
            <select
              value={activeSlug}
              onChange={(event) => scrollTo(event.target.value)}
              aria-label="Choose a project"
            >
              {projects.map((project, index) => (
                <option key={project.slug} value={project.slug}>
                  {pad(index + 1)} {project.title}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-3 bottom-4 text-[var(--muted)]" aria-hidden="true" />
          </label>
          }
        />
      </div>
    </div>
  )
}

function ControlPanel({ projectPicker }: { projectPicker: ReactNode }) {
  return (
    <div className="dp-panel">
      <section className="dp-panel-section xl:hidden">
        <FounderIntro />
      </section>

      {projectPicker}

      <section className="dp-panel-section">
        <div className="dp-contact-heading">
          <p className="dp-panel-label">Contact</p>
        </div>
        <p className="dp-panel-availability">Open to software engineering roles</p>

        <a href={IDENTITY.email} className="dp-panel-row dp-panel-row-primary">
          <span className="dp-panel-icon">
            <Mail className="h-[0.95rem] w-[0.95rem]" />
          </span>
          <span>{IDENTITY.emailLabel}</span>
          <ArrowUpRight className="dp-panel-arrow h-3.5 w-3.5" />
        </a>

        <a href={IDENTITY.cal} target="_blank" rel="noreferrer" className="dp-panel-row">
          <span className="dp-panel-icon">
            <CalendarClock className="h-[0.95rem] w-[0.95rem]" />
          </span>
          <span>Book a call</span>
          <ArrowUpRight className="dp-panel-arrow h-3.5 w-3.5" />
        </a>

        <a href={IDENTITY.telegram} target="_blank" rel="noreferrer" className="dp-panel-row">
          <span className="dp-panel-icon">
            <Send className="h-[0.95rem] w-[0.95rem]" />
          </span>
          <span>Telegram</span>
          <ArrowUpRight className="dp-panel-arrow h-3.5 w-3.5" />
        </a>
      </section>

      <section className="dp-panel-section">
        <p className="dp-panel-label">Elsewhere</p>

        <a href={IDENTITY.resume} target="_blank" rel="noreferrer" className="dp-panel-row">
          <span className="dp-panel-icon">
            <FileText className="h-[0.95rem] w-[0.95rem]" />
          </span>
          <span>Résumé</span>
          <ArrowUpRight className="dp-panel-arrow h-3.5 w-3.5" />
        </a>

        <a href={IDENTITY.github} target="_blank" rel="noreferrer" className="dp-panel-row">
          <span className="dp-panel-icon">
            <Github className="h-[0.95rem] w-[0.95rem]" />
          </span>
          <span>GitHub</span>
          <ArrowUpRight className="dp-panel-arrow h-3.5 w-3.5" />
        </a>

        <a href={IDENTITY.linkedin} target="_blank" rel="noreferrer" className="dp-panel-row">
          <span className="dp-panel-icon">
            <Linkedin className="h-[0.95rem] w-[0.95rem]" />
          </span>
          <span>LinkedIn</span>
          <ArrowUpRight className="dp-panel-arrow h-3.5 w-3.5" />
        </a>

        <a href={IDENTITY.x} target="_blank" rel="noreferrer" className="dp-panel-row">
          <span className="dp-panel-icon">
            <XIcon className="h-3.5 w-3.5" />
          </span>
          <span>Twitter / X</span>
          <ArrowUpRight className="dp-panel-arrow h-3.5 w-3.5" />
        </a>

        <a href={IDENTITY.blog} className="dp-panel-row">
          <span className="dp-panel-icon">
            <BookOpen className="h-[0.95rem] w-[0.95rem]" />
          </span>
          <span>Blog</span>
          <ArrowRight className="dp-panel-arrow h-3.5 w-3.5" />
        </a>
      </section>
    </div>
  )
}
