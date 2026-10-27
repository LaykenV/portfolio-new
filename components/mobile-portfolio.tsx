'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type TouchEvent as ReactTouchEvent,
} from 'react'
import Image from 'next/image'
import {
  ArrowLeft,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Github,
  Mail,
  Trophy,
} from 'lucide-react'

import type { Project } from '@/types/project'
import { MobileMenuController } from '@/components/mobile-menu-controller'
import { FounderIntro } from '@/components/founder-intro'
import { WritingIdentity } from '@/components/writing-identity'
import { AnimatedThemeToggler } from '@/components/animated-theme-toggler'
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

export function MobilePortfolio({ projects }: MobilePortfolioProps) {
  const deckRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLElement | null)[]>([])
  const previewResetRef = useRef<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [deepDiveSlug, setDeepDiveSlug] = useState<string | null>(null)
  const [entryPreview, setEntryPreview] = useState<{ slug: string; offset: number } | null>(null)
  const [swipePreview, setSwipePreview] = useState<{
    slug: string | null
    offset: number
    active: boolean
  }>({ slug: null, offset: 0, active: false })
  // total slots = about (index 0) + each project
  const total = projects.length + 1

  const jumpTo = useCallback((slotIndex: number) => {
    const deck = deckRef.current
    if (!deck) return
    const target = slideRefs.current[slotIndex]
    if (!target) return
    const inset = parseFloat(getComputedStyle(deck).scrollPaddingTop) || 0
    deck.scrollTo({ top: Math.max(0, target.offsetTop - inset), behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const deck = deckRef.current
    if (!deck) return
    const slides = slideRefs.current.filter(Boolean) as HTMLElement[]
    if (slides.length === 0) return

    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        let index = 0
        const inset = (parseFloat(getComputedStyle(deck).scrollPaddingTop) || 0) + 24
        for (let i = 1; i < slides.length; i++) {
          if (slides[i].offsetTop <= deck.scrollTop + inset) index = i
        }
        setActiveIndex(index)
      })
    }
    update()
    deck.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(frame)
      deck.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [total])

  const currentProject = useMemo(
    () => projects.find((p) => p.slug === deepDiveSlug) ?? null,
    [projects, deepDiveSlug],
  )
  const previewProject = useMemo(
    () => projects.find((p) => p.slug === swipePreview.slug) ?? null,
    [projects, swipePreview.slug],
  )

  const clearPreviewReset = useCallback(() => {
    if (previewResetRef.current !== null) {
      window.clearTimeout(previewResetRef.current)
      previewResetRef.current = null
    }
  }, [])

  const clearSwipePreviewNow = useCallback(() => {
    clearPreviewReset()
    setSwipePreview({ slug: null, offset: 0, active: false })
  }, [clearPreviewReset])

  const clearEntryPreview = useCallback(() => {
    setEntryPreview(null)
  }, [])

  const previewSwipe = useCallback(
    (slug: string, offset: number) => {
      clearPreviewReset()
      setSwipePreview({ slug, offset, active: true })
    },
    [clearPreviewReset],
  )

  const settleSwipePreview = useCallback(
    (slug?: string, delay = 340) => {
      clearPreviewReset()
      setSwipePreview((prev) => ({
        slug: slug ?? prev.slug,
        offset: 0,
        active: false,
      }))
      previewResetRef.current = window.setTimeout(() => {
        setSwipePreview({ slug: null, offset: 0, active: false })
        previewResetRef.current = null
      }, delay)
    },
    [clearPreviewReset],
  )

  useEffect(() => () => clearPreviewReset(), [clearPreviewReset])

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
      <header className={cn('m-topbar', viewingProject && 'm-topbar-project')}>
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
          <WritingIdentity />
        </button>
        <div className="flex items-center gap-2">
          <AnimatedThemeToggler className="m-topbar-theme" />
          <MobileMenuController className="m-topbar-menu" />
        </div>
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
              active={activeIndex === slotIndex}
              onDeepDive={() => {
                haptic(8)
                clearSwipePreviewNow()
                clearEntryPreview()
                setDeepDiveSlug(project.slug)
              }}
              onSwipePreview={(offset) => previewSwipe(project.slug, offset)}
              onSwipePreviewEnd={(commit, offset) => {
                if (commit) {
                  haptic(8)
                  clearSwipePreviewNow()
                  setEntryPreview({ slug: project.slug, offset })
                  setDeepDiveSlug(project.slug)
                  return
                }
                settleSwipePreview()
              }}
            />
          )
        })}
      </div>

      {/* Deep-dive slide-in sheet */}
      <DeepDiveSheet
        project={currentProject}
        previewProject={previewProject}
        previewOffset={swipePreview.offset}
        previewActive={swipePreview.active}
        entryPreview={entryPreview}
        onEntryPreviewConsumed={clearEntryPreview}
        onClose={() => {
          clearSwipePreviewNow()
          clearEntryPreview()
          setDeepDiveSlug(null)
        }}
      />
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
            draggable={false}
          />
        </div>

        {/* Not an h1 — the page's single h1 lives in app/page.tsx so the two
            shells don't each contribute one. */}
        <p className="m-about-name">Layken Varholdt</p>

        <div className="m-about-role">
          Software engineer
        </div>

        <FounderIntro />

        <div className="m-about-cta-stack">
          <a
            href="mailto:layken@varholdt.com?subject=Software%20Engineering%20role"
            className="m-cta-email"
          >
            <span className="m-cta-icon" aria-hidden="true">
              <Mail className="h-[18px] w-[18px]" />
            </span>
            <b className="m-cta-email-addr">layken@varholdt.com</b>
            <span className="arrow">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </a>

          <nav className="m-contact-links" aria-label="Contact links">
            <a
              href="https://cal.com/layken-varholdt"
              target="_blank"
              rel="noreferrer noopener"
            >
              Book a call
            </a>
            <a
              href="https://t.me/LLVarholdt"
              target="_blank"
              rel="noreferrer noopener"
            >
              Telegram
            </a>
          </nav>
        </div>

        <button
          className="m-scroll-indicator"
          onClick={onScrollToProjects}
        >
          <span className="label">Scroll to projects</span>
          <span className="chev" aria-hidden="true">
            <ArrowDown className="h-[14px] w-[14px]" />
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
  active: boolean
  onDeepDive: () => void
  onSwipePreview: (offset: number) => void
  onSwipePreviewEnd: (commit: boolean, offset: number) => void
}

function ProjectSlide({
  ref,
  project,
  index,
  total,
  active,
  onDeepDive,
  onSwipePreview,
  onSwipePreviewEnd,
}: ProjectSlideProps) {
  const gesture = useRef<{
    startX: number
    startY: number
    startT: number
    deltaX: number
    axis: 'x' | 'y' | null
    active: boolean
  }>({ startX: 0, startY: 0, startT: 0, deltaX: 0, axis: null, active: false })

  const onTouchStart = (e: ReactTouchEvent) => {
    const t = e.touches[0]
    gesture.current = {
      startX: t.clientX,
      startY: t.clientY,
      startT: performance.now(),
      deltaX: 0,
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
      const hadLeftSwipe = gesture.current.deltaX < 0
      const clamped = dx < 0 ? dx : dx / 4
      gesture.current.deltaX = clamped
      if (dx < 0) {
        onSwipePreview(Math.min(-dx, window.innerWidth))
      } else if (hadLeftSwipe) {
        onSwipePreview(0)
      }
      if (e.cancelable) e.preventDefault()
    }
  }

  const onTouchEnd = () => {
    if (!gesture.current.active) return
    const { startT, axis } = gesture.current
    gesture.current.active = false

    if (axis === 'x') {
      const dx = gesture.current.deltaX
      const elapsed = performance.now() - startT
      const vx = dx / Math.max(elapsed, 1)
      gesture.current.deltaX = 0
      if (dx < -80 || vx < -0.5) {
        onSwipePreviewEnd(true, Math.min(-dx, window.innerWidth))
        return
      }
      onSwipePreviewEnd(false, 0)
    }
    gesture.current.deltaX = 0
  }

  return (
    <section ref={ref} className="m-slide m-project" data-active={active}>
      <div className="m-card-bg" aria-hidden="true" />
      <div
        className="m-card-inner"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        <div className="m-project-heading">
          <span className="m-counter">
            <b>{String(index + 1).padStart(2, '0')}</b>
            <span className="sep"> / </span>
            {String(total).padStart(2, '0')}
          </span>
          <h2 className="m-card-title">{project.title}</h2>
        </div>

        <div className="m-card-image">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-contain scale-[1.01]"
            sizes="100vw"
            draggable={false}
          />
        </div>

        <div className="m-card-body">
          {project.award && (
            <div className="m-ribbon">
              <Trophy size={14} aria-hidden="true" />
              <span>{project.award.label}</span>
            </div>
          )}
          <p className="m-card-desc">{project.mobileSummary}</p>

          <div className="m-card-stack">
            {project.techStack.slice(0, 3).map((tech) => (
              <span key={tech} className="m-chip">
                {tech}
              </span>
            ))}
            {project.techStack.length > 3 && (
              <span className="m-stack-ending">
                <span className="m-chip">{project.techStack[3]}</span>
                {project.techStack.length > 4 && (
                  <span className="m-chip" aria-label={`${project.techStack.length - 4} more technologies in Deep dive`}>
                    +{project.techStack.length - 4}
                  </span>
                )}
              </span>
            )}
          </div>

          <div className="m-card-actions">
            <div className="m-card-actions-ui">
              {project.links.live ? (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="m-btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-[14px] w-[14px]" />
                  Live
                </a>
              ) : (
                <span className="m-btn m-btn-ghost-empty" aria-hidden="true" />
              )}
              <button
                className="m-btn m-btn-primary"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeepDive()
                }}
              >
                Deep dive
                <ArrowRight className="h-[14px] w-[14px]" />
              </button>
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="m-btn"
                  aria-label="Source code"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github className="h-[16px] w-[16px]" />
                  Source
                </a>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}

/* ─────────────────────────── Deep-dive side sheet ──────────────────────────── */

interface DeepDiveSheetProps {
  project: Project | null
  previewProject: Project | null
  previewOffset: number
  previewActive: boolean
  entryPreview: { slug: string; offset: number } | null
  onEntryPreviewConsumed: () => void
  onClose: () => void
}

function DeepDiveSheet({
  project,
  previewProject,
  previewOffset,
  previewActive,
  entryPreview,
  onEntryPreviewConsumed,
  onClose,
}: DeepDiveSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const entryPreviewRef = useRef(entryPreview)
  const startRef = useRef({
    x: 0,
    y: 0,
    t: 0,
    axis: null as 'x' | 'y' | null,
    fromEdge: false,
  })
  const displayProject = project ?? previewProject
  const isPreviewing = !project && !!previewProject
  const isInteractive = !!project
  const openingOffset =
    project && !visible && entryPreview?.slug === project.slug ? entryPreview.offset : null

  useEffect(() => {
    entryPreviewRef.current = entryPreview
  }, [entryPreview])

  useEffect(() => {
    if (!project) {
      setVisible(false)
      return
    }
    setVisible(false)
    const openedFromSwipe = entryPreviewRef.current?.slug === project.slug
    const id = requestAnimationFrame(() => {
      setVisible(true)
      if (openedFromSwipe) {
        onEntryPreviewConsumed()
      }
    })
    return () => cancelAnimationFrame(id)
  }, [onEntryPreviewConsumed, project])

  const requestClose = useCallback(() => {
    setVisible(false)
    window.setTimeout(onClose, 340)
  }, [onClose])

  useEffect(() => {
    if (!isInteractive) return
    const sheet = sheetRef.current
    if (!sheet) return
    const previous = document.activeElement as HTMLElement | null
    const background = Array.from(
      sheet.closest('.mobile-portfolio')?.querySelectorAll<HTMLElement>('.mobile-deck, .m-topbar') ?? [],
    )
    const previousInert = background.map((element) => element.inert)
    background.forEach((element) => { element.inert = true })
    const frame = requestAnimationFrame(() => sheet.querySelector<HTMLButtonElement>('.m-sheet-back')?.focus({ preventScroll: true }))
    const containFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const controls = Array.from(sheet.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    window.addEventListener('keydown', containFocus)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('keydown', containFocus)
      background.forEach((element, index) => { element.inert = previousInert[index] })
      previous?.focus({ preventScroll: true })
    }
  }, [isInteractive])

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

  if (!displayProject) return null

  const style =
    dragging && dragX > 0
      ? { transform: `translateX(${dragX}px)` }
      : isPreviewing
        ? { transform: `translateX(calc(100% - ${previewOffset}px))` }
        : openingOffset !== null
          ? { transform: `translateX(calc(100% - ${openingOffset}px))` }
          : { transform: visible ? 'translateX(0)' : 'translateX(100%)' }

  return (
    <div
      ref={sheetRef}
      className={cn(
        'm-sheet',
        visible && 'open',
        (dragging || previewActive) && 'dragging',
        isPreviewing && 'preview',
      )}
      style={style}
      role={isInteractive ? 'dialog' : undefined}
      aria-modal={isInteractive ? 'true' : undefined}
      aria-label={isInteractive ? `${displayProject.title} deep dive` : undefined}
      aria-hidden={isPreviewing || undefined}
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
        <AnimatedThemeToggler className="m-sheet-theme" />
      </div>

      <div className="m-sheet-inner">
        <h2 className="m-sheet-title">{displayProject.title}</h2>
        <div className="m-sheet-tagline">{displayProject.tagline}</div>
        <div className="m-sheet-hero">
          <Image
            src={displayProject.secondaryImage}
            alt={isInteractive ? `${displayProject.title} — detail` : ''}
            fill
            className="object-contain scale-[1.01]"
            sizes="100vw"
            draggable={false}
            aria-hidden={isPreviewing || undefined}
          />
        </div>

        <a
          href={displayProject.secondaryImage}
          target="_blank"
          rel="noreferrer noopener"
          className="m-sheet-image-link"
        >
          Open full-size image
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>

        {displayProject.award && (
          <div className="m-sheet-award">
            <Trophy size={14} aria-hidden="true" />
            {displayProject.award.label}
          </div>
        )}

        <div className="m-sheet-label m-sheet-work-label">The work</div>
        <div className="m-sheet-body">
          {displayProject.longDescription.split('\n\n').map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="m-sheet-label">Stack</div>
        <div className="m-sheet-stack">
          {displayProject.techStack.map((t) => (
            <span key={t} className="m-chip">
              {t}
            </span>
          ))}
        </div>

        <div className="m-sheet-label">Links</div>
        <div className="m-sheet-links">
          {displayProject.links.live && (
            <a
              className="m-btn m-btn-primary"
              href={displayProject.links.live}
              target="_blank"
              rel="noreferrer noopener"
            >
              <ExternalLink className="h-[14px] w-[14px]" />
              Live site
            </a>
          )}
          {displayProject.links.github && (
            <a
              className="m-btn"
              href={displayProject.links.github}
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
