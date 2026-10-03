'use client'

import Image from 'next/image'
import { useEffect, useRef, type KeyboardEvent } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react'

import { liveHost, pad } from '@/components/variants/identity'
import type { Project } from '@/types/project'

/**
 * Full-screen case study on a native modal <dialog>: the browser supplies the
 * focus trap, Esc to close and focus restoration. Prev/next swap the project
 * in place and the arrow keys do the same.
 */
export function CaseStudy({
  project,
  index,
  total,
  onClose,
  onStep,
}: {
  project: Project
  index: number
  total: number
  onClose: () => void
  onStep: (delta: 1 | -1) => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const opener = document.activeElement as HTMLElement | null
    if (!dialog.open) dialog.showModal()
    document.body.style.overflow = 'hidden'
    // Removing a modal dialog from the DOM takes it out of the top layer, so
    // there is no close() here: calling it fires a `close` event that would
    // re-run onClose, and StrictMode's double effect would then shut the dialog
    // the moment it opened.
    return () => {
      document.body.style.overflow = ''
      opener?.focus?.()
    }
  }, [])

  const onKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'ArrowRight') onStep(1)
    else if (e.key === 'ArrowLeft') onStep(-1)
  }

  const host = liveHost(project)

  return (
    <dialog
      ref={dialogRef}
      className="ix-dialog"
      aria-labelledby="ix-case-title"
      onClose={onClose}
      onKeyDown={onKeyDown}
    >
      <div className="ix-case" key={project.slug}>
        <aside className="ix-case-meta">
          <button type="button" className="ix-case-close" onClick={onClose}>
            <X size={16} aria-hidden="true" /> Close <kbd>Esc</kbd>
          </button>

          <div className="ix-case-meta-body">
            <p className="ix-mono">
              {pad(index + 1)} / {pad(total)}
            </p>
            <h2 id="ix-case-title" className="ix-case-title">
              {project.title}
            </h2>
            <p className="ix-case-tagline">{project.tagline}</p>
            {project.award && (
              <p className="ix-award">
                <span aria-hidden="true">{project.award.icon}</span> {project.award.label}
              </p>
            )}

            <div className="ix-case-links">
              {project.links.live && (
                <a className="ix-btn ix-btn-solid" href={project.links.live} target="_blank" rel="noreferrer noopener">
                  Visit {host} <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              )}
              {project.links.github && (
                <a className="ix-btn" href={project.links.github} target="_blank" rel="noreferrer noopener">
                  Source code <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              )}
            </div>

            <h3 className="ix-label">Built with</h3>
            <ul className="ix-chips">
              {project.techStack.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>

          <div className="ix-case-step">
            <button type="button" onClick={() => onStep(-1)} aria-label="Previous project">
              <ArrowLeft size={18} aria-hidden="true" />
              <span>Prev</span>
            </button>
            <button type="button" onClick={() => onStep(1)} aria-label="Next project">
              <span>Next</span>
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </aside>

        <div className="ix-case-scroll">
          <Image
            src={project.image}
            alt={`${project.title} landing page`}
            width={1440}
            height={810}
            sizes="(min-width: 900px) 62vw, 100vw"
            className="ix-case-img"
            priority
          />
          <p className="ix-case-copy">{project.longDescription}</p>
          <Image
            src={project.secondaryImage}
            alt={`${project.title} application interface`}
            width={1440}
            height={810}
            sizes="(min-width: 900px) 62vw, 100vw"
            className="ix-case-img"
          />
        </div>
      </div>
    </dialog>
  )
}
