'use client'

import { useState, useRef, useEffect, useCallback, UIEvent } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
 
import { cn } from '@/lib/utils'
import type { Project } from '@/types/project'

interface ProjectsScrollerProps {
  projects: Project[]
}

export function ProjectsScroller({ projects }: ProjectsScrollerProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({})
  const [isClosing, setIsClosing] = useState(false)

  // Horizontal scroll on mobile; vertical on desktop
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Refs for focus management and accessibility
  const overlayRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null)
  
  // Track if we're on mobile for portal rendering
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Close flow helper to trigger CSS exit animation
  const handleRequestClose = useCallback(() => {
    if (!expandedSlug) return
    setIsClosing(true)
  }, [expandedSlug])

  const items = projects
  const currentProject = items.find(p => p.slug === expandedSlug)
  
  // Detect mobile on mount
  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Preload image on hover/focus for instant display
  const preloadImage = (src: string, slug: string) => {
    if (imageLoaded[slug]) return
    
    const img = new window.Image()
    img.src = src
    img.onload = () => {
      setImageLoaded(prev => ({ ...prev, [slug]: true }))
    }
  }

  // Simplified scroll handler like the example - no debouncing for smoother feel
  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget
    if (!container) return

    const scrollLeft = container.scrollLeft
    const totalWidth = container.scrollWidth - container.clientWidth
    
    if (totalWidth <= 0) return

    // Estimate card width based on the number of projects
    const cardWidthEstimate = container.scrollWidth / items.length
    
    const centerScrollPosition = scrollLeft + container.clientWidth / 2
    let newIndex = Math.floor(centerScrollPosition / cardWidthEstimate)

    newIndex = Math.max(0, Math.min(items.length - 1, newIndex))

    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex)
    }
  }

  // Scroll lock: prevent background scroll while overlay is open
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

  // Focus trap + ESC key handling
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
    
    // Focus the close button or first focusable element
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

  const cp = currentProject
  const mobileOverlay = mounted && isMobile && expandedSlug && cp ? createPortal(
    <div
      ref={overlayRef}
      key={`overlay-mobile-${cp.slug}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${cp.title} details`}
      tabIndex={-1}
      className={cn(
        'overlay-panel fixed inset-0 z-[100] border-0',
        isClosing ? 'animate-out zoom-out-95 anim-duration-200' : 'animate-in zoom-in-95 anim-duration-200'
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
      <div
        className={cn(
          'absolute inset-0 overflow-auto p-4',
          isClosing
            ? 'animate-out slide-out-to-bottom-2 anim-duration-200'
            : 'animate-in slide-in-from-bottom-2 anim-duration-200'
        )}
      >
        {/* Header Row */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="text-xl font-semibold tracking-tight">
              {cp.title}
            </h4>
            <p className="text-base opacity-80 mt-0.5">
              {cp.tagline}
            </p>
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

        {/* Secondary Image */}
        <div className="mt-4 relative w-full overflow-hidden rounded-lg">
          <div className="relative w-full aspect-[16/9]">
            {/* Loading spinner - shows until image loads */}
            {!imageLoaded[cp.slug] && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-white/5 backdrop-blur-sm">
                <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin opacity-50" />
              </div>
            )}
            <Image
              src={cp.secondaryImage}
              alt={`${cp.title} - additional view`}
              fill
              className="object-contain select-none"
              draggable={false}
              sizes="92vw"
              onLoad={() => setImageLoaded(prev => ({ ...prev, [cp.slug]: true }))}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/8 via-black/0 to-black/0 dark:from-black/15" />
          </div>
        </div>

        {/* Body */}
        <div className="mt-4 flex flex-col gap-6">
          <div>
            <p className="text-sm leading-relaxed">
              {cp.longDescription}
            </p>
          </div>
          <div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide opacity-70">
                Tech Stack
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {cp.techStack?.map((tech) => (
                  <span 
                    key={tech} 
                    className="tech-badge"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs font-semibold uppercase tracking-wide opacity-70">
                Links
              </div>
              <div className="mt-2 flex flex-wrap gap-3">
                {cp.links?.live ? (
                  <a
                    href={cp.links.live}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn-accent-invert btn-compact flex-1"
                  >
                    Live Website
                  </a>
                ) : null}
                {cp.links?.github ? (
                  <a
                    href={cp.links.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn-accent btn-compact flex-1"
                  >
                    GitHub Repo
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  ) : null

  return (
    <>
      <div className="h-full flex flex-col">
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex flex-row md:flex-col gap-6 md:gap-8 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto h-full md:p-6 md:pt-6 snap-x snap-mandatory md:snap-none [&::-webkit-scrollbar]:hidden mobile-scroller md:h-full"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
      {items.map((project, i) => (
        <article
          key={project.slug}
          className="min-w-[280px] w-[85vw] max-w-[360px] md:w-full md:max-w-none flex-shrink-0 snap-center card card-flat-bottom md:cursor-default relative overflow-hidden flex flex-col first:ml-6 last:mr-6 md:ml-0 md:mr-0 md:first:ml-0 md:last:mr-0"
          aria-current={undefined}
        >
          {/* Media */}
          {/* Mobile: friendlier aspect / flexible height */}
          <div className="relative block md:hidden w-full overflow-hidden rounded-md">
            <div className="relative w-full aspect-[16/9]">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-contain select-none"
                draggable={false}
                sizes="92vw"
                priority={i === 0}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-black/0 to-black/0 dark:from-black/20" />
            </div>
          </div>

          {/* Desktop: 16:9 hero image */}
          <div className="relative hidden md:block w-full overflow-hidden rounded-md">
            <div className="relative w-full aspect-[16/9]">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-contain select-none"
                draggable={false}
                sizes="(min-width: 768px) 100vw, 0vw"
                priority={i === 0}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/6 via-black/0 to-black/0" />
            </div>
          </div>

          {/* Content */}
          <div className="mt-4 flex-1 flex flex-col gap-2">
            <h3 className="text-lg font-semibold tracking-tight">{project.title}</h3>
            <p className="text-sm opacity-80">{project.tagline}</p>
            <p className="mt-1 text-sm leading-relaxed hidden md:block">{project.description}</p>

            {/* Actions */}
            <div className="mt-auto flex flex-wrap gap-3">
              {project.links?.live ? (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={cn('btn-accent-invert btn-compact flex-1 md:flex-none')}
                  onClick={(e) => e.stopPropagation()}
                >
                  Live Website
                </a>
              ) : null}

              <button
                className={cn('btn-accent btn-compact flex-1 md:flex-none transition-all duration-200')}
                onClick={(e) => {
                  e.stopPropagation()
                  lastTriggerRef.current = e.currentTarget
                  setIsClosing(false)
                  setExpandedSlug(project.slug)
                }}
                onMouseEnter={() => preloadImage(project.secondaryImage, project.slug)}
                onFocus={() => preloadImage(project.secondaryImage, project.slug)}
                aria-expanded={expandedSlug === project.slug}
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Expanding Overlay with Framer Motion morph */}
          {/* Desktop: render in card | Mobile: render via portal at body level */}
          {!isMobile && expandedSlug === project.slug && (
                <div
                  ref={overlayRef}
                  role="dialog"
                  aria-modal="true"
                  aria-label={`${project.title} details`}
                  tabIndex={-1}
          className={cn(
            'overlay-panel absolute inset-0 z-10 rounded-xl border',
            isClosing ? 'animate-out zoom-out-95 anim-duration-200' : 'animate-in zoom-in-95 anim-duration-200'
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
                  <div 
          className={cn(
            'absolute inset-0 overflow-auto p-4 md:p-6',
            isClosing
              ? 'animate-out slide-out-to-bottom-2 anim-duration-200'
              : 'animate-in slide-in-from-bottom-2 anim-duration-200'
          )}
                  >
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-base md:text-lg font-semibold tracking-tight">
                          {project.title}
                        </h4>
                        <p className="text-xs md:text-sm opacity-80 mt-0.5">
                          {project.tagline}
                        </p>
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

                    {/* Secondary Image */}
                    <div className="mt-4 relative w-full overflow-hidden rounded-lg">
                      <div className="relative w-full aspect-[16/9]">
                        {/* Loading spinner - shows until image loads */}
                        {!imageLoaded[project.slug] && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-white/5 backdrop-blur-sm">
                            <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin opacity-50" />
                          </div>
                        )}
                        <Image
                          src={project.secondaryImage}
                          alt={`${project.title} - additional view`}
                          fill
                          className="object-contain select-none"
                          draggable={false}
                          sizes="(min-width: 768px) 100vw, 92vw"
                          onLoad={() => setImageLoaded(prev => ({ ...prev, [project.slug]: true }))}
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/8 via-black/0 to-black/0 dark:from-black/15" />
                      </div>
                    </div>

                    {/* Body */}
                    <div className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-5 gap-6">
                      <div className="md:col-span-3">
                        <p className="text-sm leading-relaxed">
                          {project.longDescription}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wide opacity-70">
                            Tech Stack
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {project.techStack?.map((tech) => (
                              <span 
                                key={tech} 
                                className="tech-badge"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="text-xs font-semibold uppercase tracking-wide opacity-70">
                            Links
                          </div>
                          <div className="mt-2 flex flex-wrap gap-3">
                            {project.links?.live ? (
                              <a
                                href={project.links.live}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="btn-accent-invert btn-compact flex-1 md:flex-none"
                              >
                                Live Website
                              </a>
                            ) : null}
                            {project.links?.github ? (
                              <a
                                href={project.links.github}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="btn-accent btn-compact flex-1 md:flex-none"
                              >
                                GitHub Repo
                              </a>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
          )}
        </article>
      ))}
      </div>

      {/* Mobile bottom dock (floating) - hidden while overlay is expanded */}
      {expandedSlug === null && (
        <div className="md:hidden mobile-dock-floating">
          <div className="index-footer-track animate-in slide-in-from-bottom-3 anim-duration-300">
            {items.map((_, i) => (
              <span key={i} className={cn('index-dot', i === activeIndex && 'index-dot-active')} />
            ))}
          </div>
        </div>
      )}

      {/* Hidden images for background preloading - lazy loaded after main content */}
      <div className="hidden">
        {items.map((project) => (
          <Image
            key={`preload-${project.slug}`}
            src={project.secondaryImage}
            alt=""
            width={1}
            height={1}
            loading="lazy"
            onLoad={() => setImageLoaded(prev => ({ ...prev, [project.slug]: true }))}
          />
        ))}
      </div>
    </div>
    
    {/* Mobile fullscreen overlay portal */}
    {mobileOverlay}
    </>
  )
}


