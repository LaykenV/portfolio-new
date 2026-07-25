'use client'

import { useEffect, useState } from 'react'

import { DesktopPortfolio } from '@/components/desktop-portfolio'
import { MobilePortfolio } from '@/components/mobile-portfolio'
import type { Project } from '@/types/project'

/** Must match the `md` breakpoint the two shells are hidden at in CSS. */
const DESKTOP_QUERY = '(min-width: 768px)'

/**
 * Both shells are server-rendered so the first paint is correct on either
 * device without a flash, then the one the viewport doesn't match is
 * unmounted. Images inside both shells stay lazy so the hidden layout does not
 * force conflicting preload requests before that first client-side decision.
 */
export function PortfolioShell({ projects }: { projects: Project[] }) {
  // null until mounted, which keeps the first client render identical to the
  // server's. Resizing across the breakpoint remounts the other shell.
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY)
    const sync = () => setIsDesktop(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  return (
    <>
      {isDesktop !== true && (
        <div className="md:hidden">
          <MobilePortfolio projects={projects} />
        </div>
      )}
      {isDesktop !== false && <DesktopPortfolio projects={projects} />}
    </>
  )
}
