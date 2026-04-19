'use client'

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type TouchEvent as ReactTouchEvent,
} from 'react'
import Image from 'next/image'
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarClock,
  ChevronDown,
  ChevronLeft,
  ExternalLink,
  Github,
  Mail,
} from 'lucide-react'

import type { Project } from '@/types/project'
import { MobileMenuController } from '@/components/mobile-menu-controller'
import { cn } from '@/lib/utils'

interface MobilePortfolioProps {
  projects: Project[]
}

function haptic(ms = 8) {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(ms)
    }
  } catch {}
}

const HINT_STORAGE_KEY = 'mobile-swipe-hint-v1'
/** Total keyframe duration for the hint overlay cycle (CSS-matched). */
const HINT_CYCLE_MS = 2600
/** Button fade-in duration, matched to CSS so the controls finish appearing
 *  exactly as the hint overlay completes its exit. */
const HINT_BUTTON_FADE_MS = 320
/** Debounce between activeIndex settling and the hint firing — lets the
 *  vertical snap-scroll complete before the teach plays. */
const HINT_ARM_DELAY_MS = 500

export function MobilePortfolio({ projects }: MobilePortfolioProps) {
  const deckRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [deepDiveSlug, setDeepDiveSlug] = useState<string | null>(null)
  const [hintQueueSlot, setHintQueueSlot] = useState<number | null>(null)
  const [hintSlot, setHintSlot] = useState<number | null>(null)
  // Keep the initial server and client render identical; we decide whether to
  // run the hint only after mount once browser APIs are available.
  const [hintPending, setHintPending] = useState(false)
  const [hintReady, setHintReady] = useState(false)

  // total slots = about (index 0) + each project
  const total = projects.length + 1

  useEffect(() => {
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setHintPending(false)
        return
      }
      setHintPending(window.localStorage.getItem(HINT_STORAGE_KEY) !== 'true')
    } catch {
      setHintPending(false)
    } finally {
      setHintReady(true)
    }
  }, [])

  // Lock the teach-in to the first eligible project slide before paint so its
  // action buttons never flash in ahead of the indicator.
  useLayoutEffect(() => {
    if (!hintReady) return
    if (!hintPending) return
    if (hintQueueSlot !== null) return
    if (hintSlot !== null) return // already in-flight
    if (activeIndex < 1) return

    setHintQueueSlot(activeIndex)
  }, [activeIndex, hintPending, hintQueueSlot, hintReady, hintSlot])

  // First time the user lands on any project slide, wait for the snap to
  // settle and then play the action-bar hint on that slide.
  useEffect(() => {
    if (!hintReady) return
    if (!hintPending) return
    if (hintQueueSlot === null) return

    const slot = hintQueueSlot
    let revealTimer: number | null = null
    let cleanupTimer: number | null = null
    const armTimer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(HINT_STORAGE_KEY, 'true')
      } catch {}
      setHintSlot(slot)
      // Start the button fade so it completes exactly as the overlay exits.
      revealTimer = window.setTimeout(
        () => setHintPending(false),
        HINT_CYCLE_MS - HINT_BUTTON_FADE_MS,
      )
      cleanupTimer = window.setTimeout(() => {
        setHintSlot((prev) => (prev === slot ? null : prev))
        setHintQueueSlot((prev) => (prev === slot ? null : prev))
      }, HINT_CYCLE_MS)
    }, HINT_ARM_DELAY_MS)

    return () => {
      window.clearTimeout(armTimer)
      if (revealTimer !== null) window.clearTimeout(revealTimer)
      if (cleanupTimer !== null) window.clearTimeout(cleanupTimer)
    }
  }, [hintPending, hintQueueSlot, hintReady])

  const jumpTo = useCallback((slotIndex: number) => {
    const deck = deckRef.current
    if (!deck) return
    const target = slideRefs.current[slotIndex]
    if (!target) return
    deck.scrollTo({ top: target.offsetTop, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const deck = deckRef.current
    if (!deck) return
    const slides = slideRefs.current.filter(Boolean) as HTMLElement[]
    if (slides.length === 0) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
            const idx = slides.indexOf(entry.target as HTMLElement)
            if (idx !== -1) setActiveIndex(idx)
          }
        }
      },
      { root: deck, threshold: [0.5, 0.6, 0.75] },
    )
    slides.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [total])

  const currentProject = useMemo(
    () => projects.find((p) => p.slug === deepDiveSlug) ?? null,
    [projects, deepDiveSlug],
  )

  // Lock body when deep dive is open
  useEffect(() => {
    if (!currentProject) return
    const { body, documentElement } = document
    const prev = { body: body.style.overflow, html: documentElement.style.overflow }
    body.style.overflow = 'hidden'
    documentElement.style.overflow = 'hidden'
    return () => {
      body.style.overflow = prev.body
      documentElement.style.overflow = prev.html
    }
  }, [currentProject])

  // Escape closes deep dive
  useEffect(() => {
    if (!currentProject) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDeepDiveSlug(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [currentProject])

  const viewingProject = activeIndex > 0

  return (
    <div className="mobile-portfolio">
      <div className="m-browser-edge m-browser-edge-top" aria-hidden="true" />
      <div className="m-browser-edge m-browser-edge-bottom" aria-hidden="true" />

      {/* Top chrome — always visible (brand hidden on about slide) */}
      <header className="m-topbar">
        <button
          type="button"
          className={cn('m-topbar-brand', !viewingProject && 'm-topbar-brand-hidden')}
          onClick={() => {
            haptic(6)
            jumpTo(0)
          }}
          tabIndex={viewingProject ? 0 : -1}
          aria-label="Scroll back to the about section"
        >
          <span className="m-brand-portrait">
            <Image
              src="/portrait.jpeg"
              alt="Layken Varholdt"
              width={32}
              height={32}
              priority
              draggable={false}
            />
          </span>
          <span className="m-brand-text">Layken Varholdt</span>
        </button>
        <MobileMenuController className="m-topbar-menu" />
      </header>

      {/* Deck: vertical snap scroller (about slide + project slides) */}
      <div
        ref={deckRef}
        className="mobile-deck no-scrollbar"
        role="region"
        aria-label="Portfolio scroller"
      >
        <AboutSlide
          ref={(el: HTMLElement | null) => {
            slideRefs.current[0] = el
          }}
          onScrollToProjects={() => {
            haptic(6)
            jumpTo(1)
          }}
        />

        {projects.map((project, i) => {
          const slotIndex = i + 1
          return (
            <ProjectSlide
              key={project.slug}
              ref={(el: HTMLElement | null) => {
                slideRefs.current[slotIndex] = el
              }}
              project={project}
              index={i}
              total={projects.length}
              showHint={hintSlot === slotIndex}
              hintPending={hintReady && hintPending && hintQueueSlot === slotIndex}
              onDeepDive={() => {
                haptic(8)
                setDeepDiveSlug(project.slug)
              }}
            />
          )
        })}
      </div>

      {/* Right-rail page indicator (project slides only) */}
      {viewingProject && (
        <div className="m-rail" aria-hidden="true">
          {projects.map((p, i) => {
            const isActive = i + 1 === activeIndex
            return <span key={p.slug} className={cn('m-rail-dot', isActive && 'active')} />
          })}
        </div>
      )}

      {/* Deep-dive slide-in sheet */}
      <DeepDiveSheet project={currentProject} onClose={() => setDeepDiveSlug(null)} />
    </div>
  )
}

/* ────────────────────────────────────────────── Slides ─────────────────────── */

interface AboutSlideProps {
  ref: (el: HTMLElement | null) => void
  onScrollToProjects: () => void
}

function AboutSlide({ ref, onScrollToProjects }: AboutSlideProps) {
  return (
    <section ref={ref} className="m-slide m-about">
      <div className="m-about-bg" aria-hidden="true" />
      <div className="m-about-inner">
        <div className="m-about-portrait">
          <Image
            src="/portrait.jpeg"
            alt="Layken Varholdt"
            width={240}
            height={240}
            priority
            draggable={false}
          />
        </div>

        <div className="m-status">
          <span>Open to Senior / Staff AI</span>
        </div>

        <h1 className="m-about-name">Layken Varholdt</h1>

        <div className="m-about-role">
          AI Engineer <span className="sep">·</span>{' '}
          <span className="accent">@ DOL</span>
        </div>

        <p className="m-about-pitch">
          Engineer who ships <em>production AI.</em>
        </p>
        <p className="m-about-sub">
          1st place at the Convex Modern Stack Hackathon ($10k). I specialize
          in document intelligence pipelines, multi-agent orchestration, and
          the infrastructure that makes AI reliable in production.
        </p>

        <div className="m-about-cta-stack">
          <a
            href="mailto:Laykenv@gmail.com?subject=AI%20Engineering%20role"
            className="m-cta-email"
          >
            <span className="m-cta-icon" aria-hidden="true">
              <Mail className="h-[18px] w-[18px]" />
            </span>
            <b className="m-cta-email-addr">Laykenv@gmail.com</b>
            <span className="arrow">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </a>

          <div className="m-quick-grid">
            <a
              className="m-quick"
              href="https://cal.com/layken-varholdt"
              target="_blank"
              rel="noreferrer"
            >
              <CalendarClock className="h-[18px] w-[18px]" />
              Book call
            </a>
            <a
              className="m-quick"
              href="https://t.me/LLVarholdt"
              target="_blank"
              rel="noreferrer"
            >
              <Image
                src="/telegram.png"
                alt=""
                width={18}
                height={18}
                draggable={false}
              />
              Telegram
            </a>
            <a
              className="m-quick"
              href="https://github.com/laykenV"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="h-[18px] w-[18px]" />
              GitHub
            </a>
          </div>
        </div>

        <button
          className="m-scroll-indicator"
          onClick={onScrollToProjects}
          aria-label="Scroll to projects"
        >
          <span className="label">Swipe for work</span>
          <span className="chev" aria-hidden="true">
            <ChevronDown className="h-[16px] w-[16px]" strokeWidth={2.5} />
          </span>
        </button>
      </div>
    </section>
  )
}

/* ────────────────────────────── Project slide ──────────────────────────────── */

interface ProjectSlideProps {
  ref: (el: HTMLElement | null) => void
  project: Project
  index: number
  total: number
  showHint: boolean
  hintPending: boolean
  onDeepDive: () => void
}

function ProjectSlide({
  ref,
  project,
  index,
  total,
  showHint,
  hintPending,
  onDeepDive,
}: ProjectSlideProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const actionsHidden = hintPending
  const actionsBlocked = hintPending || showHint
  const gesture = useRef<{
    startX: number
    startY: number
    startT: number
    axis: 'x' | 'y' | null
    active: boolean
  }>({ startX: 0, startY: 0, startT: 0, axis: null, active: false })
  const [dragX, setDragX] = useState(0)
  const [hintOn, setHintOn] = useState(false)

  const onTouchStart = (e: ReactTouchEvent) => {
    const t = e.touches[0]
    gesture.current = {
      startX: t.clientX,
      startY: t.clientY,
      startT: performance.now(),
      axis: null,
      active: true,
    }
  }

  const onTouchMove = (e: ReactTouchEvent) => {
    if (!gesture.current.active) return
    const t = e.touches[0]
    const dx = t.clientX - gesture.current.startX
    const dy = t.clientY - gesture.current.startY

    if (!gesture.current.axis && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      gesture.current.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
    }

    if (gesture.current.axis === 'x') {
      // rubber-band rightward (can't swipe right on a card)
      const clamped = dx < 0 ? dx : dx / 4
      setDragX(clamped)
      if (dx < -40) setHintOn(true)
    }
  }

  const onTouchEnd = () => {
    if (!gesture.current.active) return
    const { startT, axis } = gesture.current
    gesture.current.active = false

    if (axis === 'x') {
      const dx = dragX
      const elapsed = performance.now() - startT
      const vx = dx / Math.max(elapsed, 1)
      setDragX(0)
      setHintOn(false)
      if (dx < -80 || vx < -0.5) {
        onDeepDive()
      }
    } else {
      setDragX(0)
      setHintOn(false)
    }
  }

  const bgStyle = { ['--card-bg-url' as string]: `url("${project.image}")` }

  return (
    <section ref={ref} className="m-slide m-project">
      <div className="m-card-bg" style={bgStyle} aria-hidden="true" />
      <div
        ref={cardRef}
        className={cn('m-card-inner', dragX !== 0 && 'dragging')}
        style={{ transform: dragX !== 0 ? `translateX(${dragX}px)` : undefined }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        <div className="m-eyebrow">
          <span className="m-counter">
            <b>{String(index + 1).padStart(2, '0')}</b>
            <span className="sep"> / </span>
            {String(total).padStart(2, '0')}
          </span>
        </div>

        <div className="m-card-image">
          {project.award && (
            <div className="m-ribbon" aria-label={project.award.label}>
              <span aria-hidden="true">{project.award.icon ?? '🥇'}</span>
              <span>{project.award.label}</span>
            </div>
          )}
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-contain scale-[1.01]"
            sizes="100vw"
            priority={index < 2}
            draggable={false}
          />
          <span className="m-card-shine" aria-hidden="true" />
        </div>

        <div className="m-card-body">
          <h2 className="m-card-title">{project.title}</h2>
          <p className="m-card-tagline">{project.tagline}</p>
          <p className="m-card-desc">{project.description}</p>

          <div className="m-card-stack">
            {project.techStack.slice(0, 5).map((tech) => (
              <span key={tech} className="m-chip">
                {tech}
              </span>
            ))}
          </div>

          <div className={cn('m-card-actions', actionsHidden && 'pending')}>
            {project.links.live ? (
              <a
                href={project.links.live}
                target="_blank"
                rel="noreferrer noopener"
                className="m-btn m-btn-primary"
                tabIndex={actionsBlocked ? -1 : undefined}
                aria-hidden={actionsBlocked || undefined}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-[14px] w-[14px]" />
                Live
              </a>
            ) : (
              <span className="m-btn m-btn-ghost-empty" aria-hidden="true" />
            )}
            <button
              className="m-btn"
              disabled={actionsBlocked}
              aria-hidden={actionsBlocked || undefined}
              onClick={(e) => {
                e.stopPropagation()
                onDeepDive()
              }}
            >
              Deep dive
              <ArrowUpRight className="h-[14px] w-[14px]" />
            </button>
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noreferrer noopener"
                className="m-btn m-btn-icon"
                aria-label="Source code"
                tabIndex={actionsBlocked ? -1 : undefined}
                aria-hidden={actionsBlocked || undefined}
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="h-[16px] w-[16px]" />
              </a>
            )}

            {/* One-shot action-bar hint — covers the button row on first
                project-slide arrival, then slides off to the left to
                demonstrate the swipe-for-deep-dive gesture. pointer-events
                is none so taps fall through to the buttons below. */}
            {showHint && (
              <div className="m-actions-hint" aria-hidden="true">
                <span className="m-actions-hint-chev">
                  <ChevronLeft className="h-[14px] w-[14px]" strokeWidth={3} />
                  <ChevronLeft className="h-[14px] w-[14px]" strokeWidth={3} />
                  <ChevronLeft className="h-[14px] w-[14px]" strokeWidth={3} />
                </span>
                <span className="m-actions-hint-text">Swipe for deep dive</span>
              </div>
            )}
          </div>
        </div>

        {/* Swipe-left hint */}
        <span className={cn('m-swipe-hint', hintOn && 'on')} aria-hidden="true">
          Swipe ← for details
        </span>
      </div>
    </section>
  )
}

/* ─────────────────────────── Deep-dive side sheet ──────────────────────────── */

interface DeepDiveSheetProps {
  project: Project | null
  onClose: () => void
}

function DeepDiveSheet({ project, onClose }: DeepDiveSheetProps) {
  const [visible, setVisible] = useState(false)
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startRef = useRef({
    x: 0,
    y: 0,
    t: 0,
    axis: null as 'x' | 'y' | null,
    fromEdge: false,
  })

  useEffect(() => {
    if (!project) {
      setVisible(false)
      return
    }
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [project])

  const requestClose = useCallback(() => {
    setVisible(false)
    window.setTimeout(onClose, 340)
  }, [onClose])

  const onTouchStart = (e: ReactTouchEvent) => {
    const t = e.touches[0]
    const fromEdge = t.clientX <= 28
    startRef.current = {
      x: t.clientX,
      y: t.clientY,
      t: performance.now(),
      axis: fromEdge ? 'x' : null,
      fromEdge,
    }
    setDragging(true)
  }
  const onTouchMove = (e: ReactTouchEvent) => {
    const t = e.touches[0]
    const dx = t.clientX - startRef.current.x
    const dy = t.clientY - startRef.current.y
    if (!startRef.current.axis && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      startRef.current.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
    }
    if (startRef.current.axis === 'x' && dx > 0) {
      setDragX(dx)
    }
  }
  const onTouchEnd = () => {
    const dx = dragX
    const elapsed = performance.now() - startRef.current.t
    const vx = dx / Math.max(elapsed, 1)
    const threshold = startRef.current.fromEdge ? 60 : 120
    setDragging(false)
    setDragX(0)
    if (startRef.current.axis === 'x' && (dx > threshold || vx > 0.5)) {
      haptic(8)
      requestClose()
    }
  }

  if (!project) return null

  const style = dragging && dragX > 0 ? { transform: `translateX(${dragX}px)` } : undefined

  return (
    <div
      className={cn('m-sheet', visible && 'open', dragging && 'dragging')}
      style={style}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} deep dive`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      <div className="m-sheet-topbar">
        <button
          className="m-sheet-back"
          onClick={() => {
            haptic(6)
            requestClose()
          }}
          aria-label="Back"
        >
          <ArrowLeft className="h-[14px] w-[14px]" />
          <span>Back</span>
        </button>
        <div className="m-sheet-crumb">
          <span>Deep dive</span>
          <span className="sep">/</span>
          <span className="accent">{project.title}</span>
        </div>
      </div>

      <div className="m-sheet-inner">
        <div className="m-sheet-hero">
          <Image
            src={project.secondaryImage}
            alt={`${project.title} — detail`}
            fill
            className="object-contain scale-[1.01]"
            sizes="100vw"
            draggable={false}
          />
        </div>

        <h2 className="m-sheet-title">{project.title}</h2>
        <div className="m-sheet-tagline">{project.tagline}</div>

        {project.award && (
          <div className="m-sheet-award">
            <span aria-hidden="true">{project.award.icon ?? '🥇'}</span>
            {project.award.label}
          </div>
        )}

        <div className="m-sheet-label">The work</div>
        <div className="m-sheet-body">
          <p>{project.longDescription}</p>
        </div>

        <div className="m-sheet-label">Stack</div>
        <div className="m-sheet-stack">
          {project.techStack.map((t) => (
            <span key={t} className="m-chip">
              {t}
            </span>
          ))}
        </div>

        <div className="m-sheet-label">Links</div>
        <div className="m-sheet-links">
          {project.links.live && (
            <a
              className="m-btn m-btn-primary"
              href={project.links.live}
              target="_blank"
              rel="noreferrer noopener"
            >
              <ExternalLink className="h-[14px] w-[14px]" />
              Live site
            </a>
          )}
          {project.links.github && (
            <a
              className="m-btn"
              href={project.links.github}
              target="_blank"
              rel="noreferrer noopener"
            >
              <Github className="h-[14px] w-[14px]" />
              Source
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
