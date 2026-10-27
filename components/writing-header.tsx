import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AnimatedThemeToggler } from '@/components/animated-theme-toggler'
import { WritingIdentity } from '@/components/writing-identity'

export function WritingHeader({ backHref = '/blog', backLabel = 'All posts' }: {
  backHref?: string
  backLabel?: string
}) {
  return (
    <div className="writing-header" data-home-back={backHref === '/' || undefined}>
      <Link href={backHref} className="nav-link writing-back min-h-11" aria-label={backLabel}>
        <ArrowLeft size={14} aria-hidden="true" />
        <span className="writing-back-label">{backLabel}</span>
      </Link>
      <Link href="/" className="nav-link writing-wordmark"><WritingIdentity /></Link>
      <div className="writing-header-end">
        <a href="mailto:layken@varholdt.com" className="nav-link writing-email min-h-11">Email</a>
        <AnimatedThemeToggler className="writing-theme-toggle" />
      </div>
    </div>
  )
}
