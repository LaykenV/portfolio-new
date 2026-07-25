'use client'

import { useCallback, useRef } from 'react'
import { Moon, Sun } from 'lucide-react'
import { flushSync } from 'react-dom'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

interface AnimatedThemeTogglerProps {
  className?: string
  duration?: number
}

export const AnimatedThemeToggler = ({ className, duration = 400 }: AnimatedThemeTogglerProps) => {
  const { setTheme } = useTheme()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const inFlight = useRef(false)

  const toggleTheme = useCallback(async () => {
    const btn = buttonRef.current
    if (!btn || inFlight.current) return

    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const supportsVT = 'startViewTransition' in document
    // Read the class rather than React state so a click that lands before
    // hydration settles still flips the right way.
    const nextTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark'

    if (!supportsVT || prefersReduce) {
      setTheme(nextTheme)
      return
    }

    inFlight.current = true
    try {
      const transition = document.startViewTransition(() => {
        flushSync(() => {
          setTheme(nextTheme)
        })
      })

      await transition.ready

      const { top, left, width, height } = btn.getBoundingClientRect()
      const x = left + width / 2
      const y = top + height / 2
      const maxRadius = Math.hypot(
        Math.max(left, window.innerWidth - left),
        Math.max(top, window.innerHeight - top)
      )

      document.documentElement.animate(
        {
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`],
        },
        {
          duration,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        }
      )

      await transition.finished
    } catch {
      // A transition interrupted by a second click rejects; the theme class is
      // already correct either way, so there is nothing to recover.
    } finally {
      inFlight.current = false
    }
  }, [setTheme, duration])

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn('btn-icon', className)}
      aria-label="Toggle theme"
    >
      {/* Both icons render on the server; CSS picks one off the html class, so
          there is no post-hydration swap. */}
      <Sun className="theme-icon-sun" aria-hidden="true" />
      <Moon className="theme-icon-moon" aria-hidden="true" />
    </button>
  )
}
