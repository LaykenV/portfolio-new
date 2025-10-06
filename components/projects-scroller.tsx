'use client'

import { useMemo, useState, useRef, useEffect } from 'react'

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

  return (
    <div
      ref={containerRef}
      className="flex flex-row md:flex-col gap-6 md:gap-8 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto h-full"
    >
      {items.map((project, index) => (
        <article
          key={project.slug}
          className="shrink-0 w-[85%] md:w-auto md:shrink md:max-w-[900px] card cursor-pointer"
          onClick={() => setActiveIndex(index)}
          aria-current={undefined}
        >
          <h3 className="text-lg font-semibold">{project.title}</h3>
          <p className="text-sm opacity-80">{project.tagline}</p>
          <p className="mt-2 text-sm">{project.description}</p>
        </article>
      ))}
    </div>
  )
}


