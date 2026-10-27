'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { SiteMenu } from '@/components/site-menu'
import { WritingIdentity } from '@/components/writing-identity'
import { cn } from '@/lib/utils'

interface SiteHeaderProps {
  className?: string
  /** Set by pages that scroll an inner element instead of the window. */
  scrolled?: boolean
  /** Replaces the brand, for example with a Back button in a detail view. */
  leading?: ReactNode
  /** Hides the brand while the page shows the same identity larger. */
  brandHidden?: boolean
  onHomeClick?: () => void
  onWorkClick?: () => void
}

/**
 * The phone header shared with varholdt.com and Public Parish: the brand on
 * the left, the two-line menu button on the right. It sits flush with the page
 * at the top and gets a hairline and frosted background once content scrolls.
 */
export function SiteHeader({ className, scrolled, leading, brandHidden, onHomeClick, onWorkClick }: SiteHeaderProps) {
  const [windowScrolled, setWindowScrolled] = useState(false)
  const tracksWindow = scrolled === undefined

  useEffect(() => {
    if (!tracksWindow) return
    const onScroll = () => setWindowScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [tracksWindow])

  return (
    <header className={cn('site-header', className)} data-scrolled={(tracksWindow ? windowScrolled : scrolled) || undefined}>
      <div className="site-header-row">
        {leading ?? (
          <Link
            href="/"
            className="site-brand"
            data-hidden={brandHidden || undefined}
            aria-hidden={brandHidden || undefined}
            tabIndex={brandHidden ? -1 : undefined}
            onClick={(event) => {
              if (!onHomeClick) return
              event.preventDefault()
              onHomeClick()
            }}
          >
            <WritingIdentity />
          </Link>
        )}
        <SiteMenu onHomeClick={onHomeClick} onWorkClick={onWorkClick} />
      </div>
    </header>
  )
}
