'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { WritingIdentity } from '@/components/writing-identity'
import { AnimatedThemeToggler } from '@/components/animated-theme-toggler'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export function MobileMenu({ open, onClose, children }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const panel = panelRef.current
    if (!panel) return
    const background = Array.from(
      panel.closest('.mobile-portfolio')?.querySelectorAll<HTMLElement>(
        '.mobile-deck, .m-rail, .m-topbar-brand, .hamburger',
      ) ?? [],
    )
    const previousInert = background.map((element) => element.inert)
    background.forEach((element) => { element.inert = true })
    const frame = requestAnimationFrame(() => panel.querySelector<HTMLButtonElement>('.m-menu-close')?.focus())
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key !== 'Tab') return
      const controls = Array.from(panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), select, [tabindex="0"]',
      ))
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('keydown', onKey)
      background.forEach((element, i) => { element.inert = previousInert[i] })
      previous?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      id="mobile-menu"
      className="m-menu-dialog md:hidden"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="m-menu-header">
        <span className="writing-wordmark"><WritingIdentity /></span>
        <div className="flex items-center gap-2">
          <AnimatedThemeToggler className="btn-icon" />
          <button type="button" className="m-menu-close" onClick={onClose} aria-label="Close menu">
            <X size={24} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="mobile-menu-panel">
        {children}
      </div>
    </div>
  )
}


