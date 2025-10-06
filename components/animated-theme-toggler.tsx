'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { flushSync } from 'react-dom'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<'button'> {
  duration?: number
}

export const AnimatedThemeToggler = ({ className, duration = 400, ...props }: AnimatedThemeTogglerProps) => {
  const { setTheme } = useTheme()
  const [isDark, setIsDark] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Keep local state in sync with actual class on <html>
  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    updateTheme()
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const applyTheme = useCallback((nextIsDark: boolean) => {
    const newTheme = nextIsDark ? 'dark' : 'light'
    setIsDark(nextIsDark)
    // Change DOM now so the transition captures the frame
    document.documentElement.classList.toggle('dark', nextIsDark)
    localStorage.setItem('theme', newTheme)
    // Keep next-themes context in sync for other components
    queueMicrotask(() => setTheme(newTheme))
  }, [setTheme])

  const toggleTheme = useCallback(async () => {
    const btn = buttonRef.current
    if (!btn) return

    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const supportsVT = 'startViewTransition' in document
    const nextIsDark = !isDark

    if (!supportsVT || prefersReduce) {
      applyTheme(nextIsDark)
      return
    }

    await document.startViewTransition(() => {
      flushSync(() => applyTheme(nextIsDark))
    }).ready

    const { top, left, width, height } = btn.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    )

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      }
    )
  }, [isDark, applyTheme, duration])

  return (
    <button ref={buttonRef} onClick={toggleTheme} className={cn('btn-icon', className)} aria-label="Toggle theme" {...props}>
      {isDark ? <Sun /> : <Moon />}
    </button>
  )
}
