import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="writing-theme">
      <SiteHeader className="md:hidden" />
      {children}
      <footer className="mx-auto max-w-3xl px-5 pb-12 md:px-6">
        <div className="border-t border-[var(--border)] pt-6">
          <a href="mailto:layken@varholdt.com" className="nav-link min-h-11">
            layken@varholdt.com
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </footer>
    </div>
  )
}
