'use client'

import { useEffect, useState, type ComponentType } from 'react'

import { MobilePortfolio } from '@/components/mobile-portfolio'
import type { Project } from '@/types/project'

/** Must match the `md` breakpoint the shells are hidden at in CSS. */
const DESKTOP_QUERY = '(min-width: 768px)'

/**
 * The /1 … /5 design explorations reimagine the desktop layout only. Mobile is
 * unchanged, so this mirrors PortfolioShell exactly — both shells render on the
 * server, then the one the viewport doesn't match is unmounted — and just swaps
 * the desktop half for whatever the route hands in.
 *
 * The desktop half arrives as a component rather than an element so the element
 * is created here, inside this JSX. Passing a ready-made element across the
 * server/client boundary into a conditional slot makes React ask for a key on
 * it, which would be a meaningless key on a single child.
 */
export function VariantShell({
  projects,
  desktop: Desktop,
}: {
  projects: Project[]
  desktop: ComponentType<{ projects: Project[] }>
}) {
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
      {isDesktop !== false && <Desktop projects={projects} />}
    </>
  )
}
