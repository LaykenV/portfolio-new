import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Writing on AI engineering, multi-agent orchestration, document intelligence, and production LLM infrastructure.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Blog — Layken Varholdt',
    description:
      'Writing on AI engineering, multi-agent orchestration, document intelligence, and production LLM infrastructure.',
    url: '/blog',
    siteName: 'Layken Varholdt',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://www.laykenvarholdt.com/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Layken Varholdt — Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog — Layken Varholdt',
    description:
      'Writing on AI engineering, multi-agent orchestration, document intelligence, and production LLM infrastructure.',
    creator: '@LLVarholdt',
    images: ['https://www.laykenvarholdt.com/twitter-image'],
  },
}

export default function BlogIndex() {
  return (
    <div className="font-sans mx-auto max-w-3xl min-h-dvh px-6 py-14 md:py-20 flex flex-col gap-10">
      <Link href="/" className="nav-link self-start">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back
      </Link>

      <div className="flex flex-col gap-3">
        <div className="section-eyebrow">Writing</div>
        <h1 className="hero-title">
          Notes on <em>shipping AI</em>.
        </h1>
        <p className="hero-sub">
          Long-form pieces on multi-agent orchestration, document intelligence pipelines,
          and the infrastructure work behind AI systems that actually reach production.
        </p>
      </div>

      <div className="aside-footer">
        <div className="flex items-center gap-3">
          <span className="footer-icon" aria-hidden="true">
            <BookOpen className="h-3.5 w-3.5" />
          </span>
          <div>
            <p className="text-sm font-semibold">First post landing soon.</p>
            <p className="text-xs opacity-70 mt-0.5">
              Kicking off with a teardown of the Mesh Mind multi-model orchestration layer.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
