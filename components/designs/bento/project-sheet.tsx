'use client'

import Image from 'next/image'
import { useLayoutEffect, useRef, useState, type SyntheticEvent } from 'react'
import { ArrowUpRight, X } from 'lucide-react'

import { liveHost, pad } from '@/components/variants/identity'
import type { Project } from '@/types/project'

/**
 * Project detail as a modal sheet. The landing shot carries the shared
 * view-transition name, so it morphs from the tile it was opened from. Esc is
 * routed through `onRequestClose` so the close animation can run before the
 * dialog leaves the DOM.
 */
export function ProjectSheet({
  project,
  index,
  total,
  onRequestClose,
  onClosed,
}: {
  project: Project
  index: number
  total: number
  onRequestClose: () => void
  onClosed: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const [view, setView] = useState<'landing' | 'app'>('landing')

  useLayoutEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    const opener = document.activeElement as HTMLElement | null
    if (!dialog.open) dialog.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      opener?.focus?.()
    }
  }, [])

  const onCancel = (e: SyntheticEvent) => {
    e.preventDefault()
    onRequestClose()
  }

  const host = liveHost(project)

  return (
    <dialog
      ref={ref}
      className="bn-sheet"
      aria-labelledby="bn-sheet-title"
      onCancel={onCancel}
      onClose={onClosed}
      onClick={(e) => {
        if (e.target === e.currentTarget) onRequestClose()
      }}
    >
      <div className="bn-sheet-card">
        <button type="button" className="bn-sheet-close" onClick={onRequestClose} aria-label="Close project">
          <X size={18} aria-hidden="true" />
        </button>

        <div className="bn-sheet-media">
          <div className="bn-sheet-shot">
            <Image
              key={view}
              src={view === 'landing' ? project.image : project.secondaryImage}
              alt={`${project.title} ${view === 'landing' ? 'landing page' : 'application interface'}`}
              width={1440}
              height={810}
              sizes="(min-width: 1100px) 640px, 100vw"
              priority
            />
          </div>
          <div className="bn-seg" role="group" aria-label="Screenshot">
            {(['landing', 'app'] as const).map((v) => (
              <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)}>
                {v === 'landing' ? 'Landing page' : 'Inside the app'}
              </button>
            ))}
          </div>
        </div>

        <div className="bn-sheet-body">
          <p className="bn-eyebrow">
            Project {pad(index + 1)} of {pad(total)}
          </p>
          <h2 id="bn-sheet-title" className="bn-sheet-title">
            {project.title}
          </h2>
          <p className="bn-sheet-tag">{project.tagline}</p>
          {project.award && (
            <p className="bn-award">
              <span aria-hidden="true">{project.award.icon}</span> {project.award.label}
            </p>
          )}
          <p className="bn-sheet-copy">{project.longDescription}</p>
          <ul className="bn-chips">
            {project.techStack.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <div className="bn-sheet-links">
            {project.links.live && (
              <a className="bn-btn bn-btn-solid" href={project.links.live} target="_blank" rel="noreferrer noopener">
                Visit {host} <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            )}
            {project.links.github && (
              <a className="bn-btn" href={project.links.github} target="_blank" rel="noreferrer noopener">
                Source <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </dialog>
  )
}
