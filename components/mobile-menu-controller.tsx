'use client'

import { useState } from 'react'
import { MobileMenu } from '@/components/mobile-menu'
import { AnimatedThemeToggler } from '@/components/animated-theme-toggler'
import { Github, Linkedin } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface MobileMenuControllerProps {
  className?: string
}

export function MobileMenuController({ className }: MobileMenuControllerProps) {
  const [open, setOpen] = useState(false)
  return (
    <div className={cn(className, 'z-50')}>
      <label className="hamburger" aria-label="Open menu">
        <input
          type="checkbox"
          checked={open}
          onChange={() => setOpen(!open)}
          aria-checked={open}
          aria-controls="mobile-menu"
        />
        <svg viewBox="0 0 32 32" aria-hidden="true" width="32" height="32">
          <path className="line line-top-bottom" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
          <path className="line" d="M7 16 27 16"></path>
        </svg>
      </label>

      <MobileMenu open={open} onClose={() => setOpen(false)}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold opacity-80">Menu</span>
            <AnimatedThemeToggler className="btn-icon" />
          </div>
          <div className="h-px bg-black/10 dark:bg-white/10" />
          <div className="flex items-center gap-2">
            <a href="https://x.com/LLVarholdt" aria-label="Twitter" className="btn-icon" target="_blank" rel="noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-twitter-x" viewBox="0 0 16 16">
                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
              </svg>
            </a>
            <a href="https://github.com/laykenV" aria-label="GitHub" className="btn-icon" target="_blank" rel="noreferrer">
              <Github className="h-4 w-4" />
            </a>
            <a href="https://www.linkedin.com/in/layken-varholdt-a78687230/" aria-label="LinkedIn" className="btn-icon" target="_blank" rel="noreferrer">
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
          <div className="h-px bg-black/10 dark:bg-white/10" />
          <div className="flex flex-wrap gap-2">
            <a className="btn-accent-invert btn-compact btn-equal text-sm flex-1" href="https://cal.com/layken-varholdt" target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>Schedule call</a>
            <a className="btn-accent btn-compact btn-equal text-sm flex-1" href="https://t.me/LLVarholdt" target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
              <Image src="/telegram.png" alt="Telegram" width={20} height={20} /> Chat
            </a>
          </div>
        </div>
      </MobileMenu>
    </div>
  )
}


