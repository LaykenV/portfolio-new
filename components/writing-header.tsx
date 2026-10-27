import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AnimatedThemeToggler } from '@/components/animated-theme-toggler'
import { WritingIdentity } from '@/components/writing-identity'

export function WritingHeader({ backHref = '/blog', backLabel = 'All posts' }: {
  backHref?: string
  backLabel?: string
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Link href={backHref} className="nav-link min-h-11">
        <ArrowLeft size={14} aria-hidden="true" />
        {backLabel}
      </Link>
      <div className="flex items-center gap-2">
        <Link href="/" className="nav-link writing-wordmark"><WritingIdentity /></Link>
        <AnimatedThemeToggler />
      </div>
    </div>
  )
}
