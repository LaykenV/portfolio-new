'use client'

import { useState } from 'react'
import { MobileMenu } from '@/components/mobile-menu'
import { Github, Linkedin, FileText, BookOpen, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileMenuControllerProps {
  className?: string
}

export function MobileMenuController({ className }: MobileMenuControllerProps) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={cn(className, 'z-50')}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setOpen(false)
      }}
    >
      <button
        type="button"
        className="hamburger"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(!open)}
      >
        <svg viewBox="0 0 32 32" aria-hidden="true" width="32" height="32">
          <path className="line line-top-bottom" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
          <path className="line" d="M7 16 27 16"></path>
        </svg>
      </button>

      <MobileMenu open={open} onClose={() => setOpen(false)}>
        <div className="flex flex-col gap-3">
          <a
            href="mailto:layken@varholdt.com?subject=Software%20Engineering%20role"
            className="m-cta-email w-full justify-center"
          >
            <Mail className="h-4 w-4" />
            layken@varholdt.com
          </a>
          <nav className="m-menu-links" aria-label="Portfolio links">
            <a href="/blog" className="m-menu-link">
              <BookOpen className="h-4 w-4" />
              Blog
            </a>
            <a href="/Layken-Varholdt-Software-Engineer-Resume.pdf" className="m-menu-link" target="_blank" rel="noreferrer">
              <FileText className="h-4 w-4" />
              Résumé
            </a>
            <a href="https://github.com/laykenV" className="m-menu-link" target="_blank" rel="noreferrer">
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/layken-varholdt-a78687230/" className="m-menu-link" target="_blank" rel="noreferrer">
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
            <a href="https://x.com/LLVarholdt" className="m-menu-link" target="_blank" rel="noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-twitter-x" viewBox="0 0 16 16">
                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
              </svg>
              X
            </a>
          </nav>
        </div>
      </MobileMenu>
    </div>
  )
}
