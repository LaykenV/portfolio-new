'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

export function AnimatedThemeToggler({ className }: { className?: string }) {
  const { setTheme } = useTheme()
  return (
    <button
      type="button"
      onClick={() => setTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark')}
      className={cn('btn-icon', className)}
      aria-label="Toggle theme"
    >
      <Sun className="theme-icon-sun" aria-hidden="true" />
      <Moon className="theme-icon-moon" aria-hidden="true" />
    </button>
  )
}
