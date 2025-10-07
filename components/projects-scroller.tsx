'use client'

import { useMemo, useState, useRef, useEffect, UIEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface Project {
  slug: string
  title: string
  tagline: string
  description: string
  longDescription: string
  image: string
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

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    // Reset scroll when active index changes (basic skeleton behaviour)
    const child = el.children[activeIndex] as HTMLElement | undefined
    if (!child) return
    if (window.matchMedia('(min-width: 768px)').matches) {
      el.scrollTo({ top: child.offsetTop, behavior: 'smooth' })
    } else {
      el.scrollTo({ left: child.offsetLeft, behavior: 'smooth' })
    }
  }, [activeIndex])

  const items = useMemo(() => projects, [projects])

  // Track active index during mobile horizontal scroll
  const handleMobileScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    if (!el) return
    const totalChildren = items.length
    if (totalChildren === 0) return
    const approxCardWidth = el.scrollWidth / totalChildren
    const center = el.scrollLeft + el.clientWidth / 2
    let newIndex = Math.floor(center / Math.max(1, approxCardWidth))
    newIndex = Math.max(0, Math.min(totalChildren - 1, newIndex))
    if (newIndex !== activeIndex) setActiveIndex(newIndex)
  }

  return (
    <>
      <div
        ref={containerRef}
        onScroll={handleMobileScroll}
        className="flex flex-row md:flex-col gap-6 md:gap-8 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto h-full md:h-full snap-x snap-mandatory no-scrollbar pb-16 scroll-smooth"
      >
      {items.map((project, index) => (
        <article
          key={project.slug}
          className="shrink-0 w-[92vw] md:w-full md:shrink-0 md:max-w-none card cursor-pointer relative overflow-hidden snap-center h-full flex flex-col"
          onClick={() => setActiveIndex(index)}
          aria-current={undefined}
        >
          {/* Media */}
          {/* Mobile: cropped hero for punchy look */}
          <div className="relative block md:hidden w-full overflow-hidden rounded-md">
            <div className="relative w-full aspect-[16/9]">
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover select-none"
                draggable={false}
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-black/0 to-black/0 dark:from-black/20" />
            </div>
          </div>

          {/* Desktop: show full image (no crop), allow card to be taller */}
          <div className="relative hidden md:block w-full overflow-hidden rounded-md">
            <div className="relative w-full">
              <img
                src={project.image}
                alt={project.title}
                className="block w-full h-auto max-h-[72vh] object-contain select-none"
                draggable={false}
                loading="lazy"
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

              <motion.button
                layoutId={`expand-${project.slug}`}
                className={cn('btn-accent-invert btn-compact flex-1 md:flex-none')}
                onClick={(e) => {
                  e.stopPropagation()
                  setExpandedSlug(project.slug)
                }}
                aria-expanded={expandedSlug === project.slug}
              >
                Learn More
              </motion.button>
            </div>
          </div>

          {/* Expanding Overlay */}
          <AnimatePresence initial={false}>
            {expandedSlug === project.slug && (
              <motion.div
                key="overlay"
                layoutId={`expand-${project.slug}`}
                className="overlay-panel absolute inset-0 z-10 rounded-xl border"
                initial={{ opacity: 0.96 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={`${project.title} details`}
              >
                <div className="absolute inset-0 overflow-auto p-4 md:p-6">
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
                      className="btn-icon"
                      aria-label="Close details"
                      onClick={() => setExpandedSlug(null)}
                    >
                      ×
                    </button>
                  </div>

                  {/* Body */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-6">
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
                            <span key={tech} className="tech-badge">
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
                          {project.links?.github ? (
                            <a
                              href={project.links.github}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="btn btn-compact"
                            >
                              GitHub Repo
                            </a>
                          ) : null}
                          {project.links?.live ? (
                            <a
                              href={project.links.live}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="btn-accent btn-compact"
                            >
                              Live Website
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </article>
      ))}
      </div>

      {/* Mobile index footer */}
      <div className="md:hidden fixed left-0 right-0 bottom-4 z-20 px-4">
        <div className="index-footer">
          <div className="index-footer-track">
            {items.map((_, i) => (
              <span key={i} className={cn('index-dot', i === activeIndex && 'index-dot-active')} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}


