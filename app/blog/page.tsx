import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'

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

const posts = [
  {
    slug: 'mesh-mind-debate-workflow',
    title: 'Three models, one answer.',
    description:
      'Rebuilding MIT and Google Brain’s multi-agent debate paper as a chat product, end to end on Convex — sub-threads per model, two parallel rounds, a hidden synthesis prompt, and a Zod-validated summary.',
    date: '2026-04-16',
    dateReadable: 'April 16, 2026',
    readMinutes: 12,
    tags: ['Multi-agent', 'Convex', 'Mesh Mind'],
  },
] as const

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
          Long-form pieces on multi-agent orchestration, document intelligence
          pipelines, and the infrastructure work behind AI systems that actually
          reach production.
        </p>
      </div>

      <ul className="flex flex-col gap-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="post-row group"
              aria-label={`Read: ${post.title}`}
            >
              <div className="flex flex-col gap-2 min-w-0">
                <div className="flex items-center gap-2 text-xs opacity-65">
                  <time
                    dateTime={post.date}
                    className="mono-accent"
                  >
                    {post.dateReadable}
                  </time>
                  <span aria-hidden="true">·</span>
                  <span className="mono-accent">
                    ~{post.readMinutes} min read
                  </span>
                </div>
                <h2 className="post-row-title">{post.title}</h2>
                <p className="post-row-desc">{post.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.tags.map((tag) => (
                    <span key={tag} className="tech-badge-compact">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <span className="post-row-arrow" aria-hidden="true">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
