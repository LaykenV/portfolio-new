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
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Github,
  Trophy,
} from 'lucide-react'

import type { Project } from '@/types/project'
import { FounderIntro } from '@/components/founder-intro'
import { SiteHeader } from '@/components/site-header'
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
  const flightRef = useRef<HTMLDivElement>(null)
  // The hero already shows the portrait and name; the header brand takes
  // over when the first project arrives, so the two never show together.
  const [heroPassed, setHeroPassed] = useState(false)
  const [deepDiveSlug, setDeepDiveSlug] = useState<string | null>(null)
  const [entryPreview, setEntryPreview] = useState<{ slug: string; offset: number } | null>(null)
  const [swipePreview, setSwipePreview] = useState<{
    slug: string | null
    offset: number
    active: boolean
  }>({ slug: null, offset: 0, active: false })
  // total slots = about (index 0) + each project
  const total = projects.length + 1

  const jumpTo = useCallback((slotIndex: number, behavior: ScrollBehavior = 'smooth') => {
    const deck = deckRef.current
    if (!deck) return
    const target = slideRefs.current[slotIndex]
    if (!target) return
    const inset = parseFloat(getComputedStyle(deck).scrollPaddingTop) || 0
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    deck.scrollTo({ top: Math.max(0, target.offsetTop - inset), behavior: reduce ? 'auto' : behavior })
  }, [])

  // The menu's Work link from other pages lands on /#work.
  useEffect(() => {
    if (window.location.hash !== '#work') return
    jumpTo(1, 'auto')
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }, [jumpTo])

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
        const firstStop = slides[1].offsetTop - (parseFloat(getComputedStyle(deck).scrollPaddingTop) || 0)
        setHeroPassed(deck.scrollTop >= firstStop - 2)
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

  // The hero portrait and name fly into the header brand as the first project
  // scrolls in. Copies in a fixed layer above the header do the moving, so
  // nothing fights the native scroll, and progress comes from scrollTop alone.
  // The large name fades into the header's own small name near the end, so
  // both ends rest on real, unscaled text.
  useEffect(() => {
    const deck = deckRef.current
    const flight = flightRef.current
    const root = deck?.closest<HTMLElement>('.mobile-portfolio')
    if (!deck || !flight || !root) return
    const heroPortrait = root.querySelector<HTMLElement>('.m-about-inner > .m-about-portrait')
    const heroName = root.querySelector<HTMLElement>('.m-about-inner > .m-about-name')
    const brandImg = root.querySelector<HTMLElement>('.m-site-header .site-brand img')
    const brandName = root.querySelector<HTMLElement>('.m-site-header .site-brand-name')
    const flyPortrait = flight.querySelector<HTMLElement>('.m-flight-portrait')
    const flyName = flight.querySelector<HTMLElement>('.m-flight-name')
    const rest = Array.from(root.querySelectorAll<HTMLElement>(
      '.m-about-inner > :not(.m-about-portrait):not(.m-about-name), .m-scroll-cue',
    ))
    const firstProject = slideRefs.current[1]
    if (!heroPortrait || !heroName || !brandImg || !brandName || !flyPortrait || !flyName || !firstProject) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    let geo: {
      stop: number
      portrait: { dx: number; dy: number; k: number }
      name: { dx: number; dy: number; k: number }
    } | null = null
    let frame = 0

    const clear = () => {
      root.classList.remove('m-flying')
      for (const el of [brandImg, brandName, ...rest]) el.style.opacity = ''
    }

    const apply = () => {
      if (!geo) return
      const p = Math.min(1, Math.max(0, deck.scrollTop / geo.stop))
      // Both pieces rise faster than the page at first, so the text below
      // never catches them. The portrait docks first and clears the way for
      // the name. The rest of the hero is gone before either could overlap it.
      const portraitEase = 1 - Math.pow(1 - p, 4)
      const nameEase = 1 - Math.pow(1 - p, 3)
      const nameSlide = p * p * (3 - 2 * p)
      const { portrait, name } = geo
      flyPortrait.style.transform =
        `translate3d(${portrait.dx * portraitEase}px, ${portrait.dy * portraitEase}px, 0) scale(${Math.pow(portrait.k, portraitEase)})`
      flyName.style.transform =
        `translate3d(${name.dx * nameSlide}px, ${name.dy * nameEase}px, 0) scale(${Math.pow(name.k, nameEase)})`
      // Both pieces land exactly on the header brand, so they swap with it
      // in one frame. A fade would either dim the name or double its edges.
      const dock = p >= 0.995 ? 1 : 0
      flyName.style.opacity = String(1 - dock)
      brandName.style.opacity = String(dock)
      flyPortrait.style.opacity = String(1 - dock)
      brandImg.style.opacity = String(dock)
      const fade = String(Math.max(0, 1 - p / 0.2))
      for (const el of rest) el.style.opacity = fade
    }

    const measure = () => {
      if (reduce.matches) {
        geo = null
        clear()
        return
      }
      const scroll = deck.scrollTop
      const rootTop = root.getBoundingClientRect().top
      const hp = heroPortrait.getBoundingClientRect()
      const hn = heroName.getBoundingClientRect()
      const bi = brandImg.getBoundingClientRect()
      const bn = brandName.getBoundingClientRect()
      const nameW = flyName.offsetWidth
      const nameH = flyName.offsetHeight
      // A name that wraps on a narrow phone can't fly as one line.
      if (hn.height > nameH * 1.5 || nameW === 0) {
        geo = null
        clear()
        return
      }
      const portraitTop = hp.top - rootTop + scroll
      const nameLeft = hn.left + (hn.width - nameW) / 2
      const nameTop = hn.top - rootTop + scroll
      flyPortrait.style.left = `${hp.left}px`
      flyPortrait.style.top = `${portraitTop}px`
      flyName.style.left = `${nameLeft}px`
      flyName.style.top = `${nameTop}px`
      const nameK = bn.width / nameW
      geo = {
        stop: Math.max(1, firstProject.offsetTop - (parseFloat(getComputedStyle(deck).scrollPaddingTop) || 0)),
        portrait: { dx: bi.left - hp.left, dy: bi.top - rootTop - portraitTop, k: bi.width / hp.width },
        name: {
          dx: bn.left - nameLeft,
          dy: bn.top - rootTop + bn.height / 2 - (nameH * nameK) / 2 - nameTop,
          k: nameK,
        },
      }
      root.classList.add('m-flying')
      apply()
    }

    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(apply)
    }
    const remeasure = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }

    measure()
    document.fonts?.ready.then(remeasure)
    deck.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', remeasure)
    reduce.addEventListener('change', remeasure)
    return () => {
      cancelAnimationFrame(frame)
      deck.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', remeasure)
      reduce.removeEventListener('change', remeasure)
      clear()
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
      // Escape inside the open menu closes only the menu.
      if (e.key === 'Escape' && !document.querySelector('dialog[open]')) setDeepDiveSlug(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [currentProject])

  return (
    <div className="mobile-portfolio">
      <div className="m-browser-edge m-browser-edge-top" aria-hidden="true" />
      <div className="m-browser-edge m-browser-edge-bottom" aria-hidden="true" />

      <SiteHeader
        className="m-site-header"
        scrolled={heroPassed}
        brandHidden={!heroPassed}
        onHomeClick={() => {
          haptic(6)
          jumpTo(0)
        }}
        onWorkClick={() => jumpTo(1)}
      />

      <div ref={flightRef} className="m-flight" aria-hidden="true">
        <div className="m-about-portrait m-flight-portrait">
          <Image src="/portrait.jpeg" alt="" width={240} height={240} draggable={false} />
        </div>
        <span className="m-about-name m-flight-name">Layken Varholdt</span>
      </div>

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
          onNext={() => jumpTo(1)}
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

      {/* Right-edge index of the seven projects, shown on project slides. */}
      <div className={cn('m-rail', activeIndex > 0 && 'visible')} aria-hidden="true">
        {projects.map((p, i) => (
          <span key={p.slug} className={cn('m-rail-dot', i + 1 === activeIndex && 'active')} />
        ))}
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
        onHome={() => jumpTo(0, 'auto')}
      />
    </div>
  )
}

/* ────────────────────────────────────────────── Slides ─────────────────────── */

interface AboutSlideProps {
  ref: (el: HTMLElement | null) => void
  onNext: () => void
}

function AboutSlide({ ref, onNext }: AboutSlideProps) {
  return (
    <section ref={ref} className="m-slide m-about">
      <div className="m-about-bg" aria-hidden="true" />
      <div className="m-about-inner">
        <div className="m-about-portrait">
          <Image src="/portrait.jpeg" alt="Layken Varholdt" width={240} height={240} draggable={false} />
        </div>

        {/* Not an h1. The page's single h1 lives in app/page.tsx so the two
            shells don't each add one. */}
        <p className="m-about-name">Layken Varholdt</p>
        <p className="m-about-role">Software engineer</p>

        <FounderIntro />

        <div className="m-about-cta-stack">
          <a
            href="mailto:layken@varholdt.com"
            className="m-about-email"
          >
            Email layken@varholdt.com
          </a>
          <nav className="m-contact-links" aria-label="Contact links">
            <a href="https://t.me/LLVarholdt" target="_blank" rel="noreferrer noopener">
              Telegram
            </a>
          </nav>
        </div>
      </div>
      <button type="button" className="m-scroll-cue" onClick={onNext}>
        Selected work
        <ArrowDown className="h-[16px] w-[16px]" aria-hidden="true" />
      </button>
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
          <p className="m-card-desc">{project.mobileSummary}</p>
        </div>

        <div className="m-card-image">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover object-top scale-[1.01]"
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
                  Live site
                </a>
              ) : (
                <span className="m-btn m-btn-ghost-empty" aria-hidden="true" />
              )}
              {project.links.github ? (
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
  onHome: () => void
}

function DeepDiveSheet({
  project,
  previewProject,
  previewOffset,
  previewActive,
  entryPreview,
  onEntryPreviewConsumed,
  onClose,
  onHome,
}: DeepDiveSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [bodyScrolled, setBodyScrolled] = useState(false)
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
      sheet.closest('.mobile-portfolio')?.querySelectorAll<HTMLElement>('.mobile-deck, .m-site-header') ?? [],
    )
    const previousInert = background.map((element) => element.inert)
    background.forEach((element) => { element.inert = true })
    // Focus the sheet itself. Focusing the back button after a tap would draw
    // its keyboard focus ring.
    const frame = requestAnimationFrame(() => sheet.focus({ preventScroll: true }))
    const containFocus = (event: KeyboardEvent) => {
      // The open menu is a modal dialog and contains focus itself.
      if (event.key !== 'Tab' || document.querySelector('dialog[open]')) return
      const controls = Array.from(sheet.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
        .filter((control) => !control.closest('dialog'))
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (event.shiftKey && (document.activeElement === first || document.activeElement === sheet)) {
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
      tabIndex={isInteractive ? -1 : undefined}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      <SiteHeader
        className="m-sheet-header"
        scrolled={bodyScrolled}
        onHomeClick={() => {
          onHome()
          requestClose()
        }}
        onWorkClick={requestClose}
      />

      <div className="m-sheet-inner" onScroll={(event) => setBodyScrolled(event.currentTarget.scrollTop > 8)}>
        <button
          className="m-sheet-back"
          onClick={() => {
            haptic(6)
            requestClose()
          }}
        >
          <ArrowLeft className="h-[14px] w-[14px]" aria-hidden="true" />
          All projects
        </button>
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
