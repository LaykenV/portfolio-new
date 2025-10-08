'use client'

import { useState, useRef, UIEvent } from 'react'
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
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({})

  // Horizontal scroll on mobile; vertical on desktop
  const containerRef = useRef<HTMLDivElement>(null)

  const items = projects
  
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

  return (
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
                onMouseEnter={() => preloadImage(project.secondaryImage, project.slug)}
                onFocus={() => preloadImage(project.secondaryImage, project.slug)}
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

      {/* Mobile bottom dock (floating) */}
      <div className="md:hidden mobile-dock-floating">
        <div className="index-footer-track">
          {items.map((_, i) => (
            <span key={i} className={cn('index-dot', i === activeIndex && 'index-dot-active')} />
          ))}
        </div>
      </div>

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
  )
}


