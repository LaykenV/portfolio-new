'use client'

import { useState, useRef, useEffect, UIEvent } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export interface Project {
  slug: string
  title: string
  tagline: string
  description: string
  longDescription: string
  image: string
  secondaryImage: string
  techStack: string[]
  links: {
    github?: string | null
    live?: string | null
  }
}

interface ProjectsScrollerProps {
  projects: Project[]
}

export function ProjectsScroller({ projects }: ProjectsScrollerProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null)

  // Horizontal scroll on mobile; vertical on desktop
  const containerRef = useRef<HTMLDivElement>(null)

  // Only auto-scroll on mobile when activeIndex changes
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    // Only apply auto-scroll behavior on mobile
    if (!window.matchMedia('(max-width: 767px)').matches) return
    
    const child = el.children[activeIndex] as HTMLElement | undefined
    if (!child) return
    
    el.scrollTo({ left: child.offsetLeft, behavior: 'smooth' })
  }, [activeIndex])

  const items = projects

  // Debounce scroll tracking to reduce jerkiness
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Track active index during mobile horizontal scroll with debouncing
  const handleMobileScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    if (!el) return
    
    // Clear previous timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    
    // Debounce the state update to reduce jerkiness
    scrollTimeoutRef.current = setTimeout(() => {
      const totalChildren = items.length
      if (totalChildren === 0) return
      const approxCardWidth = el.scrollWidth / totalChildren
      const center = el.scrollLeft + el.clientWidth / 2
      let newIndex = Math.floor(center / Math.max(1, approxCardWidth))
      newIndex = Math.max(0, Math.min(totalChildren - 1, newIndex))
      if (newIndex !== activeIndex) setActiveIndex(newIndex)
    }, 50)
  }
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="h-full flex flex-col">
      <div
        ref={containerRef}
        onScroll={handleMobileScroll}
        className="flex flex-row md:flex-col gap-6 md:gap-8 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto h-full no-scrollbar md:p-6 md:pt-6 snap-x snap-mandatory md:snap-none"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
      {items.map((project, i) => (
        <article
          key={project.slug}
          className="shrink-0 w-[92vw] md:w-full md:shrink-0 md:max-w-none card md:cursor-default relative overflow-hidden flex-shrink-0 flex flex-col ml-4 first:ml-4 md:ml-0 md:first:ml-0 snap-center"
          aria-current={undefined}
        >
          {/* Media */}
          {/* Mobile: 16:9 hero image */}
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
                  className={cn('btn-accent btn-compact flex-1 md:flex-none')}
                  onClick={(e) => e.stopPropagation()}
                >
                  Live Website
                </a>
              ) : null}

              <button
                className={cn('btn-accent-invert btn-compact flex-1 md:flex-none transition-all duration-200')}
                onClick={(e) => {
                  e.stopPropagation()
                  setExpandedSlug(project.slug)
                }}
                aria-expanded={expandedSlug === project.slug}
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Expanding Overlay */}
            {expandedSlug === project.slug && (
              <div
                key={`overlay-${project.slug}`}
                className="overlay-panel absolute inset-0 z-10 rounded-xl border animate-in fade-in duration-200"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={`${project.title} details`}
              >
                <div className="absolute inset-0 overflow-auto p-4 md:p-6">
                  {/* Header Row */}
                  <div 
                    className="flex items-start justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-200"
                    style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}
                  >
                    <div>
                      <h4 className="text-base md:text-lg font-semibold tracking-tight">
                        {project.title}
                      </h4>
                      <p className="text-xs md:text-sm opacity-80 mt-0.5">
                        {project.tagline}
                      </p>
                    </div>
                    <button
                      className="btn-icon"
                      aria-label="Close details"
                      onClick={() => setExpandedSlug(null)}
                    >
                      ×
                    </button>
                  </div>

                  {/* Secondary Image */}
                  <div 
                    className="mt-4 relative w-full overflow-hidden rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-300"
                    style={{ animationDelay: '120ms', animationFillMode: 'backwards' }}
                  >
                    <div className="relative w-full aspect-[16/9]">
                      <Image
                        src={project.secondaryImage}
                        alt={`${project.title} - additional view`}
                        fill
                        className="object-contain select-none"
                        draggable={false}
                        sizes="(min-width: 768px) 100vw, 92vw"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/8 via-black/0 to-black/0 dark:from-black/15" />
                    </div>
                  </div>

                  {/* Body */}
                  <div 
                    className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-5 gap-6 animate-in fade-in slide-in-from-bottom-3 duration-300"
                    style={{ animationDelay: '150ms', animationFillMode: 'backwards' }}
                  >
                    <div className="md:col-span-3">
                      <p className="text-sm leading-relaxed">
                        {project.longDescription}
                      </p>
                    </div>
                    <div 
                      className="md:col-span-2 animate-in fade-in slide-in-from-right-2 duration-300"
                      style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}
                    >
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide opacity-70">
                          Tech Stack
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {project.techStack?.map((tech, i) => (
                            <span 
                              key={tech} 
                              className="tech-badge animate-in fade-in zoom-in-95 duration-200"
                              style={{ 
                                animationDelay: `${250 + i * 30}ms`,
                                animationFillMode: 'backwards'
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div 
                        className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
                        style={{ animationDelay: '300ms', animationFillMode: 'backwards' }}
                      >
                        <div className="text-xs font-semibold uppercase tracking-wide opacity-70">
                          Links
                        </div>
                        <div className="mt-2 flex flex-wrap gap-3">
                          {project.links?.live ? (
                            <a
                              href={project.links.live}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="btn-accent btn-compact flex-1 md:flex-none"
                            >
                              Live Website
                            </a>
                          ) : null}
                          {project.links?.github ? (
                            <a
                              href={project.links.github}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="btn-accent-invert btn-compact flex-1 md:flex-none"
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

      {/* Mobile index footer - non-fixed, positioned at bottom */}
      <div className="md:hidden flex-shrink-0 py-4 px-4">
        <div className="index-footer">
          <div className="index-footer-track">
            {items.map((_, i) => (
              <span key={i} className={cn('index-dot', i === activeIndex && 'index-dot-active')} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


