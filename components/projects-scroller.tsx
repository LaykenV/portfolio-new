'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { Project } from '@/types/project'

interface ProjectsScrollerProps {
  projects: Project[]
}

export function ProjectsScroller({ projects }: ProjectsScrollerProps) {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({})
  const [isClosing, setIsClosing] = useState(false)

  const overlayRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null)

  const [mounted, setMounted] = useState(false)

  const handleRequestClose = useCallback(() => {
    if (!expandedSlug) return
    setIsClosing(true)
  }, [expandedSlug])

  const { heroes, featured, more } = useMemo(() => {
    return {
      heroes: projects.filter((p) => p.tier === 'hero'),
      featured: projects.filter((p) => p.tier === 'featured'),
      more: projects.filter((p) => p.tier === 'more'),
    }
  }, [projects])

  const currentProject = projects.find((p) => p.slug === expandedSlug)

  useEffect(() => {
    setMounted(true)
  }, [])

  const preloadImage = useCallback(
    (src: string, slug: string) => {
      if (imageLoaded[slug]) return
      const img = new window.Image()
      img.src = src
      img.onload = () => setImageLoaded((prev) => ({ ...prev, [slug]: true }))
    },
    [imageLoaded]
  )

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = []
    const initial = setTimeout(() => {
      projects.forEach((p, i) => {
        const t = setTimeout(() => preloadImage(p.secondaryImage, p.slug), i * 120)
        timeouts.push(t)
      })
    }, 800)
    timeouts.push(initial)
    return () => timeouts.forEach(clearTimeout)
  }, [projects, preloadImage])

  useEffect(() => {
    if (!expandedSlug) return
    const { body, documentElement } = document
    const prevBody = body.style.overflow
    const prevHtml = documentElement.style.overflow
    body.style.overflow = 'hidden'
    documentElement.style.overflow = 'hidden'
    return () => {
      body.style.overflow = prevBody
      documentElement.style.overflow = prevHtml
    }
  }, [expandedSlug])

  useEffect(() => {
    if (!expandedSlug) return
    const overlayEl = overlayRef.current
    if (!overlayEl) return

    const focusable = overlayEl.querySelectorAll<HTMLElement>(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const closeEl = closeBtnRef.current
    ;(closeEl ?? first ?? overlayEl).focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleRequestClose()
      }
      if (e.key === 'Tab' && focusable.length > 0) {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          ;(last as HTMLElement)?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          ;(first as HTMLElement)?.focus()
        }
      }
    }
    overlayEl.addEventListener('keydown', onKey)
    return () => overlayEl.removeEventListener('keydown', onKey)
  }, [expandedSlug, handleRequestClose])

  const openProject = useCallback((slug: string, trigger: HTMLElement) => {
    lastTriggerRef.current = trigger as HTMLButtonElement
    setIsClosing(false)
    setExpandedSlug(slug)
  }, [])

  const renderHeroCard = (project: Project, index: number) => (
    <article key={project.slug} className="hero-card relative flex flex-col">
      {project.award && (
        <div className="project-award-ribbon" aria-label={`${project.award.label}`}>
          <span aria-hidden="true">{project.award.icon ?? '🏅'}</span>
          <span>{project.award.label}</span>
        </div>
      )}

      <div className="px-5 pt-5 md:px-6 md:pt-6">
        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-contain select-none"
            draggable={false}
            sizes="(min-width: 1280px) 60vw, (min-width: 768px) 58vw, 100vw"
            priority={index === 0}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-black/0 to-black/0" />
        </div>
      </div>

      <div className="p-5 md:p-6 pt-4 md:pt-5 flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-xl md:text-2xl font-bold tracking-tight">{project.title}</h3>
          <span className="mono-accent">{project.tagline}</span>
        </div>

        <p className="text-sm md:text-[0.95rem] leading-relaxed opacity-85">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.techStack.slice(0, 6).map((t) => (
            <span key={t} className="tech-badge-compact">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          {project.links.live ? (
            <a
              href={project.links.live}
              target="_blank"
              rel="noreferrer noopener"
              className="btn-accent-invert btn-compact"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Live
            </a>
          ) : null}
          {project.links.github ? (
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer noopener"
              className="cta-secondary"
              onClick={(e) => e.stopPropagation()}
            >
              <Github className="h-3.5 w-3.5" />
              Source
            </a>
          ) : null}
          <button
            className="cta-secondary ml-auto"
            onClick={(e) => {
              e.stopPropagation()
              openProject(project.slug, e.currentTarget)
            }}
            onMouseEnter={() => preloadImage(project.secondaryImage, project.slug)}
            onFocus={() => preloadImage(project.secondaryImage, project.slug)}
            aria-expanded={expandedSlug === project.slug}
          >
            Deep dive
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  )

  const renderFeaturedCard = (project: Project) => (
    <article key={project.slug} className="featured-card relative flex flex-col">
      {project.award && (
        <div className="project-award-ribbon" aria-label={`${project.award.label}`}>
          <span aria-hidden="true">{project.award.icon ?? '🏅'}</span>
          <span>{project.award.label}</span>
        </div>
      )}

      <div className="px-4 pt-4 md:px-5 md:pt-5">
        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-md">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-contain select-none"
            draggable={false}
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 28vw, 100vw"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/8 via-black/0 to-black/0" />
        </div>
      </div>

      <div className="p-4 md:p-5 pt-3 md:pt-4 flex flex-col gap-2.5 flex-1">
        <div>
          <h3 className="text-base md:text-lg font-semibold tracking-tight">{project.title}</h3>
          <p className="mono-accent mt-0.5">{project.tagline}</p>
        </div>

        <p className="text-[0.85rem] leading-relaxed opacity-80 flex-1">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 4).map((t) => (
            <span key={t} className="tech-badge-compact">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-1 flex flex-wrap gap-2">
          {project.links.live ? (
            <a
              href={project.links.live}
              target="_blank"
              rel="noreferrer noopener"
              className="btn-accent-invert btn-compact"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Live
            </a>
          ) : null}
          <button
            className="cta-secondary ml-auto"
            onClick={(e) => {
              e.stopPropagation()
              openProject(project.slug, e.currentTarget)
            }}
            onMouseEnter={() => preloadImage(project.secondaryImage, project.slug)}
            onFocus={() => preloadImage(project.secondaryImage, project.slug)}
            aria-expanded={expandedSlug === project.slug}
          >
            Details
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  )

  const renderMoreRow = (project: Project) => (
    <button
      key={project.slug}
      className="more-row text-left w-full"
      onClick={(e) => {
        e.stopPropagation()
        openProject(project.slug, e.currentTarget)
      }}
      onMouseEnter={() => preloadImage(project.secondaryImage, project.slug)}
      onFocus={() => preloadImage(project.secondaryImage, project.slug)}
      aria-expanded={expandedSlug === project.slug}
    >
      <div className="more-thumb">
        <Image src={project.image} alt={project.title} fill className="object-cover" sizes="56px" />
      </div>
      <div className="min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-sm font-semibold tracking-tight">{project.title}</span>
          <span className="mono-accent truncate">{project.tagline}</span>
        </div>
        <p className="text-xs opacity-70 mt-0.5 line-clamp-2 md:line-clamp-1">
          {project.description}
        </p>
      </div>
      <span className="more-arrow" aria-hidden="true">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </button>
  )

  const renderOverlayBody = (cp: Project) => (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-lg md:text-xl font-semibold tracking-tight">{cp.title}</h4>
            {cp.award && (
              <span className="mono-accent" style={{ opacity: 0.85 }}>
                {cp.award.icon} {cp.award.label}
              </span>
            )}
          </div>
          <p className="text-xs md:text-sm opacity-75 mt-0.5">{cp.tagline}</p>
        </div>
        <button
          ref={closeBtnRef}
          className="btn-icon"
          aria-label="Close details"
          onClick={handleRequestClose}
        >
          ×
        </button>
      </div>

      <div className="mt-4 relative w-full overflow-hidden rounded-lg">
        <div className="relative w-full aspect-[16/9]">
          {!imageLoaded[cp.slug] && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-white/5 backdrop-blur-sm">
              <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin opacity-50" />
            </div>
          )}
          <Image
            src={cp.secondaryImage}
            alt={`${cp.title} — additional view`}
            fill
            className="object-contain select-none"
            draggable={false}
            sizes="(min-width: 768px) 60vw, 92vw"
            onLoad={() => setImageLoaded((prev) => ({ ...prev, [cp.slug]: true }))}
          />
        </div>
      </div>

      <div className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3">
          <p className="text-sm leading-relaxed">{cp.longDescription}</p>
        </div>
        <div className="md:col-span-2">
          <div>
            <div className="section-eyebrow">Stack</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {cp.techStack.map((t) => (
                <span key={t} className="tech-badge">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <div className="section-eyebrow">Links</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {cp.links.live ? (
                <a
                  href={cp.links.live}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn-accent-invert btn-compact flex-1 md:flex-none"
                >
                  Live site
                </a>
              ) : null}
              {cp.links.github ? (
                <a
                  href={cp.links.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn-accent btn-compact flex-1 md:flex-none"
                >
                  GitHub
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  )

  const portalOverlay =
    mounted && expandedSlug && currentProject
      ? createPortal(
          <div
            className={cn(
              'modal-scrim fixed inset-0 z-[100] flex items-stretch md:items-center md:justify-center md:p-6',
              isClosing ? 'modal-scrim-out' : 'modal-scrim-in'
            )}
            onClick={handleRequestClose}
          >
            <div
              ref={overlayRef}
              key={`overlay-${currentProject.slug}`}
              role="dialog"
              aria-modal="true"
              aria-label={`${currentProject.title} details`}
              tabIndex={-1}
              className={cn(
                'overlay-panel project-modal relative w-full md:max-w-3xl md:w-full overflow-auto p-5 md:p-7 md:rounded-2xl md:border',
                isClosing
                  ? 'animate-out zoom-out-95 anim-duration-200'
                  : 'animate-in zoom-in-95 anim-duration-200'
              )}
              onAnimationEnd={(e) => {
                if (e.target !== e.currentTarget) return
                if (!isClosing) return
                setExpandedSlug(null)
                setIsClosing(false)
                requestAnimationFrame(() => lastTriggerRef.current?.focus())
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {renderOverlayBody(currentProject)}
            </div>
          </div>,
          document.body
        )
      : null

  return (
    <>
      <div className="showcase-scroll md:h-full md:overflow-y-auto px-5 md:px-8 pt-4 md:pt-6 pb-10">
        {heroes.length > 0 && (
          <section className="tier-section">
            <div className="tier-header">
              <div className="section-eyebrow">Hero work</div>
              <span className="tier-count">
                01 / {projects.length}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-5 md:gap-6">
              {heroes.map((p, i) => renderHeroCard(p, i))}
            </div>
          </section>
        )}

        {featured.length > 0 && (
          <section className="tier-section">
            <div className="tier-header">
              <div className="section-eyebrow">Featured</div>
              <span className="tier-count">
                {String(heroes.length + 1).padStart(2, '0')} / {projects.length}
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
              {featured.map((p) => renderFeaturedCard(p))}
            </div>
          </section>
        )}

        {more.length > 0 && (
          <section className="tier-section">
            <div className="tier-header">
              <div className="section-eyebrow">More work</div>
              <span className="tier-count">
                {String(heroes.length + featured.length + 1).padStart(2, '0')} / {projects.length}
              </span>
            </div>
            <div className="flex flex-col gap-2">{more.map((p) => renderMoreRow(p))}</div>
          </section>
        )}

        <div className="hidden">
          {projects.map((p) => (
            <Image
              key={`preload-${p.slug}`}
              src={p.secondaryImage}
              alt=""
              width={1}
              height={1}
              loading="lazy"
              onLoad={() => setImageLoaded((prev) => ({ ...prev, [p.slug]: true }))}
            />
          ))}
        </div>
      </div>

      {portalOverlay}
    </>
  )
}
